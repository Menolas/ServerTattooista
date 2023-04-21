const { Schema, model } = require('mongoose');

const Category = new Schema({
  value: {
    type: String,
    unique: true,
  },
  wallPaper: {
    type: String,
    unique: true
  },
  description: {
    type: String,
  }
});

module.exports = model('Category', Category);
