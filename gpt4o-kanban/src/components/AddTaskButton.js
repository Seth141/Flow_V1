import React, { useState } from 'react';

function AddTaskButton({ column, onAddTask }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(column, title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="add-task-button">
      {isAdding ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            autoFocus
          />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
        </form>
      ) : (
        <button onClick={() => setIsAdding(true)}>+ Add Task</button>
      )}
    </div>
  );
}

export default AddTaskButton;
