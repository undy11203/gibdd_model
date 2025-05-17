'use client';

import React, { useState, useEffect } from 'react';

interface YandexLocationPickerProps {
  apiKey: string;
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

interface Suggestion {
  displayName: string;
  lat: number;
  lon: number;
}

const YandexLocationPicker: React.FC<YandexLocationPickerProps> = ({ apiKey, latitude, longitude, onLocationChange }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(query)}&results=5`
        );
        const data = await response.json();
        const features = data.response.GeoObjectCollection.featureMember;
        const newSuggestions = features.map((feature: any) => {
          const geoObject = feature.GeoObject;
          const pos = geoObject.Point.pos.split(' ');
          return {
            displayName: geoObject.metaDataProperty.GeocoderMetaData.text,
            lon: parseFloat(pos[0]),
            lat: parseFloat(pos[1]),
          };
        });
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error fetching Yandex geocode suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query, apiKey]);

  const handleSelect = (index: number) => {
    const selected = suggestions[index];
    setSelectedIndex(index);
    setQuery(selected.displayName);
    onLocationChange(selected.lat, selected.lon);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        placeholder="Введите адрес или место ДТП"
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedIndex(null);
        }}
        className="w-full p-2 border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${
                selectedIndex === index ? 'bg-gray-300' : ''
              }`}
              onClick={() => handleSelect(index)}
            >
              {suggestion.displayName}
            </li>
          ))}
        </ul>
      )}
      {latitude !== null && longitude !== null && (
        <p className="mt-2 text-sm text-gray-600">
          Выбранные координаты: широта {latitude.toFixed(6)}, долгота {longitude.toFixed(6)}
        </p>
      )}
    </div>
  );
};

export default YandexLocationPicker;
