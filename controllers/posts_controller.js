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

module.exports = {
    createPost,
    getAllPosts,
};
