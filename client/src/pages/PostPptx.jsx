import React, { useState, useEffect } from 'react';
import { useParams , Link } from 'react-router-dom';
import { Button, Card, Alert, Spinner } from 'flowbite-react';
import { GetApp } from '@mui/icons-material';
import LazyLoad from '../components/LazyLoad';
import HelmetTitle from '../components/HelmetTitle';

const loadPostcard = () => import('../components/PostCard');

export default function PostPptx() {
  const { themeSlug } = useParams();
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchTemplate();
    fetchPosts();
  }, [themeSlug]);

  const fetchPosts = async () => {
    const res = await fetch('/api/post/getPosts');
    const data = await res.json();
    setPosts(data.posts);
  };


  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/ppt/getpptx-file/${themeSlug}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTemplate(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching template:', err);
      setError('Failed to load template. Please try again later.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="failure">
        <span>
          <span className="font-medium">Error!</span> {error}
        </span>
      </Alert>
    );
  }

  if (!template) return null;

  return (
    <div className="max-w-7xl mx-auto p-4">
       <HelmetTitle post={template.pptFile} />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{template.pptFile.title}</h1>
          <Card className="mb-4">
            {/* Google Drive iframe for displaying the PPTX file */}
            <iframe
              src={template.links.webViewLink}
              width="100%"
              height="600px"
              allow="autoplay"
              title="PPTX Viewer"
            ></iframe>
          </Card>
        </div>
        <div className="w-full md:w-1/3" style={{paddingTop : '3.2rem'}}>
          <Card className="mb-4">
            <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Category</h5>
            <span className="text-gray-700 dark:text-gray-400">
              {template.pptFile.category}
            </span>
          </Card>
          <Card className="mb-4">
            <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Description</h5>
            <p className="text-gray-700 dark:text-gray-400">{template.pptFile.helmetdescription}</p>
          </Card>
          <Button color="blue" className="w-full mb-4">
            <a href={template.links.webContentLink} download className="flex items-center">
              <GetApp className="mr-2" />
              Download this template
            </a>
          </Button>
        </div>
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
