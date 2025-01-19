import dotenv from "dotenv";
import express, { Express } from "express";
import bodyParser from "body-parser";
import { connectDB } from "./utils/db_util";
import postsRoute from './routes/posts_routes';
import commentsRoute from "./routes/comments_routes";
import usersRoute from "./routes/users_routes";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
dotenv.config();

const app = express();
const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Web App Assignment 2025 REST API",
            version: "1.0.0",
            description: "REST server for Posts,Comments and Users",
        },
        servers: [{ url: `http://localhost:${process.env.PORT}` }],
    },
    apis: ["./**/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(bodyParser.urlencoded({ extended: true }));
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