import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    blog: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: {
      type: String,
      required: true,
    },
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users"
        },
      }
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users"
        },
        title: {
          type: String,
        },
        comment: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true, // Enable the timestamps option
  }
);

blogSchema.methods.addCommentToDB = async function(userId, title, comment){
  try {
      this.comments = this.comments.concat({userId, title, comment});
      await this.save();
      return this.comments;
  } catch (error) {
      console.log(error)
  }
}

const BlogModal = mongoose.model("Blogs", blogSchema);

export default BlogModal;
