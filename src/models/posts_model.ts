import mongoose, {Schema, Types} from "mongoose";

export interface IPost {
    _id: Types.ObjectId,
    content: string;
    sender: string;
    title: string;
}

// Define the schema for the Post
const postSchema = new Schema<IPost>({
    title: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
});

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
