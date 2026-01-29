"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Terminal,
  Server,
  X
} from "lucide-react";

interface VPS {
  id: string;
  name: string;
  ip: string;
  token: string;
  status: string;
}

export default function VPSPage() {
  const [vpsList, setVpsList] = useState<VPS[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIp, setNewIp] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVPS();
  }, []);

  const fetchVPS = async () => {
    try {
      const res = await axios.get("/api/vps");
      setVpsList(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/vps", { name: newName, ip: newIp });
      setNewName("");
      setNewIp("");
      setIsModalOpen(false);
      fetchVPS();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this VPS?")) return;
    try {
      await axios.delete(`/api/vps/${id}`);
      fetchVPS();
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  if (loading) return <div>Loading VPS management...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">VPS Management</h1>
          <p className="text-on-surface-variant">Add and manage your servers</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="md3-button-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add VPS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {vpsList.map((vps) => (
          <div key={vps.id} className="md3-card bg-surface border border-surface-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${vps.status === "online" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                <Server size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{vps.name}</h3>
                <p className="text-sm text-on-surface-variant font-mono">{vps.ip || "No IP set"}</p>
              </div>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="bg-surface-variant/20 p-3 rounded-lg flex items-center justify-between group">
                <div className="flex items-center space-x-2 text-sm font-mono overflow-hidden">
                  <Terminal size={16} className="text-primary flex-shrink-0" />
                  <span className="truncate opacity-70">curl -sSL {typeof window !== 'undefined' ? window.location.origin : ''}/api/install?token={vps.token} | sudo bash</span>
                </div>
                <button 
                  onClick={() => copyToClipboard(`curl -sSL ${window.location.origin}/api/install?token=${vps.token} | sudo bash`, vps.id)}
                  className="p-2 hover:bg-surface-variant/50 rounded-full transition-colors"
                >
                  {copiedToken === vps.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-primary" />}
                </button>
              </div>
            </div>

            <button 
              onClick={() => handleDelete(vps.id)}
              className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors self-end md:self-auto"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-md rounded-md3-xl p-8 space-y-6 relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-surface-variant/50 rounded-full">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold">Add New VPS</h2>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1 px-4">Server Name</label>
                  <input
                    type="text"
                    required
                    className="md3-input"
                    placeholder="My Production Server"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1 px-4">IP Address (Optional)</label>
                  <input
                    type="text"
                    className="md3-input"
                    placeholder="1.2.3.4"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="w-full md3-button-primary py-3">
                Create VPS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
