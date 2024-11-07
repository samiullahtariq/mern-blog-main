import express from 'express';
import { uploadPptx , deletePptx, getPptFiles , getSinglePptx, updatePptx } from '../controllers/ppt.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Destination folder
  },
  filename: (req, file, cb) => {
    // Retain the original file name
    const originalName = file.originalname.replace(/\s+/g, '-'); // Replace spaces with hyphens
    cb(null, `${Date.now()}-${originalName}`); // Append timestamp to the original name
  },
});

const upload = multer({ storage });

// Define routes for PPTX file handling
router.post('/upload-pptx', verifyToken, upload.single('file'), uploadPptx);
router.get('/getpptx-file', getPptFiles);
router.delete('/delete-pptx/:pptxId/:userId', verifyToken, deletePptx);
router.put('/update-pptx/:pptxId/:userId', verifyToken, upload.single('file'), updatePptx);
router.get('/getpptx-file/:themeSlug', getSinglePptx);

export default router;
