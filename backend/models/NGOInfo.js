const mongoose = require('mongoose');

const ngoInfoSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    organization_name: {
      type: String,
      required: true,
    },
    registration_no: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const NGOInfo = mongoose.model('NGOInfo', ngoInfoSchema);

module.exports = NGOInfo;
