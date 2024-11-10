// models/Tweet.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// 1. Define an interface representing a document in MongoDB.
export interface ITweet extends Document {
  tweetUrl: string;
  personName: string;
  twitterHandle?: string;
  datePosted?: Date;
  context?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const TweetSchema: Schema = new Schema(
  {
    tweetUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^https:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+$/,
        "Invalid Twitter/X URL format. URL must be like https://twitter.com/user/status/123 or https://x.com/user/status/123",
      ],
    },
    personName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Person name cannot exceed 100 characters"],
    },
    twitterHandle: {
      type: String,
      trim: true,
    },
    datePosted: {
      type: Date,
      required: false,
      index: true,
    },
    context: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// 3. Create a Model.
const Tweet: Model<ITweet> =
  mongoose.models.Tweet || mongoose.model<ITweet>("Tweet", TweetSchema);

export default Tweet;
