import { cookies } from "next/headers";

const BASE_URL = "http://127.0.0.1:8000/api/v001";

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}/${endpoint}`;
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access");

  const headers = {
    Authorization: `Bearer ${token?.value || ""}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      return { status: response.status, message: response.statusText };
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
