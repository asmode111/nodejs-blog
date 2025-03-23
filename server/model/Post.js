const mongoose = require('mongoose');

const Scheema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    rquired: true
  },
  body: {
    type: String,
    rquired: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);