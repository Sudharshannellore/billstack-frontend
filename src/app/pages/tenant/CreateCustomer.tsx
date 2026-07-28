import { ArrowLeft, Mail, MapPin, User, Briefcase } from "lucide-react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { cn } from "../../components/ui/utils";

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

interface CreateCustomerProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateCustomer({ onSuccess, onCancel }: CreateCustomerProps) {
  const navigate = useNavigate();

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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/tenant/customers");
    }
  };

  const onSubmit = (values: CustomerFormValues) => {
    console.log("Submitting customer:", values);

    toast.success("Customer added successfully", {
      description: `${values.firstName} has been added to your database.`,
    });

    form.reset();

    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/tenant/customers");
    }
  };

  return (
    <div className={cn("mx-auto space-y-8 pb-10", !onSuccess && "max-w-4xl")}>
      {/* Header - Only show if not in Dialog */}
      {!onSuccess && (
        <div className="flex flex-col gap-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Customers</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                New Customer
              </h1>
              <p className="text-muted-foreground text-lg italic">
                Fill in the details below to add a new customer to your catalog.
              </p>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-card border border-border p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm"
        >
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

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
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
          </div>
        </form>
      </Form>
    </div>
  );
}
