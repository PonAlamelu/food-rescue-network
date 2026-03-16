const mongoose = require('mongoose');

const requestSchema = mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This will be an NGO or Volunteer
    },
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Donation',
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
      default: 'PENDING',
    },
    // Optional: if the donor wants to provide a reason for rejection
    rejectionReason: {
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
