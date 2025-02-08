import { FC, useState } from 'react';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { ProfileField, profileFields } from '@/config/profileFields';

interface AddProfileFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (fields: ProfileField[]) => void;
  existingFields: string[];
}

export const AddProfileFieldModal: FC<AddProfileFieldModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  existingFields
}) => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFields, setSelectedFields] = useState<ProfileField[]>([]);

  const handleSelectField = (field: ProfileField) => {
    setSelectedFields(prev => {
      const isSelected = prev.some(f => f.id === field.id);
      if (isSelected) {
        return prev.filter(f => f.id !== field.id);
      } else {
        return [...prev, field];
      }
    });
  };

  const handleAdd = () => {
    if (selectedFields.length > 0) {
      onSelect(selectedFields);
      setSelectedFields([]);
      onClose();
    }
  };

  const filteredFields = profileFields
    .find(category => category.id === selectedCategory)
    ?.fields.filter(field => {
      const matchesSearch = searchTerm === '' || 
        field.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && !existingFields.includes(field.id);
    }) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add profile fields">
      <div className="h-[600px] flex">
        {/* Left Sidebar - Categories */}
        <div className="w-48 border-r border-base-200 pt-4">
          {profileFields.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-base-200'
              }`}
            >
              <Icon 
                name={category.id === 'general' ? 'user' : 
                      category.id === 'social' ? 'twitter' : 
                      'ethereum'} 
                className="w-4 h-4" 
              />
              {category.name}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-base-200">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-base-200/50 focus:outline-none"
                placeholder="Search fields"
              />
            </div>
          </div>

          {/* Fields Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredFields.map(field => {
                const isSelected = selectedFields.some(f => f.id === field.id);
                return (
                  <button
                    key={field.id}
                    onClick={() => handleSelectField(field)}
                    className={`flex items-center p-4 rounded-xl border-2 ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-base-200 hover:border-base-300'
                    }`}
                  >
                    <Icon name={field.icon} className="w-6 h-6 mr-3" />
                    <span>{field.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-4 border-t border-base-200">
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="btn btn-ghost"
              >
                <Icon name="chevronLeft" className="w-4 h-4 mr-2" />
                Back
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/60">
                  {selectedFields.length} selected
                </span>
                <button
                  onClick={handleAdd}
                  disabled={selectedFields.length === 0}
                  className="btn btn-primary"
                >
                  <Icon name="plus" className="w-4 h-4 mr-2" />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 