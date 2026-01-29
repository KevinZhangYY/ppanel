import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ vpsId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { vpsId } = await params;

    const vps = await prisma.vPS.findUnique({
      where: {
        id: vpsId,
        userId: session.user.id,
      },
    });

    if (!vps) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.vPS.delete({
      where: {
        id: vpsId,
      },
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("VPS_DELETE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
