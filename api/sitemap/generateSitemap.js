import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import Redis from 'ioredis';
import Post from '../models/post.model.js';
import dotenv from 'dotenv';
import PptFile from '../models/ppt.model.js';

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

    const pptx = await PptFile.find().select('slug');
    const pptxurls = pptx.map(pptx =>({
      url: `/theme/${pptx.slug}`,
      changefreq: 'daily',
      priority: 0.8,
    }))

    const allUrls = [
      ...urls,
      ...pptxurls,
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/keyword-extractor', changefreq: 'weekly', priority: 0.8 },
      { url: '/generate-keywords', changefreq: 'weekly', priority: 0.8 },
      { url: '/tip-calculator', changefreq: 'weekly', priority: 0.8 },
      { url: '/write-for-us', changefreq: 'weekly', priority: 0.8 }
    ];

    const stream = new SitemapStream({ hostname: 'https://www.pluseup.com/' });
    const sitemap = await streamToPromise(Readable.from(allUrls).pipe(stream)).then(data => data.toString());

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
