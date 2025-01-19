import { Router } from 'express';
const router: Router = Router();
import * as postController from "../controllers/posts_controller";
import authMiddleware from "../utils/authMiddleware";
/**
 * @swagger
 * tags:
 *  name: Post
 * description: Posts API
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Post:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  minLength: 24
 *                  maxLength: 24
 *              content:
 *                  type: string
 *              sender:
 *                  type: string
 *              title:
 *                  type: string
 *              __v:
 *                  type: integer
 *      PostInput:
 *          type: object
 *          required:
 *              - content
 *              - sender
 *          properties:
 *              content:
 *                  type: string
 *              sender:
 *                  type: string
 *              title:
 *                  type: string
 *  requestBodies:
 *      Post:
 *          description: Post object input
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PostInput'
 */


/**
 * @swagger
 * paths:
 *  /post/createPost:
 *   post:
 *     tags:
 *       - Post
 *     summary: Add a new post
 *     description: Add a new post
 *     operationId: addPost
 *     requestBody:
 *       description: Create a new post
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.post("/createPost", authMiddleware, postController.createPost);


/**
 * @swagger
 * paths:
 *  /post/getAllPosts/:
 *   get:
 *     tags:
 *       - Post
 *     summary: Get all posts
 *     description: Get all posts from the database
 *     operationId: getAllPosts
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/getAllPosts", authMiddleware, postController.getAllPosts);


/**
 * @swagger
 * paths:
 *  /post/{postId}:
 *   get:
 *     tags:
 *       - Post
 *     summary: Get post by postID
 *     description: Returns a single post
 *     operationId: getPostByID
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of post to return
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/:id", authMiddleware, postController.getPostById);

/**
 * @swagger
 * paths:
 *   /post/?sender={sender}:
 *     get:
 *       tags:
 *         - Post
 *       summary: Get posts by sender
 *       description: Retrieve all posts made by a specific sender.
 *       parameters:
 *         - name: sender
 *           in: query
 *           required: true
 *           description: The name of the sender.
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: A list of posts by the sender.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Post"
 *         "404":
 *           description: No posts found for this sender.
 *         "500":
 *           description: An unexpected error occurred
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UnexpectedError"
 */
router.get("/", authMiddleware, postController.getPostsBySender);

/**
 * @swagger
 * paths:
 *  /post/{postId}:
 *   put:
 *     tags:
 *       - Post
 *     summary: Updates the entire post with form data
 *     operationId: updatePost
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of post to return
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *     requestBody:
 *       description: Post updated data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Missing required parameters
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.put("/:id", authMiddleware, postController.updatePost);

export default router;
