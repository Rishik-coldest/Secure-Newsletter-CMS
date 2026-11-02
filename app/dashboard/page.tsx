"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Newsletter {
  id: string;
  title: string;
  content: string;
  image: string;
  status: string;
}

export default function DashboardPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserContent() {
      try {
        const res = await fetch("/api/newsletters");
        if (res.ok) {
          const data = await res.json();
          setNewsletters(data);
        }
      } catch (err) {
        console.error("Failed loading data feed matrix:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8 w-full flex-1">
      <div className="flex justify-between items-center mb-8 border-b border-base-300 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-sm text-base-content/60">Manage your newsletter collection content spaces</p>
        </div>
        <Link href="/dashboard/create" className="btn btn-primary text-white">
          Create Newsletter
        </Link>
      </div>

      {newsletters.length === 0 ? (
        <div className="text-center bg-base-100 border border-dashed border-base-300 p-12 rounded-2xl my-6">
          <p className="text-base-content/50 mb-4">You haven't generated any newsletters in this workspace yet.</p>
          <Link href="/dashboard/create" className="btn btn-sm btn-outline">Draft Your First Post</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsletters.map((letter) => (
            <div key={letter.id} className="card bg-base-100 shadow-xl border border-base-200">
              <figure className="h-40 relative bg-base-300">
                <img src={letter.image} alt={letter.title} className="object-cover w-full h-full" />
                <span className={`absolute top-3 right-3 badge text-white text-xs font-bold px-3 py-2 border-0 ${
                  letter.status === "Sent" ? "badge-success" : "badge-neutral"
                }`}>
                  {letter.status}
                </span>
              </figure>
              <div className="card-body p-5">
                <h2 className="card-title text-xl font-bold truncate">{letter.title}</h2>
                <p className="text-sm text-base-content/70 line-clamp-2 my-2">{letter.content}</p>
                <div className="card-actions justify-end gap-2 mt-4 pt-2 border-t border-base-200">
                  <Link href={`/dashboard/edit/${letter.id}`} className="btn btn-xs btn-outline btn-warning">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
