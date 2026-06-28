import React from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title = 'Confirm Delete', message = 'Are you sure you want to delete this item?' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1324] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-850 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300">{message}</p>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-800 bg-[#0b0f19] py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-850"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-rose-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
