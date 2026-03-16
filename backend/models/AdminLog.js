const mongoose = require('mongoose');

const adminLogSchema = mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
    },
    target_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    target_donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
    },
  },
  {
    timestamps: true,
  }
);

const AdminLog = mongoose.model('AdminLog', adminLogSchema);

module.exports = AdminLog;
