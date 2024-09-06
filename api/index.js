import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import compressionMiddleware from './middleware/compression.js';
import errorHandler from './middleware/errorHandler.js';
import { generateSitemap } from './sitemap/generateSitemap.js';
import routes from './routes/routing.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


const app = express();
const __dirname = path.resolve();

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

