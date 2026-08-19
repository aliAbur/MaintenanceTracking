'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface CustomConfirmProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function CustomConfirm({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false }: CustomConfirmProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div 
      className="z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    >
      <div 
        className="bg-surface border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ width: '384px', maxWidth: '90vw', margin: '0 16px' }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? 'bg-error-container text-error' : 'bg-primary-container text-primary'}`}>
              <span className="material-symbols-outlined">{isDestructive ? 'warning' : 'info'}</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">{title}</h3>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {message}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-4 flex justify-end gap-3 border-t border-outline-variant/30">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-sm font-semibold rounded-full bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors shadow-sm ${
              isDestructive 
                ? 'bg-error text-on-error hover:bg-error/90' 
                : 'bg-primary text-on-primary hover:bg-primary/90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
