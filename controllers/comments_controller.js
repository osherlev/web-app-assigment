const Comment = require("../models/comments_model");
const {handleMongoQueryError} = require("../utils/db_util");

const createComment = async (req, res) => {
    try {
        const {postId, sender, content} = req.body;
        if (!(postId || sender || content)) {
            return res
                .status(400)
                .json({error: "All fields are required: postId, sender, content"});
        }
        const comment = await Comment.create({sender, postId, content});
        res
            .status(201)
            .json({message: "Comment created successfully", comment: comment});
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const getCommentsBySender = async (req, res) => {
    const filter = req.query.sender;
    let comments;
    try {
        comments = await Comment.find({sender: filter})
        if (comments.length === 0) {
            return res
                .status(404)
                .json({message: "No comments found for this sender"});
        }
        res.status(200).send(comments);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const getCommentById = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (comment) {
            res.send(comment);
        } else {
            return res.status(404).send("Comment was not found");
        }
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.post_id;
        const comments = await Comment.find({postId});
        if (!comments || comments.length === 0) {
            return res
                .status(404)
                .json({message: "No comments found for this post."});
        }
        res.status(200).json(comments);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        if (commentId) {
            const comment = await Comment.findByIdAndUpdate(commentId, req.body, {
                new: true, runValidators: true });
            if (!comment) {
                return res.status(404).json({message: "Comment was not found"});
            }
            res.status(200).json(comment);
        }
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) return res.status(404).json({message: "Comment not found"});
        res.status(200).json({message: "Comment deleted successfully"});
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

module.exports = {
    createComment,
    getCommentsBySender,
    getCommentById,
    getCommentsByPost,
    updateComment,
    deleteComment,
};