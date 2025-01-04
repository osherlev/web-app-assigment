import express from "express";
const router = express.Router();
import * as userController from "../controllers/users_controller";

/**
 * @swagger
 * tags:
 *  name: User
 * description: Users API
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          minLength: 24
 *          maxLength: 24
 *        username:
 *          type: string
 *          description: must be unique
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        __v:
 *          type: integer
 *    UserInput:
 *      type: object
 *      required:
 *        - username
 *        - email
 *        - password
 *      properties:
 *        username:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 */

/**
 * @swagger
 *   /user/registerUser:
 *     post:
 *       tags:
 *         - User
 *       summary: Register new user
 *       description: Register a new user.
 *       requestBody:
 *         description: User registration data.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserInput"
 *       responses:
 *         "200":
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/User"
 *         "400":
 *           description: Invalid input
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UnexpectedError"
 *         "500":
 *           description: An unexpected error occurred
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UnexpectedError"
 */
router.post("/registerUser", userController.registerUser);

/**
 * @swagger
 *   /user:
 *     get:
 *       tags:
 *         - User
 *       summary: Get all users
 *       description: Get all users from the database.
 *       responses:
 *         "200":
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/User"
 *         "500":
 *           description: An unexpected error occurred
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UnexpectedError"
 */
router.get("/", userController.getAllUsers);

/**
 * @swagger
 * paths:
 *  /user/{userId}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User by userID
 *     description: Returns a single user
 *     operationId: getUserByID
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of User to return
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
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnexpectedError'
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 *   /user/email/{email}:
 *     get:
 *       tags:
 *         - User
 *       summary: Get user by email
 *       description: Retrieve a user by their email.
 *       parameters:
 *         - name: email
 *           in: path
 *           required: true
 *           description: Email of the user.
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/User"
 *         "404":
 *           description: User not found
 *         "500":
 *           description: An unexpected error occurred
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UnexpectedError"
 */
router.get("/email/:email", userController.getUserByEmail);

/**
 * @swagger
 *   /user/username/{username}:
 *     get:
 *       tags:
 *         - User
 *       summary: Get user by username
 *       description: Retrieve a user by their username.
 *       parameters:
 *         - name: username
 *           in: path
 *           required: true
 *           description: Username of the user.
 *           schema:
 *             type: string
 *       responses:
 *         "200":
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/User"
 *         "404":
 *           description: User not found
 *         "500":
 *           description: An unexpected error occurred
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UnexpectedError"
 */
router.get("/username/:username", userController.getUserByUserName);

/**
 * @swagger
 *   /user/{userId}:
 *     put:
 *       tags:
 *         - User
 *       summary: Update user details
 *       description: Update information of an existing user by their ID.
 *       parameters:
 *         - name: userId
 *           in: path
 *           required: true
 *           description: The ID of the user to update.
 *           schema:
 *             type: string
 *       requestBody:
 *         description: User object with updated information.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserInput"
 *       responses:
 *         "200":
 *           description: User successfully updated.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/User"
 *         "404":
 *           description: User not found.
 *         "500":
 *           description: An unexpected error occurred.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/UnexpectedError"
 */
router.put("/:id", userController.updateUser);

/**
 * @swagger
 *   /user/{id}:
 *     delete:
 *       tags:
 *         - User
 *       summary: Delete a user
 *       description: Delete a user by their unique ID.
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the user to delete.
 *           schema:
 *             type: string
 *       responses:
 *         "204":
 *           description: User successfully deleted.
 *         "404":
 *           description: User not found.
 *         "500":
 *           description: An unexpected error occurred.
 */
router.delete("/:id", userController.deleteUser);

/**
 * @swagger
 *   /user/login:
 *     post:
 *       tags:
 *         - User
 *       summary: User login
 *       description: Authenticate a user and return a session token or JWT.
 *       requestBody:
 *         description: User login credentials.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *               required:
 *                 - username
 *                 - password
 *       responses:
 *         "200":
 *           description: Login successful, returns a token.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                 required:
 *                   - token
 *         "401":
 *           description: Invalid credentials.
 *         "500":
 *           description: An unexpected error occurred.
 */
router.post("/login", userController.login);

/**
 * @swagger
 *   /user/logout:
 *     post:
 *       tags:
 *         - User
 *       summary: User logout
 *       description: Invalidate the current session or JWT.
 *       responses:
 *         "200":
 *           description: Logout successful.
 *         "401":
 *           description: Unauthorized, not logged in.
 *         "500":
 *           description: An unexpected error occurred.
 */
router.post("/logout", userController.logout);

export default router;
