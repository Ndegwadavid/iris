export type Client = {
  id: string;
  reg_no: string;
  first_name: string;
  last_name: string;
  dob: string | null;
  phone_number: string | null;
  email: string | null;
  last_examination_date: string | null;
  visit_count?: number;
  balance?: number;
  payment_status?: "fully_paid" | "pending_balance" | "overdue";
  latest_examination_id?: string;
  examinations?: Examination[];
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


export async function updateClientBalance(
  salesId: string,
  amountPaid: number,
  paymentMethod: "Mpesa" | "Cash",
  mpesaCode?: string
): Promise<void> {
  const payload: { advance_paid: number; advance_payment_method?: string; mpesa_transaction_code?: string } = {
    advance_paid: amountPaid,
  };
  if (paymentMethod === "Mpesa") {
    if (!mpesaCode) throw new Error("M-Pesa code is required for M-Pesa payments");
    payload.advance_payment_method = "Mpesa";
    payload.mpesa_transaction_code = mpesaCode;
  } else if (paymentMethod === "Cash") {
    payload.advance_payment_method = "Cash";
  }

  const response = await fetch(`/api/v001/clients/sales/${salesId}/pay-balance/`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.text();
    console.error(`Error response: ${errorData}`);
    throw new Error(`Failed to update balance (status: ${response.status}): ${errorData}`);
  }
  console.log(`Balance updated for sales ID ${salesId}`);
}