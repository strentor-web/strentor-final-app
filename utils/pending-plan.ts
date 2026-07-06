export const PENDING_PLAN_KEY = "strentor_pending_plan";

export interface PendingPlan {
  sessionsPerWeek: number;
  billingCycle: number;
}

export function savePendingPlan(plan: PendingPlan) {
  localStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(plan));
}
