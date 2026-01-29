"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Alert {
  id: string;
  vpsId: string;
  type: string;
  threshold: number;
  status: string;
  createdAt: string;
  vps: {
    name: string;
  };
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("/api/alerts");
        setAlerts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div>Loading alerts...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Alert History</h1>
        <p className="text-on-surface-variant">Review recent system notifications and warnings</p>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="md3-card text-center py-12">
            <Bell size={48} className="mx-auto text-surface-variant mb-4" />
            <p className="text-on-surface-variant">All systems normal. No alerts found.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="md3-card bg-surface border border-surface-variant/30 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${alert.status === "active" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {alert.status === "active" ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                </div>
                <div>
                  <h3 className="font-bold">{alert.vps.name} - {alert.type.toUpperCase()} Alert</h3>
                  <p className="text-sm text-on-surface-variant">
                    Threshold exceeded: {alert.threshold}% usage detected.
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-on-surface-variant flex items-center space-x-2">
                <Clock size={16} />
                <span>{new Date(alert.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
