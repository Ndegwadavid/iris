'use server'

import { api } from "@/lib";


export const createBranch= async (data: any) => {
  const resp = await api(`admin-f/branches/`, {
    method: "POST",
    body: JSON.stringify(data)
  });

  return resp;
};

