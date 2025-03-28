'use server';

import { api } from "@/lib";


export const getClients = async (query: string) => {
  const resp = await api(`clients/?query=${query}`, {
    method: "GET",
  });

  return resp;
};