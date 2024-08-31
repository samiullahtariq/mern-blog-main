import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HelmetTitle from '../components/HelmetTitle';
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
      <HelmetTitle/>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to PluseUp,</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
        You'll find a variety of articles and educational content on topics
        such as SEO , Web Development , product reviews, technology news, and much more..
                     Our mission is to share knowledge and empower our readers with the information they
                      need to grow and succeed
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
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