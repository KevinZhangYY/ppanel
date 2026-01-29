import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      token,
      cpuUsage,
      ramUsage,
      ramTotal,
      ramUsed,
      diskUsage,
      diskTotal,
      diskUsed,
      netIn,
      netOut,
      load,
      uptime,
    } = body;

    if (!token) {
      return new NextResponse("Token is required", { status: 400 });
    }

    const vps = await prisma.vPS.findUnique({
      where: { token },
    });

    if (!vps) {
      return new NextResponse("Invalid token", { status: 404 });
    }

    // Update VPS status
    await prisma.vPS.update({
      where: { id: vps.id },
      data: {
        status: "online",
        lastSeen: new Date(),
      },
    });

    // Save metrics
    await prisma.metric.create({
      data: {
        vpsId: vps.id,
        cpuUsage: parseFloat(cpuUsage),
        ramUsage: parseFloat(ramUsage),
        ramTotal: parseFloat(ramTotal),
        ramUsed: parseFloat(ramUsed),
        diskUsage: parseFloat(diskUsage),
        diskTotal: parseFloat(diskTotal),
        diskUsed: parseFloat(diskUsed),
        netIn: parseFloat(netIn),
        netOut: parseFloat(netOut),
        load: parseFloat(load),
        uptime: parseInt(uptime),
      },
    });

    // Check for alerts (simple threshold check)
    // In a real app, this could send emails or webhooks
    if (cpuUsage > 90 || ramUsage > 90 || diskUsage > 90) {
      await prisma.alert.create({
        data: {
          vpsId: vps.id,
          type: cpuUsage > 90 ? "cpu" : ramUsage > 90 ? "ram" : "disk",
          threshold: 90,
          status: "active",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REPORT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
