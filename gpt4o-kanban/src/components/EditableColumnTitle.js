import React, { useState, useRef, useEffect } from 'react';

function EditableColumnTitle({ title, onTitleChange }) {
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
      className="column-title-input"
    />
  ) : (
    <h2 
      className="column-title"
      onClick={() => setIsEditing(true)}
    >
      {title}
    </h2>
  );
}

export default EditableColumnTitle;
