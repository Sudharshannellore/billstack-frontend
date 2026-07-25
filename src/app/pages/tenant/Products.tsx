import { motion, AnimatePresence } from "motion/react";
import { Plus, Package, MoreVertical, Edit, Trash2, X, Check, ArrowRight } from "lucide-react";
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
import { Textarea } from "../../components/ui/textarea";
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

const productsData = [
  {
    id: 1,
    name: "Cloud Storage API",
    description: "Scalable cloud storage with REST API",
    status: "active",
    billingStyle: "subscription" as BillingStyle,
    plans: 3,
    customers: 245,
  },
  {
    id: 2,
    name: "Analytics Platform",
    description: "Real-time analytics and insights",
    status: "active",
    billingStyle: "usage" as BillingStyle,
    plans: 4,
    customers: 128,
  },
  {
    id: 3,
    name: "Email Service",
    description: "Transactional email delivery",
    status: "active",
    billingStyle: "subscription" as BillingStyle,
    plans: 2,
    customers: 89,
  },
];

type ProductFormValues = {
  name: string;
  description: string;
  status: string;
  billingStyle: BillingStyle;
};

const PRODUCT_STEPS = ["Identity", "Logic", "Publish"];

export function Products() {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState(productsData);

  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      billingStyle: "subscription",
    },
  });

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isStepValid()) {
      setCurrentStep(prev => Math.min(prev + 1, PRODUCT_STEPS.length - 1));
    }
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const isStepValid = () => {
    const values = form.getValues();
    if (currentStep === 0) return !!values.name;
    if (currentStep === 1) return !!values.billingStyle;
    return true;
  };

  const onSubmit = (values: ProductFormValues) => {
    const newProduct = {
      id: products.length + 1,
      ...values,
      plans: 0,
      customers: 0,
    } as any;

    setProducts([newProduct, ...products]);
    setIsDialogOpen(false);
    setCurrentStep(0);
    form.reset();
    toast.success("Product created successfully", {
      description: `${values.name} has been added to your catalog.`,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your products and features</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDialogOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Product</span>
        </motion.button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setCurrentStep(0);
      }}>
        <DialogContent className="sm:max-w-[650px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem] p-0 focus:outline-none">
          <div className="p-4 sm:p-8 border-b border-border/50 bg-muted/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold italic">Create New Product</DialogTitle>
              <DialogDescription className="italic">
                {currentStep === 0 && "Start by identifying your new product offering."}
                {currentStep === 1 && "Determine how this product will be billed."}
                {currentStep === 2 && "Finalize and publish your product."}
              </DialogDescription>
            </DialogHeader>

            {/* Stepper Progress */}
            <div className="flex items-center justify-between mt-8 px-4">
              {PRODUCT_STEPS.map((step, index) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-2 group">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500",
                      index <= currentStep ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground border border-border/50"
                    )}>
                      {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={cn(
                      "text-[9px] uppercase font-black tracking-widest hidden sm:block",
                      index <= currentStep ? "text-primary" : "text-muted-foreground opacity-50"
                    )}>{step}</span>
                  </div>
                  {index < PRODUCT_STEPS.length - 1 && (
                    <div className="flex-1 h-[2px] mx-4 self-center mb-6 bg-border/50 overflow-hidden">
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-8">
              <div className="min-h-[auto] sm:min-h-[320px]">
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "Product name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-black uppercase tracking-widest text-[10px] text-primary/80 ml-2">Product Identity</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Video Streaming API" {...field} className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:border-primary/50 transition-all font-bold text-lg px-6" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-black uppercase tracking-widest text-[10px] text-primary/80 ml-2">Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what this product offers..."
                                className="min-h-[100px] rounded-2xl bg-muted/30 border-border/50 focus:border-primary/50 transition-all text-sm px-6 py-4 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                      <FormField
                        control={form.control}
                        name="billingStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-black uppercase tracking-widest text-[10px] text-primary/80 ml-2 mb-4 block">Billing Logic</FormLabel>
                            <FormControl>
                              <BillingStyleSelector
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-black uppercase tracking-widest text-[10px] text-primary/80 ml-2">Initial Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:border-primary/50 transition-all font-bold px-6">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Check className="w-5 h-5 text-primary" />
                          <span className="font-black uppercase tracking-widest text-[10px] text-foreground">Ready to Launch</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                          Your product will be created with the <strong>{form.watch("billingStyle")}</strong> billing style. You can add pricing plans immediately after creation.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <DialogFooter className="pt-6 sm:pt-8 pb-2 flex flex-col sm:flex-row gap-3 sm:justify-between items-center bg-card">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={currentStep === 0 ? () => setIsDialogOpen(false) : prevStep}
                  className="h-14 px-8 font-bold uppercase tracking-widest text-xs hover:bg-muted/50 transition-all"
                >
                  {currentStep === 0 ? "Cancel" : "Back"}
                </Button>

                {currentStep < PRODUCT_STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="h-14 px-10 bg-primary hover:bg-primary-dark text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 rounded-2xl transition-all"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="h-14 px-10 bg-primary hover:bg-primary-dark text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 rounded-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    Create Product
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="relative p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMenu(showMenu === product.id ? null : product.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                  <AnimatePresence>
                    {showMenu === product.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                  product.billingStyle === 'subscription' ? "bg-primary/10 text-primary border-primary/20" :
                    product.billingStyle === 'telecom' ? "bg-info/10 text-info border-info/20" :
                      product.billingStyle === 'credits' ? "bg-warning/10 text-warning border-warning/20" :
                        "bg-success/10 text-success border-success/20"
                )}>
                  {product.billingStyle}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{product.description}</p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{product.plans} plans</span>
                  <span>{product.customers} customers</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded capitalize ${product.status === 'active' ? 'bg-success/10 text-success' :
                    product.status === 'draft' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                  }`}>
                  {product.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

