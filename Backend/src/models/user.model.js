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
        required: function () {
            return !this.googleId;
        },
    },

    contact: {
        type: String,
    },

    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer",
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre("save", async function () {
    try {
        // Google users don't have passwords
        if (!this.password) {
            return;
        }

        if (!this.isModified("password")) {
            return;
        }

        this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function (password) {
    if (!this.password) return false;

    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;