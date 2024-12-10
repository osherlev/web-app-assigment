const User = require("../models/users_model");
const {handleMongoQueryError} = require("../utils/db_util");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const userExists = await User.findOne({email});

        if (userExists) {
            return res.status(400).json({message: "User already exists."});
        }
        const user = await User.create({username, email, password});
        return res.status(201).json({id: user._id, username: user.username, email: user.email});
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.status(200).json(users);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, "-password");
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }
        res.status(200).json(user);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }, "-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const getUserByUserName = async (req, res) => {
    try {
        const user = await User.findOne(
            { username: req.params.username },
            "-password"
        );
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
};

const updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const updates = req.body;

        if (updates.password) {
            if (!updates.password.trim()) {
                return res.status(400).json({error: 'Password cannot be empty.'});
            }
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }
        const user = await User.findByIdAndUpdate(id, updates, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).json({error: 'User not found.'});
        }

        res.status(200).json(user);
    } catch (error) {
        return handleMongoQueryError(res, error);
    }
}

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return handleMongoQueryError(res, error);
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByUserName,
  updateUser,
  deleteUser,
};
