"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Server, Activity, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  const { status } = useSession() || { status: 'loading' };
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Activity className="text-on-primary" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary">PPanel</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
          <Link href="/register" className="md3-button-primary text-sm px-6 py-2">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center lg:text-left lg:flex lg:items-center lg:space-x-12">
        <div className="lg:w-1/2 space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-on-surface">
            Monitor your <span className="text-primary">VPS</span> with confidence.
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto lg:mx-0">
            Real-time performance metrics, historical data, and instant alerts for your global infrastructure. Lightweight, secure, and beautiful.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register" className="md3-button-primary text-lg px-10 py-4 w-full sm:w-auto text-center">
              Start Free Trial
            </Link>
            <Link href="#features" className="px-10 py-4 rounded-full border border-surface-variant font-medium hover:bg-surface-variant/20 transition-all w-full sm:w-auto text-center">
              View Features
            </Link>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative md3-card border-primary/20 bg-surface/80 backdrop-blur-xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-4 font-mono text-sm opacity-80">
                <p className="text-primary">$ curl -sSL ppanel.io/install | bash</p>
                <p># Installing PPanel Monitor...</p>
                <p className="text-green-500"># Done! Server connected successfully.</p>
                <div className="h-40 bg-surface-variant/20 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface-variant/10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Everything you need to stay online</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Powerful features designed for system administrators and developers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md3-card bg-surface hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Ingestion</h3>
              <p className="text-on-surface-variant">Get live updates on CPU, RAM, and network traffic every 60 seconds.</p>
            </div>
            <div className="md3-card bg-surface hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
              <p className="text-on-surface-variant">Your data is encrypted and only accessible by you. No shared monitoring scripts.</p>
            </div>
            <div className="md3-card bg-surface hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 text-green-800 rounded-xl flex items-center justify-center mb-6">
                <Server size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Cloud Support</h3>
              <p className="text-on-surface-variant">Monitor AWS, DigitalOcean, Linode, or any private VPS with a single command.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-variant/50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-on-surface-variant text-sm">© 2026 PPanel Monitoring. All rights reserved.</p>
          <div className="flex space-x-6 text-sm text-on-surface-variant">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
