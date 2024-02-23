// /pages/api/products.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("per_page") || "10", 10);
  const skip = (page - 1) * limit;

  try {
    const commissionPlans = await prisma.commissionPlan.findMany();

    const products = await prisma.product.findMany({
      take: limit,
      skip,
    });
    const totalProducts = await prisma.product.count();
    return new Response(JSON.stringify({ products, totalProducts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching products" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
