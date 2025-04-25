const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  },
  format: {
    type: String
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  bytes: {
    type: Number
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;