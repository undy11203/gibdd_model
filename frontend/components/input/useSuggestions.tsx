"use client";

import { useState, useCallback } from "react";

interface Suggestion {
  id: number;
  name: string;
}

const useSuggestions = (fetchData: (search: string) => Promise<any>) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Загрузка подсказок
  const fetchSuggestions = useCallback(
    async (search: string) => {
      if (!search) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetchData(search);
        const data = response.data.content ?? response.data;
        const formattedSuggestions = data.map((item: any) => ({
          id: item.id,
          name: item.fullName || "Unknown",
        }));
        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  // Очистка подсказок
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return { suggestions, loading, fetchSuggestions, clearSuggestions };
};

export default useSuggestions;