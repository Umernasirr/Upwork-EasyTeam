// Assuming this file is located at /pages/api/hello.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const commissionPlans = await prisma.commissionPlan.findMany();
    return new Response(JSON.stringify(commissionPlans), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error fetching commissionPlans" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();

    const { ids, commissionRate } = data;

    await prisma.commissionPlan.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        commissionRate,
      },
    });

    const commissionPlans = await prisma.commissionPlan.findMany();

    return new Response(JSON.stringify(commissionPlans), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error fetching commissionPlans" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
