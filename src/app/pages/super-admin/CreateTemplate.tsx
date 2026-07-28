import { ArrowLeft, FileText, Star, Zap, Layers, Users, HelpCircle } from "lucide-react";
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
import { Checkbox } from "../../components/ui/checkbox";
import { cn } from "../../components/ui/utils";
import { getCardTheme } from "../../components/cardThemes";

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

export interface CreatedTemplate {
  id: number;
  name: string;
  type: TemplateFormValues["type"];
  price: string;
  tenants: number;
  featured: boolean;
  description: string;
  features: string[];
  icon: typeof HelpCircle;
  gradient: string;
  glow: string;
}

interface CreateTemplateProps {
  onSuccess?: (template: CreatedTemplate) => void;
  onCancel?: () => void;
}

export function CreateTemplate({ onSuccess, onCancel }: CreateTemplateProps) {
  const navigate = useNavigate();

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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/super-admin/templates");
    }
  };

  const handleTemplateSubmit = (values: TemplateFormValues) => {
    const featureArray = values.features
      .split(",")
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const theme = getCardTheme(values.type || values.name);

    const newTemplate: CreatedTemplate = {
      id: Date.now(),
      name: values.name,
      type: values.type,
      price: values.price,
      tenants: 0,
      featured: values.featured,
      description: values.description,
      features: featureArray.length > 0 ? featureArray : ["Standard features included"],
      icon: iconMap[values.type] || HelpCircle,
      gradient: theme.topAccent,
      glow: theme.glow,
    };

    toast.success("Pricing template created successfully!");
    form.reset();

    if (onSuccess) {
      onSuccess(newTemplate);
    } else {
      navigate("/super-admin/templates");
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
            <span className="text-sm font-medium">Back to Templates</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-1">
                Create Template
              </h1>
              <p className="text-muted-foreground text-sm">
                Define a new billing template structure that tenants can inherit.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleTemplateSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Template name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Pro SaaS Plan, Enterprise Core" className="h-11" {...field} />
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
                  <FormLabel className="text-sm font-semibold">Pricing Model Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select plan model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                  <FormLabel className="text-sm font-semibold">Price Statement</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. $49/mo, $0.05/call, Negotiated" className="h-11" {...field} />
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
                  <FormLabel className="text-sm font-semibold">Description Summary</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. Full-scale subscription model..." className="h-11" {...field} />
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
                  <FormLabel className="text-sm font-semibold">Included Features (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g. 100K API Calls, Unlimited Storage, Email Support" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border p-4 bg-muted/30">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-semibold">
                      Feature this template
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Showcase this pricing plan with high priority and special badges.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={handleCancel} className="font-semibold">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-primary via-violet-600 to-purple-700 font-bold px-6">
                Create Template
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
