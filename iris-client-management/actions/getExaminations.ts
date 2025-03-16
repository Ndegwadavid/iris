'use server';

import { api } from "@/lib";


export const getExaminations = async () => {
  const resp = await api("clients/examinations/", {
    method: "GET",
  });

  return resp;
};