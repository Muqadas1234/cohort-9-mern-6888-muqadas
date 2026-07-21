const Note = require('../models/Note');

const createNote = async ({ title, content, userId }) => {
  const note = await Note.create({ title, content, user: userId });
  return note;
};

const getUserNotes = async (userId) => {
  const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
  return notes;
};

const getNoteById = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    const error = new Error('Note not found');
    error.statusCode = 404;
    throw error;
  }
  return note;
};

const updateNote = async (noteId, userId, { title, content }) => {
  const note = await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    { title, content },
    { new: true, runValidators: true }
  );
  if (!note) {
    const error = new Error('Note not found');
    error.statusCode = 404;
    throw error;
  }
  return note;
};

const deleteNote = async (noteId, userId) => {
  const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
  if (!note) {
    const error = new Error('Note not found');
    error.statusCode = 404;
    throw error;
  }
  return note;
};

module.exports = { createNote, getUserNotes, getNoteById, updateNote, deleteNote };