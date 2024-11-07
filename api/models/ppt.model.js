import mongoose from 'mongoose';

const PptFileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  userId: { 
    type: String, 
    required: true 
  },
  driveFileId:{
    type: String, 
    required: true
  },
  filePath: {
    type: String,
    required: true,
  },
  title: { 
    type: String, 
    required: true, 
    unique: true 
  },
  helmetdescription: { 
    type: String, 
    required: true 
  },
  helmetkeywords: { 
    type: String, 
    required: true 
  },
  canonicalUrl: {
    type: String,
    required: true,
  },
  category: { 
    type: String, 
    default: "uncategorized" 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  }
}, { 
  timestamps: true 
});

const PptFile = mongoose.model('PptFile', PptFileSchema);
export default PptFile;