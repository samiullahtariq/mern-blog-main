import express from 'express';
import userRoutes from './user.route.js';
import authRoutes from './auth.route.js';
import postRoutes from './post.route.js';
import commentRoutes from './comment.route.js';

const router = express.Router();

router.use('/api/user', userRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/post', postRoutes);
router.use('/api/comment', commentRoutes);

export default router;