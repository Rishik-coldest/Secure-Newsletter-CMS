import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-base-200 text-center px-4 py-12">
      <div className="max-w-md bg-base-100 p-8 rounded-2xl shadow-xl border border-base-300">
        <h1 className="text-4xl font-extrabold text-primary mb-4 tracking-tight">
          Secure Newsletter CMS
        </h1>
        <p className="text-base-content/70 mb-8 leading-relaxed">
          Build, draft, schedule, and publish enterprise-grade secure newsletters with robust session protection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn btn-primary text-white px-8">
            Get Started
          </Link>
          <Link href="/newsletters" className="btn btn-outline px-8">
            Read Public Feed
          </Link>
        </div>
      </div>
    </main>
  );
}
