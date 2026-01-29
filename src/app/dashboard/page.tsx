"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Server, 
  Activity, 
  Cpu, 
  Database, 
  Zap,
  Plus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface VPS {
  id: string;
  name: string;
  status: string;
  ip: string;
  lastSeen: string;
}

export default function DashboardPage() {
  const [vpsList, setVpsList] = useState<VPS[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVPS = async () => {
      try {
        const res = await axios.get("/api/vps");
        setVpsList(res.data);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVPS();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const onlineCount = vpsList.filter(v => v.status === "online").length;
  const offlineCount = vpsList.length - onlineCount;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Dashboard Overview</h1>
        <p className="text-on-surface-variant">Quick summary of your VPS infrastructure</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="md3-card bg-primary-container text-on-primary-container">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">Total VPS</p>
              <h3 className="text-2xl font-bold">{vpsList.length}</h3>
            </div>
            <Server size={24} />
          </div>
        </div>
        <div className="md3-card bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">Online</p>
              <h3 className="text-2xl font-bold">{onlineCount}</h3>
            </div>
            <Activity size={24} />
          </div>
        </div>
        <div className="md3-card bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">Offline</p>
              <h3 className="text-2xl font-bold">{offlineCount}</h3>
            </div>
            <Zap size={24} />
          </div>
        </div>
        <div className="md3-card border-dashed border-2 flex flex-col items-center justify-center space-y-2 hover:bg-surface-variant/20 transition-colors cursor-pointer" onClick={() => window.location.href='/dashboard/vps'}>
           <Plus size={24} className="text-primary" />
           <span className="font-medium text-primary">Add New VPS</span>
        </div>
      </div>

      {/* Recent VPS List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Servers</h2>
          <Link href="/dashboard/vps" className="text-primary flex items-center space-x-1 hover:underline text-sm font-medium">
            <span>Manage All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vpsList.length === 0 ? (
            <div className="col-span-full md3-card text-center py-12">
              <Server size={48} className="mx-auto text-surface-variant mb-4" />
              <p className="text-on-surface-variant">No VPS found. Add your first one to start monitoring!</p>
            </div>
          ) : (
            vpsList.slice(0, 6).map((vps) => (
              <Link key={vps.id} href={`/dashboard/vps/${vps.id}`} className="md3-card hover:shadow-lg transition-shadow bg-surface border border-surface-variant/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${vps.status === "online" ? "bg-green-500" : "bg-red-500"}`} />
                    <h3 className="font-bold text-lg">{vps.name}</h3>
                  </div>
                  <Server size={20} className="text-on-surface-variant" />
                </div>
                <div className="space-y-2 text-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>IP Address:</span>
                    <span className="font-mono">{vps.ip || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Seen:</span>
                    <span>{vps.lastSeen ? new Date(vps.lastSeen).toLocaleTimeString() : "Never"}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
