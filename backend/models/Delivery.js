const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Request',
    },
    pickup_time: {
      type: Date,
    },
    delivery_time: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Picked Up', 'Delivered'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
