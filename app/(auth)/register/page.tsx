"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Linked tracking state variable
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Immediate client-side validation shortcut check
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }), // Sent down to background payload parameters
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setIsSubmitting(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center justify-center mb-4">
            Create Account
          </h2>

          {error && (
            <div className="alert alert-error text-sm rounded-md py-2 text-white">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success text-sm rounded-md py-2 text-white">
              <span>Account created successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jo Blog"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} // Binds the text modifications back to your React state
                placeholder="******"
                className="input input-bordered w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full mt-4 text-white"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
