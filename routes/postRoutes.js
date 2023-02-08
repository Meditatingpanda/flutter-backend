const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const User = require("../models/user");
//create a post
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newPosts = await Post.create(req.body);
    res.status(200).json({ msg: "new post creared!" });
  })
);

//update a post
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    //find the post by id
    const post = await Post.findById(req.params.id);
    if (req.body.userId !== post.userId) {
      res.status(401);
      throw new Error("Can not update others post");
    } else {
      await post.updateOne({
        $set: req.body,
      });

      res.status(200).json({ msg: "post updated" });
    }
  })
);

//delete a post
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    //find the post by id
    const post = await Post.findById(req.params.id);
    if (req.body.userId !== post.userId) {
      res.status(401);
      throw new Error("Can not delete others post");
    } else {
      await post.deleteOne();
      res.status(200).json({ msg: "post delated" });
    }
  })
);

//like a post
router.put(
  "/:id/like",
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.body.userId)) {
      //remove like
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      res.status(200).json("The post has been disliked");
    } else {
      //add likes

      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      res.status(200).json("The post has been liked");
    }
  })
);

//get a post
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  })
);

//get  all timeline posts
router.get(
  "/timeline/all",
  asyncHandler(async (req, res) => {
    //get posts from the followings and own posts
    const userId = req.query.userId;
    const user = await User.findById(userId);
    const friendPosts = await Promise.all(
      user?.following.map((id) => {
        let currentUser = User.findById({ _id: id });
        let post = Post.find({ userId: id });
        const newPostData = {
          ...post._doc,
          username: currentUser.username,
          profile_pic: currentUser.profilePicture,
          email: currentUser.email,
          cover_pic: currentUser.coverPicture,
        };
        return newPostData;
      })
    );
    //  res.status(200).json(friendPosts);
    let ownPosts = await Post.find({ userId: userId });
    ownPosts = ownPosts.map((post) => {
      return {
        ...post._doc,

        username: user.username,
        profile_pic: user.profilePicture,
        email: user.email,

        cover_pic: user.coverPicture

      }
    })
    let allPosts = ownPosts.concat(...friendPosts);
    allPosts = allPosts.filter((post) => {
      return post.userId;
    })
    res.status(200).json(allPosts);
    //res.status(200).json(ownPosts);
  })
);

//get user's post
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    if (username) {
      const user = await User.findOne({ username });
      const post = await Post.find({ userId: user._id });
      res.status(200).json(post);
      console.log(username, 1);
    } else {
      console.log(userId);
      const post = await Post.find({ userId });
      res.status(200).json(post);
    }
    //const post=await Post.find({userId:userId})
    
    res.status(200).json(post);
  })
);
//get all posts
router.get(
  "/all",
  asyncHandler(async (req, res) => {
    const posts = await Post.find();
    //  const allPosts=await Promise.all(
    //     posts.map((post)=>{
    //       let currentUser = User.findById({ _id: post.userId });
    //       const newPostData = {

    //         ...post._doc,

    //         username: currentUser.username,
    //         profile_pic: currentUser.profilePicture,
    //         email: currentUser.email,
    //         _id: currentUser._id,
    //         cover_pic: currentUser.coverPicture,

    //       };
    //       return newPostData;
    //     })
    //  )

    res.status(200).json({});
  })
);

module.exports = router;
