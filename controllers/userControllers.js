const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//update user
const updateUser = asyncHandler(async (req, res) => {
  //find the user by id
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    const user = await User.findById({ _id: req.params.id });
    console.log(req.body);
    if (!user) {
      res.status(400);
      throw new Error("User Doesnot Exits");
    }
    if (req.body.password) {
      const hashpwd = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashpwd;
    }

    //update details of user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    res.status(400).json("Account updated");
  } else {
    res.status(403);
    throw new Error("Cant Acces Other A/c");
  }
})

//delete user

const deleteUser = asyncHandler(async (req, res) => {
  //find the user by id
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      res.status(400);
      throw new Error("User Doesnot Exits");
    }

    //delete ac
    await User.deleteOne({ _id: req.params.id });
    res.status(400).json("Account updated");
  } else {
    res.status(403);
    throw new Error("Cant Acces Other A/c");
  }
})
const getUserByQuery = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  const user = userId
    ? await User.findById(userId)
    : await User.findOne({ username });
  if (!user) {
    res.status(400);
    throw new Error("user not found");
  }
  const { password, createdAt, updatedAt, ...others } = user._doc;
  res.status(200).json(others);
})

const followUser = asyncHandler(async (req, res) => {
  if (req.body.userId === req.params.id) {
    res.status(403);
    throw new Error("you cant follow yourself");
  } else {
    const currentUser = await User.findById(req.body.userId);
    const user = await User.findById(req.params.id);
    //cu follows user => user followers cu
    if (user.followers.includes(currentUser._id)) {
      res.status(403);
      throw new Error("You already following");
    } else {
      await currentUser.updateOne({
        $push: {
          following: req.params.id,
        },
      });
      await user.updateOne({
        $push: {
          followers: req.body.userId,
        },
      });
      res.status(200).json({ msg: "user has been followed" });
    }
  }
})
const unfollowUser = asyncHandler(async (req, res) => {
  if (req.body.userId === req.params.id) {
    res.status(403);
    throw new Error("you cant unfollow yourself");
  } else {
    const currentUser = await User.findById(req.body.userId);
    const user = await User.findById(req.params.id);
    //cu follows user => user followers cu
    if (user.followers.includes(currentUser._id)) {
      //remove that user from current user followings
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      res.status(200).json("user has been unfollowed");
    } else {
      res.status(400);
      throw new Error("First Follow");
    }
  }
})

const fetchFollowings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const following = await Promise.all(
    user.following.map((followId) => {
      let followingUser = User.findById({ _id: followId });
      return followingUser;
    }))

  let followingList = [...following];
  followingList = followingList.map((user) => {
    const { _id, username, profilePicture, email, desc, coverPicture, following, followers } = user;
    return { _id, username, profilePicture, email, desc, coverPicture, following, followers };
  });
  res.status(200).json(followingList);
})

const fetchFollowers = asyncHandler(async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  // res.json(user);
  const followers = await Promise.all(
    user.followers.map((followId) => {
      let followerUser = User.findById({ _id: followId });
      return followerUser;
    }))


  let followersList = [];
  if (followers.length === 0) {

    res.status(200).json({ msg: "No Followers" })
    return;
  }
  else {
    followersList = [...followers];
  }
  followersList = followersList.map((user) => {
    const { _id, username, profilePicture, email, desc, coverPicture, following, followers } = user;
    return { _id, username, profilePicture, email, desc, coverPicture, following, followers };
  });
  res.status(200).json(followersList);
})

module.exports = { updateUser, deleteUser, getUserByQuery, followUser, unfollowUser, fetchFollowings, fetchFollowers }