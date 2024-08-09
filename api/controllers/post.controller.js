import Post from"../models/post.model.js";import{errorHandler}from"../utils/error.js";export const create=async(t,e,r)=>{if(!t.user.isAdmin)return r(errorHandler(403,"You are not allowed to create a post"));if(!t.body.title||!t.body.content)return r(errorHandler(400,"Please provide all required fields"));const s=t.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g,""),o=new Post({...t.body,slug:s,userId:t.user.id});try{const t=await o.save();e.status(201).json(t)}catch(t){r(t)}};export const getposts=async(t,e,r)=>{try{const s=parseInt(t.query.startIndex)||0,o=parseInt(t.query.limit)||9,a="asc"===t.query.order?1:-1,n=await Post.find({...t.query.userId&&{userId:t.query.userId},...t.query.category&&{category:t.query.category},...t.query.slug&&{slug:t.query.slug},...t.query.postId&&{_id:t.query.postId},...t.query.searchTerm&&{$or:[{title:{$regex:t.query.searchTerm,$options:"i"}},{content:{$regex:t.query.searchTerm,$options:"i"}}]}}).sort({updatedAt:a}).skip(s).limit(o),d=await Post.countDocuments(),u=new Date,i=new Date(u.getFullYear(),u.getMonth()-1,u.getDate()),c=await Post.countDocuments({createdAt:{$gte:i}});e.status(200).json({posts:n,totalPosts:d,lastMonthPosts:c})}catch(t){r(t)}};export const deletepost=async(t,e,r)=>{if(!t.user.isAdmin||t.user.id!==t.params.userId)return r(errorHandler(403,"You are not allowed to delete this post"));try{await Post.findByIdAndDelete(t.params.postId),e.status(200).json("The post has been deleted")}catch(t){r(t)}};export const updatepost=async(t,e,r)=>{if(!t.user.isAdmin||t.user.id!==t.params.userId)return r(errorHandler(403,"You are not allowed to update this post"));try{const s=await Post.findByIdAndUpdate(t.params.postId,{$set:{title:t.body.title,content:t.body.content,category:t.body.category,image:t.body.image}},{new:!0});e.status(200).json(s)}catch(t){r(t)}};