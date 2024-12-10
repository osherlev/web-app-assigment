const Comment = require("../models/comments_model");

const createComment = async (req, res) => {
    try {
        const { postId, sender, content } = req.body;
        if (!(postId || sender || content)) {
        return res
            .status(400)
            .json({ error: "All fields are required: postId, sender, content" });
        }
        const comment = await Comment.create({ sender, postId, content });
        res
        .status(201)
        .json({ message: "Comment created successfully", comment: comment });
    } catch (error) {
      return handleMongoQueryError(res, error);
    }
};

const getCommentsBySender = async (req, res) => {
    const filter = req.query.sender;
    let comments;
    try {
      comments = await Comment.find({ sender: filter })
      if (posts.length === 0) {
        return res
          .status(404)
          .json({ message: "No posts found for this sender" });
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

module.exports = {
    createComment,
    getCommentsBySender,
    getCommentById,
  };