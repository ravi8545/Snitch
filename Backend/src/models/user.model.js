import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        required: true,
        default: "buyer",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


const userModel = mongoose.model("User", userSchema);

export default userModel;