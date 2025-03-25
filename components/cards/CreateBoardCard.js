// src/components/cards/CreateBoardCard.js
'use client';

import { useState } from 'react';
import { board } from '@/actions/workspace';
import { useRouter } from 'next/navigation';
import { Card, CreateBoardTitle } from './Card';

export function CreateBoardCard({ workspaceId }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0079bf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const backgroundColors = [
    '#0079bf',
    '#b04632',
    '#89609e',
    '#cd5a91',
    '#4bbf6b',
    '#00aecc',
    '#000000',
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await board.createBoard({
        title,
        background: selectedColor,
        workspace_id: workspaceId,
      });
      setShowModal(false);
      router.refresh(); // refresh the page to show the new board
    } catch (error) {
      setError(error.message || 'Failed to create board');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* create board card */}
      <Card
        onClick={() => setShowModal(true)}
        className="bg-black/20 hover:bg-black/10 flex text-green flex-col items-center justify-center"
      >
        <CreateBoardTitle>Create new board</CreateBoardTitle>
      </Card>

      {/* modal dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-purple-300/50  rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Create board</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* board preview */}
              <div
                className="h-28 rounded-md p-3 transition-colors"
                style={{ backgroundColor: selectedColor }}
              >
                <input
                  type="text"
                  placeholder="Add board title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/30 border-none p-2 rounded text-white placeholder:text-white/70 font-medium"
                  required
                />
              </div>

              {/* bg color selector */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  Background
                </label>
                <div className="flex flex-wrap gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-8 rounded-md ${selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border hover:bg-black"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-black text-white hover:bg-black/80"
                  disabled={isSubmitting || !title.trim()}
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
