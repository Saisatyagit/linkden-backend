const Post = require('../models/Post');

// 📝 Create a post (text + optional image/video)
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let image = null, video = null;

    if (req.file) {
      if (req.file.mimetype.startsWith('image')) image = `uploads/${req.file.filename}`;
      if (req.file.mimetype.startsWith('video')) video = `uploads/${req.file.filename}`;
    }

    const post = await Post.create({
      user: req.user._id,
      text,
      image,
      video
    });

    const populatedPost = await post.populate('user', 'name');
    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get all posts (with user + comments)
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❤️ Like / Unlike post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(req.user._id);
    if (index === -1) post.likes.push(req.user._id);
    else post.likes.splice(index, 1);

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 💬 Comment on post
exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user._id, text });
    await post.save();

    const populatedPost = await Post.findById(post._id).populate('comments.user', 'name');
    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Edit post (only by owner)
exports.editPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Unauthorized' });

    post.text = text || post.text;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑️ Delete post (only by owner)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Unauthorized' });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
