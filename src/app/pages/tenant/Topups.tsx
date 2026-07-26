import { motion, AnimatePresence } from "motion/react";
import { Plus, Zap, MoreVertical, Edit, Trash2, Package, Database, Coins, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
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
import { BillingStyleSelector, BillingStyle } from "../../components/billing/BillingStyleSelector";
import { cn } from "../../components/ui/utils";
import { MOCK_PRODUCTS } from "../../data/mock-plans";

const initialTopups = [
  {
    id: 1,
    name: "1000 Credits Pack",
    product: "Cloud Storage API",
    style: "credits",
    value: "1000 Credits",
    price: "₹50",
    status: "active",
  },
  {
    id: 2,
    name: "50GB Extra Data",
    product: "Video Streaming API",
    style: "telecom",
    value: "50 GB",
    price: "₹25",
    status: "active",
  },
  {
    id: 3,
    name: "10k API Calls",
    product: "Analytics Platform",
    style: "usage",
    value: "10,000 Units",
    price: "₹10",
    status: "draft",
  },
];

// Removed local PRODUCTS constant, using MOCK_PRODUCTS instead

type TopupFormValues = {
  name: string;
  productId: string;
  planId: string;
  style: BillingStyle | null;
  value: string;
  price: string;
};

const TOPUP_STEPS = ["Target", "Price & Pack"];

export function Topups() {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [topupsList, setTopupsList] = useState(initialTopups);
  const [currentStep, setCurrentStep] = useState(0);

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

  const onSubmit = (values: TopupFormValues) => {
    const productName = MOCK_PRODUCTS.find(p => p.id === values.productId)?.name || "Unknown Product";
    
    let formattedValue = values.value;
    if (values.style === 'credits') formattedValue += " Credits";
    else if (values.style === 'telecom') formattedValue += " GB";
    else if (values.style === 'usage') formattedValue += " Units";

    const newTopup = {
      id: topupsList.length + 1,
      name: values.name,
      product: productName,
      style: values.style,
      value: formattedValue,
      price: `₹${values.price}`,
      status: "active",
    } as any;

    setTopupsList([newTopup, ...topupsList]);
    setIsDialogOpen(false);
    form.reset();
    toast.success("Top-up pack created", {
      description: `${values.name} is now available for purchase.`,
    });
    setCurrentStep(0);
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

  const getStyleTheme = (style: string) => {
    switch (style) {
      case 'credits': return {
        border: "border-amber-500/25",
        accent: "from-amber-500 via-orange-500 to-yellow-500",
        gradient: "from-amber-600/10 via-transparent to-orange-600/5",
        glow: "bg-amber-500/8",
        iconBg: "bg-amber-500/15 border border-amber-500/20",
      };
      case 'telecom': return {
        border: "border-sky-500/25",
        accent: "from-sky-500 via-cyan-500 to-blue-500",
        gradient: "from-sky-600/10 via-transparent to-blue-600/5",
        glow: "bg-sky-500/8",
        iconBg: "bg-sky-500/15 border border-sky-500/20",
      };
      case 'usage': return {
        border: "border-violet-500/25",
        accent: "from-violet-500 via-purple-500 to-indigo-500",
        gradient: "from-violet-600/10 via-transparent to-indigo-600/5",
        glow: "bg-violet-500/8",
        iconBg: "bg-violet-500/15 border border-violet-500/20",
      };
      default: return {
        border: "border-emerald-500/25",
        accent: "from-emerald-500 via-teal-500 to-green-500",
        gradient: "from-emerald-600/10 via-transparent to-teal-600/5",
        glow: "bg-emerald-500/8",
        iconBg: "bg-emerald-500/15 border border-emerald-500/20",
      };
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Top-ups</h1>
          <p className="text-muted-foreground">Manage on-demand resource packs and add-ons</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDialogOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Top-up</span>
        </motion.button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setCurrentStep(0);
      }}>
        <DialogContent className="sm:max-w-[600px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl p-0 rounded-[1.5rem] sm:rounded-[2rem] focus:outline-none">
          <div className="p-4 sm:p-6 border-b border-border bg-muted/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold italic">Define Top-up Pack</DialogTitle>
              <DialogDescription className="italic">
                Add resource packs to your {selectedPlan?.name || "selected"} plan.
              </DialogDescription>
            </DialogHeader>

            {/* Stepper Progress */}
            <div className="flex items-center justify-between mt-6 px-4">
              {TOPUP_STEPS.map((step, index) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                      index <= currentStep ? "bg-primary text-white" : "bg-muted text-muted-foreground border border-border"
                    )}>
                      {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-wider hidden sm:block",
                      index <= currentStep ? "text-primary" : "text-muted-foreground"
                    )}>{step}</span>
                  </div>
                  {index < TOPUP_STEPS.length - 1 && (
                    <div className="flex-1 h-[2px] mx-4 self-center mb-6 bg-muted">
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-6">
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
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary">
                          <Package className="w-5 h-5" />
                          <span className="font-bold italic">Select Source Plan</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
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
                        </div>

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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <DialogFooter className="pt-6 border-t border-border mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between w-full">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={currentStep === 0 ? () => setIsDialogOpen(false) : prevStep}
                  className="h-12 px-6 font-bold italic flex items-center gap-2"
                >
                  {currentStep === 0 ? "Cancel" : <><ArrowLeft className="w-4 h-4" /> Back</>}
                </Button>
                
                {currentStep < TOPUP_STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="h-12 px-8 bg-primary hover:bg-primary-dark text-white font-bold italic shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isStepValid()}
                    className="h-12 px-8 bg-primary hover:bg-primary-dark text-white font-bold italic shadow-lg shadow-primary/20"
                  >
                    Launch Top-up
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topupsList.map((topup, index) => {
          const theme = getStyleTheme(topup.style);
          return (
          <motion.div
            key={topup.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className={`relative p-6 bg-card border ${theme.border} rounded-2xl hover:shadow-xl transition-all group overflow-hidden`}
          >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${theme.accent} rounded-t-2xl pointer-events-none`} />
            {/* Gradient tint */}
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} pointer-events-none`} />
            {/* Glow orb */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${theme.glow} rounded-full blur-3xl pointer-events-none`} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 ${theme.iconBg} rounded-xl flex items-center justify-center`}>
                  {getStyleIcon(topup.style)}
                </div>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMenu(showMenu === topup.id ? null : topup.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                  <AnimatePresence>
                    {showMenu === topup.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <button className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="text-xl font-bold">{topup.name}</h3>
                <p className="text-sm text-muted-foreground">{topup.product}</p>
              </div>

              <div className="flex items-end justify-between border-t border-white/[0.06] pt-4">
                <div>
                  <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1 italic">Value</div>
                  <div className="font-bold text-lg text-primary">{topup.value}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1 italic">Price</div>
                  <div className="text-2xl font-black italic">{topup.price}</div>
                </div>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
