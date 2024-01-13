const express = require("express");
const userCheck = require("./middlewares");
const { User, Notes } = require("./db");
const config = require("./config");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "connection complete",
  });
});

app.post("/register", async (req, res) => {
  try {
    console.log("this", process.env.JWT_PASS);
    const { userName, password } = req.body;
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists, login instead!",
      });
    } else {
      const token = jwt.sign({ userName }, "arjun@notesapp", {
        expiresIn: "1h",
      });
      await User.create({ userName, password });

      res.status(200).json({
        msg: "User registered successfully",
        token: token,
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
});

app.get("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({
      userName,
      password,
    });
    if (user) {
      const token = jwt.sign(
        { userName: newUser.userName },
        config.content.JWT_PASS,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        msg: "login success!",
        token,
      });
    } else {
      res.status(403).json({
        msg: "Invalid credentials",
      });
    }
  } catch {}
});

app.get("/user-note", userCheck, async (req, res) => {
  try {
    const userNote = await Notes.find({
      createdBy: req.headers.id,
    });
    if (userNote) {
      res.status(200).json({
        userNote,
      });
    } else {
      res.status(200).json({
        msg: "no notes for user",
      });
    }
  } catch {
    res.status(500).send("Error is fetching users note");
  }
});

app.post("/mark-completed", userCheck, async (req, res) => {
  try {
    const { title } = req.body;
    const note = await Notes.findOne({
      title,
      createdBy: req.headers.id,
    });
    if (!note) {
      res.status(400).send("note does not exist");
    } else {
      const updatedNote = await Notes.updateOne(
        { title: note.title },
        { $set: { completed: true } }
      );

      if (updatedNote) {
        res.status(200).send("Note status updated successfully");
      } else {
        res.status(500).send("Failed to update note status");
      }
    }
  } catch {
    res.status(500).send("internal server error");
  }
});

app.post("/create-note", userCheck, async (req, res) => {
  try {
    const { title, description } = req.body;
    const existingNote = await Notes.findOne({
      title,
    });
    if (existingNote)
      return res.status(500).json({
        msg: "Note already exists!",
      });
    else {
      const newNote = await Notes.create({
        title,
        description,
        completed: false,
        createdBy: req.headers.id,
      });
      res.status(200).json({
        msg: "Note created Successfully!",
        newNote,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
    });
  }
});

app.get("/all-users", userCheck, async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    users,
  });
});

app.get("/notes", userCheck, async (req, res) => {
  const all = await Notes.find();
  res.status(200).json({
    all,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
