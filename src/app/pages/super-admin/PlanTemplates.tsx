import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Plus, 
  Users, 
  Zap, 
  Layers, 
  MoreVertical, 
  Copy, 
  Star,
  CheckCircle,
  Edit,
  Trash2,
  HelpCircle
} from "lucide-react";
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
import { Checkbox } from "../../components/ui/checkbox";

const templates = [
  { 
    id: 1, 
    name: "SaaS Starter", 
    type: "Subscription", 
    price: "$29/mo", 
    tenants: 12, 
    featured: true,
    description: "Fixed monthly subscription ideal for early-stage SaaS products.",
    features: ["Unlimited API Calls", "5GB Storage", "Email Support"],
    icon: Star,
    gradient: "from-primary via-violet-600 to-purple-700",
    glow: "shadow-primary/20",
  },
  { 
    id: 2, 
    name: "API Usage", 
    type: "Usage-based", 
    price: "$0.01/call", 
    tenants: 8, 
    featured: false,
    description: "Pay-per-use model for API-driven products. Scale costs with consumption.",
    features: ["Per-request billing", "Daily invoices", "Overage alerts"],
    icon: Zap,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    glow: "shadow-amber-500/20",
  },
  { 
    id: 3, 
    name: "Freemium Model", 
    type: "Hybrid", 
    price: "$0 + overage", 
    tenants: 15, 
    featured: false,
    description: "Generous free tier with usage-based overages after quota is exceeded.",
    features: ["10K free calls/mo", "Usage metering", "Auto-upgrade prompts"],
    icon: Layers,
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
  { 
    id: 4, 
    name: "Enterprise", 
    type: "Custom", 
    price: "Custom", 
    tenants: 3, 
    featured: false,
    description: "Fully negotiated contracts with SLA guarantees and dedicated support.",
    features: ["Custom limits", "99.99% SLA", "Dedicated CSM"],
    icon: Users,
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    glow: "shadow-emerald-500/20",
  },
];

const typeColors: Record<string, string> = {
  Subscription: "bg-primary/10 text-primary border-primary/20",
  "Usage-based": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Hybrid: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Custom: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

type TemplateFormValues = {
  name: string;
  type: "Subscription" | "Usage-based" | "Hybrid" | "Custom";
  price: string;
  description: string;
  features: string;
  featured: boolean;
};

const iconMap = {
  Subscription: Star,
  "Usage-based": Zap,
  Hybrid: Layers,
  Custom: Users,
};

const gradientMap = {
  Subscription: "from-primary via-violet-600 to-purple-700",
  "Usage-based": "from-amber-500 via-orange-500 to-red-500",
  Hybrid: "from-cyan-500 via-sky-500 to-blue-600",
  Custom: "from-emerald-500 via-teal-500 to-green-600",
};

const glowMap = {
  Subscription: "shadow-primary/20",
  "Usage-based": "shadow-amber-500/20",
  Hybrid: "shadow-cyan-500/20",
  Custom: "shadow-emerald-500/20",
};

export function PlanTemplates() {
  const [templateList, setTemplateList] = useState(templates);
  const [menu, setMenu] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<TemplateFormValues>({
    defaultValues: {
      name: "",
      type: "Subscription",
      price: "",
      description: "",
      features: "",
      featured: false,
    },
  });

  const handleTemplateSubmit = (values: TemplateFormValues) => {
    const featureArray = values.features
      .split(",")
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const newTemplate = {
      id: templateList.length + 1,
      name: values.name,
      type: values.type,
      price: values.price,
      tenants: 0,
      featured: values.featured,
      description: values.description,
      features: featureArray.length > 0 ? featureArray : ["Standard features included"],
      icon: iconMap[values.type] || HelpCircle,
      gradient: gradientMap[values.type] || "from-gray-500 via-gray-600 to-gray-700",
      glow: glowMap[values.type] || "shadow-gray-500/20",
    };

    setTemplateList(prev => [...prev, newTemplate]);
    setIsDialogOpen(false);
    form.reset();
    toast.success("Pricing template created successfully!");
  };

  const deleteTemplate = (id: number) => {
    setTemplateList(prev => prev.filter(t => t.id !== id));
    toast.success("Template deleted successfully!");
    setMenu(null);
  };

  const getTemplateStyles = (type: string) => {
    let color = "purple";
    if (type === "Usage-based") color = "amber";
    else if (type === "Hybrid") color = "cyan";
    else if (type === "Custom") color = "emerald";

    const accentMap: Record<string, string> = {
      purple:  "from-purple-500 to-violet-500",
      emerald: "from-emerald-500 to-teal-500",
      amber:   "from-amber-500 to-orange-500",
      cyan:    "from-cyan-500 to-sky-500",
    };

    return {
      border: `border-${color}-500/20 hover:border-${color}-500/40`,
      glow: `hover:shadow-${color}-500/10`,
      bgClass: `bg-gradient-to-br from-${color}-500/10 via-[#0b0b0f] to-${color}-500/5`,
      bgGlow: `from-${color}-500/15 via-transparent to-transparent`,
      topAccent: accentMap[color] || "from-violet-500 to-purple-500",
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-1 sm:p-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Plan Templates</h1>
          <p className="text-muted-foreground text-sm">Build reusable pricing blueprints that tenants can adopt for their billing models.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsDialogOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </motion.button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Templates", value: templateList.length,
            gradient: "from-violet-600/20 via-transparent to-transparent",
            glow: "bg-violet-500/10", border: "border-violet-500/20",
            topAccent: "from-violet-500 to-purple-500",
          },
          {
            label: "Active Tenants", value: templateList.reduce((a, t) => a + t.tenants, 0),
            gradient: "from-emerald-600/20 via-transparent to-transparent",
            glow: "bg-emerald-500/10", border: "border-emerald-500/20",
            topAccent: "from-emerald-500 to-teal-500",
          },
          {
            label: "Avg Tenants / Template", value: templateList.length > 0 ? (templateList.reduce((a, t) => a + t.tenants, 0) / templateList.length).toFixed(1) : "0",
            gradient: "from-cyan-600/20 via-transparent to-transparent",
            glow: "bg-cyan-500/10", border: "border-cyan-500/20",
            topAccent: "from-cyan-500 to-sky-500",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`relative overflow-hidden p-4 bg-card border ${stat.border} rounded-2xl text-center`}
          >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${stat.topAccent} rounded-t-2xl pointer-events-none`} />
            {/* Gradient tint */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} pointer-events-none`} />
            {/* Glow orb */}
            <div className={`absolute -bottom-4 -right-4 w-16 h-16 ${stat.glow} rounded-full blur-2xl pointer-events-none`} />
            <div className="relative z-10 text-2xl font-black text-white">{stat.value}</div>
            <div className="relative z-10 text-[10px] text-muted-foreground mt-0.5 uppercase font-semibold tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templateList.map((tpl, i) => {
          const Icon = tpl.icon;
          const styles = getTemplateStyles(tpl.type);
          return (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09 }}
              whileHover={{ y: -4 }}
              className={`relative p-6 ${styles.bgClass} border ${styles.border} rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl ${styles.glow}`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${styles.bgGlow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />

              {/* Top accent bar */}
              <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${styles.topAccent} rounded-t-2xl pointer-events-none`} />

              {/* Top */}
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${tpl.gradient} rounded-xl flex items-center justify-center shadow-lg ${tpl.glow}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-white text-sm">{tpl.name}</h3>
                      {tpl.featured && (
                        <span className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded uppercase tracking-wider">Featured</span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border ${typeColors[tpl.type]}`}>
                      {tpl.type}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setMenu(menu === tpl.id ? null : tpl.id)}
                    className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {menu === tpl.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />
                      <div className="absolute right-0 mt-1 w-32 bg-[#0c0c12] border border-white/[0.08] rounded-xl shadow-xl py-1.5 z-20">
                        <button className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 flex items-center gap-2">
                          <Edit className="w-3.5 h-3.5 text-muted-foreground" /> Edit
                        </button>
                        <button className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 flex items-center gap-2">
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" /> Duplicate
                        </button>
                        <button 
                          onClick={() => deleteTemplate(tpl.id)}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed relative z-10">{tpl.description}</p>

              {/* Features */}
              <div className="space-y-1.5 mb-5 relative z-10">
                {tpl.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 relative z-10">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Base Price</span>
                  <span className="text-sm font-black text-white">{tpl.price}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span>{tpl.tenants} tenants</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Creation Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0b0b0f] border border-white/[0.08] rounded-3xl p-6 sm:p-8 max-w-md text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Create Template</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a new billing template structure that tenants can inherit.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleTemplateSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Template name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Pro SaaS Plan, Enterprise Core" className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Pricing Model Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/[0.06] text-white">
                          <SelectValue placeholder="Select plan model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0b0b0f] border border-white/[0.08] text-white">
                        <SelectItem value="Subscription">Subscription (Flat Rate)</SelectItem>
                        <SelectItem value="Usage-based">Usage-based (Metered)</SelectItem>
                        <SelectItem value="Hybrid">Hybrid (Flat + Usage)</SelectItem>
                        <SelectItem value="Custom">Custom (Negotiated)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                rules={{ required: "Price description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Price Statement</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. $49/mo, $0.05/call, Negotiated" className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Description Summary</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Full-scale subscription model..." className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="features"
                rules={{ required: "Provide at least one feature parameter" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Included Features (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. 100K API Calls, Unlimited Storage, Email Support" className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-white/[0.06] p-4 bg-white/[0.01]">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-xs font-semibold text-white">
                        Feature this template
                      </FormLabel>
                      <p className="text-[10px] text-muted-foreground">
                        Showcase this pricing plan with high priority and special badges.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 border-t border-white/[0.04] gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="bg-white/5 border border-white/[0.06] hover:bg-white/10 text-xs font-semibold rounded-xl text-white">
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-violet-600 text-xs font-bold rounded-xl text-white px-6">
                  Create Template
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
