const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments_controller");

router.post("/createComment", commentController.createComment);

router.get("/find", commentController.getCommentsBySender);

router.get("/find/:id", commentController.getCommentById);

module.exports = router;