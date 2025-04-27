"use client";

import React, { useEffect, useState } from "react";

interface OwnerOverdueInspection {
  fullName: string;
  totalCount: number;
}

//4. Получить перечень и общее число владельцев машин не прошедших вовремя техосмотр.

const OwnersWithOverdueInspection: React.FC = () => {
  const [owners, setOwners] = useState<OwnerOverdueInspection[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/owners/overdue-inspections")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data: OwnerOverdueInspection[]) => {
        setOwners(data);
        if (data.length > 0) {
          setTotalCount(data[0].totalCount);
        } else {
          setTotalCount(0);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading owners with overdue inspections...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Owners with Overdue Technical Inspections</h2>
      <p>Total owners: {totalCount}</p>
      <ul>
        {owners.map((owner, index) => (
          <li key={index}>{owner.fullName}</li>
        ))}
      </ul>
    </div>
  );
};

export default OwnersWithOverdueInspection;
