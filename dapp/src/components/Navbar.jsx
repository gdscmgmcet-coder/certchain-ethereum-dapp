import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ───── Truncate address helper ───── */
const truncate = (addr) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

/* ───── Network name from chain ID ───── */
const networkName = (id) => {
  if (id === 1337) return "Ganache";
  if (id === 11155111) return "Sepolia";
  if (id === 31337) return "Localhost";
  return `Chain ${id}`;
};

export default function Navbar({ account, chainId, onConnect, activeTab, onTabChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        {/* ── Logo — click to go home ── */}
        <button
          onClick={() => onTabChange("landing")}
          className="text-xl font-bold tracking-tight select-none"
        >
          <span className="text-cyan-400">Cert</span><span className="text-purple-400">Chain</span>
        </button>

        {/* ── Nav Links (Desktop) ── */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => onTabChange("landing")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "landing"
                ? "bg-white/10 text-cyan-400"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onTabChange("verify")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "verify"
                ? "bg-white/10 text-cyan-400"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Verify
          </button>
          <button
            onClick={() => onTabChange("admin")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "admin"
                ? "bg-white/10 text-cyan-400"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Issue Certificate
          </button>
        </div>

        {/* ── Desktop wallet badge ── */}
        <div className="hidden sm:flex items-center gap-3">
          {account ? (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm">
              {/* pulse dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-slate-400 font-medium">
                {networkName(chainId)}
              </span>
              <span className="text-white font-mono text-xs">
                {truncate(account)}
              </span>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="sm:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden border-t border-white/[0.06] bg-slate-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {/* ── Mobile Nav Links ── */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { onTabChange("landing"); setMenuOpen(false); }}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === "landing"
                      ? "bg-white/10 text-cyan-400"
                      : "text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => { onTabChange("verify"); setMenuOpen(false); }}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === "verify"
                      ? "bg-white/10 text-cyan-400"
                      : "text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  Verify
                </button>
                <button
                  onClick={() => { onTabChange("admin"); setMenuOpen(false); }}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === "admin"
                      ? "bg-white/10 text-cyan-400"
                      : "text-slate-400 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  Issue Certificate
                </button>
              </div>

              {account ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                  <span className="text-slate-400 font-medium">
                    {networkName(chainId)}
                  </span>
                  <span className="text-white font-mono text-xs">
                    {truncate(account)}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onConnect();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
