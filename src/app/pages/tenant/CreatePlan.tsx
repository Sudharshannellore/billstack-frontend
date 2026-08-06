import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Sparkles,
  Zap,
  Package,
  Check,
  CreditCard,
  Coins,
  ListChecks,
  Plus,
  X,
} from "lucide-react";
import { BillingStyle, BillingStyleSelector } from "../../components/billing/BillingStyleSelector";
import { MOCK_PRODUCTS } from "../../data/mock-plans";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { cn } from "../../components/ui/utils";
import { getCardTheme } from "../../components/cardThemes";
import { getCurrencySymbol } from "../../components/currency";

const STEPS = ["Product", "Billing Style", "Payment Type", "Configuration"];

const PAYMENT_TYPES = [
  { id: "prepaid", label: "Prepaid", description: "Pay upfront before usage", icon: Coins },
  { id: "postpaid", label: "Postpaid", description: "Pay at the end of billing cycle", icon: CreditCard },
];

const INITIAL_FORM_VALUES = {
  productId: "",
  productName: "",
  productCurrency: "INR",
  billingStyle: null as BillingStyle | null,
  paymentType: "",
  name: "",
  price: "",
  billingCycle: "monthly",
  dataLimit: "",
  validity: "",
  totalCredits: "",
  unitName: "",
  pricePerUnit: "",
  features: "",
};

// Mock "current live price" used to compute the proration preview when editing an existing plan.
const MOCK_EXISTING_PRICE = 79;
// Demo assumption: we are on day 12 of a 30-day billing cycle.
const MOCK_CYCLE_DAY = 12;
const MOCK_CYCLE_LENGTH = 30;

interface CreatePlanProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function CreatePlan({ onSuccess, onCancel, isEditing = false }: CreatePlanProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prorationAmount = (() => {
    const newPrice = parseFloat(formValues.price);
    if (isNaN(newPrice)) return null;
    const remainingDays = MOCK_CYCLE_LENGTH - MOCK_CYCLE_DAY;
    const amount = ((newPrice - MOCK_EXISTING_PRICE) * remainingDays) / MOCK_CYCLE_LENGTH;
    return amount;
  })();

  const prorationTheme = getCardTheme(
    prorationAmount !== null && prorationAmount < 0 ? "proration-credit" : "proration-charge"
  );

  const currencySymbol = getCurrencySymbol(formValues.productCurrency);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const featureList = formValues.features
    .split(/[,\n]/)
    .map((f) => f.trim())
    .filter(Boolean);

  const [featureInput, setFeatureInput] = useState("");

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed || featureList.includes(trimmed)) return;
    setFormValues(prev => ({ ...prev, features: [...featureList, trimmed].join("\n") }));
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setFormValues(prev => ({ ...prev, features: featureList.filter((_, i) => i !== index).join("\n") }));
  };

  const handleFeatureInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addFeature();
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const config: Record<string, any> = {};
    if (formValues.billingStyle === "subscription") {
      config.price = formValues.price;
      config.billing_cycle = formValues.billingCycle;
    } else if (formValues.billingStyle === "telecom") {
      config.data_limit = formValues.dataLimit;
      config.validity_days = formValues.validity;
      config.price = formValues.price;
    } else if (formValues.billingStyle === "credits") {
      config.total_credits = formValues.totalCredits;
      config.price = formValues.price;
    } else if (formValues.billingStyle === "usage") {
      config.unit_name = formValues.unitName;
      config.price_per_unit = formValues.pricePerUnit;
    }

    const payload = {
      product_id: formValues.productId,
      payment_type: formValues.paymentType,
      name: formValues.name,
      billing_style: formValues.billingStyle,
      config: config,
      features: featureList,
    };

    console.log("Submitting payload:", payload);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/tenant/plans");
      }
    }, 1000);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/tenant/plans");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return !!formValues.productId;
      case 1: return !!formValues.billingStyle;
      case 2: return !!formValues.paymentType;
      case 3:
        if (!formValues.name) return false;
        switch (formValues.billingStyle) {
          case "subscription": return !!formValues.price && !!formValues.billingCycle;
          case "telecom": return !!formValues.dataLimit && !!formValues.validity && !!formValues.price;
          case "credits": return !!formValues.totalCredits && !!formValues.price;
          case "usage": return !!formValues.unitName && !!formValues.pricePerUnit;
          default: return false;
        }
      default: return false;
    }
  };

  const getHelperText = () => {
    switch (formValues.billingStyle) {
      case "subscription": return "Ideal for SaaS or content platforms with repeating fees.";
      case "telecom": return "Best for mobile data, internet packs, or resource access.";
      case "credits": return "Perfect for AI tokens, API credits, or virtual wallets.";
      case "usage": return "Common for infra APIs, messaging, or resource consumption.";
      default: return "Select a style to continue.";
    }
  };

  return (
    <div className={cn("mx-auto space-y-8 pb-10", !onSuccess && "max-w-6xl")}>
      {/* Header - Only show if not in Dialog */}
      {!onSuccess && (
        <div className="flex flex-col gap-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Plans</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Create New Plan
              </h1>
              <p className="text-muted-foreground text-lg italic">
                Configure your pricing roadmap in {STEPS.length} easy steps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4 px-2">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center group">
              <motion.div
                initial={false}
                animate={{
                  scale: index === currentStep ? 1.1 : 1,
                  backgroundColor: index <= currentStep ? "var(--primary)" : "var(--muted)",
                  boxShadow: index === currentStep ? "0 0 20px rgba(var(--primary-rgb), 0.3)" : "none",
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  index <= currentStep ? "text-white" : "text-muted-foreground"
                )}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : <span className="font-bold">{index + 1}</span>}
              </motion.div>
              <span className={cn(
                "text-[10px] mt-3 font-semibold uppercase tracking-wider transition-colors hidden sm:block",
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}>
                {step}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 sm:mx-4 self-center mt-[-16px] sm:mt-[-20px] bg-muted overflow-hidden">
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

      <div className="max-w-4xl mx-auto space-y-8 min-h-[auto] sm:min-h-[500px] px-4 sm:px-0 pb-20 sm:pb-0">
        {/* Main Content Area */}
        <div>
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Select Your Product</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_PRODUCTS.map((prod) => {
                    const isSelected = formValues.productId === prod.id;
                    return (
                      <motion.div
                        key={prod.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormValues(prev => ({
                          ...prev,
                          productId: prod.id,
                          productName: prod.name,
                          productCurrency: prod.currency ?? "INR"
                        }))}
                        className={cn(
                          "p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-5",
                          isSelected ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-border bg-card hover:border-primary/40"
                        )}
                      >
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{prod.name}</div>
                        </div>
                        {isSelected && <Check className="ml-auto w-6 h-6 text-primary" />}
                      </motion.div>
                    );
                  })}
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Select Billing Style</h2>
                </div>

                <BillingStyleSelector
                  value={formValues.billingStyle}
                  onChange={(val) => setFormValues(prev => ({ ...prev, billingStyle: val }))}
                />
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Payment Settlement</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {PAYMENT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formValues.paymentType === type.id;
                    return (
                      <motion.div
                        key={type.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormValues(prev => ({ ...prev, paymentType: type.id }))}
                        className={cn(
                          "p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 flex flex-col gap-4 text-center items-center shadow-sm",
                          isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card hover:border-primary/40"
                        )}
                      >
                        <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center mb-2", isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="font-bold text-xl mb-1">{type.label}</div>
                          <div className="text-sm text-muted-foreground italic max-w-[200px]">{type.description}</div>
                        </div>
                        {isSelected && (
                          <div className="mt-2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Selected</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Final Configuration</h2>
                </div>

                <form className="space-y-6 bg-card border border-border p-8 rounded-3xl shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold italic">Plan Name</Label>
                        <Input id="name" name="name" value={formValues.name} onChange={handleInputChange} placeholder="e.g. Pro Plan" className="h-12" required />
                      </div>

                      {formValues.billingStyle === "subscription" && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold italic">Base Price</Label>
                            <div className="relative">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{currencySymbol}</span>
                              <Input name="price" type="number" value={formValues.price} onChange={handleInputChange} className="pl-8 h-12" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold italic">Interval</Label>
                            <Select value={formValues.billingCycle} onValueChange={(val) => handleSelectChange("billingCycle", val)}>
                              <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {formValues.billingStyle === "telecom" && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold italic">Allowance (Data Limit)</Label>
                            <Input name="dataLimit" value={formValues.dataLimit} onChange={handleInputChange} placeholder="e.g. 100GB" className="h-12" required />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold italic">Validity (Days)</Label>
                            <Input name="validity" type="number" value={formValues.validity} onChange={handleInputChange} className="h-12" required />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold italic">Pack Price</Label>
                            <div className="relative">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{currencySymbol}</span>
                              <Input name="price" type="number" value={formValues.price} onChange={handleInputChange} className="pl-8 h-12" required />
                            </div>
                          </div>
                        </>
                      )}

                      {formValues.billingStyle === "credits" && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold italic">Credit Quota</Label>
                            <Input name="totalCredits" type="number" value={formValues.totalCredits} onChange={handleInputChange} className="h-12" required />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold italic">One-time Cost</Label>
                            <div className="relative">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{currencySymbol}</span>
                              <Input name="price" type="number" value={formValues.price} onChange={handleInputChange} className="pl-8 h-12" required />
                            </div>
                          </div>
                        </>
                      )}

                      {formValues.billingStyle === "usage" && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold italic">Chargeable Unit</Label>
                            <Input name="unitName" value={formValues.unitName} onChange={handleInputChange} placeholder="API Call" className="h-12" required />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold italic">Price per {formValues.unitName || "item"}</Label>
                            <div className="relative">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{currencySymbol}</span>
                              <Input name="pricePerUnit" type="number" step="0.0001" value={formValues.pricePerUnit} onChange={handleInputChange} className="pl-8 h-12" required />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="feature-input" className="text-sm font-bold italic flex items-center gap-2">
                          <ListChecks className="w-4 h-4 text-primary" />
                          <span>Included Features</span>
                        </Label>
                        <div className="rounded-2xl border border-border bg-muted/20 p-3 space-y-3">
                          <div className="flex items-center gap-2">
                            <Input
                              id="feature-input"
                              value={featureInput}
                              onChange={(e) => setFeatureInput(e.target.value)}
                              onKeyDown={handleFeatureInputKeyDown}
                              placeholder="e.g. Up to 10,000 API calls/mo"
                              className="h-11"
                            />
                            <Button
                              type="button"
                              onClick={addFeature}
                              disabled={!featureInput.trim()}
                              className="h-11 px-4 shrink-0 flex items-center gap-1.5"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add</span>
                            </Button>
                          </div>

                          {featureList.length > 0 ? (
                            <ul className="space-y-2">
                              {featureList.map((feature, idx) => (
                                <motion.li
                                  key={`${feature}-${idx}`}
                                  initial={{ opacity: 0, y: -6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-card border border-border"
                                >
                                  <span className="flex items-center gap-2 text-sm font-medium min-w-0">
                                    <Check className="w-4 h-4 text-primary shrink-0" />
                                    <span className="truncate">{feature}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeFeature(idx)}
                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                                    aria-label={`Remove ${feature}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </motion.li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground italic px-1">No features added yet.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {isEditing && prorationAmount !== null && (
                        <div className={cn(
                          "p-6 rounded-3xl border-2 relative overflow-hidden",
                          prorationTheme.border
                        )}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${prorationTheme.bgGlow} pointer-events-none`} />
                          <div className="relative flex items-start gap-3">
                            <Info className={cn("w-5 h-5 shrink-0 mt-0.5", prorationTheme.iconColor)} />
                            <div className="space-y-1">
                              <p className="text-sm font-bold italic">Proration preview</p>
                              <p className="text-sm text-muted-foreground">
                                Since it's day {MOCK_CYCLE_DAY} of a {MOCK_CYCLE_LENGTH}-day cycle, existing subscribers will be{" "}
                                {prorationAmount >= 0 ? "charged" : "credited"} a prorated amount of ~{currencySymbol}
                                {Math.abs(prorationAmount).toFixed(2)} on their next invoice reflecting the price change
                                (from {currencySymbol}{MOCK_EXISTING_PRICE} to {currencySymbol}{formValues.price || "—"}).
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-8 rounded-[2rem] border-2 border-primary bg-card/60 shadow-2xl relative overflow-hidden flex flex-col gap-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                              {formValues.billingStyle || "Plan Preview"}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground uppercase">
                              {formValues.paymentType}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black tracking-tight mt-1">{formValues.name || "Unnamed Plan"}</h3>
                          <p className="text-xs text-muted-foreground italic mt-0.5">{formValues.productName || "No product selected"}</p>
                        </div>

                        <div className="py-4 border-y border-border flex flex-col justify-center">
                          {formValues.billingStyle === "subscription" && (
                            <div>
                              <div className="text-3xl font-black tracking-tight text-foreground">
                                {currencySymbol}{formValues.price || "0"}
                              </div>
                              <div className="text-xs text-muted-foreground font-semibold">per {formValues.billingCycle || "month"}</div>
                            </div>
                          )}
                          {formValues.billingStyle === "telecom" && (
                            <div>
                              <div className="text-3xl font-black tracking-tight text-foreground">
                                {currencySymbol}{formValues.price || "0"}
                              </div>
                              <div className="text-xs text-muted-foreground font-semibold">
                                Includes {formValues.dataLimit || "0GB"} data for {formValues.validity || "0"} days
                              </div>
                            </div>
                          )}
                          {formValues.billingStyle === "credits" && (
                            <div>
                              <div className="text-3xl font-black tracking-tight text-foreground">
                                {currencySymbol}{formValues.price || "0"}
                              </div>
                              <div className="text-xs text-muted-foreground font-semibold">
                                Adds {formValues.totalCredits || "0"} credits to wallet
                              </div>
                            </div>
                          )}
                          {formValues.billingStyle === "usage" && (
                            <div>
                              <div className="text-3xl font-black tracking-tight text-foreground">
                                {currencySymbol}{formValues.pricePerUnit || "0.00"}
                              </div>
                              <div className="text-xs text-muted-foreground font-semibold">
                                per {formValues.unitName || "API call"} (Metered billing)
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">What's included:</div>
                          {featureList.length > 0 ? (
                            <ul className="space-y-2">
                              {featureList.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground">
                                  <Check className="w-4 h-4 text-primary shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Add features to see them listed here.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-8 h-12 italic font-bold border-2"
            >
              Back
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-8 h-12 bg-primary hover:bg-primary-dark font-bold italic shadow-xl shadow-primary/20 flex items-center gap-2 group"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="px-10 h-12 bg-primary hover:bg-primary-dark font-bold italic shadow-xl shadow-primary/20"
              >
                {isSubmitting ? "Generating..." : "Finalize & Launch"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

