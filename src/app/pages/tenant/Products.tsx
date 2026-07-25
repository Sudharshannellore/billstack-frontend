import { motion, AnimatePresence } from "motion/react";
import { Plus, Package, MoreVertical, Edit, Trash2, X, Check, ArrowRight, HelpCircle, Layers, ArrowLeft } from "lucide-react";
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
    description: "Scalable cloud storage with REST API integrations.",
    status: "active",
    billingStyle: "subscription" as BillingStyle,
    plans: 3,
    customers: 245,
  },
  {
    id: 2,
    name: "Analytics Platform",
    description: "Real-time analytics and user insights dashboard.",
    status: "active",
    billingStyle: "usage" as BillingStyle,
    plans: 4,
    customers: 128,
  },
  {
    id: 3,
    name: "Email Services Gateway",
    description: "Transactional email delivery infrastructure.",
    status: "active",
    billingStyle: "credits" as BillingStyle,
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
    } else {
      toast.error("Please fill out all required fields.");
    }
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const isStepValid = () => {
    const values = form.getValues();
    switch (currentStep) {
      case 0:
        return !!values.name && !!values.description;
      case 1:
        return !!values.billingStyle;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const handleProductSubmit = (values: ProductFormValues) => {
    const newProduct = {
      id: products.length + 1,
      name: values.name,
      description: values.description,
      status: values.status,
      billingStyle: values.billingStyle,
      plans: 0,
      customers: 0,
    };

    setProducts([...products, newProduct]);
    setIsDialogOpen(false);
    form.reset();
    setCurrentStep(0);
    toast.success("Product created successfully!");
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted successfully.");
  };

  const getStyleColor = (style: BillingStyle) => {
    switch (style) {
      case "subscription": return "bg-primary/10 text-primary border-primary/20";
      case "usage": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "credits": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "telecom": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default: return "bg-white/5 text-muted-foreground border-white/[0.08]";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Product Catalog</h1>
          <p className="text-muted-foreground text-sm">Create, deploy, and organize billing configurations for your SaaS inventory.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsDialogOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 hover:from-primary-dark hover:to-violet-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Grid of products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -4, borderColor: "rgba(255, 255, 255, 0.12)" }}
              className="bg-card border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between h-[210px] relative group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    getStyleColor(product.billingStyle)
                  )}>
                    {product.billingStyle}
                  </span>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowMenu(showMenu === product.id ? null : product.id)}
                      className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {showMenu === product.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(null)} />
                        <div className="absolute right-0 mt-1 w-32 bg-[#0c0c12] border border-white/[0.08] rounded-xl shadow-xl py-1.5 z-20">
                          <button className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                            <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Lower statistics */}
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{product.plans} active plans</span>
                </div>
                <div className="text-muted-foreground">
                  <span className="text-white font-bold">{product.customers}</span> subscribers
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Creation Modal Wizard */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          form.reset();
          setCurrentStep(0);
        }
      }}>
        <DialogContent className="bg-[#0b0b0f] border border-white/[0.08] rounded-3xl p-6 sm:p-8 max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <span>Create Product Config</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure SaaS catalogs, routing paths, and payment architectures.
            </DialogDescription>
          </DialogHeader>

          {/* Stepper indicators */}
          <div className="flex items-center justify-between my-6 border-b border-white/[0.04] pb-4">
            {PRODUCT_STEPS.map((step, idx) => (
              <div key={step} className="flex items-center gap-2 text-xs">
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] transition-all",
                  idx <= currentStep 
                    ? "bg-primary text-white" 
                    : "bg-white/5 border border-white/[0.06] text-muted-foreground"
                )}>
                  {idx + 1}
                </span>
                <span className={cn(
                  "font-bold",
                  idx === currentStep ? "text-white" : "text-muted-foreground"
                )}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleProductSubmit)} className="space-y-6">
              <div className="min-h-[220px] flex flex-col justify-center">
                {currentStep === 0 && (
                  <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-white">Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Database Storage API" className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white" {...field} />
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
                          <FormLabel className="text-xs font-semibold text-white">Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Explain what services, aggregates, or resource access this product configuration facilitates." className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white min-h-[90px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="billingStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-white mb-2 block">Billing Architecture Logic</FormLabel>
                          <FormControl>
                            <BillingStyleSelector value={field.value} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 text-center py-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-base font-extrabold text-white">Review & Deploy</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto font-light leading-relaxed">
                      Confirming deployment for <span className="text-primary font-bold">{form.getValues("name")}</span>. New billing lines will immediately activate in Sandbox.
                    </p>
                  </motion.div>
                )}
              </div>

              <DialogFooter className="flex items-center justify-between border-t border-white/[0.04] pt-4 gap-3">
                <div className="flex items-center gap-2 w-full">
                  {currentStep > 0 && (
                    <Button type="button" onClick={prevStep} className="bg-white/5 border border-white/[0.06] hover:bg-white/10 text-xs font-semibold rounded-xl text-white">
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                      <span>Back</span>
                    </Button>
                  )}
                  
                  {currentStep < PRODUCT_STEPS.length - 1 ? (
                    <Button type="button" onClick={nextStep} className="bg-primary hover:bg-primary-dark ml-auto text-xs font-semibold rounded-xl text-white">
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-gradient-to-r from-primary to-violet-600 text-xs font-bold rounded-xl ml-auto text-white px-6">
                      Deploy Product
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
