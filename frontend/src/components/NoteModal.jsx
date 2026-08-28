import { useState, useEffect, useRef } from 'react';

export const NoteModal = ({ isOpen, onClose, onSave, editingNote, loading }) => {
  const [error, setError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const titleEditorRef = useRef(null);
  const contentEditorRef = useRef(null);
  const emojiRef = useRef(null);
  const lastActiveRef = useRef('content'); // Tracks active focused field: 'title' or 'content'

  const fontFamilies = [
    'Inter',
    'Roboto',
    'Poppins',
    'Montserrat',
    'Open Sans',
    'Lato',
    'Oswald',
    'Raleway',
    'Nunito',
    'Playfair Display',
    'Merriweather',
    'Pacifico',
    'Caveat',
    'Dancing Script',
    'Fira Code',
    'Courier Prime',
    'Lobster',
    'Satisfy',
    'Ubuntu',
    'Georgia',
    'Impact',
    'Comic Sans MS',
  ];

  // Smiling & Laughing Emojis FIRST at the top
  const fullEmojiCollection = [
    // 1. Smiling, Laughing & Happy Faces FIRST
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', '🤪', '🤓', '😎', '🤩', '🥳', '🧐', '🤐', '🤨', '🥱', '😴', '🤯', '😭', '😱',
    // 2. Ticks, Stars & Badges
    '✅', '✔️', '☑️', '❌', '❎', '⭕', '🟢', '🔴', '🟡', '🔵', '🟣', '📌', '📍', '⭐', '🌟', '✨', '💫', '🌠', '❇️', '✴️', '💥', '⚡', '🔥', '🏆', '🥇', '🥈', '🥉', '🎯', '🚀',
    // 3. Hands & Gestures
    '👍', '👎', '👏', '🙌', '👐', '🤝', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '🤙', '🖐️',
    // 4. Hearts & Emotions
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
    // 5. Productivity & Work
    '📝', '💡', '🎓', '💻', '🖥️', '📁', '📂', '📑', '📅', '📊', '📈', '📉', '📜', '⚙️', '🔑', '🔒', '🎨', '🎉', '🎁', '🏷️', '💬', '📢', '⏰', '⌛', '☀️', '🌙', '🌈', '☘️', '☕', '🎂', '🍕', '🚗'
  ];

  useEffect(() => {
    if (editingNote) {
      if (titleEditorRef.current) {
        titleEditorRef.current.innerHTML = editingNote.title || '';
      }
      if (contentEditorRef.current) {
        contentEditorRef.current.innerHTML = editingNote.content || '';
      }
    } else {
      if (titleEditorRef.current) {
        titleEditorRef.current.innerHTML = '';
      }
      if (contentEditorRef.current) {
        contentEditorRef.current.innerHTML = '';
      }
    }
    setError('');
    setShowEmojiPicker(false);
  }, [editingNote, isOpen]);

  // Close emoji dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Execute Live WYSIWYG Rich Text Formatting on active field
  const formatText = (command, value = null) => {
    const activeRef = lastActiveRef.current === 'title' ? titleEditorRef : contentEditorRef;
    if (activeRef.current) {
      activeRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  // Dynamic List Style Switcher
  const applyListStyle = (styleType) => {
    const activeRef = lastActiveRef.current === 'title' ? titleEditorRef : contentEditorRef;
    if (!activeRef.current) return;
    activeRef.current.focus();

    if (styleType === 'unordered' || styleType === 'square') {
      document.execCommand('insertUnorderedList', false, null);
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
          const listElem = sel.anchorNode.nodeType === 1 
            ? sel.anchorNode.closest('ul') 
            : sel.anchorNode.parentElement?.closest('ul');
          if (listElem) {
            listElem.removeAttribute('type');
            listElem.style.setProperty('list-style-type', styleType === 'square' ? 'square' : 'disc', 'important');
          }
        }
      }, 0);
    } else {
      document.execCommand('insertOrderedList', false, null);
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
          const listElem = sel.anchorNode.nodeType === 1 
            ? sel.anchorNode.closest('ol') 
            : sel.anchorNode.parentElement?.closest('ol');
          if (listElem) {
            listElem.removeAttribute('type');

            let cssType = 'decimal';
            let htmlType = '1';

            if (styleType === 'upper-roman') {
              cssType = 'upper-roman';
              htmlType = 'I';
            } else if (styleType === 'lower-roman') {
              cssType = 'lower-roman';
              htmlType = 'i';
            } else if (styleType === 'upper-alpha') {
              cssType = 'upper-alpha';
              htmlType = 'A';
            } else if (styleType === 'lower-alpha') {
              cssType = 'lower-alpha';
              htmlType = 'a';
            } else if (styleType === 'decimal') {
              cssType = 'decimal';
              htmlType = '1';
            }

            listElem.setAttribute('type', htmlType);
            listElem.style.setProperty('list-style-type', cssType, 'important');
          }
        }
      }, 0);
    }
  };

  // Insert Emoji at active field cursor
  const insertEmoji = (emoji) => {
    formatText('insertText', emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const titleHtml = titleEditorRef.current ? titleEditorRef.current.innerHTML.trim() : '';
    const contentHtml = contentEditorRef.current ? contentEditorRef.current.innerHTML.trim() : '';

    if (!titleHtml || titleHtml === '<br>') {
      setError('Title is required');
      return;
    }

    onSave({ title: titleHtml, content: contentHtml });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '880px', overflow: 'visible', position: 'relative' }}>
        <div className="modal-header">
          <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        {error && <div className="auth-alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Clean Single Line Toolbar */}
          <div
            className="rich-wysiwyg-toolbar"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'nowrap',
              gap: '4px',
              padding: '0.45rem 0.65rem',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              marginBottom: '1rem',
              position: 'relative',
            }}
          >
            {/* 22 Font Families Dropdown */}
            <select
              onChange={(e) => formatText('fontName', e.target.value)}
              defaultValue="Inter"
              style={{ ...selectStyle, maxWidth: '110px' }}
              title="Font Family"
            >
              <option value="" disabled>Select Font</option>
              {fontFamilies.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>

            <span style={dividerStyle} />

            {/* List Styles Dropdown */}
            <select
              onChange={(e) => {
                if (e.target.value) applyListStyle(e.target.value);
              }}
              defaultValue=""
              style={{ ...selectStyle, maxWidth: '135px' }}
              title="List Styles"
            >
              <option value="" disabled>☰ Lists...</option>
              <option value="unordered">• Bullets</option>
              <option value="square">▪ Squares</option>
              <option value="decimal">1. Numbers (1, 2, 3)</option>
              <option value="upper-roman">I. Roman (I, II, III)</option>
              <option value="lower-roman">i. Roman (i, ii, iii)</option>
              <option value="upper-alpha">A. Alpha (A, B, C)</option>
              <option value="lower-alpha">a. Alpha (a, b, c)</option>
            </select>

            <span style={dividerStyle} />

            {/* Text Styles Group */}
            <button type="button" onClick={() => formatText('bold')} style={compactBtnStyle} title="Bold">
              <b>B</b>
            </button>
            <button type="button" onClick={() => formatText('italic')} style={compactBtnStyle} title="Italic">
              <i>I</i>
            </button>
            <button type="button" onClick={() => formatText('underline')} style={compactBtnStyle} title="Underline">
              <u>U</u>
            </button>
            <button type="button" onClick={() => formatText('strikeThrough')} style={compactBtnStyle} title="Strikethrough">
              <s>S</s>
            </button>

            <span style={dividerStyle} />

            {/* Headings Group */}
            <button type="button" onClick={() => formatText('formatBlock', '<h1>')} style={compactBtnStyle} title="Heading 1">
              H1
            </button>
            <button type="button" onClick={() => formatText('formatBlock', '<h2>')} style={compactBtnStyle} title="Heading 2">
              H2
            </button>

            <span style={dividerStyle} />

            {/* Alignment Group */}
            <button type="button" onClick={() => formatText('justifyLeft')} style={compactBtnStyle} title="Align Left">
              Left
            </button>
            <button type="button" onClick={() => formatText('justifyCenter')} style={compactBtnStyle} title="Align Center">
              Center
            </button>

            <span style={dividerStyle} />

            {/* Attached Inline Emoji Dropdown Button */}
            <div style={{ position: 'relative' }} ref={emojiRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                style={{
                  ...compactBtnStyle,
                  background: showEmojiPicker ? 'rgba(99, 102, 241, 0.3)' : compactBtnStyle.background,
                  borderColor: showEmojiPicker ? 'var(--primary-color)' : compactBtnStyle.borderColor,
                  whiteSpace: 'nowrap',
                }}
                title="Insert Emoji"
              >
                😀 Emoji
              </button>

              {/* Inline Attached Dropdown Panel (Opens directly under button) */}
              {showEmojiPicker && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    zIndex: 999,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '4px',
                    padding: '0.6rem',
                    background: '#1e293b',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.6)',
                    width: '270px',
                    maxHeight: '220px',
                    overflowY: 'auto',
                  }}
                >
                  {fullEmojiCollection.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '1.2rem',
                        padding: '0.35rem',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rich Title Input */}
          <div className="form-group">
            <label htmlFor="note-title">Title (Rich Text & Fonts)</label>
            <div
              ref={titleEditorRef}
              contentEditable
              suppressContentEditableWarning
              onFocus={() => { lastActiveRef.current = 'title'; }}
              style={{
                padding: '0.65rem 1rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontSize: '1.1rem',
                fontWeight: '600',
                outline: 'none',
                minHeight: '42px',
              }}
            />
          </div>

          {/* Rich Content Input */}
          <div className="form-group">
            <label htmlFor="note-content">Content (Rich Text & Fonts)</label>
            <div
              ref={contentEditorRef}
              contentEditable
              suppressContentEditableWarning
              onFocus={() => { lastActiveRef.current = 'content'; }}
              style={{
                minHeight: '160px',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '0.85rem 1rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                outline: 'none',
              }}
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

const selectStyle = {
  padding: '0.25rem 0.45rem',
  borderRadius: '6px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: '#1e293b',
  color: '#fff',
  fontSize: '0.8rem',
  cursor: 'pointer',
  outline: 'none',
  height: '28px',
};

const compactBtnStyle = {
  padding: '0.25rem 0.5rem',
  borderRadius: '6px',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  fontSize: '0.8rem',
  cursor: 'pointer',
  height: '28px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
  flexShrink: 0,
};

const dividerStyle = {
  width: '1px',
  height: '18px',
  background: 'rgba(255, 255, 255, 0.12)',
  margin: '0 1px',
  alignSelf: 'center',
  flexShrink: 0,
};
