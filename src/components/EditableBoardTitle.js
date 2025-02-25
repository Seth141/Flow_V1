import React, { useState, useRef, useEffect } from 'react';

function EditableBoardTitle({ title, onTitleChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (editedTitle.trim() !== '') {
      onTitleChange(editedTitle.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={editedTitle}
      onChange={(e) => setEditedTitle(e.target.value)}
      onBlur={handleSubmit}
      onKeyDown={handleKeyDown}
      className="board-title-input"
    />
  ) : (
    <h1 className="board-title" onClick={() => setIsEditing(true)}>
      {title}
    </h1>
  );
}

export default EditableBoardTitle;
