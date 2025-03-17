// app/api/sales/[route]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCompletedExaminations, getRecentSales, createSale } from "@/lib/api/sales";

export async function GET(req: NextRequest, { params }: { params: { route: string } }) {
  const { route } = params;

  try {
    if (route === "examinations") {
      const examinations = await getCompletedExaminations();
      return NextResponse.json(examinations);
    } else if (route === "recent") {
      const sales = await getRecentSales();
      return NextResponse.json(sales);
    }
    return NextResponse.json({ error: "Invalid route" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: { route: string } }) {
  const { route } = params;

  try {
    if (route === "create") {
      const payload = await req.json();
      const result = await createSale(payload);
      return NextResponse.json(result);
    }
    return NextResponse.json({ error: "Invalid route" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}