// Assuming this file is located at /pages/api/hello.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const staffMembers = await prisma.staffMember.findMany();
    return new Response(JSON.stringify(staffMembers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error fetching staffMembers" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
