import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import LazyLoad from '../components/LazyLoad';

const loadHeavyComponent = () => import('../components/CallToAction');
const loadPostcard = () => import('../components/PostCard');

export default function Home() {
 
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
       <Helmet>
    <title>PluseUp - Boosting Your Growth through Smarter SEO</title>
    <meta name="description" content="At PluseUp, we are offer SEO solutions focused on boosting online visibility and driving long-term growth with customer Satisfaction."/>
    <link rel="canonical" href="https://www.pluseup.com/" />
   </Helmet>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-4xl'>Welcome to PluseUp
</h1>
        <p className='text-gray-500'>
        At PluseUp, we specialize in increasing your online visibility and driving targeted traffic to your website.
         Our expertise in SEO helps businesses achieve higher search engine rankings and deliver measurable results.
          Whether you need on-page optimization, link building, or a comprehensive digital strategy, we're here to 
          help you succeed in the digital landscape. Discover how we can transform your online presence and grow 
          your business.
        </p>
        <Link
          to='/search'
          className= 'text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>
      <div className='p-3 bg-purple-300 dark:bg-slate-700'>
      <LazyLoad loader={loadHeavyComponent} fallback={<div>Loading...</div>} />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.slice(0, 3).map((post) => (
               <LazyLoad loader={loadPostcard} key={post._id} post={post} fallback={<div>Loading Posts...</div>} /> 
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}