import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import compression from 'compression';
import axios from 'axios';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();


const app = express();
app.set('trust proxy', true);
app.use(compression({
  level : 6,
  threshold : 10*1000,
  filter:(req ,res)=>{
    if(req.headers['x-no-compression']){
      return false;
    }
    return compression.filter(req,res)
  }
}))
app.use(express.json());
app.use(cookieParser());

// Upstash Redis REST API setup
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Function to get data from Upstash Redis
const getFromRedis = async (key) => {
  try {
    const response = await axios.get(`${redisUrl}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${redisToken}`,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching from Redis:', error);
    return null;
  }
};

// Function to set data in Upstash Redis with TTL
const setInRedis = async (key, value, ttlSeconds) => {
  try {
    await axios.post(`${redisUrl}/set/${key}/${value}`, null, {
      headers: {
        Authorization: `Bearer ${redisToken}`,
      },
      params: {
        ttl: 3600, // Set TTL in seconds
      }
    });
  } catch (error) {
    console.error('Error setting value in Redis:', error);
  }
};

// Example usage: Caching with TTL
app.get('/api/posts/:id', async (req, res, next) => {
  const postId = req.params.id;

  try {
    // Check if the post is in the cache
    const cachedPost = await getFromRedis(`post:${postId}`);

    if (cachedPost) {
      return res.status(200).json(JSON.parse(cachedPost));
    }

    // Fetch post from the database if not in cache
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Store the post in Redis cache with an expiration time (e.g., 3600 seconds = 1 hour)
    await setInRedis(`post:${postId}`, JSON.stringify(post), 3600);

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
