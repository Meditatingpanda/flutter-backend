const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

//create a post
const createPost = asyncHandler(async (req, res) => {
    const newPosts = await Post.create(req.body);
    res.status(200).json({ msg: "new post creared!" });
})


//update a post
const updatePost = asyncHandler(async (req, res) => {
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

//delete a post
const deletePost = asyncHandler(async (req, res) => {
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

//like or dislike a post

const likePost = asyncHandler(async (req, res) => {
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

//get a post
const getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
})


//get timeline posts
const getTimelinePosts = asyncHandler(async (req, res) => {
    //get posts from the followings and own posts
    const userId = req.query.userId;
    const user = await User.findById(userId);
    const friendPosts = await Promise.all(
        user.following.map((id) => {
            console.log(id);
            let currentUser = User.findById({ _id: id });
            console.log(currentUser.username)
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

//get user posts
const getUserPosts = asyncHandler(async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    if (username) {
        const user = await User.findOne({ username });
        const post = await Post.find({ userId: user._id });
        res.status(200).json(post);

    } else {
        console.log(userId);
        const post = await Post.find({ userId });
        res.status(200).json(post);
    }
    //const post=await Post.find({userId:userId}).exec();

    //res.status(200).json(post);
})

//get all posts
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({});
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

    res.status(200).json(posts);
})

module.exports = {
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getTimelinePosts,
    getUserPosts,
    getAllPosts
}