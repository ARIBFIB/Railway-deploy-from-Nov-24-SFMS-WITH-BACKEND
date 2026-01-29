import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface XSDropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  infoText?: string;
  className?: string;
}

const XSDropdown: React.FC<XSDropdownProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  disabled = false,
  infoText,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(option => option.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      // Focus first option
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault();
      // Focus last option
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      <div className="flex items-center mb-1">
        <label className="text-xs font-medium text-gray-700">
          {label}
        </label>
        {infoText && (
          <div 
            className="ml-1 w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] cursor-pointer"
            title={infoText}
          >
            ?
          </div>
        )}
      </div>

      {/* Dropdown Field */}
      <div
        className={`
          relative h-9 min-w-[120px] rounded border cursor-pointer
          flex items-center px-3 pr-9
          transition-all duration-200
          ${disabled 
            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
            : isOpen
              ? 'border-green-700 bg-white shadow-[0_0_0_2px_rgba(46,125,50,0.15)]'
              : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        <span className="text-sm text-gray-800 truncate">
          {selectedOption?.label || value}
        </span>
        
        {/* Chevron Icon */}
        <svg 
          className={`
            absolute right-3 w-4 h-4 text-gray-500 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
            ${disabled ? 'text-gray-400' : ''}
          `}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-300 rounded shadow-[0_4px_12px_rgba(0,0,0,0.12)] max-h-44 overflow-auto"
          role="listbox"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`
                h-8 px-3 flex items-center text-sm cursor-pointer transition-colors
                ${option.value === value
                  ? 'bg-green-100 text-green-800 font-medium border-l-2 border-green-700'
                  : 'text-gray-700 hover:bg-green-50'
                }
              `}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSelect(option.value);
                }
              }}
              role="option"
              aria-selected={option.value === value}
              tabIndex={0}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default XSDropdown;