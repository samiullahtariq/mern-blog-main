import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();


const redisClient = new Redis(process.env.REDIS_NODE || 'redis://localhost:6379');

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};





// Function to get all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    next(error);
  }
};

// Function to get a single post
export const getSinglePost = async (req, res, next) => {
  // Extract postSlug from req.params
  const postSlug = req.params.postSlug;

  try {
    if (postSlug) {
      // Check Redis for cached post
      const cachedPost = await redisClient.get(postSlug);
      if (cachedPost) {
        console.log(`Cache hit for ${postSlug}`);
        return res.status(200).json(JSON.parse(cachedPost));
      }

      // Fetch post from the database
      const postData = await Post.findOne({ slug: postSlug });
      if (!postData) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Cache the post in Redis
      await redisClient.set(postSlug, JSON.stringify(postData), 'EX', 43200); // 12 hours TTL
      console.log(`Caching Data for  ${postSlug}, caching data...`);
      return res.status(200).json(postData);
    } else {
      return res.status(400).json({ message: 'postSlug is required' });
    }
  } catch (error) {
    next(error);
  }
};



export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
          helmetdescription: req.body.helmetdescription,
          helmetkeywords: req.body.helmetkeywords,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
