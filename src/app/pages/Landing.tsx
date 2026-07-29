import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from "motion/react";
import { Link } from "react-router";
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  CreditCard,
  Globe,
  Cpu,
  Check,
  ChevronRight,
  Database,
  Coins,
  RefreshCw,
  Terminal,
  Sparkles,
  Lock,
  ChevronDown,
  Copy,
  TrendingUp,
  Users,
  Activity,
  Star
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Animated count-up number, triggers once when scrolled into view
function CountUp({ value, decimals = 0, suffix = "", prefix = "" }: { value: number; decimals?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1400;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}

// Card with a cursor-tracked radial glow, used for the feature bento grid
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform([x, y], ([latestX, latestY]) =>
            `radial-gradient(280px circle at ${latestX}px ${latestY}px, rgba(139,92,246,0.18), transparent 70%)`
          )
        }}
      />
      {children}
    </div>
  );
}

// Mock billing event simulation data
const billingStylesPreview = {
  subscription: {
    title: "Subscription Billing",
    badge: "Recurring Plans",
    description: "Charge customers on a fixed weekly, monthly, or annual cadence. Auto-renew, handle grace periods, and handle dunning out-of-the-box.",
    metricLabel: "MRR Impact",
    metricValue: "₹4,82,500/mo",
    simulateText: "Upgrade customer plan",
    code: `const subscription = await billstack.subscriptions.create({
  customerId: "cust_982",
  planId: "plan_enterprise_gold",
  coupon: "WELCOME50"
});`
  },
  usage: {
    title: "Usage-Based Billing",
    badge: "Pay-As-You-Go",
    description: "Measure usage events in real-time (APIs, compute minutes, terabytes) and aggregate them at the end of the month dynamically.",
    metricLabel: "Events Ingested",
    metricValue: "18,429,102 / sec",
    simulateText: "Ingest 5,000 API events",
    code: `await billstack.events.track({
  customerId: "cust_982",
  eventName: "api_call",
  units: 5000,
  timestamp: Date.now()
});`
  },
  credits: {
    title: "Credits & Wallets",
    badge: "Prepaid Tokens",
    description: "Allow customers to buy tokens/credits upfront. Deduct credits based on complex consumption actions or LLM token usage.",
    metricLabel: "Wallet Balance",
    metricValue: "15,280 Credits",
    simulateText: "Top up wallet (+5k credits)",
    code: `await billstack.wallets.topup({
  customerId: "cust_982",
  credits: 5000,
  reference: "stripe_ch_9381"
});`
  },
  telecom: {
    title: "Data Packs & Validity",
    badge: "Quota-Based Packs",
    description: "Provision resources with custom validity periods and usage caps (e.g. 50GB for 28 days) with automatic fallback rates.",
    metricLabel: "Remaining Quota",
    metricValue: "42.8 GB / 50 GB",
    simulateText: "Add 10GB Data Pack",
    code: `await billstack.packs.provision({
  customerId: "cust_982",
  packId: "pack_data_10gb",
  validityDays: 28
});`
  }
};

export function Landing() {
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof billingStylesPreview>("subscription");
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    subscription: 482500,
    usage: 18429102,
    credits: 15280,
    telecom: 42.8
  });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Mouse-reactive hero glow / parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const tiltX = useTransform(glowY, [0, 1], [8, -8]);
  const tiltY = useTransform(glowX, [0, 1], [-8, 8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll listener to toggle navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-simulate stats to make the dashboard feel "alive"
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedMetrics(prev => ({
        ...prev,
        usage: prev.usage + Math.floor(Math.random() * 150) + 10,
        credits: Math.max(2000, prev.credits - (Math.random() > 0.8 ? 5 : 0))
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);


  const triggerSimulation = () => {
    if (selectedStyle === "subscription") {
      setSimulatedMetrics(prev => ({ ...prev, subscription: prev.subscription + 2900 }));
    } else if (selectedStyle === "usage") {
      setSimulatedMetrics(prev => ({ ...prev, usage: prev.usage + 5000 }));
    } else if (selectedStyle === "credits") {
      setSimulatedMetrics(prev => ({ ...prev, credits: prev.credits + 5000 }));
    } else if (selectedStyle === "telecom") {
      setSimulatedMetrics(prev => ({ ...prev, telecom: Math.min(50, Number((prev.telecom + 10).toFixed(1))) }));
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(billingStylesPreview[selectedStyle].code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formatMetric = (style: keyof typeof billingStylesPreview) => {
    const val = simulatedMetrics[style];
    if (style === "subscription") return `₹${val.toLocaleString()}/mo`;
    if (style === "usage") return `${val.toLocaleString()} events`;
    if (style === "credits") return `${val.toLocaleString()} Credits`;
    if (style === "telecom") return `${val} GB / 50 GB`;
    return String(val);
  };

  const faqs = [
    {
      q: "Can I combine subscription and usage-based billing?",
      a: "Yes! BillStack fully supports hybrid models. You can charge a base subscription price of ₹2,999/month and add metered usage components (e.g. ₹0.05 per API call) on top of it."
    },
    {
      q: "How does the multi-tenant isolation work?",
      a: "Every tenant is fully isolated logically. Database schemas and cached data partitions are segmented to guarantee high performance, security, and strict data compliance."
    },
    {
      q: "What payment gateways do you support?",
      a: "We support Stripe, Razorpay, Paddle, and Adyen out-of-the-box. You can configure multiple gateways at once for localized payment routes."
    },
    {
      q: "Is there a sandbox environment for developer testing?",
      a: "Absolutely. Every account gets a Sandbox environment (with test API keys) and a Production environment. You can toggle between them seamlessly."
    }
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-foreground selection:bg-primary selection:text-white overflow-hidden relative font-sans">

      {/* Visual background decorations - glowing mesh elements, drifting + mouse-reactive */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/15 blur-[120px] pointer-events-none"
        style={{ x: useTransform(glowX, [0, 1], [-40, 40]), y: useTransform(glowY, [0, 1], [-40, 40]) }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-500/15 blur-[130px] pointer-events-none"
        style={{ x: useTransform(glowX, [0, 1], [30, -30]), y: useTransform(glowY, [0, 1], [30, -30]) }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none"
        style={{ x: useTransform(glowX, [0, 1], [-20, 20]), y: useTransform(glowY, [0, 1], [20, -20]) }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Dynamic Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-[#060608]/85 backdrop-blur-md border-b border-white/[0.06] py-0"
          : "bg-transparent border-b border-transparent py-2"
        }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl tracking-tighter">B</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none">BillStack</span>
              <span className="text-[10px] text-primary font-semibold tracking-widest uppercase">Infrastructure</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground"
          >
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#simulator" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#faqs" className="hover:text-white transition-colors">FAQ</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <Link to="/tenant" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              Tenant Portal
            </Link>
            <Link to="/super-admin">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-semibold shadow-md transition-all duration-300"
              >
                Super Admin
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs font-semibold text-primary mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>Introducing BillStack 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.05] mb-8"
          >
            SaaS Billing that feels like{" "}
            <span className="bg-gradient-to-r from-primary via-violet-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              Magic.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12 font-light"
          >
            The modular revenue API that supports multi-tenant isolation, real-time usage event ingestion,
            automated telecom data packs, credits wallets, and hybrid subscription plans.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <Link to="/tenant" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group transition-all"
              >
                <span>Access Tenant Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/super-admin" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white/[0.02] border border-white/[0.08] hover:border-white/20 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Access Super Admin</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Floating dashboard mockup - tilts with cursor position */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
            className="relative w-full max-w-4xl mt-4"
          >
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-cyan-500/10 to-violet-600/20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative bg-[#0a0a0f]/90 border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-sm">
              <div className="px-5 py-3.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-muted-foreground font-mono ml-3">app.billstack.dev/dashboard</span>
              </div>
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "MRR", value: "₹18.4L", trend: "+12.4%", icon: TrendingUp, color: "text-emerald-400" },
                  { label: "Active Tenants", value: "1,284", trend: "+38", icon: Users, color: "text-cyan-400" },
                  { label: "Events / sec", value: "42,918", trend: "live", icon: Activity, color: "text-primary" }
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{stat.label}</span>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{stat.value}</span>
                    <span className={`text-xs font-semibold ${stat.color}`}>{stat.trend}</span>
                  </div>
                ))}
                <div className="md:col-span-3 h-28 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-end gap-1.5 px-4 pb-4 pt-6 overflow-hidden">
                  {[40, 55, 48, 62, 58, 72, 65, 80, 74, 88, 82, 95, 90, 100, 96].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.03 }}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/40 to-cyan-400/70"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust / stats strip */}
      <section className="py-14 px-6 relative z-10 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 42, decimals: 0, suffix: "M+", label: "Events ingested / day" },
            { value: 99.99, decimals: 2, suffix: "%", label: "Platform uptime" },
            { value: 1200, decimals: 0, suffix: "+", label: "Tenants onboarded" },
            { value: 18.4, decimals: 1, prefix: "₹", suffix: "L", label: "Avg. MRR tracked" }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl md:text-4xl font-black text-white tracking-tight">
                <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} prefix={stat.prefix} />
              </span>
              <span className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Logo marquee - "works with" strip */}
      <section className="py-10 px-6 relative z-10 overflow-hidden">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6">
          Integrates with the tools you already use
        </p>
        <div className="relative max-w-6xl mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex items-center gap-16 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(2)].map((_, dupeIdx) => (
              <div key={dupeIdx} className="flex items-center gap-16">
                {["Stripe", "Razorpay", "Paddle", "Adyen", "AWS", "Twilio", "Segment", "Slack"].map((name) => (
                  <span key={name} className="text-xl font-bold text-white/25 hover:text-white/50 transition-colors whitespace-nowrap">
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Real-time Interactive Simulator Section */}
      <section id="simulator" className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Choose Your Billing Architecture</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Click through our natively integrated billing styles and run events in the console to watch metrics change live.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left selector menu */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              {(Object.keys(billingStylesPreview) as Array<keyof typeof billingStylesPreview>).map((key) => {
                const isSelected = selectedStyle === key;
                return (
                  <motion.button
                    key={key}
                    whileHover={{ x: 6 }}
                    onClick={() => {
                      setSelectedStyle(key);
                      setCopiedCode(false);
                    }}
                    className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-1 relative overflow-hidden ${isSelected
                      ? "bg-gradient-to-br from-primary/10 to-violet-500/5 border-primary/30 shadow-xl shadow-primary/5"
                      : "bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.04] hover:border-white/[0.1]"
                      }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeGlow"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-cyan-400"
                      />
                    )}
                    <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                      {billingStylesPreview[key].badge}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {billingStylesPreview[key].title}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Right side interactive console and mock dashboard */}
            <div className="lg:col-span-8 bg-[#0a0a0f] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-muted-foreground font-mono ml-3">billstack-sandbox-console</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  Live Simulator
                </div>
              </div>

              {/* Console & Preview Body */}
              <div className="p-6 md:p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Code Window */}
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono">
                      <Terminal className="w-4 h-4 text-primary" />
                      <span>Node.js / SDK Method</span>
                    </div>
                    <div className="relative bg-black/60 rounded-xl p-4 border border-white/[0.04] font-mono text-xs text-violet-300 leading-relaxed overflow-x-auto min-h-[140px] flex items-center">
                      <pre className="w-full"><code>{billingStylesPreview[selectedStyle].code}</code></pre>
                      <button
                        onClick={copyCodeToClipboard}
                        className="absolute top-2 right-2 p-1.5 rounded bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={triggerSimulation}
                      className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold text-sm shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-2 group"
                    >
                      <RefreshCw className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                      <span>{billingStylesPreview[selectedStyle].simulateText}</span>
                    </motion.button>
                  </div>
                </div>

                {/* Dashboard Metrics Window */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 flex flex-col gap-6 h-full justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      {billingStylesPreview[selectedStyle].title}
                    </h4>
                    <p className="text-xs text-muted-foreground italic font-light">
                      {billingStylesPreview[selectedStyle].description}
                    </p>
                  </div>

                  <div className="p-4 bg-black/40 rounded-xl border border-white/[0.04]">
                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                      {billingStylesPreview[selectedStyle].metricLabel}
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-white tracking-tight tabular-nums">
                      {formatMetric(selectedStyle)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Real-time billing state verified</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Core Strengths */}
      <section id="features" className="py-24 px-6 relative z-10 border-t border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Engineered for High-Growth SaaS</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to capture, configure, and scale your revenue operations dynamically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Strict Multi-Tenancy",
                description: "Complete logical and operational tenant isolation designed for secure, distributed cloud environments.",
                color: "from-blue-500/20 to-indigo-500/10"
              },
              {
                icon: Zap,
                title: "Sub-millisecond Ingestion",
                description: "Send usage events at scale without throttling. Built to handle million-event payloads concurrently.",
                color: "from-amber-500/20 to-orange-500/10"
              },
              {
                icon: BarChart3,
                title: "Live Analytics & MRR",
                description: "Deep analytics tracking active subscriptions, churn metrics, and revenue collections instantly.",
                color: "from-emerald-500/20 to-teal-500/10"
              },
              {
                icon: Coins,
                title: "Credits & Token Wallets",
                description: "Let customers prepay or top up wallets. Automatically deduct tokens as consumption occurs.",
                color: "from-purple-500/20 to-violet-500/10"
              },
              {
                icon: Globe,
                title: "Unified Webhooks",
                description: "Receive webhooks for payment renewals, cancellations, failures, and limit thresholds.",
                color: "from-cyan-500/20 to-sky-500/10"
              },
              {
                icon: Lock,
                title: "Enterprise Compliance",
                description: "Complete audit logs, role-based access controls, and infrastructure backup triggers built-in.",
                color: "from-rose-500/20 to-red-500/10"
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              const isFeatured = idx === 0;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className={`group ${isFeatured ? "md:col-span-2" : ""}`}
                >
                  <SpotlightCard className="h-full p-8 bg-[#09090c] border border-white/[0.05] rounded-3xl hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center relative z-10`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white relative z-10">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light relative z-10">{feature.description}</p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials / social proof */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Loved by revenue teams</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Engineering and finance teams trust BillStack to keep billing accurate at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "We swapped three billing scripts and a cron job for BillStack's usage API. Migrated our entire metered pricing in a week.",
                name: "Ananya Rao",
                role: "CTO, Loopwave",
              },
              {
                quote: "The multi-tenant isolation is genuinely airtight. Our compliance audit took a fraction of the time it used to.",
                name: "Marcus Idris",
                role: "VP Engineering, Fenwick Cloud",
              },
              {
                quote: "Credits and wallets shipped in a single sprint. Our LLM product now bills per token without any custom ledger code.",
                name: "Priya Nambiar",
                role: "Founder, Sparrow AI",
              }
            ].map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-7 bg-white/[0.02] border border-white/[0.06] rounded-3xl flex flex-col gap-5"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-white/90 leading-relaxed font-light">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/[0.05]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{t.name}</span>
                    <span className="text-xs text-muted-foreground">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faqs" className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to clear up the basics.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white/[0.01] border border-white/[0.05] rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-bold text-white">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-5 pt-1 text-sm text-muted-foreground font-light leading-relaxed border-t border-white/[0.03]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <section className="py-28 px-6 border-t border-white/[0.04] bg-gradient-to-b from-transparent to-[#09090c] relative z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-primary/15 blur-[140px] pointer-events-none"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Deploy revenue infrastructure in minutes.
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl font-light leading-relaxed">
            Stop coding subscription logic, credit limits, and usage webhooks from scratch. Build on a robust foundation.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link to="/tenant" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30"
              >
                Access Tenant Portal
              </motion.button>
            </Link>
            <Link to="/super-admin" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 text-white font-semibold rounded-xl"
              >
                Access Super Admin
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footnote */}
      <footer className="py-12 border-t border-white/[0.04] text-center text-xs text-muted-foreground relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white text-xs font-black">B</span>
            </div>
            <span className="font-bold text-white">BillStack</span>
          </div>
          <p>© {new Date().getFullYear()} BillStack. All rights reserved. Platform infrastructure is sandbox-verified.</p>
        </div>
      </footer>

    </div>
  );
}