// app/api/clients/[route]/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://127.0.0.1:8000/api/v001/clients";
const CLIENTS_API_URL = "https://127.0.0.1:8000/api/v001/clients/client/?id={$id}";

async function fetchFromBackend(endpoint: string, token?: string) {
  const url = `${BASE_URL}/${endpoint}`;
  console.log(`Fetching from backend: ${url}`); // Debug log
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Backend error: ${response.status} - ${errorText}`);
    return NextResponse.json({ error: errorText || "Request failed" }, { status: response.status });
  }

  return response.json();
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
      const data = await fetchFromBackend(endpoint, token);
      return NextResponse.json(data);
    } else if (route.startsWith("client/")) { // Changed from detail/ to client/
      const id = route.split("/")[1];
      const endpoint = `clients/client/${id}/`; // Matches Django URL
      console.log(`Proxying to: ${BASE_URL}/${endpoint}`); // Debug log
      const data = await fetchFromBackend(endpoint, token);
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error: "Invalid route" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}