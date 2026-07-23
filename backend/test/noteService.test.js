const { expect } = require('chai');
const sinon = require('sinon');
const Note = require('../models/Note');
const { createNote, getUserNotes, getNoteById, updateNote, deleteNote } = require('../services/noteService');

describe('noteService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('createNote', () => {
    it('should create a note for the given user', async () => {
      const fakeNote = {
        _id: 'note123',
        title: 'Test Note',
        content: 'Some content',
        user: 'user123',
      };
      sinon.stub(Note, 'create').resolves(fakeNote);

      const note = await createNote({
        title: 'Test Note',
        content: 'Some content',
        userId: 'user123',
      });

      expect(note.title).to.equal('Test Note');
      expect(note.user).to.equal('user123');
    });
  });

  describe('getUserNotes', () => {
    it('should return notes belonging to the user, sorted by newest first', async () => {
      const fakeNotes = [
        { _id: '1', title: 'Note 1', user: 'user123' },
        { _id: '2', title: 'Note 2', user: 'user123' },
      ];

      const sortStub = sinon.stub().resolves(fakeNotes);
      sinon.stub(Note, 'find').returns({ sort: sortStub });

      const notes = await getUserNotes('user123');

      expect(notes).to.have.lengthOf(2);
      expect(Note.find.calledWith({ user: 'user123' })).to.be.true;
    });
  });

  describe('getNoteById', () => {
    it('should return a note if found', async () => {
      const fakeNote = { _id: '64f1a2b3c4d5e6f7a8b9c0d1', title: 'Found Note', user: 'user123' };
      sinon.stub(Note, 'findOne').resolves(fakeNote);

      const note = await getNoteById('64f1a2b3c4d5e6f7a8b9c0d1', 'user123');
      expect(note.title).to.equal('Found Note');
    });

    it('should throw 404 if note is not found', async () => {
      sinon.stub(Note, 'findOne').resolves(null);

      try {
        await getNoteById('64f1a2b3c4d5e6f7a8b9c0d1', 'user123');
        throw new Error('Expected to throw');
      } catch (error) {
        expect(error.message).to.equal('Note not found');
        expect(error.statusCode).to.equal(404);
      }
    });

    it('should throw 400 if note ID is invalid', async () => {
      try {
        await getNoteById('invalid-id', 'user123');
        throw new Error('Expected to throw');
      } catch (error) {
        expect(error.message).to.equal('Invalid note ID');
        expect(error.statusCode).to.equal(400);
      }
    });
  });

  describe('updateNote', () => {
    it('should update and return the note', async () => {
      const updatedNote = { _id: '64f1a2b3c4d5e6f7a8b9c0d1', title: 'Updated', user: 'user123' };
      sinon.stub(Note, 'findOneAndUpdate').resolves(updatedNote);

      const note = await updateNote('64f1a2b3c4d5e6f7a8b9c0d1', 'user123', { title: 'Updated' });
      expect(note.title).to.equal('Updated');
    });

    it('should throw 404 if note not found on update', async () => {
      sinon.stub(Note, 'findOneAndUpdate').resolves(null);

      try {
        await updateNote('64f1a2b3c4d5e6f7a8b9c0d1', 'user123', { title: 'Test' });
        throw new Error('Expected to throw');
      } catch (error) {
        expect(error.message).to.equal('Note not found');
        expect(error.statusCode).to.equal(404);
      }
    });
  });

  describe('deleteNote', () => {
    it('should throw a 404 error if the note is not found', async () => {
      sinon.stub(Note, 'findOneAndDelete').resolves(null);

      try {
        await deleteNote('64f1a2b3c4d5e6f7a8b9c0d1', 'user123');
        throw new Error('Expected deleteNote to throw, but it did not');
      } catch (error) {
        expect(error.message).to.equal('Note not found');
        expect(error.statusCode).to.equal(404);
      }
    });

    it('should delete and return the note if found', async () => {
      const fakeNote = { _id: '64f1a2b3c4d5e6f7a8b9c0d1', title: 'To Delete', user: 'user123' };
      sinon.stub(Note, 'findOneAndDelete').resolves(fakeNote);

      const note = await deleteNote('64f1a2b3c4d5e6f7a8b9c0d1', 'user123');
      expect(note.title).to.equal('To Delete');
    });
  });
});