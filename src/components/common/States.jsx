// src/components/common/States.jsx
// Shared loading / empty / error blocks for list pages.
import React from 'react';
import { Link } from 'react-router-dom';

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
    </div>
  </div>
);

export const CardGridSkeleton = ({ count = 8, className }) => (
  <div className={className}>
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const EmptyState = ({ icon = '🔍', title, text, actionTo, actionLabel, onAction }) => (
  <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    {text && <p className="text-gray-500 dark:text-gray-400 mt-1">{text}</p>}
    {actionTo && (
      <Link to={actionTo} className="inline-block mt-5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm">
        {actionLabel}
      </Link>
    )}
    {onAction && (
      <button onClick={onAction} className="mt-5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm">
        {actionLabel}
      </button>
    )}
  </div>
);
