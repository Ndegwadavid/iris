'use server';

import { api } from "@/lib";


export const getSytemInfo = async () => {
  const resp = await api("admin-f/system-info/", {
    method: "GET",
  });

  return resp;
};