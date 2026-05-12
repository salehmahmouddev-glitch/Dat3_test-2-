'use client';

import { useState, useTransition } from 'react';
import { deleteTodo, toggleTodoComplete } from '@/app/actions/todoActions';
import EditTodoModal from './EditTodoModal';

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isPendingToggle, startToggleTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    setError(null);
    startToggleTransition(async () => {
      const result = await toggleTodoComplete(todo._id, !todo.completed);
      if (!result.success) {
        setError(result.error || 'Failed to update status');
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    setError(null);
    startDeleteTransition(async () => {
      const result = await deleteTodo(todo._id);
      if (!result.success) {
        setError(result.error || 'Failed to delete todo');
      }
    });
  };

  const formattedDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isLoading = isPendingToggle || isPendingDelete;

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-sm border transition-all duration-200 p-5 ${
          todo.completed ? 'border-green-200 opacity-75' : 'border-gray-200 hover:shadow-md'
        } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={isLoading}
            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {todo.completed && (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`font-semibold text-gray-800 break-words ${
                  todo.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {todo.title}
              </h3>

              {/* Status badge */}
              <span
                className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                  todo.completed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {todo.completed ? 'Done' : 'Pending'}
              </span>
            </div>

            <p
              className={`mt-1 text-sm break-words ${
                todo.completed ? 'text-gray-400 line-through' : 'text-gray-600'
              }`}
            >
              {todo.description}
            </p>

            <p className="mt-2 text-xs text-gray-400">{formattedDate}</p>

            {error && (
              <p className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">{error}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowEditModal(true)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>

          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors disabled:cursor-not-allowed ${
              todo.completed
                ? 'text-yellow-600 hover:bg-yellow-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isPendingToggle ? 'Updating...' : todo.completed ? 'Mark Pending' : 'Mark Done'}
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:cursor-not-allowed ml-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {isPendingDelete ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditTodoModal todo={todo} onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
}
