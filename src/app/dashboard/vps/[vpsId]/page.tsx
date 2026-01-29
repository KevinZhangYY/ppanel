"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  Cpu, 
  Database, 
  HardDrive, 
  Activity,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Metric {
  id: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  netIn: number;
  netOut: number;
  timestamp: string;
}

interface VPS {
  id: string;
  name: string;
  ip: string;
  status: string;
}

export default function VPSDetailPage() {
  const { vpsId } = useParams();
  const [vps, setVps] = useState<VPS | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [vpsRes, metricsRes] = await Promise.all([
        axios.get(`/api/vps`), // Simplified, usually you'd have a detail endpoint
        axios.get(`/api/vps/${vpsId}/metrics?limit=30`)
      ]);
      const currentVps = vpsRes.data.find((v: any) => v.id === vpsId);
      setVps(currentVps);
      setMetrics(metricsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [vpsId]);

  if (loading) return <div>Loading VPS details...</div>;
  if (!vps) return <div>VPS not found</div>;

  const latestMetric = metrics[metrics.length - 1];

  const formatTime = (timeStr: any) => {
    return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/vps" className="p-2 hover:bg-surface-variant/50 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{vps.name}</h1>
            <p className="text-on-surface-variant font-mono text-sm">{vps.ip}</p>
          </div>
        </div>
        <button onClick={fetchData} className="p-2 hover:bg-surface-variant/50 rounded-full transition-colors">
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md3-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium opacity-70">CPU Usage</span>
            <Cpu size={20} className="text-primary" />
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-4xl font-bold">{latestMetric?.cpuUsage.toFixed(1) || 0}%</span>
          </div>
          <div className="w-full bg-surface-variant/30 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${latestMetric?.cpuUsage || 0}%` }} />
          </div>
        </div>

        <div className="md3-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium opacity-70">RAM Usage</span>
            <Database size={20} className="text-secondary" />
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-4xl font-bold">{latestMetric?.ramUsage.toFixed(1) || 0}%</span>
          </div>
          <div className="w-full bg-surface-variant/30 h-2 rounded-full overflow-hidden">
            <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${latestMetric?.ramUsage || 0}%` }} />
          </div>
        </div>

        <div className="md3-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium opacity-70">Disk Usage</span>
            <HardDrive size={20} className="text-on-surface-variant" />
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-4xl font-bold">{latestMetric?.diskUsage.toFixed(1) || 0}%</span>
          </div>
          <div className="w-full bg-surface-variant/30 h-2 rounded-full overflow-hidden">
            <div className="bg-on-surface-variant h-full transition-all duration-500" style={{ width: `${latestMetric?.diskUsage || 0}%` }} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CPU History */}
        <div className="md3-card min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">CPU Load History</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6750A4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6750A4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E0EB" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime} 
                  stroke="#49454F"
                  fontSize={12}
                />
                <YAxis stroke="#49454F" fontSize={12} unit="%" />
                <Tooltip 
                  labelFormatter={formatTime}
                  contentStyle={{ backgroundColor: '#FEF7FF', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="cpuUsage" stroke="#6750A4" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Traffic */}
        <div className="md3-card min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">Network Bandwidth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E0EB" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime} 
                  stroke="#49454F"
                  fontSize={12}
                />
                <YAxis stroke="#49454F" fontSize={12} />
                <Tooltip 
                  labelFormatter={formatTime}
                  contentStyle={{ backgroundColor: '#FEF7FF', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="netIn" stroke="#6750A4" strokeWidth={2} dot={false} name="Incoming" />
                <Line type="monotone" dataKey="netOut" stroke="#D0BCFF" strokeWidth={2} dot={false} name="Outgoing" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
