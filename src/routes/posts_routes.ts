import { Router } from 'express';
const router: Router = Router();
import * as postController from "../controllers/posts_controller";

router.post("/createPost", postController.createPost);

router.get("/getAllPosts", postController.getAllPosts);

router.get("/:id", postController.getPostById);

router.get("/", postController.getPostsBySender);

router.put("/:id", postController.updatePost);

export default router;
