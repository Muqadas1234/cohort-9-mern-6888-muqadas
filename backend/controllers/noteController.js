const {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../services/noteService');

const create = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await createNote({ title, content, userId: req.userId });
    res.status(201).json({ message: 'Note created successfully', note });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const notes = await getUserNotes(req.userId);
    res.status(200).json({ notes });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const note = await getNoteById(req.params.id, req.userId);
    res.status(200).json({ note });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await updateNote(req.params.id, req.userId, { title, content });
    res.status(200).json({ message: 'Note updated successfully', note });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await deleteNote(req.params.id, req.userId);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getOne, update, remove };