import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Helmet } from 'react-helmet';

export default function TemplateCard() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/ppt/getpptx-file');
        if (!res.ok) throw new Error('Failed to fetch templates');
        const data = await res.json();
        setTemplates(data.pptxfiles);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setError('Failed to load templates. Please try again later.');
      }
    };
    fetchTemplates();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Helmet>
    <title>Presentation Templates - PluseUp</title>
    <meta name="description" content="Download our Presentation Templates for Google Slides & PowerPoint! ✓ Free ✓ Customizable ✓ Perfect for professional insights"/>
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <link rel="canonical" href="https://www.pluseup.com/theme" />
   </Helmet>

      {templates.map((template) => (
        <div key={template._id} className='group relative w-full border border-teal-500 hover:border-2 h-[360px] overflow-hidden rounded-lg sm:w-[340px] transition-all duration-500 ease-in-out'>
          <Link to={`/theme/${template.slug}`}>
            <LazyLoadImage
              src="https://www.adobe.com/uk/acrobat/resources/document-files/data-files/media_1949bff8aa3fcc47f6986b088cbb03a1685ff1414.png?width=750&format=png&optimize=medium"
              alt={template.title}
              className='h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-500 ease-in-out z-20'
              effect='blur'
            />
          </Link>
          <div className='p-3 flex flex-col gap-2'>
            <p className='text-lg font-semibold line-clamp-2'>
              {template.title}
            </p>
            <span className='italic text-sm'>
              {template.category}
            </span>
            <Link
              to={`/theme/${template.slug}`}
              className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-500 ease-in-out text-center py-2 rounded-md !rounded-tl-none m-2'
            >
              See Template
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}