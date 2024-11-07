import React, { useState, useEffect } from 'react';
import { Button, FileInput, Alert, Spinner, TextInput } from 'flowbite-react';
import { CloudUpload, Error, CheckCircle } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PPTXUpdate() {
  const [pptFile, setPptFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { pptxId } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    canonicalUrl: '',
    helmetdescription: '',
    helmetkeywords: '',
    category: '',
    fileName: '',
  });

  useEffect(() => {
    const fetchPPTXData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/ppt/getpptx-file?pptxId=${pptxId}`);
        if (!response.ok) throw new Error('Failed to fetch PPTX data');
        const data = await response.json();
        setFormData(data.pptxfiles[0]);
      } catch (err) {
        console.error('Error fetching PPTX data:', err);
        setError('Failed to fetch PPTX data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPPTXData();
  }, [pptxId]);

  const handleFileChange = (e) => {
    setPptFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileUpdate = async (e) => {
    e.preventDefault();

    const updateData = new FormData();
    if (pptFile) {
      updateData.append('file', pptFile);
    }

    Object.keys(formData).forEach((key) => {
      updateData.append(key, formData[key]);
    });

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/ppt/update-pptx/${pptxId}/${currentUser._id}`, {
        method: 'PUT',
        body: updateData,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to update file');
      
      console.log(data);
      setSuccess('File updated successfully!');
      
      // Optional delay before redirect
      setTimeout(() => navigate(`/theme/${data.updatedFile.slug}`), 1000);
    } catch (err) {
      console.error('Error updating file:', err);
      setError(err.message || 'Failed to update file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser?.isAdmin) {
    return <div className="text-center mt-8">Access denied. Admin only.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Update PPTX File</h1>
      <form onSubmit={handleFileUpdate} className="space-y-4">
        <div>
          <p className="mb-2">Current file: {formData.fileName}</p>
          <FileInput
            id="file"
            helperText="Upload a new PPTX file (optional)"
            accept=".pptx"
            onChange={handleFileChange}
          />
        </div>
        <TextInput
          type="text"
          placeholder="Title"
          id="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <TextInput
          type="text"
          placeholder="Add Canonical Url"
          id="canonicalUrl"
          value={formData.canonicalUrl}
          onChange={handleInputChange}
          required
        />
        <TextInput
          type="text"
          placeholder="Helmet description"
          id="helmetdescription"
          value={formData.helmetdescription}
          onChange={handleInputChange}
          required
        />
        <TextInput
          type="text"
          placeholder="Helmet keywords"
          id="helmetkeywords"
          value={formData.helmetkeywords}
          onChange={handleInputChange}
          required
        />
        <TextInput
          type="text"
          placeholder="Category"
          id="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          color="blue"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" light={true} />
              <span className="ml-2">Updating...</span>
            </>
          ) : (
            <>
              <CloudUpload className="mr-2" />
              <span>Update PPTX</span>
            </>
          )}
        </Button>
      </form>
      {success && (
        <Alert color="success" className="mt-4">
          <CheckCircle className="mr-2" />
          <span>
            <span className="font-medium">Success!</span> {success}
          </span>
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-4">
          <Error className="mr-2" />
          <span>
            <span className="font-medium">Error:</span> {error}
          </span>
        </Alert>
      )}
    </div>
  );
}
