"use client";

import { getOverdueInspections } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { OverdueInspectionInfo } from "@/types/inspections";

// 4. Получить перечень и общее число владельцев машин не прошедших вовремя техосмотр.

const OwnersWithOverdueInspection = () => {
  const [owners, setOwners] = useState<OverdueInspectionInfo[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverdueInspections = async () => {
      try {
        const overdueInspections = await getOverdueInspections();
        
        // Backend now returns data in the correct format directly
        setOwners(overdueInspections);
        setTotalCount(overdueInspections.length);
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
