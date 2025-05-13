'use server'

import { api } from "@/lib";


export const getClientsWithBalance = async (reg_no: string) => {
  const resp = await api(`clients/sales/search-client-balance/?q=${reg_no}`, {
    method: "GET",
  });

  return resp;
};