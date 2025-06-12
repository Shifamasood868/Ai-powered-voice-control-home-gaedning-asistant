import express from 'express';
import Post from '../schema/Post.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar')
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
    
    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(id => !id.equals(req.user._id));
    } else {
      post.likes.push(req.user._id);
    }
    
    await post.save();
    res.json(post);
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
      author: req.user._id,
      content
    });
    
    await post.save();
    await post.populate('comments.author', 'name avatar');
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;