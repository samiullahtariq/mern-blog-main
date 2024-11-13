import React, { useEffect, useState } from 'react';
import { Card, Carousel, Timeline } from 'flowbite-react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CreateIcon from '@mui/icons-material/Create';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Helmet } from 'react-helmet-async';

export default function WriteForUs() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
       <Helmet>
    <title>Write For Us - SEO and Digital Marketing</title>
    <meta name="description" content="Passionate about SEO, digital marketing, or content strategy? Write for us! Share your insights, tips, and unique perspectives with our audience."/>
   <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://www.pluseup.com/write-for-us" />
   </Helmet>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white sm:tracking-tight">
          Write for Us
        </h1>
        <p className="mt-5 text-xl text-center text-gray-500 dark:text-gray-400">
          Share your expertise with our growing community of SEO professionals and digital marketers.
        </p>

        <Carousel className="mt-10 h-64 rounded-lg">
          {posts.slice(0, 3).map((post, index) => (
            <img key={index} src={post.image} alt={post.title} className="h-full object-cover" />
          ))}
        </Carousel>

        <Card className="mt-10 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What We're Looking For</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            We welcome in-depth, original articles that provide value to our readers in the fields of SEO, digital marketing, and content strategy.
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600 dark:text-gray-300">
            <li>SEO strategies and best practices</li>
            <li>Content marketing techniques</li>
            <li>Digital marketing trends and insights</li>
            <li>Data-driven case studies and analysis</li>
            <li>Actionable tips for improving online visibility</li>
          </ul>
        </Card>

        <Card className="mt-6 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Requirements</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <AssignmentIcon className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Minimum 1,500 words</span>
            </div>
            <div className="flex items-center">
              <CreateIcon className="h-6 w-6 text-green-500 dark:text-green-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Original, well-researched content</span>
            </div>
            <div className="flex items-center">
              <CalendarTodayIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Up-to-date information and strategies</span>
            </div>
            <div className="flex items-center">
              <MailOutlineIcon className="h-6 w-6 text-purple-500 dark:text-purple-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Engaging and reader-friendly style</span>
            </div>
          </div>
        </Card>

        <Timeline className="mt-10" style={{ marginLeft: '1rem' }}>
          <Timeline.Item>
            <Timeline.Point icon={CreateIcon} />
            <Timeline.Content>
              <Timeline.Title className="text-gray-900 dark:text-white">Submit Your Pitch</Timeline.Title>
              <Timeline.Body className="text-gray-600 dark:text-gray-300">
                Send us your article idea or a brief outline to get started.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point icon={AssignmentIcon} />
            <Timeline.Content>
              <Timeline.Title className="text-gray-900 dark:text-white">Review Process</Timeline.Title>
              <Timeline.Body className="text-gray-600 dark:text-gray-300">
                Our editorial team will review your submission within 5-7 business days.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point icon={CreateIcon} />
            <Timeline.Content>
              <Timeline.Title className="text-gray-900 dark:text-white">Write Your Article</Timeline.Title>
              <Timeline.Body className="text-gray-600 dark:text-gray-300">
                Once approved, write your full article following our guidelines.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point icon={MailOutlineIcon} />
            <Timeline.Content>
              <Timeline.Title className="text-gray-900 dark:text-white">Final Review and Publication</Timeline.Title>
              <Timeline.Body className="text-gray-600 dark:text-gray-300">
                We'll review your article and work with you on any necessary revisions before publishing.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline>

        <Card className="mt-10 text-center bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thank you for your interest in contributing to PluseUp!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            If you have any questions, please contact us at{' '}
            <a href="mailto:pluseupblogs@gmail.com" className="text-blue-500 dark:text-blue-400 hover:underline">
              pluseupblogs@gmail.com
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}