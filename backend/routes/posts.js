import express from 'express';
import Post from '../schema/Post.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatar')
      .populate('likes._id', 'name')
      .populate('comments.author._id', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, image, tags } = req.body;
    
    const post = new Post({
      author: req.user._id,
      content,
      image,
      tags: tags || []
    });

    await post.save();
    await post.populate('author', 'name avatar');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    const existingLikeIndex = post.likes.findIndex(
      like => like._id.toString() === req.user._id.toString()
    );

    if (existingLikeIndex >= 0) {
      // Unlike the post
      post.likes.splice(existingLikeIndex, 1);
    } else {
      // Like the post
      post.likes.push({
        _id: req.user._id,
        name: req.user.name
      });
    }
    
    await post.save();
    
    // Populate the likes for the response
    const updatedPost = await Post.findById(post._id)
      .populate('likes._id', 'name')
      .populate('author', 'name avatar')
      .populate('comments.author._id', 'name avatar');
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    
    post.comments.push({
      author: {
        _id: req.user._id,
        name: req.user.name
      },
      content,
      createdAt: new Date()
    });
    
    await post.save();
    
    // Populate all necessary fields for the response
    const updatedPost = await Post.findById(post._id)
      .populate('likes._id', 'name')
      .populate('author', 'name avatar')
      .populate('comments.author._id', 'name avatar');
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;