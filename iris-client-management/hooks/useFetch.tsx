import { useState, useEffect } from "react";

export const useFetch = (
  action: (param: string) => Promise<any>,
  param : string = ''
) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await action(param);
        setData(response);
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [action, param]);

  return { data, loading, error };
};
