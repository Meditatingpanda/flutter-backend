const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png",
    },
    coverPicture: {
      type: String,
      default:
        "https://store-images.s-microsoft.com/image/apps.63492.14530245757884134.ca02ac43-83ee-4fba-967d-3ffef82bbfd0.10daf27d-0a3a-403c-bdd4-ab6b077e9814?mode=scale&q=90&h=1080&w=1920",
    },
    following: {
      type: Array,
      // default: ["628e6c0f332574a3a385db3f"],
    },
    followers: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 100,
      default: "hello world",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
