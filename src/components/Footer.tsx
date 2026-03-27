import Link from "next/link";
import { motion } from "framer-motion";

interface FooterProps {
  variant?: "full" | "simple";
}

export default function Footer({ variant = "full" }: FooterProps) {
  if (variant === "simple") {
    return (
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="material-icons text-white text-xl">
                  health_and_safety
                </span>
              </div>
              <span className="text-xl font-bold text-white">
                Care<span className="text-teal-400">.io</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm justify-center">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/services"
                className="hover:text-white transition-colors"
              >
                Services
              </Link>
              <Link
                href="/caregivers"
                className="hover:text-white transition-colors"
              >
                Caregivers
              </Link>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
            </div>
            <p className="text-xs text-slate-500">
              © 2024 Care.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-10 sm:mb-12">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="material-icons text-white text-lg">
                  health_and_safety
                </span>
              </div>
              <span className="text-base sm:text-lg md:text-xl font-bold text-white">
                Care.io
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Transforming the way families find trusted, professional care for
              your loved ones across the globe.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
              Services
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
              {[
                "Senior Care",
                "Specialized Nursing",
                "Dementia Care",
                "Child Care",
              ].map((s) => (
                <li key={s}>
                  <Link
                    href="#"
                    className="hover:text-teal-400 transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
              Company
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
              {["About Us", "Careers", "Privacy Policy", "Contact"].map((s) => (
                <li key={s}>
                  <Link
                    href="#"
                    className="hover:text-teal-400 transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-bold text-white mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
              Newsletter
            </h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm min-w-0"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-all text-xs sm:text-sm shrink-0"
              >
                Join
              </motion.button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            © 2026 Care.io Inc. All rights reserved. Providing compassionate
            care nationwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
