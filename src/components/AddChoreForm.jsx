import React, { useState } from 'react';
import { FREQUENCY, CATEGORY, generateId } from '../models/chores';

// Component for adding a new chore
const AddChoreForm = ({ onAddChore, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORY.DAILY);
  const [frequency, setFrequency] = useState(FREQUENCY.WEEKLY);
  const [points, setPoints] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      return;
    }
    
    // Create new chore object
    const newChore = {
      id: generateId(),
      title: title.trim(),
      category,
      frequency,
      assignedTo: null, // Will be assigned based on week
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...(category === CATEGORY.MAJOR && { points: Number(points) })
    };
    
    onAddChore(newChore);
    resetForm();
  };
  
  const resetForm = () => {
    setTitle('');
    setCategory(CATEGORY.DAILY);
    setFrequency(FREQUENCY.WEEKLY);
    setPoints(5);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-3">Lägg till ny syssla</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titel
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Dammsuga"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={CATEGORY.DAILY}>Vardaglig</option>
            <option value={CATEGORY.MAJOR}>Större uppgift</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
            Frekvens
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={FREQUENCY.ONCE}>Engångs</option>
            <option value={FREQUENCY.WEEKLY}>Varje vecka</option>
            <option value={FREQUENCY.BIWEEKLY}>Varannan vecka</option>
            <option value={FREQUENCY.MONTHLY}>Månadsvis</option>
          </select>
        </div>
        
        {category === CATEGORY.MAJOR && (
          <div className="mb-3">
            <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
              Poäng
            </label>
            <input
              type="number"
              id="points"
              value={points}
              onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
        
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

export default AddChoreForm; 