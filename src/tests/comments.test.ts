import request from 'supertest';
import initApp from '../server';
import { Express } from 'express';
import mongoose from 'mongoose';
import postModel from '../models/posts_model';
import commentModel from '../models/comments_model';

let app: Express;

jest.mock("../utils/authMiddleware", () => ({
    __esModule: true,
    default: jest.fn((req, res, next) => next()),
}));

beforeAll(async () => {
    app = await initApp();
});
beforeEach(async () => {
    await commentModel.deleteMany();
});
afterEach(async () => {
    jest.restoreAllMocks();
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe("/comment/createComment", () => {
    it("should create a new comment", async () => {
        const post = await postModel.create({
            title: "test post",
            content: "test post for get post by id",
            sender: "admin",
        });

        const newComment = {
            sender: "admin",
            postId: post._id,
            content: "test comment",
        };

        const response = await request(app)
            .post("/comment/createComment")
            .send(newComment);

        expect(response.status).toBe(200);
        expect(response.body.content).toBe(newComment.content);
    });

    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/comment/createComment')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Post ID is required." });
    })

    it('should return 404 if there is an error during fetching not existing comments', async () => {
        const response = await request(app).post('/comment/createComment').send({
            sender: "test",
            postId: new mongoose.Types.ObjectId(),
            content: "test"
        });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Post not found.');
    });
});

describe("/comment/byId/:id", () => {
    it("should retrieve a comment by ID", async () => {
        const post = await postModel.create({
            title: "test post",
            content: "test post for get comment by id",
            sender: "admin",
        });
        const comment = await commentModel.create({
            sender: "admin2",
            postId: post._id,
            content: "test comment",
        });

        const response = await request(app).get(`/comment/byId/${comment._id}`);

        expect(response.status).toBe(200);
        expect(response.body.content).toBe(comment.content);
    });

    it("should return 4004 for a non-existent comment ID", async () => {

        const response = await request(app).get(`/comment/byId/${new mongoose.Types.ObjectId()}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Comment not found");
    });

    it('should return 400 if there is an error during fetching comments', async () => {
        jest.spyOn(commentModel, 'findById').mockImplementation(() => {
            throw new Error('A server error occurred.');
        });
        const response = await request(app).get('/comment/byId/a');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('A server error occurred.');
    });
});

describe("/comment/post/:post_id", () => {
    it("should retrieve all comments by Post", async () => {
        const post = await postModel.create({
            title: "test post",
            content: "test post for get comment by id",
            sender: "admin",
        });
        const postID: string = String(post._id);
        await commentModel.create({
            sender: "admin2",
            postId: postID,
            content: "test comment 1",
        });
        await commentModel.create({
            sender: "admin1",
            postId: postID,
            content: "test comment 2",
        });

        const response = await request(app).get(`/comment/post/${postID}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it("should return 404 for a non-existent post ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app).get(`/comment/post/${nonExistentId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No comments found for this post.");
    });

    it('should return 500 if there is an error during fetching comments', async () => {
        jest.spyOn(commentModel, 'find').mockImplementation(() => {
            throw new Error('A server error occurred.');
        });
        const response = await request(app).get('/comment/post/post_id=test');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('A server error occurred.');
    });
});

describe("/comment/bySender?sender=", () => {
    it("should retrieve all comments by sender", async () => {
        const post = await postModel.create({
            title: "test post",
            content: "test post for get all comments",
            sender: "admin",
        });
        await commentModel.create({
            sender: "admin1",
            postId: post._id,
            content: "test comment 1",
        });
        await commentModel.create({
            sender: "admin2",
            postId: post._id,
            content: "test comment 2",
        });

        const response = await request(app).get(`/comment/bySender?sender=admin2`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });

    it("should return 404 if there is no comments by this sender", async () => {

        const response = await request(app).get(`/comment/bySender?sender=`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No comments found for this sender");
    });

    it('should return 500 if there is an error during fetching comments', async () => {
        jest.spyOn(commentModel, 'find').mockImplementation(() => {
            throw new Error('A server error occurred.');
        });
        const response = await request(app).get('/comment/bySender?sender="test"');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('A server error occurred.');
    });
});

describe("/comment/update/:id", () => {
    it("should successfully update comment", async () => {
        const post = await postModel.create({
            title: "test post",
            content: "test post",
            sender: "admin",
        });
        const comment = await commentModel.create({
            sender: "admin1",
            postId: post._id,
            content: "test comment",
        });

        const updatedComment = {
            sender: "admin1",
            postId: post._id,
            content: "test comment updated",
        };

        const response = await request(app)
            .put(`/comment/update/${comment._id}`)
            .send(updatedComment)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body.content).toBe(updatedComment.content);
    });

    it("should return 400 commentId is required", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).put(`/comment/update/${null}`);

        expect(response.status).toBe(400);
    });

    it("should return 400 for a null comment id", async () => {
        const response = await request(app).put(`/comment/update/null`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it('should return 400 if there is an error during updating comments without required fields', async () => {
        const response = await request(app).put(`/comment/update/${new mongoose.Types.ObjectId()}`);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Content and sender are required.');
    });
});

describe("/comment/delete/:id", () => {
    it("should successfully delete comment", async () => {
        const post = await postModel.create({
            title: "test post",
            content: "test post",
            sender: "admin",
        });
        const comment = await commentModel.create({
            sender: "admin1",
            postId: post._id,
            content: "test comment",
        });

        const response = await request(app).delete(`/comment/delete/${comment._id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Comment deleted successfully");
    });

    it("should return 404 for a non-existent comment id", async () => {

        const response = await request(app).delete(`/comment/delete/${new mongoose.Types.ObjectId()}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Comment not found");
    });

    it('should return 500 if there is an error during fetching comments', async () => {
        jest.spyOn(commentModel, 'findByIdAndDelete').mockImplementation(() => {
            throw new Error('A server error occurred.');
        });
        const response = await request(app).delete(`/comment/delete/${new mongoose.Types.ObjectId()}`);
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('A server error occurred.');
    });
});