// lib/clients.ts
export type Client = {
  id: string;
  reg_no: string;
  first_name: string;
  last_name: string;
  dob: string | null;
  phone_number: string | null;
  email: string | null;
  last_examination_date: string | null;
};

export type Examination = {
  id: string;
  client: string;
  examination_date: string;
  examined_by: string;
  clinical_history: string;
  right_sph?: number | null;
  right_cyl?: number | null;
  right_axis?: number | null;
  right_add?: number | null;
  right_va?: string;
  right_ipd?: number | null;
  left_sph?: number | null;
  left_cyl?: number | null;
  left_axis?: number | null;
  left_add?: number | null;
  left_va?: string;
  left_ipd?: number | null;
  state: string;
  booked_for_sales: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchClients(searchQuery: string = ""): Promise<Client[]> {
  const url = searchQuery
    ? `/api/clients/list?q=${encodeURIComponent(searchQuery)}`
    : "/api/clients/list";
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: `Server returned ${response.status}` }));
    throw new Error(errorData.error || `Failed to fetch clients (status: ${response.status})`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchClientById(id: string): Promise<Client & { examinations: Examination[] }> {
  const response = await fetch(`/clients/client?id=${id}`, { credentials: "include" }); // Changed from /detail/ to /client/
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: `Server returned ${response.status}` }));
    throw new Error(errorData.error || `Failed to fetch client (status: ${response.status})`);
  }
  return await response.json();
}