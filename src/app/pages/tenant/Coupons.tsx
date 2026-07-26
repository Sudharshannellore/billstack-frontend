import { motion, AnimatePresence } from "motion/react";
import { Plus, Ticket, MoreVertical, Edit, Trash2, Calendar as CalendarIcon, Package, Sparkles, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
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
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../components/ui/utils";
import { MOCK_PRODUCTS } from "../../data/mock-plans";

const initialCoupons = [
  {
    id: 1,
    name: "Welcome Pack",
    code: "WELCOME50",
    type: "percentage",
    value: "50%",
    usage: "124/500",
    expiry: "Dec 31, 2026",
    status: "active",
  },
  {
    id: 2,
    name: "Summer Sale",
    code: "SUMMER100",
    type: "fixed",
    value: "₹100",
    usage: "45/100",
    expiry: "Aug 15, 2026",
    status: "active",
  },
  {
    id: 3,
    name: "Black Friday",
    code: "BLACKFRIDAY",
    type: "percentage",
    value: "75%",
    usage: "0/1000",
    expiry: "Nov 30, 2026",
    status: "draft",
  },
];

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

export function Coupons() {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [couponsList, setCouponsList] = useState(initialCoupons);
  const [currentStep, setCurrentStep] = useState(0);

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

  const onSubmit = (values: CouponFormValues) => {
    const newCoupon = {
      id: couponsList.length + 1,
      name: values.name,
      code: values.code.toUpperCase(),
      type: values.type,
      value: values.type === "percentage" ? `${values.value}%` : `₹${values.value}`,
      usage: "0/∞",
      expiry: format(values.expiry, "MMM d, yyyy"),
      status: "active",
    };

    setCouponsList([newCoupon, ...couponsList]);
    setIsDialogOpen(false);
    form.reset();
    toast.success("Coupon created successfully", {
      description: `Coupon ${newCoupon.code} is now active.`,
    });
    setCurrentStep(0);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, COUPON_STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const isStepValid = () => {
    const values = form.getValues();
    switch (currentStep) {
      case 0: return !!values.productId && !!values.planId;
      case 1: return !!values.name && !!values.code && !!values.expiry;
      case 2: return !!values.type && !!values.value;
      default: return false;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coupons</h1>
          <p className="text-muted-foreground">Manage discounts and promotional codes</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDialogOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Coupon</span>
        </motion.button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setCurrentStep(0);
      }}>
        <DialogContent className="sm:max-w-[550px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl p-0 rounded-[1.5rem] sm:rounded-[2rem] focus:outline-none">
          <div className="p-4 sm:p-6 border-b border-border bg-muted/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold italic">Create New Coupon</DialogTitle>
              <DialogDescription className="italic">
                Complete the {COUPON_STEPS.length} steps to launch your campaign.
              </DialogDescription>
            </DialogHeader>

            {/* Stepper Progress */}
            <div className="flex items-center justify-between mt-6 px-2">
              {COUPON_STEPS.map((step, index) => (
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
                  {index < COUPON_STEPS.length - 1 && (
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
                      <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold uppercase italic">Plan Association</span>
                        </div>
                        
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
                      <div className="grid grid-cols-1 gap-6">
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
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="p-6 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 text-center mb-6">
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
                
                {currentStep < COUPON_STEPS.length - 1 ? (
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
                    Activate Coupon
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card border border-violet-500/20 rounded-2xl overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-t-2xl pointer-events-none z-10" />
        {/* Gradient tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/8 via-transparent to-indigo-600/5 pointer-events-none" />
        {/* Glow orb */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.01] border-b border-white/[0.04]">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Campaign
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Code
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Discount
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Usage
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Expiry
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {couponsList.map((coupon, index) => (
              <motion.tr
                key={coupon.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border hover:bg-muted/30 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{coupon.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded border border-border">
                    {coupon.code}
                  </span>
                </td>
                <td className="py-4 px-6 font-bold text-primary">{coupon.value}</td>
                <td className="py-4 px-6 text-muted-foreground text-sm">{coupon.usage}</td>
                <td className="py-4 px-6 text-muted-foreground text-sm">{coupon.expiry}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 text-xs rounded capitalize ${
                    coupon.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {coupon.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="relative inline-block">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMenu(showMenu === coupon.id ? null : coupon.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                    <AnimatePresence>
                      {showMenu === coupon.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden text-left"
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
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
