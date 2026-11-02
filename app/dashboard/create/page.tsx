"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateNewsletterPage() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Placeholder simulated fallback id to mirror your custom auth setup parameters cleanly
    const authorId = "1"; 

    try {
      const res = await fetch("/api/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, image, content, authorId }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("Failed to save draft parameter options.");
        setIsSaving(false);
      }
    } catch (err) {
      console.error("Failed creating record:", err);
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-8 w-full flex-1">
      <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
        <h1 className="text-3xl font-bold mb-2">Create New Newsletter</h1>
        <p className="text-sm text-base-content/60 mb-6">Draft a new content layout config layer for your database.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Title</span></label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter headline details" 
              className="input input-bordered w-full"
              required 
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Cover Image Location URL</span></label>
            <input 
              type="url" 
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://unsplash.com..." 
              className="input input-bordered w-full" 
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Content Area</span></label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6} 
              placeholder="Compose content here..." 
              className="textarea textarea-bordered w-full leading-relaxed"
              required
            ></textarea>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Link href="/dashboard" className="btn btn-ghost">Cancel</Link>
            <button type="submit" disabled={isSaving} className="btn btn-primary text-white px-6">
              {isSaving ? "Saving Record..." : "Save Draft Layout"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
