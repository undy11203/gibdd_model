import React from 'react';
import { SalePurchase } from '../../types/salePurchase';

interface SaleCardProps {
  sale: SalePurchase;
  className?: string;
}

const SaleCard: React.FC<SaleCardProps> = ({ sale, className }) => {
  return (
    <div className={`sale-card ${className}`}>
      <h2>{sale.vehicle.brand} {sale.vehicle.model}</h2>
      <p>Date: {sale.date}</p>
      <p>Cost: ${sale.cost}</p>
      <p>Buyer: {sale.buyer.name}</p>
      <p>Seller: {sale.seller.name}</p>
    </div>
  );
};

export default SaleCard;
