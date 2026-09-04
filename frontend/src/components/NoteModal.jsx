import { useState, useEffect, useRef } from 'react';

export const NoteModal = ({ isOpen, onClose, onSave, editingNote, loading }) => {
  const [error, setError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [fontColor, setFontColor] = useState('#8b5cf6'); // Default MS Word style color bar

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
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', '🤪', '🤓', '😎', '🤩', '🥳', '🧐', '🤐', '🤨', '🥱', '😴', '🤯', '😭', '😱',
    '✅', '✔️', '☑️', '❌', '❎', '⭕', '🟢', '🔴', '🟡', '🔵', '🟣', '📌', '📍', '⭐', '🌟', '✨', '💫', '🌠', '❇️', '✴️', '💥', '⚡', '🔥', '🏆', '🥇', '🥈', '🥉', '🎯', '🚀',
    '👍', '👎', '👏', '🙌', '👐', '🤝', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '🤙', '🖐️',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
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

  // Dedicated Font Color Applier (Changes both text AND list numbers/bullets color)
  const applyTextColor = (colorHex) => {
    const activeRef = lastActiveRef.current === 'title' ? titleEditorRef : contentEditorRef;
    if (!activeRef.current) return;
    activeRef.current.focus();

    // 1. Apply color to selected text
    document.execCommand('foreColor', false, colorHex);

    // 2. Apply color directly to parent <li> / <ol> / <ul> so numbers, bullets, and markers change color
    setTimeout(() => {
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        let node = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
        const liElem = node?.closest('li');
        if (liElem) {
          liElem.style.setProperty('color', colorHex, 'important');
        }
        const listElem = node?.closest('ol, ul');
        if (listElem) {
          listElem.style.setProperty('color', colorHex, 'important');
        }
      }
    }, 0);
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
      {/* Dead Center Modal Card - 100% Pixel Equal Top and Bottom Gap */}
      <div
        className="modal-card"
        style={{
          maxWidth: '780px',
          overflow: 'visible',
          margin: '0',
          position: 'relative',
          padding: '1.4rem 1.75rem',
        }}
      >
        <div className="modal-header" style={{ marginBottom: '0.85rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
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
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              marginBottom: '0.85rem',
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
              style={{ ...selectStyle, maxWidth: '130px' }}
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

            {/* MS Word Style Font Color Button (A with Color Bar) */}
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <input
                id="font-color-picker"
                type="color"
                value={fontColor}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setFontColor(newColor);
                  applyTextColor(newColor);
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 2,
                }}
                title="Font Color (Changes text & list numbers color)"
              />
              <button
                type="button"
                style={{
                  ...compactBtnStyle,
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.2rem 0.6rem',
                  gap: '1px',
                  pointerEvents: 'none',
                }}
                title="Font Color (MS Word Style)"
              >
                <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0f172a', lineHeight: '1' }}>A</span>
                <span style={{ width: '14px', height: '3px', background: fontColor, borderRadius: '2px' }} />
              </button>
            </div>

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
                  background: showEmojiPicker ? '#f3e8ff' : compactBtnStyle.background,
                  borderColor: showEmojiPicker ? '#8b5cf6' : compactBtnStyle.borderColor,
                  color: showEmojiPicker ? '#7c3aed' : compactBtnStyle.color,
                  whiteSpace: 'nowrap',
                }}
                title="Insert Emoji"
              >
                😀 Emoji
              </button>

              {/* Inline Attached Light Dropdown Panel */}
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
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
                    width: '270px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  {fullEmojiCollection.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '1.2rem',
                        padding: '0.35rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
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
          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label htmlFor="note-title" style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Title</label>
            <div
              ref={titleEditorRef}
              contentEditable
              suppressContentEditableWarning
              onFocus={() => { lastActiveRef.current = 'title'; }}
              style={{
                padding: '0.6rem 0.9rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#0f172a',
                fontSize: '1.05rem',
                fontWeight: '600',
                outline: 'none',
                minHeight: '40px',
              }}
            />
          </div>

          {/* Rich Content Input - ZERO SCROLLBARS */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="note-content" style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>Content</label>
            <div
              ref={contentEditorRef}
              contentEditable
              suppressContentEditableWarning
              onFocus={() => { lastActiveRef.current = 'content'; }}
              style={{
                minHeight: '140px',
                padding: '0.75rem 0.9rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#0f172a',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                outline: 'none',
                overflow: 'visible',
              }}
            />
          </div>

          <div className="modal-footer" style={{ marginTop: '0.85rem' }}>
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
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  color: '#0f172a',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer',
  outline: 'none',
  height: '28px',
};

const compactBtnStyle = {
  padding: '0.25rem 0.5rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  color: '#1e293b',
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
  background: '#cbd5e1',
  margin: '0 1px',
  alignSelf: 'center',
  flexShrink: 0,
};
