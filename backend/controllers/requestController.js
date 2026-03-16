const asyncHandler = require('express-async-handler');
const Request = require('../models/Request');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const { updateExpiredDonations } = require('../utils/donationUtils');


const createAndSendNotification = require('../utils/notificationUtils');

// @desc    Create a new request for a donation
// @route   POST /api/requests
// @access  Private/NGO/Volunteer
const createRequest = asyncHandler(async (req, res) => {
  const { donationId } = req.body;

  // Ensure donation statuses are up-to-date before processing
  await updateExpiredDonations();

  const donation = await Donation.findById(donationId).populate('donor');

  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  // Business logic: Only allow requests for 'POSTED' donations
  if (donation.status !== 'POSTED') {
      res.status(400);
      throw new Error(`This donation is no longer available for requests. Its status is '${donation.status}'.`);
  }

  // Check if user has already requested this donation
  const existingRequest = await Request.findOne({
      donation: donationId,
      requester: req.user._id,
  });

  if (existingRequest) {
      res.status(400);
      throw new Error('You have already requested this donation');
  }

  const request = new Request({
    requester: req.user._id,
    donation: donationId,
  });

  const createdRequest = await request.save();
  
  // Update donation status to 'REQUESTED'
  // If multiple NGOs can request, this logic might need adjustment.
  // For now, the first request moves it to 'REQUESTED'.
  donation.status = 'REQUESTED';
  await donation.save();

  // Send real-time, SMS, and Email notification to donor
  await createAndSendNotification(req, {
    recipient: donation.donor,
    senderId: req.user._id,
    donationId: donation._id,
    message: `${req.user.name} has requested your donation for '${donation.description}'.`,
    smsMessage: `Food Rescue Network: Your donation '${donation.description}' has been requested by ${req.user.name}.`,
    emailSubject: 'Donation Request Update',
    emailHtml: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2e7d32;">Donation Request Update</h2>
        <p>Hello <strong>${donation.donor.name}</strong>,</p>
        <p>Your donation <strong>"${donation.description}"</strong> has been requested by <strong>${req.user.name}</strong>.</p>
        <p>Please log in to your dashboard to review and approve the request.</p>
        <p>Thank you for helping reduce food waste!</p>
        <br/>
        <p>Best regards,<br/>Food Rescue Network Team</p>
      </div>
    `,
    emailText: `Hello ${donation.donor.name}, Your donation "${donation.description}" has been requested by ${req.user.name}. Please log in to your dashboard to review and approve the request. Thank you for helping reduce food waste!`
  });

  res.status(201).json(createdRequest);
});

// @desc    Get all requests made by the current user (NGO/Volunteer)
// @route   GET /api/requests/myrequests
// @access  Private/NGO/Volunteer
const getMyRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({ requester: req.user._id })
        .populate('donation', 'description status expiryDate')
        .sort({ createdAt: -1 });
    res.json(requests);
});


// @desc    Update a request status (e.g., approve, reject)
// @route   PUT /api/requests/:id
// @access  Private/Donor
const updateRequestStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // Incoming as 'approved' or 'rejected'

    const request = await Request.findById(req.params.id).populate('donation').populate('requester');

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    const donation = await Donation.findById(request.donation._id);

    // Authorization: Only the donor can approve/reject
    if (donation.donor.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to update this request');
    }
    
    // Ensure action is valid
    if (donation.status !== 'REQUESTED') {
        res.status(400)
        throw new Error(`Action cannot be completed. Donation status is already '${donation.status}'.`)
    }

    const targetStatus = status.toUpperCase();

    if (targetStatus === 'APPROVED') {
        // Update donation status to 'APPROVED' and mark the approved NGO
        donation.status = 'APPROVED';
        donation.approvedNGO = request.requester._id;
        await donation.save();
        
        request.status = 'APPROVED';

        // Notify the approved NGO
        await createAndSendNotification(req, {
            recipient: request.requester,
            senderId: req.user._id,
            donationId: donation._id,
            message: `Your request for '${donation.description}' has been approved by the donor. Please arrange for pickup.`,
            smsMessage: `Food Rescue Network: Your request for "${donation.description}" has been approved! Please arrange for pickup.`,
            emailSubject: 'Donation Request Approved!',
            emailHtml: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2e7d32;">Donation Request Approved!</h2>
                <p>Hello <strong>${request.requester.name}</strong>,</p>
                <p>Your request for the donation <strong>"${donation.description}"</strong> has been approved by the donor.</p>
                <p>Please arrange for pickup from the specified location in your dashboard.</p>
                <p>Thank you for helping reduce food waste!</p>
                <br/>
                <p>Best regards,<br/>Food Rescue Network Team</p>
              </div>
            `,
            emailText: `Hello ${request.requester.name}, Your request for the donation "${donation.description}" has been approved. Please arrange for pickup. Thank you for helping reduce food waste!`
        });

        // Auto-reject all other pending requests for this donation
        const otherRequests = await Request.find({ donation: donation._id, status: 'PENDING' }).populate('requester');
        for (const otherReq of otherRequests) {
            if (otherReq._id.toString() !== request._id.toString()) {
                otherReq.status = 'REJECTED';
                await otherReq.save();
                
                // Notify other NGOs of rejection
                await createAndSendNotification(req, {
                    recipient: otherReq.requester,
                    senderId: req.user._id,
                    donationId: donation._id,
                    message: `Your request for '${donation.description}' was not approved as another request was selected.`,
                });
            }
        }
    } else if (targetStatus === 'REJECTED') {
        request.status = 'REJECTED';
        
        // Make the donation available again
        donation.status = 'POSTED';
        await donation.save();

        // Notify the NGO of the rejection
        await createAndSendNotification(req, {
            recipient: request.requester,
            senderId: req.user._id,
            donationId: donation._id,
            message: `Your request for '${donation.description}' has been rejected by the donor.`,
            smsMessage: `Food Rescue Network: Your request for "${donation.description}" has been rejected by the donor.`,
            emailSubject: 'Donation Request Update',
            emailHtml: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #c62828;">Donation Request Rejected</h2>
                <p>Hello <strong>${request.requester.name}</strong>,</p>
                <p>Your request for the donation <strong>"${donation.description}"</strong> has been rejected by the donor.</p>
                <p>Don't worry, there are many other available donations you can request.</p>
                <br/>
                <p>Best regards,<br/>Food Rescue Network Team</p>
              </div>
            `,
            emailText: `Hello ${request.requester.name}, Your request for the donation "${donation.description}" has been rejected by the donor. Keep looking for other available donations!`
        });
    } else {
        res.status(400)
        throw new Error("Invalid status update provided.");
    }

    const updatedRequest = await request.save();
    res.json(updatedRequest);
});

// @desc    Get all requests (Admin only)
// @route   GET /api/requests/all
// @access  Private/Admin
const getAllRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({})
        .populate('requester', 'name email')
        .populate('donation', 'description status')
        .sort({ createdAt: -1 });
    res.json(requests);
});

module.exports = {
  createRequest,
  getMyRequests,
  updateRequestStatus,
  getAllRequests,
};

