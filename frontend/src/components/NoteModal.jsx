import { useState, useEffect, useRef } from 'react';

export const NoteModal = ({ isOpen, onClose, onSave, editingNote, loading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '');
      setContent(editingNote.content || '');
    } else {
      setTitle('');
      setContent('');
    }
    setError('');
  }, [editingNote, isOpen]);

  if (!isOpen) return null;

  // Insert Rich Text Formatting at selection cursor
  const applyFormat = (openTag, closeTag, defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToFormat = selectedText || defaultText;

    const formattedText = `${openTag}${textToFormat}${closeTag}`;
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    
    setContent(newContent);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + textToFormat.length);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    onSave({ title: title.trim(), content: content.trim() });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        {error && <div className="auth-alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="note-title">Title</label>
            <input
              id="note-title"
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label htmlFor="note-content" style={{ margin: 0 }}>Content</label>
              
              {/* Rich Text Formatting Toolbar */}
              <div className="rich-toolbar" style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => applyFormat('<b>', '</b>', 'Bold Text')}
                  style={{ fontWeight: 'bold', padding: '0.2rem 0.6rem', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('<i>', '</i>', 'Italic Text')}
                  style={{ fontStyle: 'italic', padding: '0.2rem 0.6rem', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('<u>', '</u>', 'Underlined Text')}
                  style={{ textDecoration: 'underline', padding: '0.2rem 0.6rem', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                  title="Underline"
                >
                  U
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('• ', '', 'List item')}
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                  title="Bullet List"
                >
                  • List
                </button>
              </div>
            </div>

            <textarea
              id="note-content"
              ref={textareaRef}
              rows="6"
              placeholder="Write your note content here... Use toolbar above for Bold, Italic & Lists"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Saving...' : editingNote ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
