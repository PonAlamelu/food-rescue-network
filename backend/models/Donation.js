const mongoose = require('mongoose');

const donationSchema = mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: String, // e.g., "10 meals", "5 kg vegetables"
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['POSTED', 'REQUESTED', 'APPROVED', 'PICKED_UP', 'DELIVERED', 'EXPIRED'],
      default: 'POSTED',
    },
    pickupTimestamp: {
        type: Date,
    },
    deliveryTimestamp: {
        type: Date,
    },
    // To track which NGO's request was approved
    approvedNGO: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
  },
  {
    timestamps: true,
  }
);

donationSchema.index({ location: '2dsphere' });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
