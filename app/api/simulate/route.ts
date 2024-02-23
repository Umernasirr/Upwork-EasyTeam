// Assuming this file is located at /pages/api/hello.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const staffMemberId = url.searchParams.get("staffMemberId");
  const dateRange = url.searchParams.get("dateRange");

  try {
    if (staffMemberId === null || dateRange === null) {
      return new Response(
        JSON.stringify({ error: "Error fetching staffMembers" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const ordersWithDetails = await prisma.order.findMany({
      where: {
        staffMemberId: parseInt(staffMemberId),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        staffMember: true,
      },
    });

    const productsArray = ordersWithDetails.map((order) => order.items);

    const products = productsArray.flat();
    const commissionPlan = await prisma.commissionPlan.findMany({
      where: {
        productId: {
          in: products.map((product) => product.productId),
        },
      },
    });

    return new Response(
      JSON.stringify({ ordersWithDetails, products, commissionPlan }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error fetching simulate data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
