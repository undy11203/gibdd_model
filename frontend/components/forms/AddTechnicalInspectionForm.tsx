"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addInspection, getOwners, getVehicles } from "@/utils/api";
import { Owner, Vehicle } from "@/types/type";

interface TechnicalInspectionFormData {
  ownerName: string; // Full name input for owner search
  ownerId: number | null; // Selected owner ID for submission
  vehicleId: number | null; // Selected vehicle ID
  inspectionDate: string;
  result: string;
  nextInspectionDate: string;
}

const prepareFormData = (formData: TechnicalInspectionFormData): {
  ownerId: number;
  vehicleId: number;
  inspectionDate: string;
  result: string;
  nextInspectionDate: string;
} => {
  return {
    ownerId: formData.ownerId || 0,
    vehicleId: formData.vehicleId || 0,
    inspectionDate: formData.inspectionDate,
    result: formData.result,
    nextInspectionDate: formData.nextInspectionDate,
  };
};

interface Suggestion {
  id: number;
  name: string;
}

interface SuggestionInputProps {
  name: string;
  placeholder: string;
  value: string;
  suggestions: Suggestion[];
  onInputChange: (name: string, value: string) => void;
  onSuggestionSelect: (suggestion: Suggestion) => void;
}

const SuggestionInput = ({
  name,
  placeholder,
  value,
  suggestions,
  onInputChange,
  onSuggestionSelect,
}: SuggestionInputProps) => {
  return (
    <div>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onInputChange(name, e.target.value)}
        className="border p-2 w-full"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="border p-2 w-full max-h-40 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => onSuggestionSelect(suggestion)}
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

const AddTechnicalInspectionForm = () => {
  const [formData, setFormData] = useState<TechnicalInspectionFormData>({
    ownerName: "",
    ownerId: null,
    vehicleId: null,
    inspectionDate: "",
    result: "",
    nextInspectionDate: "",
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const router = useRouter();

  const fetchOwnerSuggestions = useCallback(
    async (search: string) => {
      if (!search) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await getOwners({ search });
        // Adjust to handle response with content array
        const owners = response.data.content ?? response.data;
        const formattedSuggestions = owners.map((owner: Owner) => ({
          id: owner.id,
          name: owner.fullName || "Unknown Owner",
        }));
        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Error fetching owner suggestions", error);
      }
    },
    []
  );

  useEffect(() => {
    if (formData.ownerId !== null) {
      getVehicles({ ownerId: formData.ownerId }).then((response) => {
        const vehiclesData = response.data.content || response.data;
        setVehicles(vehiclesData);
      });
    } else {
      setVehicles([]);
      setFormData((prev) => ({ ...prev, vehicleId: null }));
    }
  }, [formData.ownerId]);

  const handleInputChange = (name: string, value: string) => {
    if (name === "ownerName") {
      setFormData((prev) => ({
        ...prev,
        ownerName: value,
        ownerId: null,
        vehicleId: null,
      }));
      fetchOwnerSuggestions(value);
    } else if (name === "vehicleId") {
      const parsedValue = value === "" ? null : Number(value);
      setFormData((prev) => ({
        ...prev,
        vehicleId: parsedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setFormData((prev) => ({
      ...prev,
      ownerName: suggestion.name,
      ownerId: suggestion.id,
      vehicleId: null,
    }));
    setSuggestions([]);
    setVehicles([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const preparedData = prepareFormData(formData);
      await addInspection(preparedData);
      alert("Technical inspection successfully registered!");
      router.push("/technical-inspections");
    } catch (error) {
      console.error(error);
      alert("Error registering technical inspection.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Регистрация техосмотра</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Owner */}
        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
          Владелец
        </label>
        <SuggestionInput
          name="ownerName"
          placeholder="Search for an owner"
          value={formData.ownerName}
          suggestions={suggestions}
          onInputChange={handleInputChange}
          onSuggestionSelect={handleSuggestionSelect}
        />

        {/* Vehicle */}
        {formData.ownerId !== null && (
          <>
            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
              Транспортное средство
            </label>
            <select
              name="vehicleId"
              value={formData.vehicleId || ""}
              onChange={(e) => handleInputChange("vehicleId", e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {`${vehicle.brand?.name ?? "Unknown Brand"} (${
                    vehicle.licensePlate?.licenseNumber ?? "Unknown License Plate"
                  })`}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Inspection Date */}
        <label htmlFor="inspectionDate" className="block text-sm font-medium text-gray-700">
          Дата текущего техосмотра
        </label>
        <input
          type="date"
          name="inspectionDate"
          placeholder="Дата техосмотра"
          value={formData.inspectionDate}
          onChange={(e) => handleInputChange("inspectionDate", e.target.value)}
          className="border p-2 w-full"
        />

        {/* Result */}
        <label htmlFor="result" className="block text-sm font-medium text-gray-700">
          Результат
        </label>
        <input
          type="text"
          name="result"
          placeholder="Результат"
          value={formData.result}
          onChange={(e) => handleInputChange("result", e.target.value)}
          className="border p-2 w-full"
        />

        {/* Next Inspection Date */}
        <label htmlFor="nextInspectionDate" className="block text-sm font-medium text-gray-700">
          Дата следующего техосмотра
        </label>
        <input
          type="date"
          name="nextInspectionDate"
          placeholder="Дата следующего техосмотра"
          value={formData.nextInspectionDate}
          onChange={(e) => handleInputChange("nextInspectionDate", e.target.value)}
          className="border p-2 w-full"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          disabled={!formData.vehicleId} // Button enabled only when vehicle is selected
        >
          Зарегистрировать
        </button>
      </form>
    </div>
  );
};

export default AddTechnicalInspectionForm;
