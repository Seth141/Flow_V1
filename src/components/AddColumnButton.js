import React, { useState } from 'react';

function AddColumnButton({ onAddColumn }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddColumn(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="add-column-button">
      {isAdding ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter column title"
            autoFocus
          />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setIsAdding(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setIsAdding(true)}>+ Add Column</button>
      )}
    </div>
  );
}

export default AddColumnButton;
