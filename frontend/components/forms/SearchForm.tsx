import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (criteria: any) => void;
  className?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [vehicle, setVehicle] = useState('');
  const [date, setDate] = useState('');
  const [buyer, setBuyer] = useState('');
  const [seller, setSeller] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ vehicle, date, buyer, seller });
  };

  return (
<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Vehicle"
        value={vehicle}
        onChange={(e) => setVehicle(e.target.value)}
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Buyer"
        value={buyer}
        onChange={(e) => setBuyer(e.target.value)}
      />
      <input
        type="text"
        placeholder="Seller"
        value={seller}
        onChange={(e) => setSeller(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
