"use client";

import React, { useState, useEffect } from 'react';
import useSuggestions from './useSuggestions';

interface SuggestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: { id: number; name: string }) => void;
  fetchData: (search: string) => Promise<any>;
  placeholder?: string;
}

const SuggestionInput: React.FC<SuggestionInputProps> = ({
  value,
  onChange,
  onSelect,
  fetchData,
  placeholder = 'Введите текст',
}) => {
  const { suggestions, loading, fetchSuggestions, clearSuggestions } = useSuggestions(fetchData);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    fetchSuggestions(newValue);
  };

  const handleSuggestionSelect = (suggestion: { id: number; name: string }) => {
    onSelect(suggestion);
    clearSuggestions();
  }

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="border p-2 w-full max-w-full shadow-sm border border-gray-300 rounded-md p-2 flex-grow"
        autoComplete="off"
      />
      {loading && <p>Загрузка...</p>}
      {suggestions.length > 0 && (
        <ul className="border p-2 w-full max-h-40 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionSelect(suggestion)}
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggestionInput;