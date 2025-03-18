// /app/api/admin/[route]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = "http://127.0.0.1:8000/api/v001";

async function apiFetch(endpoint: string, token: string | undefined) {
  const url = `${BASE_URL}/${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: response.statusText },
      { status: response.status }
    );
  }

  return response.json();
}

export async function GET(req: NextRequest, { params }: { params: { route: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get("access")?.value;

  const { route } = params;

  try {
    switch (route) {
      case "clients":
        const clients = await apiFetch("clients/", token);
        return NextResponse.json({ total: Array.isArray(clients) ? clients.length : 0 });

      case "examinations":
        const exams = await apiFetch("clients/examinations/", token);
        return NextResponse.json({ total: exams.d ? exams.d.length : 0 });

      case "sales":
        const sales = await apiFetch("clients/sales/", token);
        return NextResponse.json({ total: Array.isArray(sales) ? sales.length : 0 });

      case "staff":
        const staff = await apiFetch("auth/users/", token);
        return NextResponse.json(
          staff.map((user: any) => ({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            is_active: user.is_active,
          }))
        );

      case "branches":
        const branches = await apiFetch("clients/branches/", token);
        return NextResponse.json(
          Array.isArray(branches)
            ? branches.map((branch: any) => ({
                id: branch.id,
                name: branch.name,
                code: branch.code,
              }))
            : []
        );

      default:
        return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { route: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get("access")?.value;
  const body = await req.json();

  const { route } = params;

  try {
    switch (route) {
      case "staff":
        const staffResponse = await fetch(`${BASE_URL}/auth/users/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(body),
        });
        if (!staffResponse.ok) {
          return NextResponse.json(
            { error: staffResponse.statusText },
            { status: staffResponse.status }
          );
        }
        const newStaff = await staffResponse.json();
        return NextResponse.json(newStaff);

      case "branches":
        const branchResponse = await fetch(`${BASE_URL}/clients/branches/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(body),
        });
        if (!branchResponse.ok) {
          return NextResponse.json(
            { error: branchResponse.statusText },
            { status: branchResponse.status }
          );
        }
        const newBranch = await branchResponse.json();
        return NextResponse.json(newBranch);

      default:
        return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}