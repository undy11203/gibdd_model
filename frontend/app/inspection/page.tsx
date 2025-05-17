"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddTechnicalInspectionForm from '../../components/forms/AddTechnicalInspectionForm';
import TabNav from '../../components/common/TabNav';
// import { TechnicalInspection } from "'types"' (see below for file content)
// import { getInspections } from ''utils/api'' (see below for file content);

export default function InspectionPage() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('list');

  const router = useRouter();

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        // const response = await getInspections({});
        // setInspections(response.content);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInspections();
  }, []);

  const tabs = [
    { id: 'list', label: 'List' },
    { id: 'add', label: 'Add' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
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

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'list' && (
        <>
          <h2 className="text-xl font-semibold mb-2">List of Technical Inspections</h2>
          <ul className="space-y-2 mb-6">
            {inspections != undefined && inspections.map((inspection) => (
              <li key={inspection.id} className="border p-2">
                <strong>{inspection.vehicle?.licensePlate?.licenseNumber ?? 'Unknown License Plate'}</strong> - {inspection.vehicle?.brand?.name ?? 'Unknown Brand'}, {inspection.inspectionDate}, {inspection.result}
              </li>
            ))}
          </ul>
        </>
      )}

      {activeTab === 'add' && (
        <div>
          <AddTechnicalInspectionForm />
        </div>
      )}
    </div>
  );
}
