const express = require('express');
const router = express.Router();
const { getAllBlogs, createBlog, deleteBlog, updateLikes } = require('../controllers/blogController');

router.get('/', getAllBlogs);
router.post('/', createBlog);
router.delete('/:id', deleteBlog);
router.put('/:id', updateLikes);

module.exports = router;
