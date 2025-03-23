import React, { useState } from 'react';

// Component for adding a new reward
const AddRewardForm = ({ onAddReward, onCancel }) => {
  const [name, setName] = useState('');
  const [pointsCost, setPointsCost] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      return;
    }
    
    // Create new reward object
    const newReward = {
      id: `reward-${Date.now()}`,
      name: name.trim(),
      pointsCost: Number(pointsCost),
      claimedBy: null,
      claimedAt: null
    };
    
    onAddReward(newReward);
    resetForm();
  };
  
  const resetForm = () => {
    setName('');
    setPointsCost(5);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-3">Lägg till ny belöning</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Namn
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Massage"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="pointsCost" className="block text-sm font-medium text-gray-700 mb-1">
            Poängkostnad
          </label>
          <input
            type="number"
            id="pointsCost"
            value={pointsCost}
            onChange={(e) => setPointsCost(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Lägg till
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRewardForm; 