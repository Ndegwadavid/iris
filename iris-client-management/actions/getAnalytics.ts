'use server'

import { api } from "@/lib";


export const getAnalytics = async () => {
  const resp = await api(`analytics/all/`, {
    method: "GET",
  });

  return resp;
};