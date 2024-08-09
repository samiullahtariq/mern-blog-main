import User from"../models/user.model.js";import bcryptjs from"bcryptjs";import{errorHandler}from"../utils/error.js";import jwt from"jsonwebtoken";export const signup=async(s,o,r)=>{const{username:e,email:n,password:t}=s.body;e&&n&&t&&""!==e&&""!==n&&""!==t||r(errorHandler(400,"All fields are required"));const i=bcryptjs.hashSync(t,10),a=new User({username:e,email:n,password:i});try{await a.save(),o.json("Signup successful")}catch(s){r(s)}};export const signin=async(s,o,r)=>{const{email:e,password:n}=s.body;e&&n&&""!==e&&""!==n||r(errorHandler(400,"All fields are required"));try{const s=await User.findOne({email:e});if(!s)return r(errorHandler(404,"User not found"));const t=bcryptjs.compareSync(n,s.password);if(!t)return r(errorHandler(400,"Invalid password"));const i=jwt.sign({id:s._id,isAdmin:s.isAdmin},process.env.JWT_SECRET),{password:a,...c}=s._doc;o.status(200).cookie("access_token",i,{httpOnly:!0}).json(c)}catch(s){r(s)}};export const google=async(s,o,r)=>{const{email:e,name:n,googlePhotoUrl:t}=s.body;try{const s=await User.findOne({email:e});if(s){const r=jwt.sign({id:s._id,isAdmin:s.isAdmin},process.env.JWT_SECRET),{password:e,...n}=s._doc;o.status(200).cookie("access_token",r,{httpOnly:!0}).json(n)}else{const s=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8),r=bcryptjs.hashSync(s,10),i=new User({username:n.toLowerCase().split(" ").join("")+Math.random().toString(9).slice(-4),email:e,password:r,profilePicture:t});await i.save();const a=jwt.sign({id:i._id,isAdmin:i.isAdmin},process.env.JWT_SECRET),{password:c,...d}=i._doc;o.status(200).cookie("access_token",a,{httpOnly:!0}).json(d)}}catch(s){r(s)}};