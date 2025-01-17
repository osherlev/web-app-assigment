import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import User, { IUser } from '../models/users_model';
import { handleMongoQueryError } from "../utils/db_util";
import token from "../utils/token_util";

const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, email, password }: { username: string; email: string; password: string } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }
        // Validate password
        if (!password.trim()) {
            return res.status(400).json({ error: 'Password cannot be empty.' });
        }

        const user = new User({
            username,
            email,
            password,
        });

        const savedUser: IUser = await user.save() as IUser;
        return res.status(200).json(savedUser);
    } catch (err: any) {
        console.warn("Error registering user:", err);
        if (err.code === 11000) {
            return res.status(400).json({ error: "Username already exists." });
        } else if (err._message === "User validation failed") {
            return res.status(400).json({ error: "Email is not valid. Please enter a valid email address." });
        } else {
            return res.status(500).json({ error: "An error occurred while registering the user." });
        }
    }
};

// Get All Users
const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const users: IUser[] | null = await User.find() as IUser[] | null;
        return res.status(200).json(users);
    } catch (err: any) {
        console.warn("Error fetching users:", err);
        return res.status(500).json({ error: "An error occurred while fetching the users." });
    }
};

const getUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const user: IUser | null = await User.findById(req.params.id) as IUser | null;

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json(user);
    } catch (error: any) {
        return handleMongoQueryError(res, error);
    }
};

const getUserByEmail = async (req: Request, res: Response): Promise<any> => {
    const email: string = req.params.email;
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    try {
        const user: IUser | null = await User.findOne({ email }) as IUser | null;
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json(user);
    } catch (error: any) {
        return handleMongoQueryError(res, error);
    }
};

const getUserByUserName = async (req: Request, res: Response): Promise<any> => {
    try {
        const user: IUser | null = await User.findOne({ username: req.params.username }) as IUser | null;
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.status(200).json(user);
    } catch (error: any) {
        return handleMongoQueryError(res, error);
    }
};

const updateUser = async (req: Request, res: Response): Promise<any> => {
    const userId: string = req.params.id; // Update user by userId
    const updates = req.body;

    try {
        if (updates.password) {
            if (!updates.password.trim()) {
                return res.status(400).json({ error: 'Password cannot be empty.' });
            }
            const salt: string = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        // Update user in database
        const user: IUser | null = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true
        }) as IUser | null;
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        return res.status(200).json(user);
    } catch (error: any) {
        return handleMongoQueryError(res, error);
    }
};

const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId: string = req.params.id;
        const user: IUser | null = await User.findByIdAndDelete(userId) as IUser | null;
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        return handleMongoQueryError(res, error);
    }
};

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password }: { username: string; password: string } = req.body;
        const existingUser: IUser | null = await User.findOne({ username }) as IUser | null;

        if (!existingUser) {
            return res.status(404).json({ error: "User not found." });
        }

        const isMatchedPassword = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isMatchedPassword) {
            return res
                .status(400)
                .json({ error: existingUser.password });
        }
        const { accessToken, refreshToken, }: {
            accessToken: string;
            refreshToken: string
        } = await token.generateTokens(existingUser);
        return token.setTokens(accessToken, refreshToken, res);
    } catch (err) {
        console.warn("Error while logging in:", err);
        return res
            .status(500)
            .json({ error: "An error occurred while logging in.", err });
    }
};

const logout = async (req: Request, res: Response): Promise<any> => {
    try {
        return token.clearTokens(res);
    } catch (err) {
        console.warn("Error while logging out:", err);
        return res
            .status(500)
            .json({ error: "An error occurred while logging out.", err });
    }
};

// Email validation function
const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export {
    registerUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    getUserByUserName,
    updateUser,
    deleteUser,
    login,
    logout,
};