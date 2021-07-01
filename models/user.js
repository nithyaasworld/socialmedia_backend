const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    i_follow: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    },
    my_followers: {
      type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    },
    refresh_token: {
      type: [String],
    },
  },
  { timestamps: true }
);

const UserModel = new mongoose.model("User", UserSchema);
module.exports = UserModel;