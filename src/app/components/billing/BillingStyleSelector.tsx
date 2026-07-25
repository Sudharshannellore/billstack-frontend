import React from "react";
import { motion } from "motion/react";
import { 
  CreditCard, 
  Database, 
  Coins, 
  Zap,
  CheckCircle2
} from "lucide-react";
import { cn } from "../ui/utils";

export type BillingStyle = "subscription" | "telecom" | "credits" | "usage";

interface BillingStyleOption {
  id: BillingStyle;
  title: string;
  description: string;
  icon: React.ElementType;
}

const billingStyles: BillingStyleOption[] = [
  {
    id: "subscription",
    title: "Subscription",
    description: "Netflix-style recurring plans with fixed periodic charges.",
    icon: CreditCard,
  },
  {
    id: "telecom",
    title: "Data Packs",
    description: "Telecom style packs like Airtel/Jio with validity and limits.",
    icon: Database,
  },
  {
    id: "credits",
    title: "Credits",
    description: "Wallet/token-based system for consumption-based services.",
    icon: Coins,
  },
  {
    id: "usage",
    title: "Usage-based",
    description: "Pay-as-you-go pricing based on units like APIs or SMS.",
    icon: Zap,
  },
];

interface BillingStyleSelectorProps {
  value: BillingStyle | null;
  onChange: (value: BillingStyle) => void;
}

export const BillingStyleSelector: React.FC<BillingStyleSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
      {billingStyles.map((style) => {
        const Icon = style.icon;
        const isSelected = value === style.id;

        return (
          <motion.div
            key={style.id}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(style.id)}
            className={cn(
              "relative cursor-pointer group p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all duration-500 overflow-hidden",
              isSelected 
                ? "border-primary bg-primary/10 shadow-2xl shadow-primary/20 ring-1 ring-primary/30" 
                : "border-border bg-card/40 hover:border-primary/40 hover:bg-muted/50"
            )}
          >
            {/* Background Gradient Glow */}
            <div className={cn(
              "absolute -top-12 -right-12 w-24 h-24 bg-primary/20 blur-3xl rounded-full transition-opacity duration-500",
              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )} />

            <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
              <div className={cn(
                "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
                isSelected 
                  ? "bg-primary text-white scale-110 shadow-primary/40" 
                  : "bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110"
              )}>
                <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <h3 className={cn(
                  "font-black text-base sm:text-lg tracking-tight transition-colors",
                  isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {style.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium leading-[1.4] italic opacity-80 line-clamp-2">
                  {style.description}
                </p>
              </div>
            </div>

            {isSelected && (
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20"
              >
                <div className="bg-primary text-white p-0.5 sm:p-1 rounded-full shadow-lg">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </motion.div>
            )}
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
};
