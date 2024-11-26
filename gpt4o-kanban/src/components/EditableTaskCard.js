import React, { useState, useRef, useEffect } from 'react';

function EditableTaskCard({ task, onTaskUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title || '');
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedUrgency, setEditedUrgency] = useState(task.urgency || 'medium');
  const [editedStoryPoints, setEditedStoryPoints] = useState(task.storyPoints || '3');
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedTitle(task.title || '');
    setEditedDescription(task.description || '');
    setEditedUrgency(task.urgency || 'medium');
    setEditedStoryPoints(task.storyPoints || '3');
  }, [task]);

  const handleSubmit = () => {
    const trimmedTitle = editedTitle?.trim() || '';
    const trimmedDescription = editedDescription?.trim() || '';
    
    if (trimmedTitle !== '') {
      onTaskUpdate({
        ...task,
        id: task.id?.toString() || Date.now().toString(),
        title: trimmedTitle,
        description: trimmedDescription,
        urgency: editedUrgency,
        storyPoints: editedStoryPoints
      });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title || '');
      setEditedDescription(task.description || '');
      setEditedUrgency(task.urgency || 'medium');
      setEditedStoryPoints(task.storyPoints || '3');
      setIsEditing(false);
    }
  };

  return (
    <div className="task-card" onClick={() => !isEditing && setIsEditing(true)}>
      {isEditing ? (
        <div className="task-card-edit">
          <input
            ref={titleInputRef}
            type="text"
            value={editedTitle || ''}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="task-title-input"
          />
          <textarea
            value={editedDescription || ''}
            onChange={(e) => setEditedDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="task-description-input"
            placeholder="Add a description..."
          />
          <div className="task-metadata">
            <select
              value={editedUrgency}
              onChange={(e) => setEditedUrgency(e.target.value)}
              className="urgency-select"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={editedStoryPoints}
              onChange={(e) => setEditedStoryPoints(e.target.value)}
              className="story-points-select"
            >
              {[1, 2, 3, 4, 5].map(point => (
                <option key={point} value={point}>{point}</option>
              ))}
            </select>
          </div>
          <div className="task-edit-buttons">
            <button onClick={handleSubmit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <div className="task-metadata">
            <span className={`urgency-badge ${task.urgency}`}>
              {task.urgency}
            </span>
            <span className="story-points-badge">
              {task.storyPoints} points
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default EditableTaskCard;
