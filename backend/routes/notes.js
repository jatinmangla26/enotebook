var express = require("express");
var app = express();
var router = express.Router();
const Notes = require("../models/Notes");
const fetchUser = require("../middleware/fetchUser");
//Fetch All Notes
router.get("/fetchallnotes", fetchUser, async function (req, res) {
  userId = req.id;
  const notes = await Notes.find({ user: userId });
  res.json(notes);
});

// Add a Note
router.post("/addnote", fetchUser, async (req, res) => {
  userId = req.id;
  note = await Notes.create({
    user: req.id,
    title: req.body.title,
    description: req.body.description,
    tag: req.body.tag,
  });
  res.json(note);
});
// Update a note
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  const newNote = {};
  if (title) newNote.title = title;
  if (description) newNote.description = description;
  if (tag) newNote.tag = tag;

  let note = await Notes.findById(req.params.id);
  console.log(note);
  if (!note) return res.status(404).send("Note Does Not Exist");
  if (note.user.toString() !== req.id)
    return res.status(401).send("Cannot Not Edit");
  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json(note);
});

//Deleting a Note
router.put("/deletenote/:id",fetchUser, async (req,res) => {
  let note = await Notes.findById(req.params.id);
  console.log(note);
  if (!note) return res.status(404).send("Note Does Not Exist");
  if (note.user.toString() !== req.id)
    return res.status(401).send("Cannot Not Delete");
  note=await Notes.findByIdAndDelete(req.params.id)
  res.send("Deleted Successfully");''
});
module.exports = router;
