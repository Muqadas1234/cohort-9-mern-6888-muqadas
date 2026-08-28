export const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3
          className="note-title"
          dangerouslySetInnerHTML={{ __html: note.title || 'Untitled Note' }}
        />
        <span className="note-date">{formatDate(note.createdAt)}</span>
      </div>

      <div
        className="note-content"
        dangerouslySetInnerHTML={{ __html: note.content || 'No content provided.' }}
      />

      <div className="note-card-actions">
        <button className="icon-btn edit" onClick={() => onEdit(note)} title="Edit Note">
          ✏️ Edit
        </button>
        <button className="icon-btn delete" onClick={() => onDelete(note)} title="Delete Note">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};
