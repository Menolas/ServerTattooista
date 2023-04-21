const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  contacts: {
    email: { type: String },
    insta: {
      type: String
    },
    phone: {
      type: String
    },
    whatsapp: {
      type: String
    },
    messenger: {
      type: String
    }
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);
