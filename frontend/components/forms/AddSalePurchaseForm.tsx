"use client";

import { useState, useEffect, useCallback } from "react";
import { getVehicles, getOwners, addSalePurchase } from "@/utils/api";

interface SalePurchaseFormData {
  vehicleId: number | null;
  date: string;
  cost: number | null;
  buyerId: number | null;
  buyerName?: string;
  sellerId: number | null;
  sellerName: string;
}

interface Suggestion {
  id: number;
  name: string;
}

interface AddSalePurchaseFormProps {
  onSuccess?: () => void;
}

const AddSalePurchaseForm: React.FC<AddSalePurchaseFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<SalePurchaseFormData>({
    vehicleId: null,
    date: "",
    cost: null,
    buyerId: null,
    sellerId: null,
    sellerName: "",
  });

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);

  // Suggestions for buyer input
  const [buyerSuggestions, setBuyerSuggestions] = useState<Suggestion[]>([]);

  // Fetch buyer suggestions
  const fetchBuyerSuggestions = useCallback(
    async (search: string) => {
      if (!search) {
        setBuyerSuggestions([]);
        return;
      }
      try {
        const response = await getOwners({ search });
        const ownersData = response.data.content ?? response.data;
        const formattedSuggestions = ownersData.map((owner: any) => ({
          id: owner.id,
          name: owner.fullName || "Unknown Owner",
        }));
        setBuyerSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Error fetching buyer suggestions", error);
      }
    },
    []
  );
  const [sellerSuggestions, setSellerSuggestions] = useState<Suggestion[]>([]);

  const fetchSellerSuggestions = useCallback(
    async (search: string) => {
      if (!search) {
        setSellerSuggestions([]);
        return;
      }
      try {
        const response = await getOwners({ search });
        const ownersData = response.data.content ?? response.data;
        const formattedSuggestions = ownersData.map((owner: any) => ({
          id: owner.id,
          name: owner.fullName || "Unknown Owner",
        }));
        setSellerSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Error fetching seller suggestions", error);
      }
    },
    []
  );

  useEffect(() => {
    if (formData.sellerId !== null) {
      getVehicles({ ownerId: formData.sellerId })
        .then((response) => {
          const vehiclesData = response.data.content || response.data;
          setVehicles(vehiclesData);
        })
        .catch((error) => {
          console.error("Error fetching vehicles for seller", error);
          setVehicles([]);
        });
    } else {
      setVehicles([]);
      setFormData((prev) => ({ ...prev, vehicleId: null }));
    }
  }, [formData.sellerId]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await getOwners({});
        const ownersData = response.data.content ?? response.data;
        setOwners(ownersData);
      } catch (error) {
        console.error("Error fetching owners", error);
      }
    };
    fetchOwners();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    if (name === "sellerName") {
      setFormData((prev) => ({
        ...prev,
        sellerName: value,
        sellerId: null,
        vehicleId: null,
      }));
      fetchSellerSuggestions(value);
    } else if (name === "buyerName") {
      setFormData((prev) => ({
        ...prev,
        buyerName: value,
        buyerId: null,
      }));
      fetchBuyerSuggestions(value);
    } else if (name === "date" || name === "cost" || name === "vehicleId" || name === "buyerId" || name === "sellerId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : name === "cost" ? parseFloat(value) : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSuggestionSelect = (suggestion: Suggestion, field: "seller" | "buyer") => {
    if (field === "seller") {
      setFormData((prev) => ({
        ...prev,
        sellerName: suggestion.name,
        sellerId: suggestion.id,
        vehicleId: null,
      }));
      setSellerSuggestions([]);
    } else if (field === "buyer") {
      setFormData((prev) => ({
        ...prev,
        buyerName: suggestion.name,
        buyerId: suggestion.id,
      }));
      setBuyerSuggestions([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.vehicleId ||
      !formData.date ||
      formData.cost === null ||
      !formData.buyerId ||
      !formData.sellerId
    ) {
      alert("Пожалуйста, заполните все поля");
      return;
    }
    try {
      await addSalePurchase({
        vehicleId: formData.vehicleId,
        date: formData.date,
        cost: formData.cost,
        buyerId: formData.buyerId,
        sellerId: formData.sellerId,
      });
      alert("Сделка купли-продажи успешно зарегистрирована!");
      if (onSuccess) {
        await onSuccess();
      }
      setFormData({
        vehicleId: null,
        date: "",
        cost: null,
        buyerId: null,
        sellerId: null,
        sellerName: "",
      });
      setVehicles([]);
    } catch (error) {
      console.error("Error adding sale purchase", error);
      alert("Ошибка при регистрации сделки.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Seller input with suggestions */}
        <div>
          <input
            type="text"
            name="sellerName"
            value={formData.sellerName}
            onChange={(e) => handleInputChange("sellerName", e.target.value)}
            placeholder="Введите имя продавца"
            className="border p-2 w-full max-w-full"
            autoComplete="off"
          />
          {sellerSuggestions.length > 0 && (
            <ul className="border p-2 w-full max-h-40 overflow-y-auto">
              {sellerSuggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionSelect(suggestion, "seller")}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Vehicle select */}
        <select
          name="vehicleId"
          value={formData.vehicleId ?? ""}
          onChange={(e) => handleInputChange("vehicleId", e.target.value)}
          className="border p-2 w-full max-w-full"
          disabled={!formData.sellerId}
        >
          <option value="">Выберите транспортное средство</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.brand?.name ?? "Unknown Brand"} - {vehicle.licensePlate?.licenseNumber ?? "Unknown License Plate"}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          className="border p-2 w-full max-w-full"
        />

        <input
          type="number"
          name="cost"
          placeholder="Стоимость"
          value={formData.cost ?? ""}
          onChange={(e) => handleInputChange("cost", e.target.value)}
          className="border p-2 w-full max-w-full"
          min="0"
          step="0.01"
        />

        {/* Buyer input with suggestions */}
        <div>
          <input
            type="text"
            name="buyerName"
            value={formData.buyerName || ""}
            onChange={(e) => handleInputChange("buyerName", e.target.value)}
            placeholder="Введите имя покупателя"
            className="border p-2 w-full max-w-full"
            autoComplete="off"
          />
          {buyerSuggestions.length > 0 && (
            <ul className="border p-2 w-full max-h-40 overflow-y-auto">
              {buyerSuggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionSelect(suggestion, "buyer")}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Зарегистрировать сделку
        </button>
      </form>
    </>
  );
};

export default AddSalePurchaseForm;
