// /actions/getSingleClient.ts
"use server";

import { api } from "@/lib/fetch"; // Your server-side fetch utility
import { Client, Examination } from "@/lib/clients";

interface ClientResponse {
  client: Client & { examinations: Examination[] };
  examinations: Examination[];
}

export async function getSingleClient(clientId: string): Promise<ClientResponse> {
  const endpoint = `clients/client-info/${clientId}/`;
  const data = await api(endpoint, {
    method: "GET",
  });

  if ("status" in data && data.status >= 400) {
    throw new Error(`Failed to fetch client: ${data.status} - ${data.message || "Unknown error"}`);
  }

  return data as ClientResponse;
}