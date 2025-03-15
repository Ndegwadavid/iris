'use server';

import { api } from "@/lib";


export const getBranches = async () => {
  const resp = await api("clients/branches/", {
    method: "GET",
  });

  return resp;
};