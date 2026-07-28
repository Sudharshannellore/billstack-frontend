import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { cn } from "../../components/ui/utils";

// Mock Data (mirrors Subscriptions.tsx)
const MOCK_TOPUPS = [
  { id: "topup_1", productId: "prod_1", planId: "plan_1_1", name: "1000 Extra API Calls", price: "₹10" },
  { id: "topup_2", productId: "prod_1", planId: "plan_1_2", name: "50GB Extra Storage", price: "₹20" },
  { id: "topup_3", productId: "prod_3", planId: "plan_3_1", name: "10GB Extra Bandwidth", price: "₹15" },
];

const initialSubscriptions = [
  { id: 1, customer: "Alice Johnson", productId: "prod_1", planId: "plan_1_2", plan: "Pro", status: "active", nextBilling: "Apr 15, 2026", mrr: "₹99" },
  { id: 2, customer: "Bob Smith", productId: "prod_3", planId: "plan_3_2", plan: "Ultra Pack", status: "active", nextBilling: "Apr 18, 2026", mrr: "₹50" },
  { id: 3, customer: "Carol White", productId: "prod_1", planId: "plan_1_3", plan: "Enterprise", status: "trial", nextBilling: "Apr 20, 2026", mrr: "₹499" },
];

interface AddSubscriptionTopupProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddSubscriptionTopup({ onSuccess, onCancel }: AddSubscriptionTopupProps) {
  const navigate = useNavigate();
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const [topupValue, setTopupValue] = useState<string>("none");

  const subscription = initialSubscriptions.find((s) => s.id === Number(subscriptionId));

  const availableTopups = subscription
    ? MOCK_TOPUPS.filter((t) => t.productId === subscription.productId && t.planId === subscription.planId)
    : [];

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/tenant/subscriptions");
    }
  };

  const handleApply = () => {
    const selectedTopup = MOCK_TOPUPS.find((t) => t.id === topupValue);
    if (!subscription || !selectedTopup) return;

    console.log("Applying topup:", { subscriptionId: subscription.id, topup: selectedTopup });

    toast.success("Topup Applied", { description: `${selectedTopup.name} successfully applied.` });
    setTopupValue("none");

    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/tenant/subscriptions");
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
            <span className="text-sm font-medium">Back to Subscriptions</span>
          </button>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Add Topup
            </h1>
            <p className="text-muted-foreground text-lg italic">
              {subscription
                ? `Select an available topup to immediately upgrade ${subscription.customer}'s subscription.`
                : "Subscription not found."}
            </p>
          </div>
        </div>
      )}

      <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        {subscription ? (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold">{subscription.customer}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{subscription.plan} &middot; {subscription.mrr}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-70">Available Topups</label>
              <Select value={topupValue} onValueChange={setTopupValue}>
                <SelectTrigger className="h-12 text-sm bg-muted/30 border-border">
                  <SelectValue placeholder="Select a topup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Topup</SelectItem>
                  {availableTopups.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name} ({t.price})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableTopups.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center p-3 bg-muted rounded-lg">
                  No topups available for this product/plan combination.
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic text-center p-3">
            We couldn't find that subscription. It may have been removed.
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={handleCancel} className="font-bold italic h-11">
            Cancel
          </Button>
          <Button
            disabled={topupValue === "none" || !subscription}
            onClick={handleApply}
            className="bg-primary hover:bg-primary-dark text-white font-bold italic shadow-lg shadow-primary/20 h-11 px-8"
          >
            Apply Topup
          </Button>
        </div>
      </div>
    </div>
  );
}
