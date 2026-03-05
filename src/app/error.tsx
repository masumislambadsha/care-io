"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-icons text-red-600 text-5xl">error</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-slate-600 mb-8">
          We encountered an unexpected error. Please try again or contact
          support if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-teal-600 hover:text-teal-600 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
