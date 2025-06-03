import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: { type: String, required: true },
    bio: {
      type: String,
      maxlength: [200, "Bio should not be more than 200 characters"],
    },
    profilePhoto: {
      type: String,
      default: "https://pbs.twimg.com/media/EbNX_erVcAUlwIx.jpg:large",
    },
    isVerified: { type: Boolean, default: false },
    verifyOTP: { type: String },
    otpExpiry: { type: Date },
    social_links: {
      youtube: { type: String, default: "", match: [/^$|^https?:\/\/.+/] },
      instagram: { type: String, default: "", match: [/^$|^https?:\/\/.+/] },
      facebook: { type: String, default: "", match: [/^$|^https?:\/\/.+/] },
      X: { type: String, default: "", match: [/^$|^https?:\/\/.+/] },
      github: { type: String, default: "", match: [/^$|^https?:\/\/.+/] },
      website: { type: String, default: "", match: [/^$|^https?:\/\/.+/] },
    },
    account_info: {
      total_post: { type: Number, default: 0 },
      total_reads: { type: Number, default: 0 },
      google_auth: { type: Boolean, default: false },
      blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "blogs" }],
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.verifyOTP;
  delete user.otpExpiry;
  return user;
};

const User = mongoose.model("User", userSchema);
export default User;
