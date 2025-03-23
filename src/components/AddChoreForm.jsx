import React, { useState } from 'react';
import { FREQUENCY, CATEGORY, generateId } from '../models/chores';

// Component for adding a new chore
const AddChoreForm = ({ onAddChore, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORY.MAT);
  const [frequency, setFrequency] = useState(FREQUENCY.WEEKLY);
  const [points, setPoints] = useState(5);
  const [assignedTo, setAssignedTo] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Titel krävs';
    }
    
    if (category === CATEGORY.MAJOR && (!points || points < 1)) {
      newErrors.points = 'Poäng måste vara minst 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Create new chore object
    const newChore = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      category,
      frequency,
      assignedTo, // Allow directly assigning to a user
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...(category === CATEGORY.MAJOR && { points: Number(points) })
    };
    
    onAddChore(newChore);
    resetForm();
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(CATEGORY.MAT);
    setFrequency(FREQUENCY.WEEKLY);
    setPoints(5);
    setAssignedTo(null);
    setErrors({});
  };

  // Get category icon based on selected category
  const getCategoryIcon = () => {
    switch(category) {
      case CATEGORY.MAT:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case CATEGORY.STAD:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      case CATEGORY.TVATT:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case CATEGORY.SICKAN:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        );
      case CATEGORY.MAJOR:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white p-5 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-purple-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Lägg till ny uppgift
        </h2>
        <span className="text-sm text-purple-600">Alla fält markerade med * är obligatoriska</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-3">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titel *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
            placeholder="Ex: Handla mat"
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 appearance-none"
              >
                <option value={CATEGORY.MAT}>Mat</option>
                <option value={CATEGORY.STAD}>Städ</option>
                <option value={CATEGORY.TVATT}>Tvätt</option>
                <option value={CATEGORY.SICKAN}>Sickan</option>
                <option value={CATEGORY.DAILY}>Vardaglig</option>
                <option value={CATEGORY.MAJOR}>Större uppgift</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                {getCategoryIcon()}
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Frekvens
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value={FREQUENCY.ONCE}>Engångs</option>
              <option value={FREQUENCY.DAILY}>Dagligen</option>
              <option value={FREQUENCY.WEEKLY}>Varje vecka</option>
              <option value={FREQUENCY.BIWEEKLY}>Varannan vecka</option>
              <option value={FREQUENCY.MONTHLY}>Månadsvis</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Beskrivning (valfritt)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="Mer information om uppgiften..."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
              Tilldela (valfritt)
            </label>
            <select
              id="assignedTo"
              value={assignedTo || ""}
              onChange={(e) => setAssignedTo(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Välj person</option>
              <option value="user1">Erik</option>
              <option value="user2">Linnea</option>
            </select>
          </div>
          
          {category === CATEGORY.MAJOR && (
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
                Poäng *
              </label>
              <input
                type="number"
                id="points"
                value={points}
                onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className={`w-full px-3 py-2 border ${errors.points ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
              />
              {errors.points && <p className="mt-1 text-sm text-red-500">{errors.points}</p>}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            Spara uppgift
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddChoreForm;