import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  children, 
  defaultValue, 
  value, 
  onValueChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || '');
  
  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            isOpen, 
            setIsOpen, 
            selectedValue, 
            onValueChange: handleValueChange 
          } as any);
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps & { 
  isOpen?: boolean; 
  setIsOpen?: (open: boolean) => void; 
  selectedValue?: string;
}> = ({ 
  children, 
  className = '', 
  isOpen, 
  setIsOpen 
}) => {
  return (
    <button
      type="button"
      className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
      onClick={() => setIsOpen?.(!isOpen)}
    >
      {children}
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </button>
  );
};

export const SelectContent: React.FC<SelectContentProps & { 
  isOpen?: boolean; 
  setIsOpen?: (open: boolean) => void; 
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}> = ({ 
  children, 
  className = '', 
  isOpen, 
  setIsOpen 
}) => {
  if (!isOpen) return null;

  return (
    <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps & { 
  isOpen?: boolean; 
  setIsOpen?: (open: boolean) => void; 
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}> = ({ 
  value, 
  children, 
  className = '', 
  selectedValue, 
  onValueChange 
}) => {
  const isSelected = selectedValue === value;
  
  return (
    <button
      type="button"
      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
        isSelected ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
      } ${className}`}
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </button>
  );
};

export const SelectValue: React.FC<SelectValueProps & { 
  selectedValue?: string;
}> = ({ 
  placeholder, 
  className = '', 
  selectedValue 
}) => {
  return (
    <span className={`${selectedValue ? 'text-gray-900' : 'text-gray-500'} ${className}`}>
      {selectedValue || placeholder}
    </span>
  );
};



