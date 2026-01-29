import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const vpsList = await prisma.vPS.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(vpsList);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, ip } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const vps = await prisma.vPS.create({
      data: {
        name,
        ip,
        userId: session.user.id,
      },
    });

    return NextResponse.json(vps);
  } catch (error) {
    console.error("VPS_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
