import mongoose, {Schema, Types} from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    _id: Types.ObjectId,
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
        validate: {
            validator: function (v: string) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: (props: { value: string }) => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
        select: false
    },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const workFactor = 10;
        this.password = await bcrypt.hash(this.password, workFactor);
    }
    next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;