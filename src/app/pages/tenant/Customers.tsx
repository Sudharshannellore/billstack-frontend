import { motion, AnimatePresence } from "motion/react";
import { Plus, Users, Mail, Phone, MoreVertical, Edit, Trash2, MapPin, Globe, User, Briefcase } from "lucide-react";
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-card border border-border rounded-xl"
        >
          <div className="text-3xl font-bold mb-1">1,284</div>
          <div className="text-sm text-muted-foreground">Total Customers</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-card border border-border rounded-xl"
        >
          <div className="text-3xl font-bold mb-1">892</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-card border border-border rounded-xl"
        >
          <div className="text-3xl font-bold mb-1">48</div>
          <div className="text-sm text-muted-foreground">Trial</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-card border border-border rounded-xl"
        >
          <div className="text-3xl font-bold mb-1">$34.6K</div>
          <div className="text-sm text-muted-foreground">Total MRR</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
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
                    className={`px-2 py-1 text-xs rounded capitalize ${
                      customer.status === "active"
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
      </motion.div>
    </motion.div>
  );
}
