'use server';

import { api } from "@/lib";


export const getClientExaminations = async (id: string) => {
  const resp = await api(`clients/examinations/${id}/`, {
    method: "GET",
  });

  return resp;
};