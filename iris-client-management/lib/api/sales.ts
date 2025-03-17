// lib/api/sales.ts
import { api } from "../fetch";
import { Examination, Sale } from "../sales";

export async function getCompletedExaminations(): Promise<Examination[]> {
  const data = await api("clients/examinations/");
  return data.d.filter(
    (exam: Examination) => exam.state === "Completed" && exam.booked_for_sales
  );
}

export async function getRecentSales(): Promise<Sale[]> {
  return await api("clients/sales/");
}

export async function createSale(payload: any): Promise<any> {
  return await api("clients/sales/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}