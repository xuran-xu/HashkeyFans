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
      console.log('Adding fields:', selectedFields);
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
      // 检查此字段是否已在已有字段列表中
      const alreadyExists = existingFields.includes(field.id);
      console.log(`Field ${field.id}:`, { 
        matchesSearch, 
        alreadyExists, 
        willShow: matchesSearch && !alreadyExists
      });
      return matchesSearch && !alreadyExists;
    }) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add profile fields">
      <div className="h-[600px] flex relative">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"></div>
        <div className="absolute inset-0 bg-hexagon-pattern opacity-5 -z-10"></div>
        
        {/* Left Sidebar - Categories */}
        <div className="w-48 border-r border-base-200/50 pt-4 bg-base-100/50 backdrop-blur-sm">
          {profileFields.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-4 py-3 flex items-center gap-2 transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'hover:bg-base-200/60 border-l-4 border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-full ${selectedCategory === category.id ? 'bg-primary/20' : 'bg-base-200/70'}`}>
                <Icon 
                  name={category.id === 'general' ? 'user' : 
                        category.id === 'social' ? 'twitter' : 
                        'ethereum'} 
                  className="w-4 h-4" 
                />
              </div>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-base-200/50 bg-base-100/30 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 p-1 rounded-full bg-base-200/50">
                <Icon name="search" className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-base-200/40 focus:outline-none focus:bg-base-200/60 focus:ring-1 focus:ring-primary/30 transition-all border border-white/5 placeholder:text-base-content/30"
                placeholder="Search fields"
              />
            </div>
          </div>

          {/* Fields Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-base-100/20 backdrop-blur-sm">
            {filteredFields.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-base-content/50">
                <Icon name="search" className="w-12 h-12 mb-4 text-base-content/30" />
                <p className="text-lg">No fields found</p>
                <p className="text-sm">Try another category or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredFields.map(field => {
                  const isSelected = selectedFields.some(f => f.id === field.id);
                  return (
                    <button
                      key={field.id}
                      onClick={() => handleSelectField(field)}
                      className={`flex items-center p-4 rounded-xl border-2 transition-all transform hover:scale-102 ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-md shadow-primary/10'
                          : 'border-base-200/70 hover:border-primary/30 bg-base-200/20 hover:bg-base-200/40'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${isSelected ? 'bg-primary/20' : 'bg-base-300/50'} mr-3`}>
                        <Icon name={field.icon} className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-base-content/70'}`} />
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-primary' : 'text-base-content/80'}`}>{field.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="p-4 border-t border-base-200/50 bg-base-100/40 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="btn btn-ghost border border-base-200/50 hover:bg-base-200/50 text-base-content/70"
              >
                <Icon name="chevronLeft" className="w-4 h-4 mr-2" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-base-content/60 bg-base-200/40 py-1 px-3 rounded-full">
                  {selectedFields.length} selected
                </span>
                <button
                  onClick={handleAdd}
                  disabled={selectedFields.length === 0}
                  className={`btn ${selectedFields.length > 0 ? 'btn-primary shadow-md shadow-primary/20' : 'btn-disabled opacity-50'}`}
                >
                  <Icon name="plus" className="w-4 h-4 mr-2" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 