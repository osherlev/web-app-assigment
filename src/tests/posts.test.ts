import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import { Express } from 'express';
import postModel from '../models/posts_model';

let app: Express;

jest.mock("../utils/authMiddleware", () => ({
    __esModule: true,
    default: jest.fn((req, res, next) => next()),
}));

beforeAll(async () => {
    app = await initApp();
});
beforeEach(async () => {
    jest.restoreAllMocks();
    await postModel.deleteMany();
});
afterEach(async () => {
    jest.restoreAllMocks();
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe("/post/createPost", () => {
    it("should create a new post", async () => {
        const newPost = {
            title: "test post",
            content: "test test test!!!",
            sender: "admin",
        };

        const response = await request(app).post("/post/createPost").send(newPost);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("_id");
        expect(response.body.title).toBe(newPost.title);
    });

    it("should not create a post without required title", async () => {
        const response = await request(app)
            .post("/post/createPost")
            .send({ sender: "admin", content: "test" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            "Post validation failed: title: Path `title` is required."
        );
    });
    it("should not create a post without required sender", async () => {
        const response = await request(app)
            .post("/post/createPost")
            .send({ title: "test", content: "test" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            "Post validation failed: sender: Path `sender` is required."
        );
    });
});

describe("/post/getAllPosts", () => {
    it("should retrieve all posts", async () => {
        await postModel.create({
            title: "test post 1",
            content: "first test post",
            sender: "admin",
        });
        await postModel.create({
            title: "test post 2",
            content: "second test post",
            sender: "admin",
        });

        const response = await request(app).get("/post/getAllPosts");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });
    it("should retrieve 0 posts", async () => {
        const response = await request(app).get("/post/getAllPosts");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });
    it('should return 500 if there is an error during fetching posts', async () => {
        jest.spyOn(postModel, 'find').mockImplementation(() => {
            throw new Error('An error occurred.');
        });
        const response = await request(app).get('/post/getAllPosts');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('A server error occurred.');
    });
});

describe("/post/:id", () => {
    it("should retrieve a post by ID", async () => {
        const post = await postModel.create({
            title: "test post",
            content: "test post for get post by id",
            sender: "admin",
        });

        const response = await request(app).get(`/post/${post._id}`);

        expect(response.status).toBe(200);
        expect(response.body.content).toBe(post.content);
    });
    it("should return 404 for a non-existent post ID", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app).get(`/post/${nonExistentId}`);

        expect(response.status).toBe(404);
    });
    it('should return 500 if there is an error during fetching posts by id', async () => {
        jest.spyOn(postModel, 'findById').mockImplementation(() => {
            throw new Error('A server error occurred.');
        });
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/post/${nonExistentId}`);
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('A server error occurred.');
        ;
    });
});

describe("/post?sender=", () => {
    it("should retrieve all posts by sender", async () => {
        await postModel.create({
            title: "test post 1",
            content: "first test post",
            sender: "admin1",
        });
        await postModel.create({
            title: "test post 2",
            content: "second test post",
            sender: "admin2",
        });

        const response = await request(app).get(`/post/?sender=admin2`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });

    it("should return 404 for a non-existent post sender", async () => {
        await postModel.create({
            title: "test post 1",
            content: "first test post",
            sender: "admin",
        });
        await postModel.create({
            title: "test post 2",
            content: "second test post",
            sender: "admin",
        });

        const response = await request(app).get(`/post/?sender=userWithoutPosts`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No posts found for this sender");
    });
    it('should return 500 if there is an server error during fetching posts', async () => {
        jest.spyOn(postModel, 'find').mockImplementation(() => {
            throw new Error('A server error occurred.');
        });

        const response = await request(app).get(`/post/?sender=test`);
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('A server error occurred.');
        ;
    });
});

describe("/post/:id", () => {
    it("should succesfully update post", async () => {
        const post = await postModel.create({
            title: "test post",
            content: "test post for get post by id",
            sender: "admin",
        });

        const updatedPost = {
            title: "test updated",
            content: "post updated succesfully!",
            sender: "admin",
        };

        const response = await request(app)
            .put(`/post/${post._id}`)
            .send(updatedPost)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        expect(response.body.content).toBe(updatedPost.content);
    });

    it("should return 404 for updating a non-existent post id", async () => {

        const response = await request(app).put(`/post/${new mongoose.Types.ObjectId()}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
    it('should return 500 if there is an error during updating posts', async () => {
        jest.spyOn(postModel, 'findByIdAndUpdate').mockImplementation(() => {
            throw new Error('A server error occurred.');
        });
        const response = await request(app).put(`/post/${new mongoose.Types.ObjectId()}`);
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('A server error occurred.');
    });
});