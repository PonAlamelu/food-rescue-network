const express = require('express');
const router = express.Router();
const {
  createDonation,
  getAvailableDonations,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  getAllDonations,
  confirmPickup,
  confirmDelivery,
  getMyPickups, // Import new controller
  getDonorStats,
  getNgoStats,
  getAdminStats, // Import getAdminStats
  getDonationReports, // Import getDonationReports
} = require('../controllers/donationController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import admin middleware

// --- Dashboard Stats & Reports Routes ---
router.get('/stats/donor', protect, getDonorStats);
router.get('/stats/ngo', protect, getNgoStats);
router.get('/stats/admin', protect, admin, getAdminStats); // Add Admin stats route
router.get('/reports/daily', protect, admin, getDonationReports); // Add Admin reports route

router.route('/')
  .post(protect, createDonation)
  .get(protect, getAvailableDonations);

router.route('/mydonations').get(protect, getMyDonations);
router.route('/mypickups').get(protect, getMyPickups); // New route for NGO pickups
router.route('/all').get(protect, admin, getAllDonations); // Protect getAllDonations with admin middleware

router.route('/:id')
  .get(protect, getDonationById)
  .put(protect, updateDonation)
  .delete(protect, deleteDonation);

router.route('/:id/pickup').put(protect, confirmPickup);
router.route('/:id/deliver').put(protect, confirmDelivery);

module.exports = router;
