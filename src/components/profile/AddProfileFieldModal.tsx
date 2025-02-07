import { FC, useState } from 'react';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { profileFields, ProfileField } from '@/config/profileFields';

interface AddProfileFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (field: ProfileField) => void;
  existingFields: string[]; // 已经添加的字段ID列表
}

export const AddProfileFieldModal: FC<AddProfileFieldModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  existingFields
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');

  const handleSelectField = (field: ProfileField) => {
    onSelect(field);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add profile fields">
      <div className="h-[600px] flex">
        {/* Left Sidebar - Categories */}
        <div className="w-48 border-r border-gray-200 dark:border-gray-700 pt-4">
          {profileFields.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-4 py-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 focus:outline-none"
                placeholder="Search fields"
              />
            </div>
          </div>

          {/* Fields Grid with Scroll */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-4">
              {profileFields
                .find(c => c.id === selectedCategory)
                ?.fields.filter(field => !existingFields.includes(field.id))
                .filter(field => 
                  field.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(field => (
                  <button
                    key={field.id}
                    onClick={() => handleSelectField(field)}
                    className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-center"
                  >
                    <Icon name={field.icon} className="w-8 h-8 mx-auto mb-2" />
                    <span className="block text-sm">{field.name}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 