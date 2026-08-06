import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Package, Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { cn } from "../../components/ui/utils";
import { SUPPORTED_CURRENCIES } from "../../components/currency";

const PRODUCT_STEPS = ["Identity", "Publish"];

type ProductFormValues = {
  name: string;
  description: string;
  status: string;
  currency: string;
};

interface CreateProductProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProduct({ onSuccess, onCancel }: CreateProductProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      currency: "INR",
    },
  });

  const values = form.watch();
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!values.name && !!values.description && !!values.currency;
      case 1:
        return true;
      default:
        return false;
    }
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isStepValid()) {
      setCurrentStep(prev => Math.min(prev + 1, PRODUCT_STEPS.length - 1));
    } else {
      toast.error("Please fill out all required fields.");
    }
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/tenant/products");
    }
  };

  const handleProductSubmit = (values: ProductFormValues) => {
    console.log("Submitting product:", values);
    toast.success("Product created successfully!");

    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/tenant/products");
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
            <span className="text-sm font-medium">Back to Products</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Create Product Config
              </h1>
              <p className="text-muted-foreground text-lg italic">
                Configure SaaS catalogs, routing paths, and payment architectures in {PRODUCT_STEPS.length} easy steps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4 px-2">
        {PRODUCT_STEPS.map((step, index) => (
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
            {index < PRODUCT_STEPS.length - 1 && (
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
          <form onSubmit={form.handleSubmit(handleProductSubmit)} className="space-y-8">
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
                  <h2 className="text-xl sm:text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Product Identity</h2>
                </div>

                <div className="space-y-6 bg-card border border-border p-8 rounded-3xl shadow-sm">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold italic">Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Database Storage API" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold italic">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain what services, aggregates, or resource access this product configuration facilitates."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold italic">Currency</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {SUPPORTED_CURRENCIES.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.symbol} {currency.code} — {currency.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Review & Deploy</h2>
                </div>

                <div className="text-center py-10 bg-card border border-border rounded-3xl shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="text-base font-extrabold">Ready to Deploy</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto font-light leading-relaxed">
                    Confirming deployment for <span className="text-primary font-bold">{form.getValues("name")}</span> priced in <span className="text-primary font-bold">{form.getValues("currency")}</span>. New billing lines will immediately activate in Sandbox.
                  </p>
                </div>
              </motion.div>
            )}
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-8 h-12 italic font-bold border-2"
              >
                Back
              </Button>

              {currentStep < PRODUCT_STEPS.length - 1 ? (
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
                  disabled={!isStepValid()}
                  className="px-10 h-12 bg-primary hover:bg-primary-dark font-bold italic shadow-xl shadow-primary/20"
                >
                  Deploy Product
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
