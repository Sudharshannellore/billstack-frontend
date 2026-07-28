import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Package, Zap, Coins, Database } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { BillingStyle } from "../../components/billing/BillingStyleSelector";
import { cn } from "../../components/ui/utils";
import { MOCK_PRODUCTS } from "../../data/mock-plans";

type TopupFormValues = {
  name: string;
  productId: string;
  planId: string;
  style: BillingStyle | null;
  value: string;
  price: string;
};

const TOPUP_STEPS = ["Target", "Price & Pack"];

interface CreateTopupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTopup({ onSuccess, onCancel }: CreateTopupProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TopupFormValues>({
    defaultValues: {
      name: "",
      productId: "",
      planId: "",
      style: "credits",
      value: "",
      price: "",
    },
  });

  const selectedProductId = form.watch("productId");
  const selectedPlanId = form.watch("planId");

  const selectedProduct = MOCK_PRODUCTS.find(p => p.id === selectedProductId);
  const selectedPlan = selectedProduct?.plans.find(p => p.id === selectedPlanId);

  // Auto-update style when plan changes
  useState(() => {
    if (selectedPlan) {
      form.setValue("style", selectedPlan.billingStyle);
    }
  });

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/tenant/topups");
    }
  };

  const onSubmit = (values: TopupFormValues) => {
    setIsSubmitting(true);

    const productName = MOCK_PRODUCTS.find(p => p.id === values.productId)?.name || "Unknown Product";

    let formattedValue = values.value;
    if (values.style === 'credits') formattedValue += " Credits";
    else if (values.style === 'telecom') formattedValue += " GB";
    else if (values.style === 'usage') formattedValue += " Units";

    const payload = {
      id: Date.now(),
      name: values.name,
      product: productName,
      style: values.style,
      value: formattedValue,
      price: `₹${values.price}`,
      status: "active",
    };

    console.log("Submitting payload:", payload);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Top-up pack created", {
        description: `${values.name} is now available for purchase.`,
      });
      form.reset();
      setCurrentStep(0);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/tenant/topups");
      }
    }, 1000);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, TOPUP_STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const isStepValid = () => {
    const values = form.getValues();
    switch (currentStep) {
      case 0: return !!values.productId && !!values.planId;
      case 1: return !!values.name && !!values.value && !!values.price;
      default: return false;
    }
  };

  const getStyleLabel = () => {
    const style = form.watch("style");
    switch (style) {
      case 'telecom': return "Data Allowance (GB)";
      case 'credits': return "Credit Load";
      case 'usage': return "Prepaid Units";
      default: return "Resource Quantity";
    }
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'credits': return <Coins className="w-5 h-5 text-amber-400" />;
      case 'telecom': return <Database className="w-5 h-5 text-sky-400" />;
      case 'usage': return <Zap className="w-5 h-5 text-violet-400" />;
      default: return <Package className="w-5 h-5 text-emerald-400" />;
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
            <span className="text-sm font-medium">Back to Top-ups</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Define Top-up Pack
              </h1>
              <p className="text-muted-foreground text-lg italic">
                Add resource packs to your {selectedPlan?.name || "selected"} plan in {TOPUP_STEPS.length} easy steps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4 px-2">
        {TOPUP_STEPS.map((step, index) => (
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
            {index < TOPUP_STEPS.length - 1 && (
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Select Source Plan</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 bg-card border border-border p-8 rounded-3xl shadow-sm">
                      <FormField
                        control={form.control}
                        name="productId"
                        rules={{ required: "Product is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase opacity-70 italic tracking-tighter">1. Choose Product</FormLabel>
                            <Select onValueChange={(val) => {
                              field.onChange(val);
                              form.setValue("planId", "");
                              const prod = MOCK_PRODUCTS.find(p => p.id === val);
                              if (prod) form.setValue("style", prod.billingStyle);
                            }} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-card">
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {MOCK_PRODUCTS.map(p => (
                                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="planId"
                        rules={{ required: "Plan is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase opacity-70 italic tracking-tighter">2. Choose Plan</FormLabel>
                            <Select onValueChange={(val) => {
                              field.onChange(val);
                              const plan = selectedProduct?.plans.find(p => p.id === val);
                              if (plan) form.setValue("style", plan.billingStyle);
                            }} value={field.value} disabled={!selectedProductId}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-card">
                                  <SelectValue placeholder="Select plan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedProduct?.plans.map(p => (
                                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {selectedPlan && (
                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
                          <div className="flex items-center gap-2">
                            {getStyleIcon(selectedPlan.billingStyle)}
                            <span className="text-xs font-bold uppercase text-primary">Billing System: {selectedPlan.billingStyle}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground italic leading-relaxed">
                            Top-ups for this plan will follow the {selectedPlan.billingStyle} ledger rules.
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Price & Pack</h2>
                    </div>

                    <div className="space-y-6 bg-card border border-border p-8 rounded-3xl shadow-sm">
                      <div className="grid grid-cols-1 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          rules={{ required: "Name is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold italic">Pack Label</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 50GB Boost" {...field} className="h-12 bg-card" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="value"
                            rules={{ required: "Value is required" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold italic">{getStyleLabel()}</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g. 50" {...field} className="h-12 bg-card" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="price"
                            rules={{ required: "Price is required" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold italic">Selling Price (₹)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g. 25" {...field} className="h-12 bg-card" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-xl border border-border text-center">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground italic">Add-on Summary</span>
                        <div className="text-lg font-black italic mt-1">
                          {form.watch("value") || "0"} {selectedPlan?.billingStyle === 'telecom' ? 'GB' : selectedPlan?.billingStyle === 'credits' ? 'Credits' : 'Units'} for ₹{form.watch("price") || "0"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={currentStep === 0 ? handleCancel : prevStep}
                  className="px-8 h-12 italic font-bold border-2 flex items-center gap-2"
                >
                  {currentStep === 0 ? "Cancel" : <><ArrowLeft className="w-4 h-4" /> Back</>}
                </Button>

                {currentStep < TOPUP_STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="px-8 h-12 bg-primary hover:bg-primary-dark font-bold italic shadow-xl shadow-primary/20 flex items-center gap-2 group"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isStepValid() || isSubmitting}
                    className="px-10 h-12 bg-primary hover:bg-primary-dark font-bold italic shadow-xl shadow-primary/20"
                  >
                    {isSubmitting ? "Generating..." : "Launch Top-up"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
