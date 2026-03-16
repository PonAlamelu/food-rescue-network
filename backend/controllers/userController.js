const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Notification = require('../models/Notification'); // Assuming Notification model might be used later, keeping import
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, contact, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    contact,
    phone,
    isApproved: role.toLowerCase() === 'admin' ? true : false, // New non-admin users require approval
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Approve a user (for admin)
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isApproved = true;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isApproved: updatedUser.isApproved,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is already populated by 'protect' middleware
  const user = req.user;
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      phone: user.phone,
      contact: user.contact,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (for admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { approved } = req.query;
  let filter = {};

  // If 'approved' query parameter is present, filter by isApproved status
  if (approved !== undefined) {
    filter.isApproved = approved === 'true'; // Convert string 'true'/'false' to boolean
  }

  const users = await User.find(filter).select('-password'); // Exclude password from results
  res.json(users);
});

// @desc    Get admin user statistics
// @route   GET /api/users/stats/admin
// @access  Private/Admin
const getAdminUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalApprovedUsers = await User.countDocuments({ isApproved: true });
  const totalPendingUsers = await User.countDocuments({ isApproved: false });

  res.json({
    totalUsers,
    totalApprovedUsers,
    totalPendingUsers,
  });
});

// @desc    Delete a user (for admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role.toLowerCase() === 'admin' && user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot delete your own admin account');
    }
    
    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
  getAdminUserStats,
  approveUser,
  deleteUser,
};

