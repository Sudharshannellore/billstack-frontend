import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Check, ArrowRight, ArrowLeft, User, Package } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { cn } from "../../components/ui/utils";
import { MOCK_PRODUCTS } from "../../data/mock-plans";

// Mock Data for the Wizard
const MOCK_CUSTOMERS = [
  { id: "cust_1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "cust_2", name: "Bob Smith", email: "bob@company.com" },
  { id: "cust_3", name: "Carol White", email: "carol@startup.io" },
];

const MOCK_COUPONS = [
  { id: "coup_1", productId: "prod_1", planId: "plan_1_1", code: "WELCOME50", discount: "50%" },
  { id: "coup_2", productId: "prod_1", planId: "plan_1_2", code: "PROMO20", discount: "20%" },
  { id: "coup_3", productId: "prod_2", planId: "plan_2_1", code: "SUMMER10", discount: "10%" },
];

type SubscriptionFormValues = {
  customerId: string;
  productId: string;
  planId: string;
  couponId: string;
};

const STEPS = ["Customer", "Subscription Details"];

interface CreateSubscriptionProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateSubscription({ onSuccess, onCancel }: CreateSubscriptionProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<SubscriptionFormValues>({
    defaultValues: {
      customerId: "",
      productId: "",
      planId: "",
      couponId: "none",
    },
  });

  const selectedProductId = form.watch("productId");
  const selectedPlanId = form.watch("planId");

  const selectedProduct = MOCK_PRODUCTS.find((p) => p.id === selectedProductId);

  const availableCoupons = MOCK_COUPONS.filter(
    (c) => c.productId === selectedProductId && c.planId === selectedPlanId
  );

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const values = form.watch();
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!values.customerId;
      case 1:
        return !!values.productId && !!values.planId;
      default:
        return false;
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/tenant/subscriptions");
    }
  };

  const onSubmit = (values: SubscriptionFormValues) => {
    const customer = MOCK_CUSTOMERS.find((c) => c.id === values.customerId);
    const product = MOCK_PRODUCTS.find((p) => p.id === values.productId);
    const plan = product?.plans.find((p) => p.id === values.planId);

    console.log("Submitting subscription:", values);

    toast.success("Subscription created", {
      description: `Successfully subscribed ${customer ? customer.name : "customer"} to ${plan ? plan.name : "plan"}.`,
    });

    form.reset();
    setCurrentStep(0);

    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/tenant/subscriptions");
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
            <span className="text-sm font-medium">Back to Subscriptions</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                New Subscription
              </h1>
              <p className="text-muted-foreground text-lg italic">
                Initialize a new subscription plan for an existing customer.
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="min-h-[250px]">
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
                        <User className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Select Customer</h2>
                    </div>

                    <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border">
                      <FormField
                        control={form.control}
                        name="customerId"
                        rules={{ required: "Customer is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase opacity-70">Customer</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-sm bg-card">
                                  <SelectValue placeholder="Choose a customer..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {MOCK_CUSTOMERS.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>{c.name} ({c.email})</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold italic underline decoration-primary/30 underline-offset-8">Product & Plan</h2>
                    </div>

                    <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border">
                      <div className="grid grid-cols-1 gap-4">
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
                                form.setValue("couponId", "none");
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
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  form.setValue("couponId", "none");
                                }}
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

                        {availableCoupons.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                          >
                            <FormField
                              control={form.control}
                              name="couponId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-bold uppercase opacity-70">Apply Coupon</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-12 text-sm bg-primary/5 border-primary/20 text-primary font-medium">
                                        <SelectValue placeholder="No coupon applied" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="none">No Coupon</SelectItem>
                                      {availableCoupons.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.code} ({c.discount})</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </motion.div>
                        )}
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

                {currentStep < STEPS.length - 1 ? (
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
                    className="px-10 h-12 bg-primary hover:bg-primary-dark font-bold italic shadow-xl shadow-primary/20 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Finalize
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
