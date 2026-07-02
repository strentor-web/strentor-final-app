import { SubscriptionPlan } from "@/types/subscription";

// Temporary static plans; replace with real DB fetch later.
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "fitness_q",
    name: "Fitness Quarterly",
    category: "FITNESS",
    plan_type: "ONLINE",
    price: 21000,
    features: [
      { name: "Everything in Fitness Quarterly", included: true },
      { name: "3-month discounted billing", included: true },
    ],
    razorpay_plan_id: "plan_Qpm6Y0UaT0Cu", // placeholder
    billing_cycle: 3,
  },
  {
    id: "fitness_sa",
    name: "Fitness Semi-Annual",
    category: "FITNESS",
    plan_type: "ONLINE",
    price: 110000,
    features: [
      { name: "Everything in Fitness Semi-Annual", included: true },
      { name: "6-month discounted billing", included: true },
    ],
    razorpay_plan_id: "plan_Qpm1PvU1aVDX8", // placeholder
    billing_cycle: 6,
  },
  {
    id: "fitness_a",
    name: "Fitness Annual",
    category: "FITNESS",
    plan_type: "ONLINE",
    price: 210000,
    features: [
      { name: "Everything in Fitness Annual", included: true },
      { name: "12-month discounted billing", included: true },
    ],
    razorpay_plan_id: "plan_Qpm6Y0UaT0Cu", // placeholder
    billing_cycle: 12,
  },

  {
    id: "aio_q",
    name: "All-In-One Quarterly",
    category: "ALL_IN_ONE",
    plan_type: "ONLINE",
    price: 202500,
    features: [
      { name: "Kickstart Deep-Dive Coaching", included: true },
      { name: "Monthly 1:1 Strategy & Evaluation", included: true },
    ],
    razorpay_plan_id: "plan_Qpn1PYRkSnVS6F", // placeholder
    billing_cycle: 3,
  },
  {
    id: "aio_sa",
    name: "All-In-One Semi-Annual",
    category: "ALL_IN_ONE",
    plan_type: "ONLINE",
    price: 336000,
    features: [
      { name: "Everything in All-In-One Semi-Annual", included: true },
      { name: "6-month discounted billing", included: true },
    ],
    razorpay_plan_id: "plan_QpnWMvS0Uljx8", // placeholder
    billing_cycle: 6,
  },
  {
    id: "aio_a",
    name: "All-In-One Annual",
    category: "ALL_IN_ONE",
    plan_type: "ONLINE",
    price: 630000,
    features: [
      { name: "Everything in All-In-One Annual", included: true },
      { name: "12-month discounted billing", included: true },
    ],
    razorpay_plan_id: "plan_QpnNBl8mqivid", // placeholder
    billing_cycle: 12,
  },
]; 