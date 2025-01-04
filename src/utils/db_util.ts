import {Response} from "express";
import mongoose, {ConnectOptions} from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.DB_URL as string);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        throw err;
    }
};

export const handleMongoQueryError = (res: Response, err: Error): Response => {
    const isClientError: boolean = (err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError);
    if (isClientError) {
        return res.status(400).json({error: err.message});
    } else {
        return res.status(500).json({error: "A server error occurred."});
    }
};