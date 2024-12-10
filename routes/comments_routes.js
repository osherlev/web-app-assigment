const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments_controller");

router.post("/createComment", commentController.createComment);

router.get("/bySender", commentController.getCommentsBySender);

router.get("/byId/:id", commentController.getCommentById);

module.exports = router;