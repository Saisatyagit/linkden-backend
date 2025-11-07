const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  likePost,
  commentPost,
  editPost,
  deletePost
} = require('../controller/postController');
const { authMiddleware } = require('../middelware/authMiddleware');
const { upload, resizeImage } = require('../middelware/upload');

// Routes
router.post('/', authMiddleware, upload.single('media'), resizeImage, createPost);
router.get('/', authMiddleware, getPosts);
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/comment', authMiddleware, commentPost);
router.put('/:id', authMiddleware, editPost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
