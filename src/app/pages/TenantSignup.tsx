import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Check, CreditCard, Zap, Coins, Layers } from "lucide-react";

const steps = ["Company Info", "Business Type", "Monetization", "Review"];

const businessTypes = [
  { value: "saas", label: "SaaS Platform", description: "Software as a service" },
  { value: "marketplace", label: "Marketplace", description: "Multi-sided platform" },
  { value: "api", label: "API Service", description: "API-first business" },
  { value: "telecom", label: "Telecom", description: "Communication services" },
];

const monetizationTypes = [
  {
    value: "subscription",
    label: "Subscription",
    description: "Recurring billing like Netflix",
    icon: CreditCard,
  },
  { value: "usage", label: "Usage-based", description: "Pay per API call or resource", icon: Zap },
  { value: "credits", label: "Credits", description: "Prepaid credit system", icon: Coins },
  { value: "hybrid", label: "Hybrid", description: "Mix of subscription + usage", icon: Layers },
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <Link to="/">
            <motion.button
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to home</span>
            </motion.button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-8"
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-semibold">BillStack</span>
          </div>

          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: index === currentStep ? 1.1 : 1,
                        backgroundColor:
                          index <= currentStep
                            ? "rgb(139, 92, 246)"
                            : "rgba(255, 255, 255, 0.1)",
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index <= currentStep ? "text-white" : "text-muted-foreground"
                      }`}
                    >
                      {index < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="font-medium">{index + 1}</span>
                      )}
                    </motion.div>
                    <span
                      className={`text-xs mt-2 ${
                        index <= currentStep ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-border mx-2">
                      <motion.div
                        initial={false}
                        animate={{ width: index < currentStep ? "100%" : "0%" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Company Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Tell us about your company to get started
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-foreground">Company Name</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      placeholder="Acme Inc."
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://company.com"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Business Type</h2>
                  <p className="text-sm text-muted-foreground">
                    Select the category that best describes your business
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {businessTypes.map((type) => (
                    <motion.button
                      key={type.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, businessType: type.value })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.businessType === type.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="font-medium mb-1">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Monetization Type</h2>
                  <p className="text-sm text-muted-foreground">
                    How do you plan to charge your customers?
                  </p>
                </div>

                <div className="space-y-3">
                  {monetizationTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <motion.button
                        key={type.value}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setFormData({ ...formData, monetizationType: type.value })
                        }
                        className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 text-left transition-all ${
                          formData.monetizationType === type.value
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            formData.monetizationType === type.value
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Review & Submit</h2>
                  <p className="text-sm text-muted-foreground">
                    Please review your information before submitting
                  </p>
                </div>

                <div className="space-y-4 p-6 bg-input-background rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Company Name</div>
                    <div className="font-medium">{formData.companyName || "—"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <div className="font-medium">{formData.email || "—"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Website</div>
                    <div className="font-medium">{formData.website || "—"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Business Type</div>
                    <div className="font-medium">
                      {businessTypes.find((t) => t.value === formData.businessType)?.label || "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Monetization Type</div>
                    <div className="font-medium">
                      {monetizationTypes.find((t) => t.value === formData.monetizationType)
                        ?.label || "—"}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    Your application will be reviewed by our team. You'll receive an email within 24
                    hours.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2.5 border border-border rounded-lg text-foreground font-medium hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </motion.button>

            {currentStep < steps.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30"
              >
                Submit Application
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
