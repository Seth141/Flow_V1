'use client';

import { useState, useTransition } from 'react';
import { card } from '@/actions/workspace';
import { useFormStatus } from 'react-dom';

// form component with form status
function TaskForm({ columnId, onCancel }) {
  const { pending } = useFormStatus();

  return (
    <form
      action={card.createCard}
      className="p-2 bg-white/10 backdrop-blur-sm rounded-md"
    >
      <input type="hidden" name="column_id" value={columnId} />
      <textarea
        name="title"
        placeholder="Enter task title..."
        className="w-full p-2 mb-2 rounded bg-white/20 text-white placeholder:text-white/70 resize-none min-h-[60px]"
        autoFocus
        disabled={pending}
        required
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm"
          disabled={pending}
        >
          {pending ? 'Adding...' : 'Add'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-white/70 hover:text-white text-sm px-2"
          disabled={pending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AddTaskButton({ columnId }) {
  const [isAdding, setIsAdding] = useState(false);

  if (isAdding) {
    return <TaskForm columnId={columnId} onCancel={() => setIsAdding(false)} />;
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full text-left px-2 py-1.5 text-white/70 hover:text-white text-sm flex items-center gap-1"
    >
      <span className="text-lg leading-none">+</span> Add a task
    </button>
  );
}
