const Donation = require('../models/Donation');

const updateExpiredDonations = async () => {
  try {
    const now = new Date();
    await Donation.updateMany(
      {
        expiryDate: { $lte: now },
        status: { $nin: ['DELIVERED', 'EXPIRED'] } // Don't update already delivered or expired donations
      },
      {
        $set: { status: 'EXPIRED' }
      }
    );
  } catch (error) {
    console.error('Error updating expired donations:', error);
  }
};

module.exports = { updateExpiredDonations };
