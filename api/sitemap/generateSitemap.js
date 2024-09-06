import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import Redis from 'ioredis';
import Post from '../models/post.model.js';
import dotenv from 'dotenv';

dotenv.config();


// Use environment variable or default to localhost
const redisSitemap = new Redis(process.env.REDIS_NODE || 'redis://localhost:6379');

export const generateSitemap = async (req, res) => {
  try {
    // Check if sitemap is cached
    const cachedSitemap = await redisSitemap.get('sitemap');
    if (cachedSitemap) {
      res.header('Content-Type', 'application/xml');
      console.log('Cache hit for sitemap');
      return res.status(200).send(cachedSitemap); // Use send for XML
    }

    // Generate sitemap
    const posts = await Post.find().select('slug');
    const urls = posts.map(post => ({
      url: `/post/${post.slug}`,
      changefreq: 'daily',
      priority: 0.8,
    }));

    urls.push({ url: '/', changefreq: 'weekly', priority: 1.0 });

    const stream = new SitemapStream({ hostname: 'https://www.pluseup.com/' });
    const sitemap = await streamToPromise(Readable.from(urls).pipe(stream)).then(data => data.toString());

    // Cache the generated sitemap
    await redisSitemap.set('sitemap', sitemap, 'EX', 43200);
    res.header('Content-Type', 'application/xml');
    console.log('Caching sitemap data');
    return res.status(200).send(sitemap); // Use send for XML
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).end();
  }
};
