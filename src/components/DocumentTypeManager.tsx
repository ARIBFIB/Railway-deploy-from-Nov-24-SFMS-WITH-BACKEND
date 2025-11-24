import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, X, CheckCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
// Removed unused Input import
import { documentTypesApi, type DocumentType } from '../utils/api';

interface DocumentTypeManagerProps {
  items: string[];
  onItemsChange: (newItems: string[]) => void;
  title: string;
  placeholder: string;
  buttonText: string;
  documentTypes: DocumentType[];
  onEdit?: (oldName: string, newName: string) => Promise<void>;
  onDelete?: (typeName: string) => Promise<void>;
  foundationId?: string;
}

export const DocumentTypeManager: React.FC<DocumentTypeManagerProps> = ({
  items: _items, // Renamed to indicate it's unused
  onItemsChange,
  title,
  placeholder,
  buttonText,
  documentTypes,
  onEdit,
  onDelete,
  foundationId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [editingItems, setEditingItems] = useState<DocumentType[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Use documentTypes from props directly
      setEditingItems([...documentTypes]);
      setError(null);
    }
  }, [isOpen, documentTypes]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleAdd = async () => {
    if (!newItem.trim()) return;

    const trimmedItem = newItem.trim();
    if (editingItems.some(item => item.name === trimmedItem)) {
      setError('This document type already exists');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Creating document type:', { name: trimmedItem, foundationId });
      
      // Add to backend
      const newDocumentType = await documentTypesApi.createDocumentType(trimmedItem, foundationId);
      
      // Update local state
      const newItems = [...editingItems, newDocumentType];
      setEditingItems(newItems);
      
      // Call onItemsChange to refresh parent component
      if (onItemsChange) {
        onItemsChange([]); // Trigger refresh
      }
      
      setNewItem('');
    } catch (err: any) {
      console.error('Error creating document type:', err);
      setError(err.message || 'Failed to add document type');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(editingItems[index].name);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !editingValue.trim()) return;

    const trimmedValue = editingValue.trim();
    const oldItem = editingItems[editingIndex];

    if (trimmedValue === oldItem.name) {
      setEditingIndex(null);
      setEditingValue('');
      return;
    }

    if (editingItems.some((item, idx) => idx !== editingIndex && item.name === trimmedValue)) {
      setError('This document type already exists');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (onEdit) {
        await onEdit(oldItem.name, trimmedValue);
      }
      
      // Update local state
      const newItems = [...editingItems];
      newItems[editingIndex] = { ...oldItem, name: trimmedValue };
      setEditingItems(newItems);
      
      // Call onItemsChange to refresh parent component
      if (onItemsChange) {
        onItemsChange([]); // Trigger refresh
      }
      
      setEditingIndex(null);
      setEditingValue('');
    } catch (err: any) {
      setError(err.message || 'Failed to update document type');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const itemToDelete = editingItems[index];
    
    setLoading(true);
    setError(null);

    try {
      if (onDelete) {
        await onDelete(itemToDelete.name);
      }
      
      // Update local state
      const newItems = editingItems.filter((_, i) => i !== index);
      setEditingItems(newItems);
      
      // Call onItemsChange to refresh parent component
      if (onItemsChange) {
        onItemsChange([]); // Trigger refresh
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete document type');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setEditingIndex(null);
    setNewItem('');
    setEditingValue('');
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingIndex !== null) {
        handleSaveEdit();
      } else {
        handleAdd();
      }
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-gray-500 hover:text-gray-700"
      >
        {buttonText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title={`Manage ${title}`}
        size="md"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Add new item */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={handleAdd}
              disabled={!newItem.trim() || loading}
              loading={loading}
            >
              Add
            </Button>
          </div>

          {/* Items list */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {editingItems.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No document types found. Add some to get started.
              </div>
            ) : (
              editingItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        onKeyPress={handleKeyPress}
                        autoFocus
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={CheckCircle}
                        onClick={handleSaveEdit}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={X}
                        onClick={() => {
                          setEditingIndex(null);
                          setEditingValue('');
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-800">{item.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => handleEdit(index)}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(index)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={handleCancel} disabled={loading}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
