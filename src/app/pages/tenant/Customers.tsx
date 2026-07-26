import { motion, AnimatePresence } from "motion/react";
import { Plus, Users, Mail, Phone, MoreVertical, Edit, Trash2, MapPin, Globe, User, Briefcase, Clock, IndianRupee, CheckCircle } from "lucide-react";
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

const initialCustomers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    plan: "Pro",
    mrr: "$99",
    status: "active",
    joined: "Jan 15, 2026",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@company.com",
    plan: "Business",
    mrr: "$299",
    status: "active",
    joined: "Feb 3, 2026",
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@startup.io",
    plan: "Enterprise",
    mrr: "$999",
    status: "trial",
    joined: "Mar 20, 2026",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@tech.com",
    plan: "Pro",
    mrr: "$99",
    status: "active",
    joined: "Jan 28, 2026",
  },
];

type CustomerFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  status: string;
};

export function Customers() {
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customersList, setCustomersList] = useState(initialCustomers);

  const form = useForm<CustomerFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      status: "trial",
    },
  });

  const onSubmit = (values: CustomerFormValues) => {
    const newCustomer = {
      id: customersList.length + 1,
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      plan: "None",
      mrr: "₹0",
      status: values.status,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setCustomersList([newCustomer, ...customersList]);
    setIsDialogOpen(false);
    form.reset();
    toast.success("Customer added successfully", {
      description: `${values.firstName} has been added to your database.`,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Customers</h1>
          <p className="text-muted-foreground">Manage your customer base</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDialogOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white font-medium shadow-lg shadow-primary/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Customer</span>
        </motion.button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl p-0 rounded-2xl sm:rounded-3xl">
          <div className="p-6 sm:p-8 border-b border-border bg-muted/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold italic">Register New Customer</DialogTitle>
              <DialogDescription className="italic">
                Fill in the details below to add a new customer to your catalog.
              </DialogDescription>
            </DialogHeader>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
              {/* Identity Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <User className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">Identity</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold italic opacity-70">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} className="h-12 bg-muted/30 border-border/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold italic opacity-70">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} className="h-12 bg-muted/30 border-border/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Mail className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">Contact Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold italic opacity-70">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} className="h-12 bg-muted/30 border-border/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    rules={{ required: "Mobile number is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold italic opacity-70">Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" {...field} className="h-12 bg-muted/30 border-border/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <MapPin className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">Billing Address</span>
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold italic opacity-70">Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Business Park, Sector 62" {...field} className="h-12 bg-muted/30 border-border/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="city"
                        rules={{ required: "Required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold italic opacity-70">City</FormLabel>
                            <FormControl>
                              <Input placeholder="Noida" {...field} className="h-12 bg-muted/30 border-border/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="state"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold italic opacity-70">State</FormLabel>
                          <FormControl>
                            <Input placeholder="UP" {...field} className="h-12 bg-muted/30 border-border/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pincode"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold italic opacity-70">Pincode</FormLabel>
                          <FormControl>
                            <Input placeholder="201309" {...field} className="h-12 bg-muted/30 border-border/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="country"
                    rules={{ required: "Country is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold italic opacity-70">Country</FormLabel>
                        <FormControl>
                          <Input placeholder="India" {...field} className="h-12 bg-muted/30 border-border/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Briefcase className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">Account Settings</span>
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold italic opacity-70">Initial Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-muted/30 border-border/50">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  className="h-12 px-8 font-bold italic"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-12 px-10 bg-primary hover:bg-primary-dark text-white font-bold italic shadow-xl shadow-primary/20"
                >
                  Create Customer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Customers", value: "1,284",
            icon: Users, color: "text-violet-300",
            iconBg: "bg-violet-500/20 border border-violet-500/30",
            gradient: "from-violet-600/20 via-transparent to-transparent",
            glow: "bg-violet-500/10",
            border: "border-violet-500/20",
            topAccent: "from-violet-500 to-purple-500",
          },
          {
            label: "Active Customers", value: "892",
            icon: CheckCircle, color: "text-emerald-300",
            iconBg: "bg-emerald-500/20 border border-emerald-500/30",
            gradient: "from-emerald-600/20 via-transparent to-transparent",
            glow: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            topAccent: "from-emerald-500 to-teal-500",
          },
          {
            label: "Trial Customers", value: "48",
            icon: Clock, color: "text-amber-300",
            iconBg: "bg-amber-500/20 border border-amber-500/30",
            gradient: "from-amber-600/20 via-transparent to-transparent",
            glow: "bg-amber-500/10",
            border: "border-amber-500/20",
            topAccent: "from-amber-500 to-orange-500",
          },
          {
            label: "Total MRR", value: "₹34.6K",
            icon: IndianRupee, color: "text-cyan-300",
            iconBg: "bg-cyan-500/20 border border-cyan-500/30",
            gradient: "from-cyan-600/20 via-transparent to-transparent",
            glow: "bg-cyan-500/10",
            border: "border-cyan-500/20",
            topAccent: "from-cyan-500 to-sky-500",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden p-4 bg-card border ${stat.border} rounded-2xl flex items-center gap-3`}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${stat.topAccent} rounded-t-2xl pointer-events-none`} />
              {/* Gradient tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} pointer-events-none`} />
              {/* Glow orb */}
              <div className={`absolute -bottom-4 -right-4 w-20 h-20 ${stat.glow} rounded-full blur-2xl pointer-events-none`} />
              <div className={`relative z-10 w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative bg-card border border-violet-500/20 rounded-2xl overflow-hidden animate-fadeIn"
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
                  Customer
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Plan
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  MRR
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">
                  Joined
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customersList.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="border-b border-border hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {customer.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium">{customer.mrr}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 text-xs rounded capitalize ${customer.status === "active"
                        ? "bg-success/10 text-success"
                        : customer.status === "trial"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{customer.joined}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="relative inline-block">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowMenu(showMenu === customer.id ? null : customer.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                      <AnimatePresence>
                        {showMenu === customer.id && (
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
