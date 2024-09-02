import mongoose from "mongoose";

let postSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
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
  },
  image: { 
    type: String 
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

const Post = mongoose.model("Post", postSchema);

export default Post;
