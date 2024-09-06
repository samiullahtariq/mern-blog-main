import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletepost,  updatepost ,getAllPosts, getSinglePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getAllPosts);
router.get('/:postSlug', getSinglePost);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)


export default router;