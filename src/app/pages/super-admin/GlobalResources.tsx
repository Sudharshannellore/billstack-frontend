import { motion, AnimatePresence } from "motion/react";
import { 
  Database, 
  Plus, 
  Cpu, 
  HardDrive, 
  Zap,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  TrendingUp,
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

const resources = [
  { 
    id: 1, 
    name: "TRADES", 
    type: "Unit", 
    description: "Stock trading transactions consumption", 
    price: "$0.10/trade", 
    usageThisMonth: 482000,
    growth: "+14%",
    icon: TrendingUp,
    color: "from-primary/20 to-violet-500/10",
    iconColor: "text-primary"
  },
  { 
    id: 2, 
    name: "API_CALLS", 
    type: "Unit", 
    description: "Metered API request gateway consumption", 
    price: "$0.001/call", 
    usageThisMonth: 18400000,
    growth: "+32%",
    icon: Zap,
    color: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400"
  },
  { 
    id: 3, 
    name: "DATA_GB", 
    type: "Unit", 
    description: "Cloud storage disk usage in gigabytes", 
    price: "$0.50/GB", 
    usageThisMonth: 3240,
    growth: "+9%",
    icon: HardDrive,
    color: "from-cyan-500/20 to-sky-500/10",
    iconColor: "text-cyan-400"
  },
  { 
    id: 4, 
    name: "COMPUTE_HOURS", 
    type: "Unit", 
    description: "vCPU compute-hours from cloud workloads", 
    price: "$0.08/hr", 
    usageThisMonth: 9800,
    growth: "+21%",
    icon: Cpu,
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400"
  },
];

type ResourceFormValues = {
  name: string;
  type: string;
  description: string;
  price: string;
  iconType: "Cpu" | "HardDrive" | "Zap" | "TrendingUp";
};

const iconMap = {
  Cpu: Cpu,
  HardDrive: HardDrive,
  Zap: Zap,
  TrendingUp: TrendingUp,
};

const colorMap = {
  Cpu: { color: "from-emerald-500/20 to-teal-500/10", iconColor: "text-emerald-400" },
  HardDrive: { color: "from-cyan-500/20 to-sky-500/10", iconColor: "text-cyan-400" },
  Zap: { color: "from-amber-500/20 to-orange-500/10", iconColor: "text-amber-400" },
  TrendingUp: { color: "from-primary/20 to-violet-500/10", iconColor: "text-primary" },
};

export function GlobalResources() {
  const [resourceList, setResourceList] = useState(resources);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ResourceFormValues>({
    defaultValues: {
      name: "",
      type: "Unit",
      description: "",
      price: "",
      iconType: "Zap",
    },
  });

  const handleResourceSubmit = (values: ResourceFormValues) => {
    const formattedPrice = values.price.startsWith("$") ? values.price : `$${values.price}`;
    const newResource = {
      id: resourceList.length + 1,
      name: values.name.toUpperCase().replace(/\s+/g, "_"),
      type: values.type,
      description: values.description,
      price: formattedPrice.includes("/") ? formattedPrice : `${formattedPrice}/${values.name.toLowerCase()}`,
      usageThisMonth: 0,
      growth: "+0%",
      icon: iconMap[values.iconType] || HelpCircle,
      ...colorMap[values.iconType]
    };

    setResourceList(prev => [...prev, newResource]);
    setIsDialogOpen(false);
    form.reset();
    toast.success("Global resource created successfully!");
  };

  const deleteResource = (id: number) => {
    setResourceList(prev => prev.filter(r => r.id !== id));
    toast.success("Resource deleted successfully!");
    setShowMenu(null);
  };

  const getResourceStyles = (iconColor: string) => {
    const baseColor = iconColor.replace("text-", "").split("-")[0]; // e.g. "amber", "cyan", "emerald", "primary"
    const color = baseColor === "primary" ? "purple" : baseColor;
    const accentMap: Record<string, string> = {
      purple:  "from-purple-500 to-violet-500",
      emerald: "from-emerald-500 to-teal-500",
      amber:   "from-amber-500 to-orange-500",
      cyan:    "from-cyan-500 to-sky-500",
      rose:    "from-rose-500 to-pink-500",
      indigo:  "from-indigo-500 to-violet-500",
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Global Resources</h1>
          <p className="text-muted-foreground text-sm">Define and manage platform-wide metered billing resource units available to all tenants.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsDialogOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Resource</span>
        </motion.button>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resourceList.map((resource, index) => {
          const Icon = resource.icon;
          const styles = getResourceStyles(resource.iconColor);
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className={`relative p-6 ${styles.bgClass} border ${styles.border} rounded-2xl hover:shadow-xl ${styles.glow} transition-all duration-300 flex flex-col justify-between gap-6 group overflow-hidden`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${styles.topAccent} rounded-t-2xl pointer-events-none`} />
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${styles.bgGlow} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />

              {/* Top row */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${resource.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-black text-white font-mono tracking-wider text-sm">{resource.name}</h3>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{resource.type}</span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === resource.id ? null : resource.id)}
                    className="p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {showMenu === resource.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowMenu(null)} />
                      <div className="absolute right-0 mt-1 w-32 bg-[#0c0c12] border border-white/[0.08] rounded-xl shadow-xl py-1.5 z-20">
                        <button className="w-full px-4 py-2 text-left text-xs font-semibold text-white hover:bg-white/5 flex items-center gap-2">
                          <Edit className="w-3.5 h-3.5 text-muted-foreground" /> Edit
                        </button>
                        <button 
                          onClick={() => deleteResource(resource.id)}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground font-light leading-relaxed relative z-10">{resource.description}</p>

              {/* Bottom Stats Row */}
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 relative z-10">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider block mb-0.5">Unit Price</span>
                  <span className="text-sm font-black text-white">{resource.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider block mb-0.5">Usage This Month</span>
                  <span className="text-sm font-black text-white">{resource.usageThisMonth.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {resource.growth}
                  </span>
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
              <Database className="w-5 h-5 text-primary" />
              <span>Create Resource</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a new platform-wide billing metric for metered consumption.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleResourceSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Resource name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Resource Identifier</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. API_CALLS, STORAGE_GB, TRADES" className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white uppercase" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Resource Type</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Unit, Gigabytes, Seconds" className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white" {...field} />
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
                    <FormLabel className="text-xs font-semibold text-white">Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Explain the consumption parameter..." className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                rules={{ required: "Price definition is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Unit Price (USD)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. 0.05 (for $0.05/unit)" className="bg-white/5 border-white/[0.06] focus:border-primary text-sm rounded-xl py-2 px-3 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iconType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-white">Visual Icon Indicator</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/[0.06] text-white">
                          <SelectValue placeholder="Select icon type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0b0b0f] border border-white/[0.08] text-white">
                        <SelectItem value="Zap">Zap (API, requests)</SelectItem>
                        <SelectItem value="Cpu">Cpu (Compute, instances)</SelectItem>
                        <SelectItem value="HardDrive">Hard Drive (Storage, DB)</SelectItem>
                        <SelectItem value="TrendingUp">Trending Up (Fintech, trades)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 border-t border-white/[0.04] gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="bg-white/5 border border-white/[0.06] hover:bg-white/10 text-xs font-semibold rounded-xl text-white">
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-violet-600 text-xs font-bold rounded-xl text-white px-6">
                  Create Resource
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
