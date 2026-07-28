import { useNavigate } from "react-router";
import { ArrowLeft, Building2 } from "lucide-react";
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

type TenantFormValues = {
  name: string;
  email: string;
  status: "active" | "pending";
  plan: string;
};

interface CreateTenantProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTenant({ onSuccess, onCancel }: CreateTenantProps) {
  const navigate = useNavigate();

  const form = useForm<TenantFormValues>({
    defaultValues: {
      name: "",
      email: "",
      status: "active",
      plan: "SaaS Starter",
    },
  });

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/super-admin/tenants");
    }
  };

  const handleTenantSubmit = (values: TenantFormValues) => {
    console.log("Submitting new tenant:", values);
    toast.success("Tenant created successfully!");
    form.reset();
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/super-admin/tenants");
    }
  };

  return (
    <div className={cn("mx-auto space-y-8 pb-10", !onSuccess && "max-w-2xl")}>
      {/* Header - Only show if not in Dialog */}
      {!onSuccess && (
        <div className="flex flex-col gap-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Tenants</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Create Tenant
              </h1>
              <p className="text-muted-foreground text-lg italic">
                Register a new tenant organization on the platform.
              </p>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleTenantSubmit)}
          className="space-y-6 bg-card border border-border p-8 rounded-3xl shadow-sm"
        >
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Organization name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold italic">Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Corporation" className="h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Administrator email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold italic">Administrator Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="admin@acme.com" className="h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold italic">Initial Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select initial status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold italic">Billing Plan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select billing plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SaaS Starter">SaaS Starter</SelectItem>
                    <SelectItem value="API Usage">API Usage</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={handleCancel} className="font-bold italic border-2">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark font-bold italic shadow-xl shadow-primary/20 px-8"
            >
              Add Tenant
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
