"use client";

import { useState, useEffect, useCallback } from "react";
import { getClientsWithBalance } from "@/actions";

interface ClientData {
  id: string;
  frame_brand: string;
  frame_model: string;
  frame_color: string;
  frame_price: string;
  lens_brand: string;
  lens_type: string;
  lens_material: string;
  lens_price: string;
  total_price: string;
  advance_paid: string;
  balance_due: string;
  balance_payment_status: string;
  served_by: string;
}

export const useSearchClientWithBalance = (reg_no: string) => {
  const [clientData, setClientData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientBalance = useCallback(async () => {
    if (!reg_no) return;
    setLoading(true);
    setError(null);

    try {
      const resp = await getClientsWithBalance(reg_no);
      setClientData(resp);
    } catch (err) {
      setError("Failed to fetch client balance");
    } finally {
      setLoading(false);
    }
  }, [reg_no]);

  useEffect(() => {
    fetchClientBalance();
  }, [fetchClientBalance]);

  return { clientData, loading, error, refetch: fetchClientBalance };
};
