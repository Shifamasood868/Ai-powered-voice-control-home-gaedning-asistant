import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Camera,
  Image as ImageIcon,
  MoreHorizontal,
  User,
  Clock,
  MapPin,
  Leaf,
  Smile,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const CommunitySharing = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const { user } = useAuth();
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // For demo purposes, use sample data if API fails
      setSamplePosts();
    } finally {
      setLoading(false);
    }
  };

  const setSamplePosts = () => {
    const samplePosts = [
      {
        _id: '1',
        author: {
          _id: 'user1',
          name: 'Alex Johnson',
          avatar: ''
        },
        content: 'Just planted some new tomatoes in my garden today! Anyone have tips for organic pest control?',
        image: 'https://images.unsplash.com/photo-1594282416546-6e43936a29cf',
        likes: [
          { _id: 'user2', name: 'Maria Garcia' },
          { _id: 'user3', name: 'James Wilson' }
        ],
        comments: [
          {
            _id: 'comment1',
            author: { _id: 'user2', name: 'Maria Garcia' },
            content: 'Try neem oil spray! Works wonders for me.',
            createdAt: new Date(Date.now() - 3600000)
          }
        ],
        createdAt: new Date(Date.now() - 86400000),
        tags: ['gardening', 'tomatoes']
      },
      {
        _id: '2',
        author: {
          _id: 'user3',
          name: 'James Wilson',
          avatar: ''
        },
        content: 'My basil plants are thriving this season! Here are my care tips...',
        image: '',
        likes: [
          { _id: 'user1', name: 'Alex Johnson' }
        ],
        comments: [],
        createdAt: new Date(Date.now() - 7200000),
        tags: ['herbs', 'basil']
      }
    ];
    setPosts(samplePosts);
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    setPosting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/posts', {
        content: newPost,
        image: newPostImage,
        tags: []
      });

      setPosts([response.data, ...posts]);
      setNewPost('');
      setNewPostImage('');
    } catch (error) {
      console.error('Error creating post:', error);
      // For demo purposes, add post locally if API fails
      const demoPost = {
        _id: Date.now().toString(),
        author: {
          _id: user.id,
          name: user.name,
          avatar: ''
        },
        content: newPost,
        image: newPostImage,
        likes: [],
        comments: [],
        createdAt: new Date(),
        tags: []
      };
      setPosts([demoPost, ...posts]);
      setNewPost('');
      setNewPostImage('');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/like`);
      // Update local state with the updated post from server
      setPosts(posts.map(post => post._id === postId ? response.data : post));
    } catch (error) {
      console.error('Error liking post:', error);
      // Fallback: Update local state optimistically
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.some(like => like._id === user?.id);
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter(like => like._id !== user?.id)
              : [...post.likes, { _id: user.id, name: user.name }]
          };
        }
        return post;
      }));
    }
  };

  const handleAddComment = async (postId, content) => {
    if (!content.trim() || !user) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
        content
      });
      
      // Update local state with the updated post from server
      setPosts(posts.map(post => post._id === postId ? response.data : post));
      
      // Clear the comment input
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
      // Fallback: Update local state optimistically
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                _id: Date.now().toString(), // temporary ID
                author: {
                  _id: user.id,
                  name: user.name
                },
                content,
                createdAt: new Date()
              }
            ]
          };
        }
        return post;
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatLikers = (likes) => {
    if (likes.length === 0) return '';
    if (likes.length === 1) return `Liked by ${likes[0].name}`;
    if (likes.length === 2) return `Liked by ${likes[0].name} and ${likes[1].name}`;
    return `Liked by ${likes[0].name}, ${likes[1].name} and ${likes.length - 2} others`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Garden
          </h1>
          <p className="text-xl text-gray-600">
            Share your gardening journey and connect with fellow plant lovers
          </p>
        </div>

        {/* Create Post */}
        {user && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your gardening experience, tips, or questions..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />

                {newPostImage && (
                  <div className="mt-4 relative">
                    <img
                      src={newPostImage}
                      alt="Post preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setNewPostImage('')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="url"
                      value={newPostImage}
                      onChange={(e) => setNewPostImage(e.target.value)}
                      placeholder="Add image URL (optional)"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="file-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewPostImage(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    <button
                      type="button"
                      className="text-green-500 hover:text-green-600"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <Camera className="h-5 w-5" />
                    </button>

                  </div>

                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim() || posting}
                    className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {posting ? 'Posting...' : 'Share'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Post Header */}
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {post.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-gray-800 leading-relaxed mb-4">
                  {post.content}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Image */}
              {post.image && (
                <div className="px-6 pb-4">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="px-6 py-4 border-t border-gray-100">
                {/* Likes count with names */}
                {post.likes.length > 0 && (
                  <div className="text-sm text-gray-600 mb-3">
                    {formatLikers(post.likes)}
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center space-x-2 transition-colors ${post.likes.some(like => like._id === user?.id)
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-500 hover:text-red-500'
                        }`}
                      data-tip={post.likes.map(like => like.name).join(', ')}
                      data-for={`likes-tooltip-${post._id}`}
                    >
                      <Heart className={`h-5 w-5 ${post.likes.some(like => like._id === user?.id) ? 'fill-current' : ''}`} />
                      <span>{post.likes.length}</span>
                    </button>
                    <ReactTooltip 
                      id={`likes-tooltip-${post._id}`} 
                      effect="solid" 
                      place="top"
                    />

                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span>{post.comments.length}</span>
                    </button>

                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Comments */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-3">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm">
                            {comment.author.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {comment.author.name}
                            </h4>
                            <p className="text-gray-700 text-sm mt-1">
                              {comment.content}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>{formatTimeAgo(comment.createdAt)}</span>
                            <button className="hover:text-gray-700">Like</button>
                            <button className="hover:text-gray-700">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                {user && (
                  <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && commentInputs[post._id]?.trim()) {
                            handleAddComment(post._id, commentInputs[post._id]);
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (commentInputs[post._id]?.trim()) {
                            handleAddComment(post._id, commentInputs[post._id]);
                          }
                        }}
                        className="absolute right-3 top-2 text-green-500 hover:text-green-600"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600">
              Be the first to share your gardening experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitySharing;