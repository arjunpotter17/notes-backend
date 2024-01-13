const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://arjunpotter17:n5PZO9uYFjbSi9g3@cohort-cluster.npcszzm.mongodb.net/"
);

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
