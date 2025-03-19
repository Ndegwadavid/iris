// /lib/admin-api.ts
interface StaffMember {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: "staff" | "receptionist" | "optometrist";
    is_active: boolean;
  }
  
  interface Branch {
    id: number;
    name: string;
    code: string;
  }
  
  async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`/api/admin/${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }
  
  export async function getTotalClients(): Promise<number> {
    const data = await apiFetch("clients");
    return data.total;
  }
  
  export async function getTotalExaminations(): Promise<number> {
    const data = await apiFetch("examinations");
    return data.total;
  }
  
  export async function getTotalSales(): Promise<number> {
    const data = await apiFetch("sales");
    return data.total;
  }
  
  export async function getStaffMembers(): Promise<StaffMember[]> {
    const data = await apiFetch("staff");
    return data;
  }
  
  export async function createStaffMember(data: {
    first_name: string;
    last_name: string;
    email: string;
    role: "staff" | "receptionist" | "optometrist";
    password: string;
  }): Promise<StaffMember> {
    const response = await apiFetch("staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response;
  }
  
  export async function getBranches(): Promise<Branch[]> {
    const data = await apiFetch("branches");
    return data;
  }
  
  export async function createBranch(data: { name: string; code: string }): Promise<Branch> {
    const response = await apiFetch("branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response;
  }