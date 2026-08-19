'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  icon?: string;
}

export default function CustomSelect({ options, value, onChange, disabled, className, placeholder, icon, name }: CustomSelectProps & { name?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full flex items-center justify-between outline-none ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="material-symbols-outlined text-[18px] text-secondary">{icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : (placeholder || 'Select...')}</span>
        </div>
        <span className="material-symbols-outlined text-[20px] text-outline ml-2">expand_more</span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full min-w-[150px] mt-1 bg-surface-container-highest border border-outline-variant rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-primary/10 transition-colors ${option.value === value ? 'bg-primary/5 text-primary font-bold' : 'text-on-surface'}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
