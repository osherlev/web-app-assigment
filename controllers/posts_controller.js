const Post = require("../models/posts_model");
const {handleMongoQueryError} = require("../utils/db_util");

const createPost = async (req, res) => {
    const postBody = req.body;
    try {
        const post = await Post.create(postBody);
        res.status(201).send(post);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const getAllPosts = async (req, res) => {
    let posts;
    try {
        posts = await Post.find();
        res.send(posts);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const getPostById = async (req, res) => {
    const postId = req.params.id;
  
    try {
      const post = await Post.findById(postId);
      if (post) {
        res.send(post);
      } else {
        return res.status(404).send("Post was not found");
      }
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
  };
  
  const getPostsBySender = async (req, res) => {
    try {
      const sender = req.query.sender;
  
      const posts = await Post.find({ sender });
      if (posts.length === 0) {
        return res
          .status(404)
          .json({ message: "No posts found for this sender" });
      }
      res.status(200).json(posts);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
  };
  
  const updatePost = async (req, res) => {
    try {
      const updatedData = req.body;
      const post = await Post.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
        runValidators: true
      });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
  };
  
  module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    getPostsBySender,
    updatePost,
  };
