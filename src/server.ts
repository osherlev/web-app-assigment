import dotenv from "dotenv";
import express, {Express} from "express";
import bodyParser from "body-parser";
import {connectDB} from "./utils/db_util";
import postsRoute from './routes/posts_routes';
import commentsRoute from "./routes/comments_routes";
import usersRoute from "./routes/users_routes";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/post", postsRoute);
app.use("/comment", commentsRoute);
app.use("/user", usersRoute);

const initApp = async (): Promise<Express> => {
    try {
        await connectDB();
        return app;
    } catch (err) {
        throw new Error(`Error connecting to DB: ${err}`);
    }
};

export default initApp;