'use server'

import { api } from "@/lib";

type Amount = {
    advance_paid : number
}

export const payBalance = async (id: string, amount: Amount) => {
  const resp = await api(`clients/sales/${id}/pay-balance/`, {
    method: "PUT",
    body: JSON.stringify(amount)
  });

  return resp;
};