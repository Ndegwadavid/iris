'use server';

import { api } from "@/lib";


export const getStaff = async () => {
  const resp = await api(`admin-f/staff/`, {
    method: "GET",
  });

  return resp;
};