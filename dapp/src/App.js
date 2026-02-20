import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import AdminPanel from "./components/AdminPanel";
import VerifyPanel from "./components/VerifyPanel";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN_ID, NETWORK_NAME } from "./contract";

import "./App.css";

/* ───── Network constants ───── */
const EXPECTED_CHAIN_ID = CHAIN_ID || 1337;
const EXPECTED_NETWORK = NETWORK_NAME || "Ganache";
const EXPECTED_CHAIN_HEX = "0x" + EXPECTED_CHAIN_ID.toString(16);

/* ───── Dark toaster style (shared) ───── */
const TOAST_STYLE = {
  borderRadius: "12px",
  background: "#1E293B",
  color: "#F1F5F9",
  fontSize: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
};

function App() {
  /* ────── View / navigation state ────── */
  const [view, setView] = useState("landing"); // "landing" | "verify" | "admin"

  /* ────── Wallet & contract state ────── */
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletError, setWalletError] = useState(null);

  /* ═══════════ NETWORK CHECK ═══════════ */
  const checkNetwork = useCallback(async (prov) => {
    const network = await prov.getNetwork();
    const cId = Number(network.chainId);
    setChainId(cId);
    if (cId !== EXPECTED_CHAIN_ID) {
      setWalletError(
        `Access Denied: Please switch MetaMask to ${EXPECTED_NETWORK} (Chain ID ${EXPECTED_CHAIN_ID}).`
      );
      return false;
    }
    setWalletError(null);
    return true;
  }, []);

  /* ═══════════ CONNECT WALLET ═══════════ */
 const connectWallet = useCallback(async () => {
  if (!window.ethereum) {
    setWalletError("MetaMask not found.");
    return;
  }

  try {
    const prov = new ethers.BrowserProvider(window.ethereum);
    const isNetworkValid = await checkNetwork(prov);
    if (!isNetworkValid) return;

    await prov.send("eth_requestAccounts", []);
    const sig = await prov.getSigner();
    const addr = await sig.getAddress();

    const cert = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      sig
    );

    setSigner(sig);
    setAccount(addr);
    setContract(cert);
  } catch (err) {
    console.error(err);
  }
}, [checkNetwork]);

  /* ═══════════ METAMASK EVENT LISTENERS ═══════════ */
  useEffect(() => {
    if (!window.ethereum) return;

    const onAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setSigner(null);
        setContract(null);
        toast("Wallet disconnected", { icon: "👋" });
      } else {
        connectWallet();
      }
    };

    const onChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener("chainChanged", onChainChanged);
    };
  }, [connectWallet]);

  /* ═══════════ AUTO-CONNECT (if previously connected) ═══════════ */
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accs) => { if (accs.length > 0) connectWallet(); })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ═══════════ NAVIGATION HANDLER ═══════════ */
  const handleNavigate = useCallback((route) => {
    setView(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ═══════════ NOT-CONNECTED OVERLAY ═══════════ */
  const NotConnectedOverlay = () => (
    <div className="absolute inset-0 z-10 backdrop-blur-sm bg-slate-950/60 rounded-2xl flex items-center justify-center">
      <p className="text-slate-400 font-medium text-sm text-center px-4">
        Please connect your wallet to interact.
      </p>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* ── Global dark toaster ── */}
      <Toaster
        position="top-right"
        toastOptions={{ duration: 4000, style: TOAST_STYLE }}
      />

      {/* ── Navbar — always visible ── */}
      <Navbar
        account={account}
        chainId={chainId}
        onConnect={connectWallet}
        activeTab={view}
        onTabChange={handleNavigate}
      />

      {/* ── Wrong-network blocking overlay ── */}
      <AnimatePresence>
        {walletError && walletError.startsWith("Access Denied") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg max-w-md w-full p-8 text-center"
            >
              <div className="text-4xl mb-4">🔒</div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Wrong Network Detected
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Please switch MetaMask to{" "}
                <span className="font-semibold text-cyan-400">{EXPECTED_NETWORK}</span>{" "}
                (Chain ID {EXPECTED_CHAIN_ID}) to use CertChain.
              </p>
              <button
                onClick={async () => {
                  try {
                    await window.ethereum.request({
                      method: "wallet_switchEthereumChain",
                      params: [{ chainId: EXPECTED_CHAIN_HEX }],
                    });
                  } catch (err) {
                    toast.error("Failed to switch network.");
                  }
                }}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]
                           text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all duration-300"
              >
                Switch to {EXPECTED_NETWORK}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <AnimatePresence mode="wait">
        {/* ── Landing ── */}
        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onNavigate={handleNavigate} />
          </motion.div>
        )}

        {/* ── Verify ── */}
        {view === "verify" && (
          <motion.main
            key="verify"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
          >
            {/* Inline wallet warning */}
            {walletError && !walletError.startsWith("Access Denied") && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-white/5 border border-red-500/30 rounded-2xl text-sm">
                <span className="text-red-400 text-lg">⚠️</span>
                <span className="text-white font-medium">{walletError}</span>
              </div>
            )}

            <div className="relative">
              {!account && <NotConnectedOverlay />}
              <VerifyPanel contract={contract} />
            </div>

            <footer className="mt-12 pt-6 border-t border-white/[0.06] text-center">
              <p className="text-xs text-slate-500">
                CertChain — Decentralized Certificate Verification on {EXPECTED_NETWORK}
              </p>
            </footer>
          </motion.main>
        )}

        {/* ── Admin ── */}
        {view === "admin" && (
          <motion.main
            key="admin"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
          >
            {/* Inline wallet warning */}
            {walletError && !walletError.startsWith("Access Denied") && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-white/5 border border-red-500/30 rounded-2xl text-sm">
                <span className="text-red-400 text-lg">⚠️</span>
                <span className="text-white font-medium">{walletError}</span>
              </div>
            )}

            <div className="relative">
              {!account && <NotConnectedOverlay />}
              <AdminPanel contract={contract} signer={signer} />
            </div>

            <footer className="mt-12 pt-6 border-t border-white/[0.06] text-center">
              <p className="text-xs text-slate-500">
                CertChain — Decentralized Certificate Verification on {EXPECTED_NETWORK}
              </p>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
