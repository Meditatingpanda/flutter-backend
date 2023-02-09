const router = require("express").Router();
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Post = require("../models/posts");
const { updateUser, deleteUser, getUserByQuery, followUser, unfollowUser, fetchFollowers, fetchFollowings } = require("../controllers/userControllers");
//update user
router.put(
  "/:id",
  updateUser
);

//delete user
router.delete(
  "/:id",
  deleteUser
);

//get a user by query
router.get(
  "/",
  getUserByQuery
);

//follow a user
router.put(
  "/:id/follow",
  followUser
);

//unfollow a user
router.put(
  "/:id/unfollow",
  unfollowUser
);

//fetch following
router.get(
  "/:id/following",
  fetchFollowings
)

//fetch followers
router.get(
  "/:id/followers",
  fetchFollowers)

module.exports = router;
