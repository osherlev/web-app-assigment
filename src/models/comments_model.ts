import mongoose, {Schema, Types} from "mongoose";

export interface IComment {
    _id: Types.ObjectId,
    postId: Types.ObjectId;
    content: string;
    sender: string;
}

const commentSchema = new Schema<IComment>({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    content: {
        type: String,
    },
    sender: {
        type: String,
    },
});

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;