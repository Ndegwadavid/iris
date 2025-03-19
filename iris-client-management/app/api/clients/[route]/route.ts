import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://127.0.0.1:8000/api/v001/clients";
const CLIENTS_API_URL = "https://127.0.0.1:8000/api/v001/clients/client/?id={$id}";
const SALES_UPDATE_API_URL = "https://127.0.0.1:8000/api/v001/sales/{$id}/pay-balance/";


async function fetchFromBackend(endpoint: string, method: string = "GET", token?: string, body?: any) {
  const url = `${BASE_URL}/${endpoint}`;
  console.log(`${method} request to backend: ${url}`);
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Backend error: ${response.status} - ${text}`);
    return NextResponse.json({ error: text || "Request failed" }, { status: response.status });
  }

  const data = await response.json();
  console.log(`Backend response status: ${response.status}, data:`, data);
  return data;
}

export async function GET(req: NextRequest, { params }: { params: { route: string } }) {
  const { route } = params;
  const cookieStore = cookies();
  const token = cookieStore.get("access")?.value;

  try {
    if (route === "list") {
      const { searchParams } = new URL(req.url);
      const query = searchParams.get("q") || "";
      const endpoint = query ? `search-client/?q=${encodeURIComponent(query)}` : "search-client/";
      const data = await fetchFromBackend(endpoint, "GET", token);
      return NextResponse.json(data);
    } else if (route.startsWith("client/")) {
      const id = route.split("/")[1];
      const endpoint = `clients/client/${id}/`;
      const data = await fetchFromBackend(endpoint, "GET", token);
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "Invalid route" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { route: string } }) {
  const { route } = params;
  const cookieStore = cookies();
  const token = cookieStore.get("access")?.value;
  const body = await req.json();

  try {
    if (route.startsWith("sales/") && route.endsWith("/pay-balance?")) {
      const salesId = route.split("/")[1];
      const endpoint = `sales/${salesId}/pay-balance/`;
      const data = await fetchFromBackend(endpoint, "PUT", token, body);
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "Invalid route" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}