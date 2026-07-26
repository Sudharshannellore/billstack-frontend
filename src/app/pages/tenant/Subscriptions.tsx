import { motion, AnimatePresence } from "motion/react";
import { Plus, Repeat, MoreVertical, Edit, Trash2, Check, ArrowRight, ArrowLeft, User, Package, Tag, PlusCircle, RefreshCw, XCircle } from "lucide-react";
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

const MOCK_TOPUPS = [
  { id: "topup_1", productId: "prod_1", planId: "plan_1_1", name: "1000 Extra API Calls", price: "₹10" },
  { id: "topup_2", productId: "prod_1", planId: "plan_1_2", name: "50GB Extra Storage", price: "₹20" },
  { id: "topup_3", productId: "prod_3", planId: "plan_3_1", name: "10GB Extra Bandwidth", price: "₹15" },
];

const MOCK_COUPONS = [
  { id: "coup_1", productId: "prod_1", planId: "plan_1_1", code: "WELCOME50", discount: "50%" },
  { id: "coup_2", productId: "prod_1", planId: "plan_1_2", code: "PROMO20", discount: "20%" },
  { id: "coup_3", productId: "prod_2", planId: "plan_2_1", code: "SUMMER10", discount: "10%" },
];

const initialSubscriptions = [
  { id: 1, customer: "Alice Johnson", productId: "prod_1", planId: "plan_1_2", plan: "Pro", status: "active", nextBilling: "Apr 15, 2026", mrr: "₹99" },
  { id: 2, customer: "Bob Smith", productId: "prod_3", planId: "plan_3_2", plan: "Ultra Pack", status: "active", nextBilling: "Apr 18, 2026", mrr: "₹50" },
  { id: 3, customer: "Carol White", productId: "prod_1", planId: "plan_1_3", plan: "Enterprise", status: "trial", nextBilling: "Apr 20, 2026", mrr: "₹499" },
];

type SubscriptionFormValues = {
  customerId: string;
  productId: string;
  planId: string;
  couponId: string;
};

const STEPS = ["Customer", "Subscription Details"];

export function Subscriptions() {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subscriptionsList, setSubscriptionsList] = useState(initialSubscriptions);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTopupSubscription, setActiveTopupSubscription] = useState<number | null>(null);
  const [topupValue, setTopupValue] = useState<string>("none");

  const form = useForm<SubscriptionFormValues>({
    defaultValues: {
      customerId: "",
      productId: "",
      planId: "",
      couponId: "none",
    },
  });

  const selectedCustomerId = form.watch("customerId");
  const selectedProductId = form.watch("productId");
  const selectedPlanId = form.watch("planId");

  const selectedProduct = MOCK_PRODUCTS.find((p) => p.id === selectedProductId);
  const selectedPlan = selectedProduct?.plans.find((p) => p.id === selectedPlanId);

  const availableCoupons = MOCK_COUPONS.filter(
    (c) => c.productId === selectedProductId && c.planId === selectedPlanId
  );

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const isStepValid = () => {
    const values = form.getValues();
    switch (currentStep) {
      case 0:
        return !!values.customerId;
      case 1:
        return !!values.productId && !!values.planId;
      default:
        return false;
    }
  };

  const onSubmit = (values: SubscriptionFormValues) => {
    const customer = MOCK_CUSTOMERS.find((c) => c.id === values.customerId);
    const product = MOCK_PRODUCTS.find((p) => p.id === values.productId);
    const plan = product?.plans.find((p) => p.id === values.planId);

    const newSub = {
      id: subscriptionsList.length + 1,
      customer: customer ? customer.name : "Unknown",
      productId: values.productId,
      planId: values.planId,
      plan: plan ? plan.name : "Unknown",
      status: "active",
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      mrr: plan ? plan.price.split('/')[0] : "₹0", // Simplified MRR extraction for mock data
    };

    setSubscriptionsList([newSub, ...subscriptionsList]);
    setIsDialogOpen(false);
    form.reset();
    setCurrentStep(0);
    toast.success("Subscription created", {
      description: `Successfully subscribed ${newSub.customer} to ${newSub.plan}.`,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Subscriptions</h1>
          <p className="text-muted-foreground">Manage customer subscriptions and billing</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDialogOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Subscription</span>
        </motion.button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setCurrentStep(0);
          form.reset();
        }
      }}>
        <DialogContent className="sm:max-w-[650px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl p-0 rounded-[1.5rem] sm:rounded-[2rem]">
          <div className="p-4 sm:p-6 border-b border-border bg-muted/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold italic">New Subscription</DialogTitle>
              <DialogDescription className="italic">
                Initialize a new subscription plan for an existing customer.
              </DialogDescription>
            </DialogHeader>

            {/* Stepper */}
            <div className="flex items-center justify-between mt-6 px-4">
              {STEPS.map((step, index) => (
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
                  {index < STEPS.length - 1 && (
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
                      <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                          <User className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase italic">Select Customer</span>
                        </div>
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
                      <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                          <Package className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase italic">Product & Plan</span>
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
              </div>

              <DialogFooter className="pt-6 border-t border-border mt-2 flex flex-col sm:flex-row gap-3 sm:justify-between w-full">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={currentStep === 0 ? () => setIsDialogOpen(false) : prevStep}
                  className="h-12 px-6 font-bold italic flex items-center gap-2"
                >
                  {currentStep === 0 ? "Cancel" : <><ArrowLeft className="w-4 h-4" /> Back</>}
                </Button>
                
                {currentStep < STEPS.length - 1 ? (
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
                    className="h-12 px-8 bg-primary hover:bg-primary-dark text-white font-bold italic shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Finalize
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
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Customer</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Plan</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Next Billing</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">MRR</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptionsList.map((sub, index) => (
              <motion.tr
                key={sub.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border hover:bg-muted/30 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-full flex items-center justify-center">
                      <Repeat className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{sub.customer}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded border border-primary/20">{sub.plan}</span>
                </td>
                <td className="py-4 px-6">
                   <span className={`px-2 py-1 text-xs rounded capitalize ${
                    sub.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-muted-foreground text-sm">{sub.nextBilling}</td>
                <td className="py-4 px-6 font-bold text-primary">{sub.mrr}</td>
                <td className="py-4 px-6 text-right">
                  <div className="relative inline-block">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMenu(showMenu === sub.id ? null : sub.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                     <AnimatePresence>
                      {showMenu === sub.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden text-left"
                        >
                          <button 
                            onClick={() => {
                                 setShowMenu(null);
                                 setActiveTopupSubscription(sub.id);
                                 setTopupValue("none");
                            }}
                            className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium">
                            <PlusCircle className="w-4 h-4 text-primary" />
                            <span>Add Topup</span>
                          </button>
                          <button 
                             onClick={() => {
                               setShowMenu(null);
                               toast.success("Auto-renew toggled", { description: `Auto-renew for ${sub.customer} has been updated.` });
                             }}
                             className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium">
                            <RefreshCw className="w-4 h-4 text-blue-500" />
                            <span>Toggle Renew</span>
                          </button>
                          <div className="h-[1px] w-full bg-border my-1"></div>
                          <button 
                            onClick={() => {
                               setShowMenu(null);
                               setSubscriptionsList(subscriptionsList.map(s => s.id === sub.id ? { ...s, status: "inactive" } : s));
                               toast.info("Subscription cancelled", { description: `${sub.customer}'s subscription is now inactive.` });
                            }}
                            className="w-full px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3 font-medium text-destructive">
                            <XCircle className="w-4 h-4" />
                            <span>Cancel Sub</span>
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

      <Dialog open={activeTopupSubscription !== null} onOpenChange={() => setActiveTopupSubscription(null)}>
        <DialogContent className="sm:max-w-[450px] bg-card border-border p-6 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold italic">Add Topup to Subscription</DialogTitle>
            <DialogDescription className="italic">
              Select an available topup to immediately upgrade this subscription's capabilities.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <label className="text-xs font-bold uppercase opacity-70">Available Topups</label>
             <Select value={topupValue} onValueChange={setTopupValue}>
               <SelectTrigger className="h-12 text-sm bg-muted/30 border-border">
                 <SelectValue placeholder="Select a topup" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="none">No Topup</SelectItem>
                 {
                   activeTopupSubscription !== null &&
                   MOCK_TOPUPS.filter(t => t.productId === subscriptionsList.find(s => s.id === activeTopupSubscription)?.productId && t.planId === subscriptionsList.find(s => s.id === activeTopupSubscription)?.planId).map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name} ({t.price})</SelectItem>
                   ))
                 }
               </SelectContent>
             </Select>
             {
                 activeTopupSubscription !== null && 
                 MOCK_TOPUPS.filter(t => t.productId === subscriptionsList.find(s => s.id === activeTopupSubscription)?.productId && t.planId === subscriptionsList.find(s => s.id === activeTopupSubscription)?.planId).length === 0 && (
                   <p className="text-xs text-muted-foreground italic text-center p-3 bg-muted rounded-lg">No topups available for this product/plan combination.</p>
                 )
             }
          </div>
          <DialogFooter className="mt-2 border-t border-border pt-4">
               <Button variant="ghost" onClick={() => setActiveTopupSubscription(null)} className="font-bold italic h-11">Cancel</Button>
               <Button disabled={topupValue === "none"} onClick={() => {
                   const activeSub = subscriptionsList.find(s => s.id === activeTopupSubscription);
                   const selectedT = MOCK_TOPUPS.find(t => t.id === topupValue);
                   if (activeSub && selectedT) {
                       const baseMrr = parseInt(activeSub.mrr.replace('₹', ''));
                       const topupPrice = parseInt(selectedT.price.replace('₹', ''));
                       const newMrr = `₹${baseMrr + topupPrice}`;
                       setSubscriptionsList(subscriptionsList.map(s => s.id === activeTopupSubscription ? { ...s, mrr: newMrr } : s));
                       setActiveTopupSubscription(null);
                       setTopupValue("none");
                       toast.success("Topup Applied", { description: `${selectedT.name} successfully applied.` });
                   }
               }} className="bg-primary hover:bg-primary-dark text-white font-bold italic shadow-lg shadow-primary/20 h-11 px-8">Apply Topup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
