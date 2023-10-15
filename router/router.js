import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";

import AdminModal from "../modals/admin.js";
import UserModal from "../modals/user.js";
import BlogModal from "../modals/blogs.js";
import bcrypt from 'bcrypt';
const saltRounds = 10;

import { addBlog, addCategory, adminLogin, candidateLogin, checkAdminTokenValid, checkUserTokenValid, deleteBlog, deleteCategory, editBlog, editCategory, editUserDetails, forgotPassword, getAllBlogs, getAllCategory, getBlogByCategory, getBlogById, getBlogs, getBlogsById, getComments, getLikes, getTotalBlogs, getUserdataByToken, postComment, register, resetPassword, searchBlogs, setLikes, userDisLiked, userLiked } from "./controller.js";

// const updateOperation = {
//   $set: {
//     likes: 10, // Set the likes field to 10
//   },
// };

// // Update all documents in the collection to add the likes field with the default value
// BlogModal.updateMany({}, updateOperation).then((result) => {
//   console.log('Updated', result.nModified, 'blogs.');
// })
// .catch((err) => {
//   console.error('Error updating blogs:', err);
// })

// async function addLikesToExistingDocuments() {
//   try {
//     // Find all documents where 'likes' field is missing
//     const blogsToUpdate = await BlogModal.find({ likes: { $exists: false } });

//     // Update each document to add an empty 'likes' array
//     for (const blog of blogsToUpdate) {
//       blog.likes = [];
//       await blog.save();
//     }

//     console.log('Updated likes array in existing documents.');
//   } catch (error) {
//     console.error('Error:', error);
//   } 
// }

// addLikesToExistingDocuments();

router.post('/register', register);

  router.post('/adminLogin',adminLogin);

  router.post('/candidateLogin', candidateLogin);

  router.post('/checkAdminTokenValid', checkAdminTokenValid );

  router.post('/getUserdataByToken',  getUserdataByToken);

router.post('/checkUserTokenValid', checkUserTokenValid);

router.get('/getAllBlogs', getAllBlogs);

  router.get('/getTotalBlogs', getTotalBlogs);

  router.get('/getBlogs', getBlogs);
  
  router.get('/getBlogsById', getBlogsById );

  router.get('/getBlogByCategory', getBlogByCategory );

  router.get('/getBlogById', getBlogById);

router.post('/addBlog', addBlog);

router.post('/editBlog', editBlog );

router.post('/deleteBlog', deleteBlog);

router.get('/searchBlogs', searchBlogs );

router.post('/forgotPassword', forgotPassword);

router.post('/resetPassword', resetPassword);

router.post('/addCategory', addCategory);

router.get('/getAllCategory', getAllCategory);

router.post('/editCategory', editCategory);

router.post('/deleteCategory', deleteCategory);

router.get('/userLiked', userLiked)

router.get('/userDisLiked', userDisLiked);

router.get('/getLikes', getLikes);

router.get('/setLike', setLikes);

router.post('/postComment', postComment);

router.get('/getComments', getComments);

router.post('/editUserDetails', editUserDetails);

export default router;