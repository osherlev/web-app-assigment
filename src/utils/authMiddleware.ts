import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type Payload = {
    _id: string;
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header("authorization");
    const token = authorization && authorization.split(" ")[1];

    if (!token) {
        res.status(401).send("Access Denied");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send("Server Error");
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err: any, payload: any) => {
        if (err) {
            console.warn(err);
            res.status(401).send("Access Denied");
            return;
        }
        req.params.userId = (payload as Payload)._id;
        next();
    });
};

export default authMiddleware;