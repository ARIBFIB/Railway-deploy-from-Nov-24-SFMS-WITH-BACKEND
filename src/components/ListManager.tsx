import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Settings } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

interface ListManagerProps {
  items: string[];
  onItemsChange: (items: string[]) => void;
  title: string;
  placeholder: string;
  buttonText?: string;
}

export const ListManager: React.FC<ListManagerProps> = ({
  items,
  onItemsChange,
  title,
  placeholder,
  buttonText = "Manage List"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItems, setEditingItems] = useState<string[]>(items);
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAdd = () => {
    if (newItem.trim() && !editingItems.includes(newItem.trim())) {
      setEditingItems([...editingItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(editingItems[index]);
  };

  const handleSaveEdit = () => {
    if (editingValue.trim() && editingIndex !== null) {
      const updatedItems = [...editingItems];
      updatedItems[editingIndex] = editingValue.trim();
      setEditingItems(updatedItems);
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleDelete = (index: number) => {
    const updatedItems = editingItems.filter((_, i) => i !== index);
    setEditingItems(updatedItems);
  };

  const handleSave = () => {
    onItemsChange(editingItems);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditingItems(items);
    setNewItem('');
    setEditingIndex(null);
    setEditingValue('');
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon={Settings}
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
          {/* Add new item */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={handleAdd}
              disabled={!newItem.trim() || editingItems.includes(newItem.trim())}
            >
              Add
            </Button>
          </div>

          {/* Items list */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {editingItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={Save}
                      onClick={handleSaveEdit}
                      disabled={!editingValue.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={X}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-700">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

