import { ArrowLeft, Database, Cpu, HardDrive, Zap, TrendingUp } from "lucide-react";
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

type ResourceFormValues = {
  name: string;
  type: string;
  description: string;
  price: string;
  iconType: "Cpu" | "HardDrive" | "Zap" | "TrendingUp";
};

interface CreateResourceProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateResource({ onSuccess, onCancel }: CreateResourceProps) {
  const navigate = useNavigate();

  const form = useForm<ResourceFormValues>({
    defaultValues: {
      name: "",
      type: "Unit",
      description: "",
      price: "",
      iconType: "Zap",
    },
  });

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/super-admin/resources");
    }
  };

  const handleResourceSubmit = (values: ResourceFormValues) => {
    console.log("Submitting payload:", values);
    toast.success("Global resource created successfully!");
    form.reset();
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/super-admin/resources");
    }
  };

  return (
    <div className={cn("mx-auto space-y-8 pb-10", !onSuccess && "max-w-3xl")}>
      {/* Header - Only show if not in Dialog */}
      {!onSuccess && (
        <div className="flex flex-col gap-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Resources</span>
          </button>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Create Resource
            </h1>
            <p className="text-muted-foreground text-lg italic">
              Define a new platform-wide billing metric for metered consumption.
            </p>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
        {!onSuccess && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold italic underline decoration-primary/30 underline-offset-8">
              Resource Details
            </h2>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleResourceSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Resource name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold italic">Resource Identifier</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g. API_CALLS, STORAGE_GB, TRADES"
                      className="h-12 uppercase"
                      {...field}
                    />
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
                  <FormLabel className="text-sm font-bold italic">Resource Type</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Unit, Gigabytes, Seconds" className="h-12" {...field} />
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
                  <FormLabel className="text-sm font-bold italic">Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Explain the consumption parameter..." className="h-12" {...field} />
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
                  <FormLabel className="text-sm font-bold italic">Unit Price (USD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                      <Input
                        placeholder="E.g. 0.05 (for $0.05/unit)"
                        className="pl-8 h-12"
                        {...field}
                      />
                    </div>
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
                  <FormLabel className="text-sm font-bold italic">Visual Icon Indicator</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select icon type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Zap">
                        <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Zap (API, requests)</span>
                      </SelectItem>
                      <SelectItem value="Cpu">
                        <span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Cpu (Compute, instances)</span>
                      </SelectItem>
                      <SelectItem value="HardDrive">
                        <span className="flex items-center gap-2"><HardDrive className="w-4 h-4" /> Hard Drive (Storage, DB)</span>
                      </SelectItem>
                      <SelectItem value="TrendingUp">
                        <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Trending Up (Fintech, trades)</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={handleCancel} className="h-12 px-8 font-bold italic border-2">
                Cancel
              </Button>
              <Button type="submit" className="h-12 px-10 bg-primary hover:bg-primary-dark font-bold italic shadow-xl shadow-primary/20">
                Create Resource
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
