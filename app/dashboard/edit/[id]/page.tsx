"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditNewsletterPage({ params }: EditPageProps) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("Draft");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Load the current row's parameters into the form fields on mount
  useEffect(() => {
    async function loadLetterDetails() {
      try {
        // Fetch the explicit sub-resource route directly
        const res = await fetch(`/api/newsletters/${id}`);
        if (res.ok) {
          const target = await res.json();
          setTitle(target.title);
          setImage(target.image);
          setStatus(target.status);
          setContent(target.content);
        } else {
          // Redirect or alert user if unauthorized/not found
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Failed fetching record specifics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLetterDetails();
  }, [id, router]);


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/newsletters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, image, content, status }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("Failed to update record changes.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this newsletter?")) return;
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/newsletters/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("Failed to delete record.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-8 w-full flex-1">
      <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Newsletter</h1>
            <p className="text-sm text-base-content/60">Modify parameters or shift publication states.</p>
          </div>
          <button onClick={handleDelete} disabled={isProcessing} className="btn btn-error btn-sm text-white">
            Delete Post
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Title</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered w-full" required />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Cover Image URL</span></label>
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} className="input input-bordered w-full" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Publication Lifecycle State</span></label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="select select-bordered w-full">
              <option value="Draft">Draft (Private workspace only)</option>
              <option value="Schedule">Schedule (Pending distribution queues)</option>
              <option value="Sent">Sent (Published openly to Public Feed)</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Content Body</span></label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="textarea textarea-bordered w-full leading-relaxed" required></textarea>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Link href="/dashboard" className="btn btn-ghost">Cancel</Link>
            <button type="submit" disabled={isProcessing} className="btn btn-primary text-white px-6">
              {isProcessing ? "Processing..." : "Apply Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
