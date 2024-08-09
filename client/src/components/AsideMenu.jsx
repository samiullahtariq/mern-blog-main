import React from 'react';

const AsideMenu = () => {
  return (
    <aside className="fixed left-0 top-1/4 p-4 bg-gray-100 shadow-lg rounded">
      <nav>
        <ul className="space-y-2">
          <li><a href="#title-section" className="text-blue-500">Title & Category</a></li>
          <li><a href="#image-section" className="text-blue-500">Image Upload</a></li>
          <li><a href="#content-section" className="text-blue-500">Content</a></li>
          <li><a href="#submit-section" className="text-blue-500">Submit</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default AsideMenu;