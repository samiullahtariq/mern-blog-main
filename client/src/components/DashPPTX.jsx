import React, { useEffect, useState } from 'react';
import { Modal, Table, Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function DashPPTX() {
  const { currentUser } = useSelector((state) => state.user);
  const [pptxFiles, setPptxFiles] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pptxIdToDelete, setPptxIdToDelete] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPPTXFiles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/ppt/getpptx-file?userId=${currentUser._id}`);
        if (!res.ok) throw new Error('Failed to fetch files');
        const data = await res.json();
        
        // Update this line to match your backend response structure
        setPptxFiles(data.pptxfiles);
        setShowMore(data.pptxfiles.length >= 9);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching files:', error);
        setError('Failed to load files. Please try again.');
        setLoading(false);
      }
    };
    if (currentUser?.isAdmin) {
      fetchPPTXFiles();
    }
  }, [currentUser._id]);
  
  
  const handleShowMore = async () => {
    const startIndex = pptxFiles.length;
    try {
      const res = await fetch(`/api/ppt/getpptx-file?userId=${currentUser._id}&startIndex=${startIndex}`);
      if (!res.ok) throw new Error('Failed to fetch more files');
      const data = await res.json();
      
      // Again, adjust this line to match your backend response structure
      setPptxFiles((prev) => [...prev, ...data.pptxfiles]);
      setShowMore(data.pptxfiles.length >= 9);
    } catch (error) {
      console.error('Error fetching more files:', error);
      setError('Failed to load more files. Please try again.');
    }
  };
  

  const handleDeletePPTX = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/ppt/delete-pptx/${pptxIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete file');
      setPptxFiles((prev) =>
        prev.filter((file) => file._id !== pptxIdToDelete)
      );
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Failed to delete file. Please try again.');
    }
  };
  
  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && pptxFiles.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>File name</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {pptxFiles.map((file) => (
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={file._id}>
                  <Table.Cell>{new Date(file.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{file.fileName}</Table.Cell>
                  <Table.Cell>
                    <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/theme/${file.slug}`}
                    >
                      {file.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{file.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPptxIdToDelete(file._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/update-pptx/${file._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no PPTX files yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <ErrorOutlineIcon className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this PPTX file?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePPTX}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}