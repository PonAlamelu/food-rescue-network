const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  getUsers, // Import new controller
  getAdminUserStats, // Import new controller
  approveUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware'); // Import admin middleware

router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers); // Add GET route for all users (admin only)

router.post('/login', authUser);

router.route('/profile')
  .get(protect, getUserProfile);

router.route('/stats/admin')
  .get(protect, admin, getAdminUserStats); // New route for admin user stats

router.route('/:id/approve')
  .put(protect, admin, approveUser); // Admin can approve users

router.route('/:id')
  .delete(protect, admin, deleteUser); // Admin can delete users

module.exports = router;


