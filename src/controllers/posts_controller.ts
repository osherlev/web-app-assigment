import {Request, Response} from "express";
import {handleMongoQueryError} from "../utils/db_util";
import Post, {IPost} from "../models/posts_model";

const createPost = async (req: Request, res: Response): Promise<any> => {
    try {
        const {title, content, sender}: { title: string, content?: string; sender: string } = req.body;

        const post = new Post({title, content, sender});

        const savedPost = await post.save();

        return res.json(savedPost);
    } catch (err: any) {
        console.warn("Error saving post:", err);
        return handleMongoQueryError(res, err);
    }
};

const getAllPosts = async (req: Request, res: Response): Promise<any> => {
    const {sender}: { sender?: string } = req.query;

    try {
        const posts: IPost[] = sender
            ? await Post.find({sender}) as IPost[]
            : await Post.find() as IPost[];

        return res.json(posts);
    } catch (error: any) {
        console.warn("Error fetching posts:", error);
        return handleMongoQueryError(res, error);
    }
};

const getPostById = async (req: Request, res: Response): Promise<any> => {
    const post_id: string = req.params.id;

    try {
        const post: IPost | null = await Post.findById(post_id) as IPost | null;

        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }

        return res.json(post);
    } catch (err: any) {
        console.warn("Error fetching post:", err);
        return handleMongoQueryError(res, err);
    }
};

const getPostsBySender = async (req: Request, res: Response): Promise<any> => {
    try {
        const sender: string = String(req.query.sender);

        const posts: IPost[] = await Post.find({sender}) as IPost[];

        if (posts.length === 0) {
            return res.status(404).json({message: "No posts found for this sender"});
        }

        res.status(200).json(posts);
    } catch (error: any) {
        return handleMongoQueryError(res, error);
    }
};

const updatePost = async (req: Request, res: Response): Promise<any> => {
    const post_id: string = req.params.id;
    const {title, content, sender}: { title?: string, content?: string; sender?: string } = req.body;

    try {
        const updatedPost: IPost | null = await Post.findByIdAndUpdate(
            post_id,
            {title, content, sender},
            {new: true, runValidators: true}
        ) as IPost | null;

        if (!updatedPost) {
            return res.status(404).json({error: "Post not found."});
        }

        return res.json(updatedPost);
    } catch (err: any) {
        console.warn("Error updating post:", err);
        return handleMongoQueryError(res, err);
    }
};

export {
    createPost,
    getAllPosts,
    getPostById,
    getPostsBySender,
    updatePost,
};