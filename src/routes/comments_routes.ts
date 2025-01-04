import { Router } from 'express';
const router: Router = Router();
import * as commentController from "../controllers/comments_controller";

router.post("/createComment", commentController.createComment);

router.get("/bySender", commentController.getCommentsBySender);

router.get("/byId/:id", commentController.getCommentById);

router.get("/post/:post_id", commentController.getCommentsByPost);

router.put("/update/:id", commentController.updateComment);

router.delete("/delete/:id", commentController.deleteComment);

export default router;