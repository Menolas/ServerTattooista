const mongoose = require('mongoose');
const path = require('path');
const {Schema} = require("mongoose");
const avatarBasePath = 'uploads/avatars';

const contacts = new Schema({
  email: {
    type: String
  },
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
  },
})

const ClientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  contacts: {
    email: {
      type: String,
      default: null
    },
    insta: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    whatsapp: {
      type: String,
      default: null
    },
    messenger: {
      type: String,
      default: null
    }
  },
  gallery: [{type: String}]
});

ClientSchema.virtual('avatarImagePath').get(function() {
  if (this.avatar != null) {
    return path.join('/', avatarBasePath, this.avatar)
  }
})

module.exports = mongoose.model('Client', ClientSchema);
module.exports.avatarBasePath = avatarBasePath;
