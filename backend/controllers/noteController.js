const {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../services/noteService');
const logger = require('../config/logger');

// Create new note controller with real-time socket emit
const create = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await createNote({ title, content, userId: req.userId });
    logger.info({ userId: req.userId, noteId: note._id }, 'Note created');

    // Broadcast live event to connected clients
    if (req.io) {
      req.io.emit('note:created', note);
    }

    res.status(201).json({ message: 'Note created successfully', note });
  } catch (error) {
    next(error);
  }
};

// Retrieve user notes list controller
const getAll = async (req, res, next) => {
  try {
    const notes = await getUserNotes(req.userId);
    res.status(200).json({ notes });
  } catch (error) {
    next(error);
  }
};

// Retrieve single note details controller
const getOne = async (req, res, next) => {
  try {
    const note = await getNoteById(req.params.id, req.userId);
    res.status(200).json({ note });
  } catch (error) {
    next(error);
  }
};

// Update existing note controller with real-time socket emit
const update = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await updateNote(req.params.id, req.userId, { title, content });
    logger.info({ userId: req.userId, noteId: note._id }, 'Note updated');

    // Broadcast live update event to connected clients
    if (req.io) {
      req.io.emit('note:updated', note);
    }

    res.status(200).json({ message: 'Note updated successfully', note });
  } catch (error) {
    next(error);
  }
};

// Delete note controller with real-time socket emit
const remove = async (req, res, next) => {
  try {
    await deleteNote(req.params.id, req.userId);
    logger.info({ userId: req.userId, noteId: req.params.id }, 'Note deleted');

    // Broadcast live delete event to connected clients
    if (req.io) {
      req.io.emit('note:deleted', req.params.id);
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getOne, update, remove };