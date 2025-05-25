"use client";

import { getOverdueInspections } from "@/utils/api";
import React, { useEffect, useState } from "react";

interface OwnerOverdueInspection {
  fullName: string;
  totalCount: number;
}

// 4. Получить перечень и общее число владельцев машин не прошедших вовремя техосмотр.

const OwnersWithOverdueInspection = () => {
  const [owners, setOwners] = useState<OwnerOverdueInspection[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverdueInspections = async () => {
      try {
        const overdueInspections = await getOverdueInspections();
        
        // Группируем владельцев по полному имени и считаем количество
        const ownerMap: Record<string, OwnerOverdueInspection> = {};
        
        overdueInspections.forEach((inspection) => {
          const ownerName = inspection.owner.fullName;
          if (!ownerMap[ownerName]) {
            ownerMap[ownerName] = { fullName: ownerName, totalCount: 0 };
          }
          ownerMap[ownerName].totalCount += 1;
        });

        const ownerList = Object.values(ownerMap);
        setOwners(ownerList);
        setTotalCount(ownerList.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueInspections();
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
          <li key={index}>{owner.fullName} - {owner.totalCount} overdue inspections</li>
        ))}
      </ul>
    </div>
  );
};

export default OwnersWithOverdueInspection;
