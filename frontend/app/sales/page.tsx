"use client";

import { useEffect, useState } from 'react';
import { getSales } from '../../utils/api';
import { SalePurchase } from '../../types/salePurchase';
import SearchForm from '../../components/forms/SearchForm';
import SaleCard from '../../components/SaleCard';

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<SalePurchase[]>([]);
  const [filteredSales, setFilteredSales] = useState<SalePurchase[]>([]);
  const [vehicle, setVehicle] = useState('');
  const [date, setDate] = useState('');
  const [buyer, setBuyer] = useState('');
  const [seller, setSeller] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getSales();
        setSales(response.data);
        setFilteredSales(response.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchSales();
  }, []);

  const handleSearch = (searchCriteria: any) => {
    const filtered = sales.filter(sale => {
      return (
        (!searchCriteria.vehicle || sale.vehicle.model.includes(searchCriteria.vehicle)) &&
        (!searchCriteria.date || sale.date === searchCriteria.date) &&
        (!searchCriteria.buyer || sale.buyer.name.includes(searchCriteria.buyer)) &&
        (!searchCriteria.seller || sale.seller.name.includes(searchCriteria.seller))
      );
    });
    setFilteredSales(filtered);
  };

  return (
<div className="p-4">
<button
  onClick={() => window.history.back()}
  className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
>
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-5 w-5"
  viewBox="0 0 20 20"
  fill="currentColor"
>
  <path
    fillRule="evenodd"
    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
    clipRule="evenodd"
  />
</svg>
</button>
      <h1 className="text-2xl font-bold mb-4">Sales Transactions</h1>
<div className="mb-4 space-y-2">
  <input
    type="text"
    placeholder="Vehicle"
    value={vehicle}
    onChange={(e) => setVehicle(e.target.value)}
    className="w-full p-2 border rounded"
  />
  <input
    type="date"
    placeholder="Date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="w-full p-2 border rounded"
  />
  <input
    type="text"
    placeholder="Buyer"
    value={buyer}
    onChange={(e) => setBuyer(e.target.value)}
    className="w-full p-2 border rounded"
  />
  <input
    type="text"
    placeholder="Seller"
    value={seller}
    onChange={(e) => setSeller(e.target.value)}
    className="w-full p-2 border rounded"
  />
  <button
    onClick={handleSearch}
    className="w-full p-2 bg-blue-500 text-white rounded"
  >
    Search
  </button>
</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSales.map((sale) => (
          <SaleCard key={sale.id} sale={sale} className="p-4 border rounded shadow" />
        ))}
      </div>
    </div>
  );
};

export default SalesPage;
