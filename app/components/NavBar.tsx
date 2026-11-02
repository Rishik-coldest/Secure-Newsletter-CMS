"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar bg-base-100 shadow-md px-6 border-b border-base-200">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold text-primary tracking-wide">
          Newsletter CMS
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2 items-center">
          <li><Link href="/newsletters" className="font-medium">Public Feed</Link></li>
          
          {session ? (
            <>
              <li><Link href="/dashboard" className="btn btn-ghost btn-sm font-medium">Dashboard</Link></li>
              <span className="text-sm font-semibold px-2 text-base-content/70 bg-base-200 py-1 rounded-md">
                {session.user?.name || session.user?.email}
              </span>
              <li>
                <button 
                  onClick={() => signOut({ callbackUrl: "/login" })} 
                  className="btn btn-error btn-sm text-white font-medium"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link href="/login" className="btn btn-ghost btn-sm font-medium">Login</Link></li>
              <li><Link href="/register" className="btn btn-primary btn-sm text-white font-medium">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
