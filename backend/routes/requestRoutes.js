const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  updateRequestStatus,
  getAllRequests
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createRequest); // Simplified authorization
  
router.route('/myrequests').get(protect, getMyRequests);
router.route('/all').get(protect, getAllRequests); // No longer admin-protected

router.route('/:id').put(protect, updateRequestStatus); // Simplified authorization

module.exports = router;
