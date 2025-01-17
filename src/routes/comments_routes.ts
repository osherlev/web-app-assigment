import { Router } from 'express';
const router: Router = Router();
import * as commentController from "../controllers/comments_controller";
/**
 * @swagger
 * tags:
 *  name: Comment
 * description: Comments API
 */

/**
 * @swagger
 * components:
 *  schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *         postID:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *         content:
 *           type: string
 *         sender:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *     CommentInput:
 *       type: object
 *       required:
 *         - sender
 *         - content
 *       properties:
 *         postId:
 *           type: string
 *         content:
 *           type: string
 *         sender:
 *           type: string
 *  requestBodies:
 *      Comment:
 *          description: Comment object input
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CommentInput'
 */

/**
 * @swagger
 * paths:
 *  /comment/createComment:
 *     post:
 *       tags:
 *         - Comment
 *       summary: Add a new comment
 *       description: Create a new comment for a specific post.
 *       requestBody:
 *         description: Comment object to be added
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommentInput"
 *       responses:
 *         "201":
 *           description: Comment successfully created.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Comment"
 */
router.post("/createComment", commentController.createComment);

/**
 * @swagger
 *   /comment/bySender?sender={sender}:
 *     get:
 *       tags:
 *         - Comment
 *       summary: Get comments by sender
 *       description: Retrieve comments made by a specific sender.
 *       parameters:
 *         - name: sender
 *           in: query
 *           required: true
 *           description: name of the sender to retrieve comments for.
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: List of comments successfully retrieved.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Comment"
 *         "404":
 *           description: No comments found for the sender.
 *         "500":
 *           description: Internal server error.
 */
router.get("/bySender", commentController.getCommentsBySender);

/**
 * @swagger
 *   /comment/byId/{commentId}:
 *     get:
 *       tags:
 *         - Comment
 *       summary: Get a comment by ID
 *       description: Retrieve a single comment by its unique ID.
 *       parameters:
 *         - name: commentId
 *           in: path
 *           required: true
 *           description: The ID of the comment to retrieve.
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: The requested comment.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Comment"
 *         "404":
 *           description: Comment not found.
 */
router.get("/byId/:id", commentController.getCommentById);
/**
 * @swagger
 *   /comment/post/{postId}:
 *     get:
 *       tags:
 *         - Comment
 *       summary: Get comments by post ID
 *       description: Retrieve all comments for a specific post.
 *       parameters:
 *         - name: postId
 *           in: path
 *           required: true
 *           description: ID of the post to retrieve comments for.
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: List of comments for the specified post.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/Comment"
 *         "404":
 *           description: No comments found for the post.
 *         "500":
 *           description: Internal server error.
 */
router.get("/post/:post_id", commentController.getCommentsByPost);

/**
 * @swagger
 * paths:
 *  /comment/update/{commentId}:
 *   put:
 *     tags:
 *       - Comment
 *     summary: Updates the entire comment with form data
 *     operationId: updateComment
 *     parameters:
 *       - name: commentId
 *         in: path
 *         description: ID of post to return
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *     requestBody:
 *       description: Comment updated data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
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
router.put("/update/:id", commentController.updateComment);

/**
 * @swagger
 *   /comment/delete/{commentId}:
 *     delete:
 *       tags:
 *         - Comment
 *       summary: Delete a comment
 *       description: Delete a comment by its unique ID.
 *       parameters:
 *         - name: commentId
 *           in: path
 *           required: true
 *           description: The ID of the comment to delete.
 *           schema:
 *             type: string
 *       responses:
 *         "204":
 *           description: Comment successfully deleted.
 */
router.delete("/delete/:id", commentController.deleteComment);

export default router;