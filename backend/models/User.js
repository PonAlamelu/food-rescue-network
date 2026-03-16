const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['Donor', 'NGO', 'Volunteer', 'Admin'],
      default: 'Donor',
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false,
    },
    phone: {
      type: String,
      required: true,
    },
    contact: {
      address: String,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving the user
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; // Implicitly calls next() for async pre-hooks
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
