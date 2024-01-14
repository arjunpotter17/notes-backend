const mongoose = require("mongoose");
console.log();
require("dotenv").config({ path: require("find-config")(".env") });
mongoose.connect(process.env.MONGO_URI);

const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

const NotesSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", UserSchema);
const Notes = mongoose.model("Notes", NotesSchema);

module.exports = {
  User,
  Notes,
};
