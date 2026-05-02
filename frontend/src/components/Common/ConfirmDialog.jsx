import React from 'react';
import { motion } from 'framer-motion';

export default function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'info',
}) {
  const colorClasses = {
    danger: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-cyan-400',
    success: 'text-emerald-400',
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className={`text-lg font-bold mb-2 ${colorClasses[type]}`}>
          {title}
        </h2>
        <p className="text-gray-300 text-sm mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
