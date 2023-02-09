const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const { createPost, updatePost, deletePost, likePost, getPost, getTimelinePosts, getAllPosts, getUserPosts } = require("../controllers/postControllers");
//create a post
router.post(
  "/",
  createPost
);

//update a post
router.put(
  "/:id",
  updatePost
);

//delete a post
router.delete(
  "/:id",
  deletePost
);

//like a post
router.put(
  "/:id/like",
  likePost
);

//get a post
router.get(
  "/:id",
  getPost
);

//get  all timeline posts
router.get(
  "/timeline/all",
  getTimelinePosts
);

//get user's post
router.get(
  "/",
  getUserPosts
);
//get all posts
router.get(
  "/all",
  getAllPosts
);

module.exports = router;
