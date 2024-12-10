const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments_controller");

router.post("/createComment", commentController.createComment);

router.get("/bySender", commentController.getCommentsBySender);

router.get("/byId/:id", commentController.getCommentById);

router.get("/post/:post_id", commentController.getCommentsByPost);

router.put("update/:id", commentController.updateComment);

router.delete("delete/:id", commentController.deleteComment);

module.exports = router;