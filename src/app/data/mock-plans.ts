export type BillingStyle = "subscription" | "telecom" | "credits" | "usage";

export interface Plan {
  id: string;
  name: string;
  billingStyle: BillingStyle;
  price: string;
}

export interface Product {
  id: string;
  name: string;
  billingStyle: BillingStyle;
  plans: Plan[];
  currency?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Cloud Storage API",
    billingStyle: "subscription",
    currency: "INR",
    plans: [
      { id: "plan_1_1", name: "Starter", billingStyle: "subscription", price: "₹29/mo" },
      { id: "plan_1_2", name: "Pro", billingStyle: "subscription", price: "₹99/mo" },
      { id: "plan_1_3", name: "Enterprise", billingStyle: "subscription", price: "₹499/mo" },
    ],
  },
  {
    id: "prod_2",
    name: "Analytics Platform",
    billingStyle: "usage",
    currency: "USD",
    plans: [
      { id: "plan_2_1", name: "Pay as you go", billingStyle: "usage", price: "₹0.05/query" },
      { id: "plan_2_2", name: "Developer Pack", billingStyle: "credits", price: "₹50 for 1000 credits" },
    ],
  },
  {
    id: "prod_3",
    name: "Video Streaming API",
    billingStyle: "telecom",
    currency: "INR",
    plans: [
      { id: "plan_3_1", name: "Basic Pack", billingStyle: "telecom", price: "₹10 for 10GB" },
      { id: "plan_3_2", name: "Ultra Pack", billingStyle: "telecom", price: "₹50 for 100GB" },
    ],
  },
];
