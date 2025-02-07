import { FC, useState } from 'react';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { AddProfileFieldModal } from './AddProfileFieldModal';
import { ProfileField, profileFields } from '@/config/profileFields';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

interface ProfileValue {
  fieldId: string;
  value: string;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({ isOpen, onClose, address }) => {
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [profileValues, setProfileValues] = useState<ProfileValue[]>([
    { fieldId: 'eth', value: address }
  ]);

  const handleAddField = (field: ProfileField) => {
    setProfileValues(prev => [...prev, { fieldId: field.id, value: '' }]);
  };

  const handleRemoveField = (fieldId: string) => {
    setProfileValues(prev => prev.filter(v => v.fieldId !== fieldId));
  };

  const handleValueChange = (fieldId: string, value: string) => {
    setProfileValues(prev => 
      prev.map(v => v.fieldId === fieldId ? { ...v, value } : v)
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit your profile">
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2">
                <Icon name="camera" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dynamic Fields */}
          {profileValues.map(({ fieldId, value }) => {
            const field = profileFields.flatMap(c => c.fields).find(f => f.id === fieldId);
            if (!field) return null;

            return (
              <div key={fieldId} className="space-y-2">
                <label className="text-gray-500">{field.name}</label>
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-xl">
                  <Icon name={field.icon} className="w-6 h-6" />
                  <input
                    type={field.type}
                    value={value}
                    onChange={(e) => handleValueChange(fieldId, e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder={field.placeholder}
                  />
                  <button 
                    onClick={() => handleRemoveField(fieldId)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Icon name="x" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add More Button */}
          <button
            onClick={() => setIsAddFieldModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 flex items-center justify-center space-x-2"
          >
            <Icon name="plus" className="w-5 h-5" />
            <span>Add more to profile</span>
          </button>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      <AddProfileFieldModal
        isOpen={isAddFieldModalOpen}
        onClose={() => setIsAddFieldModalOpen(false)}
        onSelect={handleAddField}
        existingFields={profileValues.map(v => v.fieldId)}
      />
    </>
  );
}; 