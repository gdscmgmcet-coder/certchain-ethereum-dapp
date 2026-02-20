import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck,
  Globe,
  Zap,
  Lock,
  FileCheck,
  ArrowRight,
  ChevronDown,
  Building2,
  Hash,
  UserCheck,
  Blocks,
  Search,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ══════════════════════════════════════════════════════════ */

/** Staggered container — children appear one by one */
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/** Fade-up child variant */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/** Simple opacity fade */
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

/** Card scale-in with stagger delay */
const scaleCard = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

/* ── Scroll-reveal wrapper — triggers children when in viewport ── */
function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANIMATED BACKGROUND — gradient orbs + grid lines
   Uses CSS animations defined in tailwind.config.js
   ══════════════════════════════════════════════════════════ */
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base void black */}
      <div className="absolute inset-0 bg-void" />

      {/* Subtle animated grid overlay */}
      <div
        className="absolute inset-0 animate-grid-fade"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating gradient orbs — slow pulsing glow */}
      <div className="absolute top-[-15%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-radial from-cyan-500/20 via-cyan-500/5 to-transparent animate-glow-pulse blur-3xl" />
      <div
        className="absolute top-[30%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-radial from-purple-500/20 via-purple-500/5 to-transparent animate-glow-pulse blur-3xl"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-[-10%] left-[30%] w-[450px] h-[450px] rounded-full bg-gradient-radial from-cyan-400/15 via-transparent to-transparent animate-glow-pulse blur-3xl"
        style={{ animationDelay: "4s" }}
      />

      {/* Bottom vignette fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void/80" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FEATURES DATA
   ══════════════════════════════════════════════════════════ */
const features = [
  {
    icon: ShieldCheck,
    title: "Tamper-Proof",
    desc: "Certificates live as cryptographic hashes on Ethereum — impossible to alter or destroy.",
    gradient: "from-cyan-500 to-cyan-400",
  },
  {
    icon: Globe,
    title: "Global Access",
    desc: "Anyone, anywhere in the world, can verify a certificate in seconds with just its ID.",
    gradient: "from-purple-500 to-purple-400",
  },
  {
    icon: Zap,
    title: "Instant Verification",
    desc: "No emails, no waiting. Real-time on-chain lookups confirm authenticity immediately.",
    gradient: "from-cyan-400 to-emerald-400",
  },
  {
    icon: Lock,
    title: "Open Issuance",
    desc: "Any connected wallet can issue certificates — no gatekeepers, fully decentralized.",
    gradient: "from-purple-400 to-pink-400",
  },
  {
    icon: FileCheck,
    title: "Immutable Records",
    desc: "Once written to the blockchain, every certificate creates a permanent, auditable trail.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Hash,
    title: "Hash-Based Integrity",
    desc: "Documents are identified by SHA-256 / IPFS hash, making forgery mathematically impossible.",
    gradient: "from-violet-500 to-purple-500",
  },
];

/* ══════════════════════════════════════════════════════════
   HOW IT WORKS — step data
   ══════════════════════════════════════════════════════════ */
const steps = [
  {
    icon: Building2,
    num: "01",
    title: "User Issues",
    desc: "Any connected wallet uploads the certificate details via the CertChain DApp.",
    accent: "cyan",
  },
  {
    icon: Blocks,
    num: "02",
    title: "Hash Stored On-Chain",
    desc: "A unique, tamper-proof hash is permanently recorded to the Ethereum smart contract.",
    accent: "purple",
  },
  {
    icon: UserCheck,
    num: "03",
    title: "Anyone Verifies",
    desc: "Enter the certificate ID to instantly confirm its authenticity on-chain.",
    accent: "cyan",
  },
];

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function LandingPage({ onNavigate }) {
  const featuresRef = useRef(null);

  const scrollToFeatures = useCallback(
    () => featuresRef.current?.scrollIntoView({ behavior: "smooth" }),
    []
  );

  return (
    <div className="relative min-h-screen font-sans text-white overflow-x-hidden">
      <AnimatedBackground />

      {/* ═══════════════════  HERO  ═══════════════════ */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 pb-24 sm:pt-36 sm:pb-32 min-h-[90vh]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-3xl"
        >
          {/* Ethereum badge */}
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase
                       bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Powered by Ethereum
          </motion.span>

          {/* Headline — shimmer gradient on "Truth" */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            <span className="text-white">Certchain</span>
            <br />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400
                         animate-shimmer bg-[length:200%_auto]"
            >
              Powered by Blockchain
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            CertChain lets institutions issue tamper-proof certificates stored on
            Ethereum. Anyone can verify authenticity in seconds — no
            intermediaries, no paperwork.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary — glowing gradient button */}
            <button
              onClick={() => onNavigate("verify")}
              className="group relative flex items-center gap-2 font-semibold text-sm px-8 py-4 rounded-xl
                         bg-gradient-to-r from-cyan-500 to-purple-600 text-white
                         shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:shadow-[0_0_50px_rgba(6,182,212,0.55)]
                         transition-all duration-300"
            >
              Launch App
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary — glass button */}
            <button
              onClick={() => onNavigate("admin")}
              className="flex items-center gap-2 font-semibold text-sm px-8 py-4 rounded-xl
                         bg-white/5 backdrop-blur-sm border border-white/10 text-slate-300
                         hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              Issue Certificate
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.button
          onClick={scrollToFeatures}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
          aria-label="Scroll to features"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.button>
      </section>

      {/* ═══════════════════  FEATURES  ═══════════════════ */}
      <section ref={featuresRef} className="relative py-24 sm:py-32 px-4 sm:px-6">
        <Reveal className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Why{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                CertChain
              </span>
              ?
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
              Built on Ethereum for maximum security, transparency, and
              accessibility.
            </p>
          </motion.div>

          {/* Feature cards — dark glass with gradient icon */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={scaleCard}
                custom={i}
                whileHover={{
                  y: -8,
                  boxShadow: "0 0 40px rgba(6,182,212,0.15)",
                  transition: { duration: 0.25 },
                }}
                className="group relative rounded-2xl border border-white/[0.06] bg-void-card/80 backdrop-blur-sm p-6
                           hover:border-cyan-500/20 transition-colors duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl
                              bg-gradient-to-br ${f.gradient} mb-5 shadow-lg`}
                >
                  <f.icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-base font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════  HOW IT WORKS  ═══════════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6">
        {/* Faint gradient divider line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        <Reveal className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How It{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Works
              </span>
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
              Three simple steps from issuance to verification — all secured by
              the Ethereum blockchain.
            </p>
          </motion.div>

          {/* Step cards */}
          <div className="relative">
            {/* Desktop connector line — gradient */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-cyan-500/30 -translate-y-1/2 z-0" />

            <div className="grid lg:grid-cols-3 gap-8 relative z-10">
              {steps.map((s, i) => {
                const isCyan = s.accent === "cyan";
                const borderColor = isCyan ? "border-cyan-500/40" : "border-purple-500/40";
                const numBg = isCyan ? "bg-cyan-500" : "bg-purple-500";
                const iconColor = isCyan ? "text-cyan-400" : "text-purple-400";
                const glowColor = isCyan
                  ? "shadow-[0_0_30px_rgba(6,182,212,0.12)]"
                  : "shadow-[0_0_30px_rgba(139,92,246,0.12)]";

                return (
                  <motion.div
                    key={s.num}
                    variants={fadeUp}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className={`relative rounded-2xl border-t-2 ${borderColor} bg-void-card/80 backdrop-blur-sm p-8 ${glowColor}
                                hover:border-t-cyan-400/60 transition-all duration-300`}
                  >
                    {/* Numbered badge */}
                    <span
                      className={`absolute -top-4 left-6 ${numBg} text-white text-xs font-bold
                                  w-8 h-8 flex items-center justify-center rounded-full shadow-lg`}
                    >
                      {s.num}
                    </span>

                    <div className={`${iconColor} mb-4 mt-2`}>
                      <s.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {s.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile flow hint */}
          <div className="mt-10 flex justify-center lg:hidden">
            <span className="text-slate-500 text-xs tracking-widest uppercase">
              Issue → Store → Verify
            </span>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════  QUICK ACCESS PORTAL  ═══════════════════ */}
      <section className="relative py-24 sm:py-28 px-4 sm:px-6">
        <Reveal className="max-w-3xl mx-auto">
          <motion.p
            variants={fadeIn}
            className="text-center text-sm uppercase tracking-[0.25em] text-slate-500 mb-10"
          >
            Quick Access
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* ── Verify Card ── */}
            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.03, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("verify")}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/50 to-cyan-500/0
                         transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
            >
              <div className="relative flex flex-col items-center gap-4 rounded-2xl bg-slate-950 px-6 py-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10
                                ring-1 ring-cyan-500/20 transition-all duration-300
                                group-hover:bg-cyan-500/20 group-hover:ring-cyan-500/40">
                  <Search className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">Verify Certificate</h3>
                  <p className="text-sm text-slate-500">Check authenticity on-chain</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 transition-all duration-300
                                       group-hover:text-cyan-400 group-hover:translate-x-1" />
              </div>
            </motion.button>

            {/* ── Admin Card ── */}
            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.03, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("admin")}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/50 to-purple-500/0
                         transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
            >
              <div className="relative flex flex-col items-center gap-4 rounded-2xl bg-slate-950 px-6 py-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10
                                ring-1 ring-purple-500/20 transition-all duration-300
                                group-hover:bg-purple-500/20 group-hover:ring-purple-500/40">
                  <FileCheck className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">Issue Certificate</h3>
                  <p className="text-sm text-slate-500">Register credentials on-chain</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 transition-all duration-300
                                       group-hover:text-purple-400 group-hover:translate-x-1" />
              </div>
            </motion.button>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════  FOOTER  ═══════════════════ */}
      <footer className="relative border-t border-white/[0.06] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-tight select-none">
            <span className="text-cyan-400">Cert</span>
            <span className="text-purple-400">Chain</span>
          </span>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} CertChain. Decentralized
            Certificate Verification on Ethereum.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <button
              onClick={() => onNavigate("verify")}
              className="hover:text-cyan-400 transition-colors"
            >
              Verify
            </button>
            <button
              onClick={() => onNavigate("admin")}
              className="hover:text-cyan-400 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
