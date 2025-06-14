import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  likes: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String
  }],
  comments: [{
    author: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String]
}, {
  timestamps: true
});

export default mongoose.model('Post', postSchema);