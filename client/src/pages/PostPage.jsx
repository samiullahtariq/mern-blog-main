import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import HelmetTitle from '../components/HelmetTitle';
import LazyLoad from '../components/LazyLoad';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const limitToFourKeywords = (text) => {
  const words = text.split(' ');
  return words.slice(0, 7).join(' ');
};
const loadHeavyComponent = () => import('../components/CallToAction');
const loadcommetnsection = () => import('../components/CommentSection');

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    if (post) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.content, 'text/html');
      const headingsList = [];
      doc.querySelectorAll('h2').forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        headingsList.push({ id, text: limitToFourKeywords(heading.textContent) });
      });
      setHeadings(headingsList);
      const updatedHTML = doc.documentElement.innerHTML;
      setProcessedContent(updatedHTML);
    }
  }, [post]);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  return (
    <>
      <HelmetTitle post={post} />
      <main className='p-3 max-w-6xl mx-auto min-h-screen'>
        <div className='flex-container'>
          <div className='main-content'>
            <div className='flex flex-col items-center'>
              <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
                {post && post.title}
              </h1>
              <Link
                to={`/search?category=${post && post.category}`}
                className='mt-5'
              >
                <Button color='gray' pill size='xs'>
                  {post && post.category}
                </Button>
              </Link>
            </div>

            <LazyLoadImage
              src={post && post.image}
              alt={post && post.title}
              className='mt-10 p-3 max-h-[600px] w-full object-cover title-image rounded-image'
              effect='blur'
            />
            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
              <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
              <span className='italic'>
                {post && (post.content.length / 1000).toFixed(0)} mins read
              </span>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-4">
                  <aside className="aside-sidebar" style={{overflow : "hidden"}}>
                    <nav>
                      <h3><strong>In this Article</strong></h3>
                      <hr />
                      <ul className="mt-2">
                        {headings.map((heading) => (
                          <li key={heading.id}>
                            <a href={`#${heading.id}`} className="text-blue-500 hover:underline">
                              {heading.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </aside>
                </div>
                <div
                  className="col-8 p-3 max-w-2xl mx-auto w-full post-content"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                ></div>
              </div>
            </div>

            <div className='max-w-4xl mx-auto w-full'>
            <LazyLoad loader={loadHeavyComponent} fallback={<div>Loading...</div>} />
            </div>
            <LazyLoad loader={loadcommetnsection} fallback={<div>Loading comments...</div>} postId={post._id} />

            <div className='flex flex-col justify-center items-center mb-5'>
              <h1 className='text-xl mt-5'>Recent articles</h1>
              <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                {recentPosts &&
                  recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
