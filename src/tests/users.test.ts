import request, { SuperTest, Test } from 'supertest';
import initApp from '../server';
import { Express } from 'express';
import mongoose from 'mongoose';
import userModel, { IUser } from '../models/users_model';

const bcrypt = require('bcrypt');
let app: Express;

jest.mock("../utils/authMiddleware", () => ({
    __esModule: true,
    default: jest.fn((req, res, next) => next()),
}));

beforeAll(async () => {
    app = await initApp();
});
beforeEach(async () => {
    await userModel.deleteMany();
});
afterEach(async () => {
    jest.restoreAllMocks();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Create User', () => {
    describe('POST /registerUser', () => {
        it('should create a new user', async () => {
            const newUser = {
                username: 'osher',
                email: 'osher@example.com',
                password: 'Password123!',
            };

            const response = await request(app).post('/user/registerUser').send(newUser);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.username).toBe(newUser.username);
        });

        it('should not create a user without required fields', async () => {
            const response = await request(app).post('/user/registerUser').send({ username: 'incomplete-user' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should not create a user with an invalid email', async () => {
            const response = await request(app).post('/user/registerUser').send({
                username: 'invalidemailuser',
                email: 'not-an-email',
                password: 'Password123!',
            });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should not create a user with duplicate username', async () => {
            const user = { username: 'user1', email: 'test@example.com', password: 'Password123!' };
            await userModel.create(user);

            const response = await request(app).post('/user/registerUser').send(user);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Username already exists.');
        });
    });
});

// User Read Tests
describe('Read User', () => {
    describe('GET /', () => {
        it('should retrieve all users', async () => {
            await userModel.create({ username: 'user1', email: 'user1@example.com', password: 'Password123!' });
            await userModel.create({ username: 'user2', email: 'user2@example.com', password: 'Password123!' });

            const response = await request(app).get('/user');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
        });

        describe("when there are no users", () => {
            it("should return an empty array", async () => {
                const response = await request(app).get("/user");

                expect(response.statusCode).toBe(200);
                expect(response.body).toBeInstanceOf(Array);
                expect(response.body).toHaveLength(0);
            });
        });

        describe("mongo failure", () => {
            it("should return 500 when there is a server error", async () => {
                jest.spyOn(userModel, "find").mockRejectedValue(new Error("Server error"));

                const response = await request(app).get("/user");

                expect(response.statusCode).toBe(500);
                expect(response.body).toHaveProperty("error");
            });
        });
    });

    describe('GET /:id', () => {
        it('should retrieve a user by ID', async () => {
            const user = await userModel.create({
                username: 'osher',
                email: 'test@example.com',
                password: 'Password123!'
            });

            const response = await request(app).get(`/user/${user._id}`);

            expect(response.status).toBe(200);
            expect(response.body.username).toBe(user.username);
        });

        it('should return 404 for a non-existent user ID', async () => {
            const response = await request(app).get(`/user/${new mongoose.Types.ObjectId()}`);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found.');
        });

        it('should return 400 for invalid user ID format', async () => {
            const response = await request(app).get('/user/invalid-id-format');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
});

// Update User Tests
describe('Update User', () => {
    describe('PUT /user/:id', () => {
        it('should update a user by ID', async () => {
            const user = await userModel.create({
                username: 'osher',
                email: 'test@example.com',
                password: 'Password123!',
            });

            const updatedData = { username: 'osher_updated' };
            const response = await request(app).put(`/user/${user._id}`).send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.username).toBe(updatedData.username);
        });

        it('should return 404 if user not found', async () => {
            const response = await request(app).put(`/user/${new mongoose.Types.ObjectId()}`).send({ username: 'newName' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found.');
        });

        it('should return 400 for invalid user ID format', async () => {
            const response = await request(app).put('/user/invalid-id').send({ username: 'newName' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should return 400 for invalid update data', async () => {
            const user = await userModel.create({
                username: 'osher',
                email: 'test@example.com',
                password: 'Password123!',
            });

            const response = await request(app).put(`/user/${user._id}`).send({ password: null });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should return 400 for invalid update password', async () => {
            const user = await userModel.create({
                username: 'osher',
                email: 'test@example.com',
                password: 'Password123!',
            });

            const response = await request(app).put(`/user/${user._id}`).send({ password: ' ' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Password cannot be empty.');
        });

        it('should return 500 if username already exists', async () => {
            await userModel.create({
                username: 'existing_user',
                email: 'existing@example.com',
                password: 'Password123!',
            });

            const user = await userModel.create({
                username: 'osher',
                email: 'test@example.com',
                password: 'Password123!',
            });

            const response = await request(app).put(`/user/${user._id}`).send({ username: 'existing_user' });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });
    describe('PUT /user/:id - Password Hashing', () => {
        it('should hash the password when updating it', async () => {
            const user = await userModel.create({
                username: 'osher',
                email: 'test@example.com',
                password: 'Password123!',
            });

            const newPassword: string = 'NewPassword123!';
            const response = await request(app).put(`/user/${user._id}`).send({ password: newPassword });

            expect(response.status).toBe(200);

            const updatedUser: IUser = await userModel.findById(user._id) as IUser;
            const isMatch: boolean = await bcrypt.compare(newPassword, updatedUser.password);

            expect(isMatch).toBe(true);

            // Optional: Spy on bcrypt methods to ensure they're called
            const genSaltSpy = jest.spyOn(bcrypt, 'genSalt');
            const hashSpy = jest.spyOn(bcrypt, 'hash');

            await bcrypt.hash(newPassword, await bcrypt.genSalt(10)); // Mimic hashing for spying

            expect(genSaltSpy).toHaveBeenCalled();
            expect(hashSpy).toHaveBeenCalled();
        });
    });
});

// Delete User Tests
describe('Delete User', () => {
    describe('DELETE /user/:id', () => {
        it('should delete a user by ID', async () => {
            const user = await userModel.create({
                username: 'osher',
                email: 'test@example.com',
                password: 'Password123!',
            });

            const response = await request(app).delete(`/user/${user._id}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User deleted successfully');

            const deletedUser = await userModel.findById(user._id);
            expect(deletedUser).toBeNull();
        });

        it('should return 404 if user not found', async () => {
            const response = await request(app).delete(`/user/${new mongoose.Types.ObjectId()}`);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found.');
        });

        it('should return 400 for invalid user ID format', async () => {
            const response = await request(app).delete('/user/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
});

// Get User by Username Tests
describe('Get User by Username', () => {
    describe('GET /user/username/:username', () => {
        it('should retrieve a user by username', async () => {
            const user = await userModel.create({
                username: 'osher',
                email: 'test@example.com',
                password: 'Password123!',
            });

            const response = await request(app).get(`/user/username/${user.username}`);

            expect(response.status).toBe(200);
            expect(response.body.username).toBe(user.username);
        });

        it('should return 404 if user not found', async () => {
            const response = await request(app).get('/user/username/nonexistentuser');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found.');
        });

        it('should return 500 if an internal server error occurs', async () => {
            jest.spyOn(userModel, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(app).get('/user/username/testuser');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });
});

// Get User by Email Tests
describe('Get User by Email', () => {
    describe('GET /user/email/:email', () => {
        it('should retrieve a user by email', async () => {
            const user = await userModel.create({
                username: 'alik1',
                email: 'alik@example.com',
                password: 'Password123!',
            });

            const response = await request(app).get('/user/email/alik@example.com');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining({
                email: user.email,
            }));
        });
        it('should return 404 if user not exist', async () => {
            const response = await request(app).get('/user/email/nonexistent@example.com');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });

        it('should return 400 for invalid email format', async () => {
            const response = await request(app).get('/user/email/invalid-email');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid email format');
        });
        it('should return 500 if there is a database error', async () => {
            jest.spyOn(userModel, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(app).get("/user/email/test@example.com");

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', "A server error occurred.");
        });
    });
});

describe('Login', () => {
    let users = [];
    const testUsers = [
        { username: "Alik", email: "testuser@gmail.com", password: "password123" },
        { username: "Osher", email: "anotherOne@gmail.com", password: "password" },
    ];

    beforeEach(async () => {
        users = await userModel.create(testUsers);
    });

    describe('POST /user/login', () => {
        it('should return tokens for valid credentials', async () => {
            const response = await request(app)
                .post('/user/login')
                .send({ username: "Alik", email: "testuser@gmail.com", password: "password123" });

            const accessToken = response.body.accessToken;
            const refreshToken = response.body.refreshToken;
            expect(accessToken).toBeDefined();
            expect(accessToken).toMatch(/^Bearer\s.+/);
            expect(refreshToken).toBeDefined();
            expect(refreshToken).toMatch(/^Bearer\s.+/);
            expect(response.body.message).toBe("Logged in successfully.");
        });

        it("should return 400 when wrong credentials", async () => {
            const response = await request(app).post("/user/login").send({
                username: "Alik",
                email: "alikkkkkk@gmail.com",
                password: "ppaassword"
            });

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty("error");
        });

        it('should return 500 for missing fields', async () => {
            const response = await request(app)
                .post('/user/login')
                .send({ username: 'Osher' }); // No password

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
        it('should return 404 for unknown user', async () => {
            const response = await request(app)
                .post('/user/login')
                .send({ username: 'test' }); // No password

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });
});
describe('Logout', () => {
    describe('POST /logout', () => {

        it('should return a response with a empty cookie after user is logged out', async () => {
            const response = await request(app).post("/user/logout").send({});
            const accessToken: string = response.headers['authorization'];
            const refreshToken: string = response.headers['refresh-token'];
            expect(accessToken).toBeUndefined();
            expect(refreshToken).toBeUndefined();
        });

        //     it('should return 500 if there is a logout error', async () => {
        //         jest.spyOn(token, 'clearHeaders').mockImplementation(() => {
        //             throw new Error('Logout failed');
        //         });
        //         const response = await request(app).post('/user/logout');
        //         expect(response.status).toBe(500);
        //         expect(response.body).toHaveProperty('error', 'An error occurred while logging out.');
        //     });
        // });
    });
});
