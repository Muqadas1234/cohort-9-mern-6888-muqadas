import { useState, useEffect, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
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

  const fileInputRef = useRef(null);

  // Modal states
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [savingLoading, setSavingLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Load initial notes asynchronously on mount
    fetchNotes()
      .then((data) => {
        if (isMounted) {
          setNotes(data.notes || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load notes');
          setLoading(false);
        }
      });

    // Initialize Socket.IO real-time listener
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    // Real-time Note Created Event with duplicate prevention
    socket.on('note:created', (newNote) => {
      setNotes((prev) => {
        if (prev.some((n) => n._id === newNote._id)) {
          return prev;
        }
        return [newNote, ...prev];
      });
    });

    // Real-time Note Updated Event
    socket.on('note:updated', (updatedNote) => {
      setNotes((prev) =>
        prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
      );
    });

    // Real-time Note Deleted Event
    socket.on('note:deleted', (deletedId) => {
      setNotes((prev) => prev.filter((n) => n._id !== deletedId));
    });

    return () => {
      isMounted = false;
      socket.disconnect();
    };
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

  // Create or Update Note Handler with deduplication
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
        setNotes((prev) => {
          if (prev.some((n) => n._id === res.note._id)) {
            return prev;
          }
          return [res.note, ...prev];
        });
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

  // Export Notes to JSON file
  const handleExportJSON = () => {
    if (notes.length === 0) {
      alert('No notes available to export.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `notes-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Notes from JSON file
  const handleImportJSON = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedNotes = JSON.parse(text);

      if (!Array.isArray(importedNotes)) {
        throw new Error('Invalid JSON format. Expected an array of notes.');
      }

      setLoading(true);
      for (const item of importedNotes) {
        if (item.title) {
          await createNoteApi(item.title, item.content || '');
        }
      }
      const data = await fetchNotes();
      setNotes(data.notes || []);
      alert('Notes imported successfully!');
    } catch (err) {
      alert('Import failed: ' + err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Hidden file picker input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJSON}
        accept=".json"
        style={{ display: 'none' }}
      />

      <Navbar
        search={search}
        setSearch={setSearch}
        onOpenCreateModal={() => {
          setEditingNote(null);
          setIsNoteModalOpen(true);
        }}
        onExportJSON={handleExportJSON}
        onImportClick={() => fileInputRef.current?.click()}
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