import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Check, CreditCard, Zap, Coins, Layers, Sparkles, Server, CheckCircle2 } from "lucide-react";

const steps = ["Company Info", "Business Type", "Monetization", "Review"];

const businessTypes = [
  { value: "saas", label: "SaaS Platform", description: "Software as a service business models." },
  { value: "marketplace", label: "Marketplace", description: "Multi-sided platform operations." },
  { value: "api", label: "API Service", description: "API-first developer tools." },
  { value: "telecom", label: "Telecom", description: "Communication and data resources." },
];

const monetizationTypes = [
  {
    value: "subscription",
    label: "Subscription",
    description: "Recurring plans like Netflix or SaaS base rates.",
    icon: CreditCard,
    color: "from-primary/20 to-primary/5 border-primary/30"
  },
  { 
    value: "usage", 
    label: "Usage-based", 
    description: "Metered pay-as-you-go per API call or resource.", 
    icon: Zap,
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/30" 
  },
  { 
    value: "credits", 
    label: "Credits Wallet", 
    description: "Prepaid credit/token system for virtual consumption.", 
    icon: Coins,
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30" 
  },
  { 
    value: "hybrid", 
    label: "Hybrid Engine", 
    description: "Mix of subscription base rates + metered usage.", 
    icon: Layers,
    color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30" 
  },
];

export function TenantSignup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    website: "",
    businessType: "",
    monetizationType: "",
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = () => {
    navigate("/tenant");
  };

  return (
    <div className="min-h-screen bg-[#060608] text-foreground selection:bg-primary selection:text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[45%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10">
        <div className="mb-6">
          <Link to="/">
            <motion.button
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-white text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-white/[0.06] rounded-3xl p-8 shadow-2xl relative"
        >
          {/* Branded Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">B</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">BillStack Onboarding</span>
          </div>

          {/* Wizard Stepper */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center flex-1 last:flex-initial">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      animate={{
                        scale: index === currentStep ? 1.15 : 1,
                        backgroundColor: index <= currentStep ? "#8B5CF6" : "rgba(255, 255, 255, 0.03)",
                        borderColor: index <= currentStep ? "#8B5CF6" : "rgba(255, 255, 255, 0.08)"
                      }}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold ${
                        index <= currentStep ? "text-white shadow-lg shadow-primary/30" : "text-muted-foreground"
                      }`}
                    >
                      {index < currentStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </motion.div>
                    <span
                      className={`text-[10px] font-bold mt-2 tracking-wide uppercase ${
                        index <= currentStep ? "text-white" : "text-muted-foreground"
                      }`}
                    >
                      {step.split(' ')[0]}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-white/[0.04] mx-2 relative">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: index < currentStep ? "100%" : "0%" }}
                        className="absolute inset-0 bg-primary"
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Step Contents */}
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-extrabold text-white mb-1.5">Company Information</h2>
                  <p className="text-xs text-muted-foreground font-light">Tell us about your company to bootstrap isolated DB clusters.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Company Name</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Acme Enterprise Inc."
                      className="w-full px-4 py-3 bg-white/5 border border-white/[0.06] rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Contact Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="billing@acme.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/[0.06] rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Website URL</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://acme.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/[0.06] rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-extrabold text-white mb-1.5">Business Type</h2>
                  <p className="text-xs text-muted-foreground font-light">Select the category that matches your SaaS delivery model.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {businessTypes.map((type) => {
                    const isSelected = formData.businessType === type.value;
                    return (
                      <motion.button
                        key={type.value}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, businessType: type.value })}
                        className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col gap-1 ${
                          isSelected
                            ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5"
                            : "bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.05] hover:border-white/[0.12]"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-primary">
                            <CheckCircle2 className="w-4 h-4 fill-primary text-white" />
                          </div>
                        )}
                        <span className="font-bold text-white text-sm">{type.label}</span>
                        <span className="text-xs text-muted-foreground font-light">{type.description}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-extrabold text-white mb-1.5">Primary Monetization Type</h2>
                  <p className="text-xs text-muted-foreground font-light">Choose your primary logic setup. You can combine models later.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {monetizationTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.monetizationType === type.value;
                    return (
                      <motion.button
                        key={type.value}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, monetizationType: type.value })}
                        className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col gap-3 ${
                          isSelected
                            ? `bg-primary/10 border-primary/40 shadow-lg shadow-primary/5`
                            : "bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.05] hover:border-white/[0.1]"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white/5`}>
                          <Icon className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block mb-0.5">{type.label}</span>
                          <span className="text-xs text-muted-foreground font-light leading-relaxed block">{type.description}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-primary">
                            <CheckCircle2 className="w-4 h-4 fill-primary text-white" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-extrabold text-white mb-1.5">Review Configuration</h2>
                  <p className="text-xs text-muted-foreground font-light">Please verify details before database isolation setup.</p>
                </div>

                <div className="space-y-4 p-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl text-xs font-semibold">
                  <div className="flex items-center justify-between border-b border-white/[0.02] pb-2">
                    <span className="text-muted-foreground font-light">Company Name</span>
                    <span className="text-white font-bold">{formData.companyName || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.02] pb-2">
                    <span className="text-muted-foreground font-light">Contact Email</span>
                    <span className="text-white font-bold font-mono">{formData.email || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.02] pb-2">
                    <span className="text-muted-foreground font-light">Website URL</span>
                    <span className="text-white font-bold font-mono">{formData.website || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.02] pb-2">
                    <span className="text-muted-foreground font-light">SaaS Business Type</span>
                    <span className="text-white font-bold">
                      {businessTypes.find((t) => t.value === formData.businessType)?.label || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-light">Billing Engine Model</span>
                    <span className="text-white font-bold">
                      {monetizationTypes.find((t) => t.value === formData.monetizationType)?.label || "—"}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex gap-3 items-center">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-light">
                    Isolated database shards will immediately provision. You can configure sandbox keys from the workspace API dashboard.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.04]">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-5 py-2.5 border border-white/[0.08] hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl text-white text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </motion.button>

            {currentStep < steps.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={nextStep}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-violet-600 hover:from-primary-dark hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/25"
              >
                Deploy Platform Instance
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
