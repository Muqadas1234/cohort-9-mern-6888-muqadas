import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { NoteCard } from '../components/NoteCard';
import { NoteModal } from '../components/NoteModal';
import { DeleteModal } from '../components/DeleteModal';
import { fetchNotes, createNoteApi, updateNoteApi, deleteNoteApi } from '../services/api';

export const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [savingLoading, setSavingLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Notes on Component Mount
  const loadNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchNotes();
      setNotes(data.notes || []);
    } catch (err) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Filter Notes based on Search Query
  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;
    const query = search.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        (note.content && note.content.toLowerCase().includes(query))
    );
  }, [notes, search]);

  // Create or Update Note Handler
  const handleSaveNote = async ({ title, content }) => {
    try {
      setSavingLoading(true);
      if (editingNote) {
        const res = await updateNoteApi(editingNote._id, title, content);
        setNotes((prev) =>
          prev.map((n) => (n._id === editingNote._id ? res.note : n))
        );
      } else {
        const res = await createNoteApi(title, content);
        setNotes((prev) => [res.note, ...prev]);
      }
      setIsNoteModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      alert(err.message || 'Failed to save note');
    } finally {
      setSavingLoading(false);
    }
  };

  // Delete Note Handler
  const handleConfirmDelete = async () => {
    if (!deletingNote) return;
    try {
      setDeleteLoading(true);
      await deleteNoteApi(deletingNote._id);
      setNotes((prev) => prev.filter((n) => n._id !== deletingNote._id));
      setIsDeleteModalOpen(false);
      setDeletingNote(null);
    } catch (err) {
      alert(err.message || 'Failed to delete note');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar
        search={search}
        setSearch={setSearch}
        onOpenCreateModal={() => {
          setEditingNote(null);
          setIsNoteModalOpen(true);
        }}
      />

      <main className="dashboard-content">
        {error && <div className="auth-alert error main-error">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your notes...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={(n) => {
                  setEditingNote(n);
                  setIsNoteModalOpen(true);
                }}
                onDelete={(n) => {
                  setDeletingNote(n);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">{search ? '🔍' : '📝'}</span>
            <h3>{search ? 'No matching notes found' : 'No notes created yet'}</h3>
            <p>
              {search
                ? 'Try adjusting your search terms.'
                : 'Click "+ New Note" in the top bar to create your first note!'}
            </p>
          </div>
        )}
      </main>

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        editingNote={editingNote}
        loading={savingLoading}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingNote(null);
        }}
        onConfirm={handleConfirmDelete}
        noteTitle={deletingNote?.title || ''}
        loading={deleteLoading}
      />
    </div>
  );
};
