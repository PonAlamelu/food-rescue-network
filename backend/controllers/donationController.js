const asyncHandler = require('express-async-handler');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const Notification = require('../models/Notification');
const { updateExpiredDonations } = require('../utils/donationUtils');
const sendSMS = require('../utils/smsService');

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private/Donor
const createDonation = asyncHandler(async (req, res) => {
  const { description, quantity, pickupLocation, expiryDate, latitude, longitude } = req.body;

  // Basic validation
  if (!description || !quantity || !pickupLocation || !expiryDate || !latitude || !longitude) {
    res.status(400);
    throw new Error('Please provide all required fields, including location coordinates.');
  }

  const donation = new Donation({
    donor: req.user._id,
    description,
    quantity,
    pickupLocation,
    location: {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)], // [longitude, latitude]
    },
    expiryDate,
    // Status defaults to 'POSTED' from the model
  });

  const createdDonation = await donation.save();
  res.status(201).json(createdDonation);
});

// @desc    Get all available donations with optional filtering
// @route   GET /api/donations
// @access  Private/NGO/Volunteer
const getAvailableDonations = asyncHandler(async (req, res) => {
  await updateExpiredDonations(); // Check for expired donations first

  const { description, quantity, pickupLocation, lat, lng, distance } = req.query;

  let filter = { status: 'POSTED' };

  if (description) {
    // Case-insensitive regex for partial matching
    filter.description = { $regex: description, $options: 'i' };
  }
  if (quantity) {
    filter.quantity = quantity;
  }
  if (pickupLocation) {
    filter.pickupLocation = { $regex: pickupLocation, $options: 'i' };
  }

  const pLat = parseFloat(lat);
  const pLng = parseFloat(lng);
  const pDist = parseInt(distance);

  if (!isNaN(pLat) && !isNaN(pLng) && !isNaN(pDist)) {
    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [pLng, pLat]
        },
        $maxDistance: pDist * 1000 // In meters
      }
    };
  }

  let donations;
  if (filter.location) {
      // Near automatically sorts by distance
      donations = await Donation.find(filter).populate('donor', 'name');
  } else {
      donations = await Donation.find(filter).populate('donor', 'name').sort({ createdAt: -1 });
  }
  res.json(donations);
});

// @desc    Get donations by a specific donor
// @route   GET /api/donations/mydonations
// @access  Private/Donor
const getMyDonations = asyncHandler(async (req, res) => {
    await updateExpiredDonations(); // Check for expired donations first
    const donations = await Donation.find({ donor: req.user._id }).sort({ createdAt: -1 });
    res.json(donations);
});

// @desc    Get a single donation by ID
// @route   GET /api/donations/:id
// @access  Private
const getDonationById = asyncHandler(async (req, res) => {
  await updateExpiredDonations(); // Also check when fetching a single donation
  const donation = await Donation.findById(req.params.id).populate('donor', 'name contact');

  if (donation) {
    // Also fetch requests for this donation for the donor to see
    const requests = await Request.find({ donation: req.params.id }).populate('requester', 'name email phone');
    res.json({ donation, requests });
  } else {
    res.status(404);
    throw new Error('Donation not found');
  }
});

// @desc    Update a donation
// @route   PUT /api/donations/:id
// @access  Private/Donor
const updateDonation = asyncHandler(async (req, res) => {
    const { description, quantity, pickupLocation, expiryDate, latitude, longitude } = req.body;

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
        res.status(404);
        throw new Error('Donation not found');
    }

    // Check if the user is the donor OR an admin
    if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized to update this donation');
    }
    
    // Forbid editing if the donation is no longer in 'POSTED' state (except for admins)
    if (donation.status !== 'POSTED' && req.user.role !== 'admin') {
        res.status(400);
        throw new Error('Cannot edit a donation that has already been requested or approved.');
    }

    donation.description = description || donation.description;
    donation.quantity = quantity || donation.quantity;
    donation.pickupLocation = pickupLocation || donation.pickupLocation;
    donation.expiryDate = expiryDate || donation.expiryDate;
    
    if (latitude && longitude) {
        donation.location = {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
        };
    }

    const updatedDonation = await donation.save();
    res.json(updatedDonation);
});

// @desc    Delete a donation
// @route   DELETE /api/donations/:id
// @access  Private/Donor
const deleteDonation = asyncHandler(async (req, res) => {
    const donation = await Donation.findById(req.params.id);

    if (donation) {
        // Check if the user is the donor OR an admin
        if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('User not authorized to delete this donation');
        }

        // Only allow deletion if it's just posted or expired (except for admins)
        if (donation.status !== 'POSTED' && donation.status !== 'EXPIRED' && req.user.role !== 'admin') {
            res.status(400);
            throw new Error('Cannot delete a donation that is active in the pickup process.');
        }

        await donation.deleteOne();
        // Also delete associated requests
        await Request.deleteMany({ donation: donation._id });

        res.json({ message: 'Donation and associated requests removed' });
    } else {
        res.status(404);
        throw new Error('Donation not found');
    }
});

const createAndSendNotification = require('../utils/notificationUtils');

// @desc    Confirm a donation has been picked up
// @route   PUT /api/donations/:id/pickup
// @access  Private/NGO
const confirmPickup = asyncHandler(async (req, res) => {
    const donation = await Donation.findById(req.params.id).populate('donor');

    if (!donation) {
        res.status(404);
        throw new Error('Donation not found');
    }

    // Authorization: Only the approved NGO can confirm pickup
    if (!donation.approvedNGO || donation.approvedNGO.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this donation\'s status');
    }

    // Idempotency: If already picked up, just return success
    if (donation.status === 'PICKED_UP' || donation.status === 'DELIVERED') {
        return res.json(donation);
    }

    // State validation: Can only be picked up if it's approved
    if (donation.status !== 'APPROVED') {
        res.status(400);
        throw new Error(`Donation is in '${donation.status}' state and cannot be marked as picked up.`);
    }

    donation.status = 'PICKED_UP';
    donation.pickupTimestamp = Date.now();
    const updatedDonation = await donation.save();

    // Notify the donor
    await createAndSendNotification(req, {
        recipient: donation.donor,
        senderId: req.user._id,
        donationId: donation._id,
        message: `Your donation for '${donation.description}' has been picked up by ${req.user.name}.`,
        smsMessage: `Food Rescue Network: Your donation "${donation.description}" has been picked up by ${req.user.name}.`,
        emailSubject: 'Donation Picked Up!',
        emailHtml: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2e7d32;">Donation Picked Up!</h2>
            <p>Hello <strong>${donation.donor.name}</strong>,</p>
            <p>Your donation <strong>"${donation.description}"</strong> has been successfully picked up by <strong>${req.user.name}</strong>.</p>
            <p>We'll notify you once it's delivered to its destination.</p>
            <p>Thank you for helping reduce food waste!</p>
            <br/>
            <p>Best regards,<br/>Food Rescue Network Team</p>
          </div>
        `,
        emailText: `Hello ${donation.donor.name}, Your donation "${donation.description}" has been picked up by ${req.user.name}. We'll notify you once it's delivered. Thank you!`
    });

    res.json(updatedDonation);
});

// @desc    Confirm a donation has been delivered
// @route   PUT /api/donations/:id/deliver
// @access  Private/NGO
const confirmDelivery = asyncHandler(async (req, res) => {
    const donation = await Donation.findById(req.params.id).populate('donor');

    if (!donation) {
        res.status(404);
        throw new Error('Donation not found');
    }

    // Authorization: Only the approved NGO can confirm delivery
    if (!donation.approvedNGO || donation.approvedNGO.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this donation\'s status');
    }

    // Idempotency: If already delivered, just return success
    if (donation.status === 'DELIVERED') {
        return res.json(donation);
    }

    // State validation: Can only be delivered if it has been picked up
    if (donation.status !== 'PICKED_UP') {
        res.status(400);
        throw new Error(`Donation is in '${donation.status}' state and cannot be marked as delivered.`);
    }

    donation.status = 'DELIVERED';
    donation.deliveryTimestamp = Date.now();
    const updatedDonation = await donation.save();
    
    // Notify the donor
    await createAndSendNotification(req, {
        recipient: donation.donor,
        senderId: req.user._id,
        donationId: donation._id,
        message: `Your donation for '${donation.description}' has been successfully delivered by ${req.user.name}. Thank you!`,
        smsMessage: `Food Rescue Network: Your donation "${donation.description}" has been successfully delivered. Thank you for your kindness!`,
        emailSubject: 'Donation Delivered Successfully!',
        emailHtml: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2e7d32;">Donation Delivered!</h2>
            <p>Hello <strong>${donation.donor.name}</strong>,</p>
            <p>Your donation <strong>"${donation.description}"</strong> has been successfully delivered by <strong>${req.user.name}</strong>.</p>
            <p>Thank you for making a difference and helping reduce food waste!</p>
            <br/>
            <p>Best regards,<br/>Food Rescue Network Team</p>
          </div>
        `,
        emailText: `Hello ${donation.donor.name}, Your donation "${donation.description}" has been successfully delivered. Thank you for making a difference!`
    });

    res.json(updatedDonation);
});

// @desc    Get all donations (Admin only) with optional filtering
// @route   GET /api/donations/all
// @access  Private/Admin
const getAllDonations = asyncHandler(async (req, res) => {
    await updateExpiredDonations(); // Check for expired donations first

    const { description, quantity, pickupLocation, status } = req.query;

    let filter = {};

    if (description) {
        filter.description = { $regex: description, $options: 'i' };
    }
    if (quantity) {
        filter.quantity = quantity;
    }
    if (pickupLocation) {
        filter.pickupLocation = { $regex: pickupLocation, $options: 'i' };
    }
    if (status) {
        filter.status = status;
    }

    const donations = await Donation.find(filter)
                                    .populate('donor', 'name email')
                                    .sort({ createdAt: -1 });
    res.json(donations);
});

// --- STATS & REPORTS ---

// @desc    Get dashboard stats for the logged-in donor
// @route   GET /api/donations/stats/donor
// @access  Private/Donor
const getDonorStats = asyncHandler(async (req, res) => {
    const donorId = req.user._id;

    const totalDonations = await Donation.countDocuments({ donor: donorId });
    
    const approvedDonations = await Donation.countDocuments({ 
        donor: donorId, 
        status: { $in: ['APPROVED', 'PICKED_UP', 'DELIVERED'] } 
    });

    const deliveredDonations = await Donation.countDocuments({ 
        donor: donorId, 
        status: 'DELIVERED' 
    });

    res.json({ totalDonations, approvedDonations, deliveredDonations });
});

// @desc    Get dashboard stats for the logged-in NGO
// @route   GET /api/donations/stats/ngo
// @access  Private/NGO
const getNgoStats = asyncHandler(async (req, res) => {
    const ngoId = req.user._id;

    const requestsMade = await Request.countDocuments({ requester: ngoId });
    
    const approvedRequests = await Request.countDocuments({ 
        requester: ngoId, 
        status: 'approved'
    });

    const completedPickups = await Donation.countDocuments({ 
        approvedNGO: ngoId, 
        status: { $in: ['PICKED_UP', 'DELIVERED'] }
    });

    res.json({ requestsMade, approvedRequests, completedPickups });
});

// @desc    Get dashboard stats for the Admin
// @route   GET /api/donations/stats/admin
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    await updateExpiredDonations();

    const totalDonations = await Donation.countDocuments({});
    const successfulDeliveries = await Donation.countDocuments({ status: 'DELIVERED' });

    res.json({ totalDonations, successfulDeliveries });
});

// @desc    Get donation reports for the Admin
// @route   GET /api/donations/reports/daily
// @access  Private/Admin
const getDonationReports = asyncHandler(async (req, res) => {
    const donationsPerDay = await Donation.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: -1 } } // Sort by date descending
    ]);

    const statusCounts = await Donation.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    res.json({ daily: donationsPerDay, status: statusCounts });
});

// @desc    Get donations assigned to the logged-in NGO/Volunteer
// @route   GET /api/donations/mypickups
// @access  Private/NGO/Volunteer
const getMyPickups = asyncHandler(async (req, res) => {
    const donations = await Donation.find({ 
        approvedNGO: req.user._id,
        status: { $in: ['APPROVED', 'PICKED_UP', 'DELIVERED'] }
    }).populate('donor', 'name email contact').sort({ updatedAt: -1 });
    
    res.json(donations);
});

module.exports = {
  createDonation,
  getAvailableDonations,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  confirmPickup,
  confirmDelivery,
  getAllDonations,
  getMyPickups,
  getDonorStats,
  getNgoStats,
  getAdminStats,
  getDonationReports,
};

