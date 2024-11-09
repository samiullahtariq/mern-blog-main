import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import compressionMiddleware from './middleware/compression.js';
import errorHandler from './middleware/errorHandler.js';
import { generateSitemap } from './sitemap/generateSitemap.js';
import routes from './routes/routing.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { generateKeywords } from './controllers/postkeyword.controller.js';
import pptFileRoutes from './routes/pptfile.route.js';
import fs from 'fs';

const app = express();
const __dirname = path.resolve();

app.use((req, res, next) => {
  // Check if the request is not HTTPS
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  // Redirect non-www to www
  if (req.hostname === 'pluseup.com') {
    return res.redirect(301, `https://www.pluseup.com${req.url}`);
  }
  next();
});


const uploadDir = path.join(process.cwd(), 'uploads');

  // Log the directory path
  console.log('Uploads directory absolute path:', uploadDir);

  // Check if the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    // If it doesn't exist, create it
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads directory created:', uploadDir);
  } else {
    console.log('Uploads directory already exists:', uploadDir);
  }


// Database connection
// Connect to MongoDB
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.log(err);
  });


// Middleware
app.set('trust proxy', true);
app.use(compressionMiddleware);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(routes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add this route for handling pptx uploads and downloads
app.use('/api/ppt', pptFileRoutes);

app.post('/api/generate-keywords', generateKeywords);
// Static files
app.use(express.static(path.join(__dirname, '/client/dist')));

// Sitemap
app.get('/sitemap.xml', generateSitemap);

// Robots.txt
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'robots.txt'));
});


// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

