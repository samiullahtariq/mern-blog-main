import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState, useMemo, useRef } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactQuill from "react-quill";
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [contentImageUploadProgress, setContentImageUploadProgress] = useState(null);
  const [contentImageUploadError, setContentImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleContentImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setContentImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.error('Upload failed:', error);
          setContentImageUploadError('Image upload failed');
          setContentImageUploadProgress(null);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setContentImageUploadProgress(null);
            setContentImageUploadError(null);
            resolve(downloadURL);
          });
        }
      );
    });
  };
  

  const handleImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const url = await handleContentImageUpload(file);
        const altText = prompt('Please enter alt text for the image');
        const titleText = prompt('Please enter title text for the image');
  
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();

        quill.insertEmbed(range.index, 'image', url);
        quill.formatLine(range.index, 1, 'align', 'center');
 
        const imgElement = quill.root.querySelector(`img[src="${url}"]`);
        if (imgElement) {
          imgElement.setAttribute('alt', altText || 'Default Alt Text');
          imgElement.setAttribute('title', titleText || 'Default Title Text');
        }
      }
    };
  };
  const handleVideo = () => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    const embedUrl = prompt("Please enter YouTube video URL");
    if (embedUrl) {
      const videoId = embedUrl.split('v=')[1] || embedUrl.split('/').pop();
      const iframe = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      quill.clipboard.dangerouslyPasteHTML(range.index, iframe);
    }
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': '1'}, {'header': '2'}, {'header': '3'} , { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'code-block' , 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'video'],  
        [{ 'align': [] }],
        ['clean']
      ],
      handlers: {
        image: handleImage,  
        video: handleVideo,  
      }
    }
  }), []);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
  
          
            const altText = prompt('Please enter alt text for the main title image');
  
          
            setFormData({
              ...formData,
              image: downloadURL,
              imageAlt: altText || 'Default Alt Text' 
            });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <TextInput
            type='text'
            placeholder='Helmetdescription'
            required
            id='helmetdescription'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, helmetdescription: e.target.value })
            }
            value={formData.helmetdescription}
          />
          <TextInput
            type='text'
            placeholder='Helmetkeywords'
            required
            id='helmetkeywords'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, helmetkeywords: e.target.value })
            }
            value={formData.helmetkeywords}
          />
          <TextInput
            type='text'
            placeholder='Category'
            required
            id='category'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          />
          <TextInput
            type='text'
            placeholder='Add Canonical Url'
            required
            id='canonicalUrl'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, canonicalUrl: e.target.value })
            }
            value={formData.canonicalUrl}
          />
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <LazyLoadImage
          effect='blur'
            src={formData.image}
            alt={formData.imageAlt}
            title={formData.title}
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          ref={quillRef}
          theme='snow'
          value={formData.content}
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          modules={modules}
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        {contentImageUploadProgress && (
          <div className='w-16 h-16 mx-auto'>
            <CircularProgressbar
              value={contentImageUploadProgress}
              text={`${contentImageUploadProgress || 0}%`}
            />
          </div>
        )}
        {contentImageUploadError && <Alert color='failure'>{contentImageUploadError}</Alert>}
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Update post
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
