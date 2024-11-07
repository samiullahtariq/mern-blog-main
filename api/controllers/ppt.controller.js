import PptFile from '../models/ppt.model.js';
import path from 'path';
import fs from 'fs/promises';
import {google} from 'googleapis'
import dotenv from 'dotenv';
import fS from 'fs'

dotenv.config()

const  oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
)

oauth2Client.setCredentials({refresh_token : process.env.REFRESH_TOKEN})

const drive = google.drive({
  version : 'v3',
  auth : oauth2Client
})

async function uploadFile(newFilename, newFilePath) {
  try{
    const response = await drive.files.create({
      requestBody :{
        name: newFilename,
        mimeType : 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      },
      media : {
        mimeType : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        body :  fS.createReadStream(newFilePath)
      }
    })

    return response.data;
  }catch(error){
     console.log(error)
  }
}

///////////// Upload pptx
export const uploadPptx = async (req, res) => {
  try {
    // Check for admin privileges
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Only admins can upload files' });
    }

    // Ensure required fields are present
    const file = req.file;
    if (!file || !req.body.title || !req.body.canonicalUrl) {
      return res.status(400).json({ message: 'Please provide all the required fields.' });
    }

    // Check file type
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: 'Only PPTX files are allowed.' });
    }

    // Generate slug from title
    const slug = req.body.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Define upload directory
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true }); // Ensure directory exists

    // Define new filename and path
    const newFilename = `${Date.now()}-${slug}.pptx`;
    const newFilePath = path.join(uploadDir, newFilename);

    // Move file to upload directory
    await fs.rename(file.path, newFilePath); // Move temp file to uploads folder

    // Save file metadata to database
    

    const response = await uploadFile(newFilename, newFilePath)

    const pptFile = new PptFile({
      fileName: file.originalname, // Keep original file name
      filePath: newFilename,
      driveFileId : response.id,
      slug,
      ...req.body,
      userId: req.user.id,
    });

    await pptFile.save();

    // Respond with success and file data
    res.status(201).json({
      message: 'PPTX file uploaded successfully',
      pptFile,
    });
  } catch (error) {
    console.error('Error in uploadPptx:', error);

    // Cleanup if something goes wrong
    if (req.file) {
      await fs.unlink(req.file.path); // Remove the temp file if needed
    }

    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

////////////////////////////////////// do not change anything from the above



export const deletePptx = async (req, res) => {

  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }

  try {

    const pptFile = await PptFile.findById(req.params.pptxId);

    if (!pptFile) {
      return res.status(404).json({ message: 'File not found in database' });
    }

    // Delete file from Google Drive
    await drive.files.delete({
      fileId: pptFile.driveFileId // Assumes you stored the Google Drive file ID in MongoDB
    });

    /////////// del from uploads folder

    const uploadDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadDir, pptFile.filePath);
    
    try {
      await fs.unlink(filePath);
      console.log(`File deleted successfully from uploads folder: ${filePath}`);
    } catch (unlinkError) {
      console.error(`Error deleting file from uploads folder: ${unlinkError.message}`);
      // Continue with the deletion process even if local file deletion fails
    }

    // Delete file record from MongoDB
    await PptFile.findByIdAndDelete(req.params.pptxId);

    res.status(200).json({ message: 'File deleted successfully from Drive and MongoDB' });

  } catch (error) {

    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });

  }
};

///////////////////////////////////////////// Works till here

export const getSinglePptx = async (req, res, next) => {
  const themeSlug = req.params.themeSlug;

  try {
    // Find the PPT file in MongoDB by slug
    const pptFile = await PptFile.findOne({ slug: themeSlug });

    if (!pptFile) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set Google Drive file permissions
    await drive.permissions.create({
      fileId: pptFile.driveFileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    // Get the file's public links from Google Drive
    const result = await drive.files.get({
      fileId: pptFile.driveFileId,
      fields: 'webViewLink, webContentLink'
    });

    // Send the file data and links back to the client
    res.status(200).json({
      pptFile,
      links: result.data // Contains webViewLink and webContentLink
    });

  } catch (error) {
    console.error('Error fetching PPT file:', error); // Log the error
    res.status(500).json({ message: 'Internal Server Error', error: error.message }); // Respond with error
  }
};

/////////////// check till here

export const getPptFiles = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const pptxfiles = await PptFile.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalFiles = await PptFile.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthFiles = await PptFile.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({ pptxfiles, totalFiles, lastMonthFiles });
  } catch (error) {
    next(error);
  }
};


////// updated pptx

export const updatePptx = async (req, res, next) => {
  // Authorization check
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this pptx'));
  }

  try {
    const pptFile = await PptFile.findById(req.params.pptxId);
    if (!pptFile) {
      return next(errorHandler(404, 'PPTX file not found'));
    }

    // Initialize updateData with metadata fields
    const updateData = {
      title: req.body.title,
      category: req.body.category,
      helmetdescription: req.body.helmetdescription,
      helmetkeywords: req.body.helmetkeywords,
      canonicalUrl: req.body.canonicalUrl
    };

    // Handle file replacement if a new file is provided
    if (req.file) {
      const uploadDir = path.join(process.cwd(), 'uploads');
      const oldFilePath = path.join(uploadDir, pptFile.filePath);

      // Delete old file from the server
      try {
        await fs.unlink(oldFilePath);
        console.log(`File deleted successfully from uploads folder: ${oldFilePath}`);
      } catch (unlinkError) {
        console.error(`Error deleting file from uploads folder: ${unlinkError.message}`);
      }

      // Delete old file from Google Drive
      try {
        await drive.files.delete({ fileId: pptFile.driveFileId });
      } catch (driveDeleteError) {
        console.error(`Error deleting file from Google Drive: ${driveDeleteError.message}`);
        return next(errorHandler(500, 'Error deleting previous file from Google Drive'));
      }

      // Upload new file to Google Drive
      const newFilename = `${Date.now()}-${req.body.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-')}.pptx`;
      const newFilePath = path.join(uploadDir, newFilename);
      await fs.rename(req.file.path, newFilePath);

      // Upload to Google Drive
      const response = await uploadFile(newFilename, newFilePath);
      if (!response || !response.id) {
        return next(errorHandler(500, 'Failed to upload new file to Google Drive'));
      }

      // Update file details in updateData
      updateData.fileName = req.file.originalname;
      updateData.filePath = newFilename;
      updateData.driveFileId = response.id;
    }

    // Update the database record
    const updatedFile = await PptFile.findByIdAndUpdate(
      req.params.pptxId,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({ message: 'PPTX file updated successfully', updatedFile });
  } catch (error) {
    console.error('Error in updatePptx:', error);
    res.status(500).json({ message: 'Error updating file', error: error.message });
  }
};
