import mongoose, { Schema, Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  postID: Types.ObjectId;
  content: string;
  sender: string;
}

const commentSchema = new Schema<IComment>({
  postID: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;