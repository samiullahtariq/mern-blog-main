import React, { useState } from 'react';
import { Button, FileInput, Alert, Spinner, TextInput } from 'flowbite-react';
import { CloudUpload, Error, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PPTXUpload() {
  const [pptFile, setPptFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    title: '',
    canonicalUrl: '',
    helmetdescription: '',
    helmetkeywords: '',
    category: '',
  });

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

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!pptFile) {
      setError('Please select a file to upload.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', pptFile);
    
    Object.keys(formData).forEach((key) => {
      uploadData.append(key, formData[key]);
    });

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/ppt/upload-pptx', {
        method: 'POST',
        body: uploadData,
      });
      if (!response.ok) throw new Error('Failed to upload file');
      const data = await response.json();
      setSuccess('File uploaded successfully!');
      navigate(`/theme/${data.pptFile.slug}`);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser?.isAdmin) {
    return <div className="text-center mt-8">Access denied. Admin only.</div>;
  }

  return (
    <div className="max-w-md mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Upload PPTX File</h1>
      <form onSubmit={handleFileUpload} className="space-y-4">
        <FileInput
          id="file"
          helperText="Upload a PPTX file"
          accept=".pptx"
          onChange={handleFileChange}
          required
        />
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
          disabled={isLoading || !pptFile}
          color="blue"
        >
          {isLoading ? (
            <>
              <Spinner size="sm" light={true} />
              <span className="ml-2">Uploading...</span>
            </>
          ) : (
            <>
              <CloudUpload className="mr-2" />
              <span>Upload PPTX</span>
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