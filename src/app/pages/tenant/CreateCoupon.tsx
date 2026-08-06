import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Package, Sparkles, Check, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { format } from "date-fns";
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
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../components/ui/utils";
import { MOCK_PRODUCTS } from "../../data/mock-plans";

type CouponFormValues = {
  name: string;
  code: string;
  type: string;
  value: string;
  expiry: Date;
  productId: string;
  planId: string;
};

const COUPON_STEPS = ["Target", "Identity", "Offer"];

interface CreateCouponProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateCoupon({ onSuccess, onCancel }: CreateCouponProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CouponFormValues>({
    defaultValues: {
      name: "",
      code: "",
      type: "percentage",
      value: "",
      expiry: new Date(),
      productId: "",
      planId: "",
    },
  });

  const selectedProductId = form.watch("productId");
  const selectedPlanId = form.watch("planId");

  const selectedProduct = MOCK_PRODUCTS.find((p) => p.id === selectedProductId);
  const selectedPlan = selectedProduct?.plans.find((p) => p.id === selectedPlanId);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/tenant/coupons");
    }
  };

  const onSubmit = (values: CouponFormValues) => {
    setIsSubmitting(true);

    const newCoupon = {
      name: values.name,
      code: values.code.toUpperCase(),
      type: values.type,
      value: values.type === "percentage" ? `${values.value}%` : `₹${values.value}`,
      expiry: format(values.expiry, "MMM d, yyyy"),
    };

    console.log("Submitting coupon:", newCoupon);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Coupon created successfully", {
        description: `Coupon ${newCoupon.code} is now active.`,
      });
      form.reset();
      setCurrentStep(0);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/tenant/coupons");
      }
    }, 1000);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, COUPON_STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const stepValues = form.watch();
  const isStepValid = () => {
    switch (currentStep) {
      case 0: return !!stepValues.productId && !!stepValues.planId;
      case 1: return !!stepValues.name && !!stepValues.code && !!stepValues.expiry;
      case 2: return !!stepValues.type && !!stepValues.value;
      default: return false;
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
            <span className="text-sm font-medium">Back to Coupons</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Create New Coupon
              </h1>
              <p className="text-muted-foreground text-lg italic">
                Complete the {COUPON_STEPS.length} steps to launch your campaign.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4 px-2">
        {COUPON_STEPS.map((step, index) => (
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
            {index < COUPON_STEPS.length - 1 && (
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
            <div className="min-h-[280px]">
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
                      <h2 className="text-xl sm:text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Select Target</h2>
                    </div>

                    <div className="space-y-4 p-4 sm:p-6 bg-card border border-border rounded-3xl shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold uppercase italic">Plan Association</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="productId"
                          rules={{ required: "Product is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold uppercase opacity-70">Product</FormLabel>
                              <Select onValueChange={(val) => {
                                field.onChange(val);
                                form.setValue("planId", "");
                              }} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 text-sm bg-card">
                                    <SelectValue placeholder="Select product" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {MOCK_PRODUCTS.map((p) => (
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
                              <FormLabel className="text-[10px] font-bold uppercase opacity-70">Target Plan</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!selectedProductId}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-12 text-sm bg-card">
                                    <SelectValue placeholder="Select plan" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {selectedProduct?.plans.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.price})</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {selectedPlan && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 mt-4 px-3 py-2 bg-primary/5 rounded-lg border border-primary/20"
                        >
                          <Sparkles className="w-4 h-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Plan Detected</span>
                            <span className="text-xs italic text-muted-foreground">{selectedPlan.billingStyle} based billing</span>
                          </div>
                        </motion.div>
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
                        <CalendarIcon className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Campaign Identity</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 bg-card border border-border p-8 rounded-3xl shadow-sm">
                      <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold italic">Campaign Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Winter Sale 2026" {...field} className="h-12 bg-card" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="code"
                        rules={{ required: "Code is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold italic">Coupon Code</FormLabel>
                            <FormControl>
                              <Input placeholder="WINTER50" {...field} className="h-12 uppercase bg-card font-mono" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="expiry"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="font-bold italic">Expiry Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    type="button"
                                    variant={"outline"}
                                    className={cn(
                                      "w-full h-12 pl-3 text-left font-normal bg-card",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Offer Configuration</h2>
                    </div>

                    <div className="space-y-6 bg-card border border-border p-8 rounded-3xl shadow-sm">
                      <div className="p-6 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 text-center">
                        <div className="text-sm font-bold italic text-primary mb-1">Targeting {selectedPlan?.name}</div>
                        <div className="text-[10px] uppercase text-muted-foreground">{selectedProduct?.name}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold italic">Discount Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-card">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                                  <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="value"
                          rules={{ required: "Value is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold italic">Value</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g. 20" {...field} className="h-12 bg-card" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                  className="px-8 h-12 italic font-bold border-2"
                >
                  {currentStep === 0 ? "Cancel" : "Back"}
                </Button>

                {currentStep < COUPON_STEPS.length - 1 ? (
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
                    {isSubmitting ? "Activating..." : "Activate Coupon"}
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
