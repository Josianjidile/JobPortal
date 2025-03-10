import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Explicitly use Clerk's string-based ID
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
     resume: {
        type: String,
      },
    image: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
