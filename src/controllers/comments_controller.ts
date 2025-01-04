import {Request, Response} from "express";
import {handleMongoQueryError} from "../utils/db_util";
import Post from "../models/posts_model";
import Comment, {IComment} from "../models/comments_model";
import { Types } from "mongoose";


const createComment = async (req: Request, res: Response): Promise<any> => {
    const {postId, content, sender}: { postId: string, content: string; sender: string } = req.body;

    try {
        if (!postId) {
            return res.status(400).json({error: "Post ID is required."});
        }

        const postExists = await Post.countDocuments({_id: postId}).exec();
        if (postExists === 0) {
            return res.status(404).json({error: "Post not found."});
        }

        const comment = new Comment({
            postId: postId,
            content,
            sender,
        });

        const savedComment = await comment.save();
        return res.json(savedComment);
    } catch (err: any) {
        console.warn("Error saving comment:", err);
        return handleMongoQueryError(res, err);
    }
};


const getCommentsBySender = async (req: Request, res: Response): Promise<any> => {
    const senderFilter: string = req.query.sender as string;

    try {
        const comments: IComment[] = await Comment.find({sender: senderFilter}) as IComment[];
        if (comments.length === 0) {
            return res.status(404).json({message: "No comments found for this sender"});
        }
        return res.status(200).json(comments);
    } catch (error: any) {
        return handleMongoQueryError(res, error);
    }
};


const getCommentById = async (req: Request, res: Response): Promise<any> => {
    const commentId: string = req.params.id;

    try {
        const comment: IComment | null = await Comment.findById(commentId) as IComment | null;
        if (!comment) {
            return res.status(404).send({error: "Comment not found"});
        }
        return res.status(200).json(comment);
    } catch (error: any) {
        return handleMongoQueryError(res, error);
    }
};


const getCommentsByPost = async (req: Request, res: Response): Promise<any> => {
    const post_id: string = req.params.post_id;
    try {
        const comments: IComment[] = await Comment.find({ postId: post_id }) as IComment[];
        if (comments.length === 0) {
            return res.status(404).json({message: "No comments found for this post."});
        }
        return res.status(200).json(comments);
    } catch (error: any) {
        return handleMongoQueryError(res, error);
    }
};


const updateComment = async (req: Request, res: Response): Promise<any> => {
    const comment_id: string = req.params.id;
    const {content, sender}: { content: string; sender: string } = req.body;

    try {
        if (!content || !sender) {
            return res.status(400).json({error: "Content and sender are required."});
        }

        const updatedComment: IComment | null = await Comment.findByIdAndUpdate(
            comment_id,
            {content, sender},
            {new: true, runValidators: true}
        ) as IComment | null;

        if (!updatedComment) {
            return res.status(404).json({error: "Comment not found."});
        }

        return res.status(200).json(updatedComment);
    } catch (err: any) {
        console.warn("Error updating comment:", err);
        return handleMongoQueryError(res, err);
    }
};

const deleteComment = async (req: Request, res: Response): Promise<any> => {
    const commentId: string = req.params.id;

    try {
        const deletedComment: IComment | null = await Comment.findByIdAndDelete(commentId) as IComment | null;
        if (!deletedComment) {
            return res.status(404).json({error: "Comment not found"});
        }
        return res.status(200).json({message: "Comment deleted successfully"});
    } catch (error: any) {
        return handleMongoQueryError(res, error);
    }
};

export {
    createComment,
    getCommentsBySender,
    getCommentById,
    getCommentsByPost,
    updateComment,
    deleteComment,
};