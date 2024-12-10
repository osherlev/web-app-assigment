const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
    }
};

const handleMongoQueryError = (res, err) => {
    const isClientError = (err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError);
    if (isClientError)
    {
        return res.status(400).json({error: err.message});
    } else {
        return res.status(500).json({error: "A server error occurred."});
    }
};

module.exports = {connectDB, handleMongoQueryError};