import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ vpsId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { vpsId } = await params;
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");

  const metrics = await prisma.metric.findMany({
    where: {
      vpsId: vpsId,
    },
    orderBy: {
      timestamp: "desc",
    },
    take: limit,
  });

  // Reverse to get chronological order for charts
  return NextResponse.json(metrics.reverse());
}
