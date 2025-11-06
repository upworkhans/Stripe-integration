export type PartialPlan = {
  id: string;
  customer: string;
  paymentMethod: string;
  currency: string;
  total: number;
  deposit: number;
  remaining: number;
  createdAt: number;
  completed: boolean;
};

const id = () => Math.random().toString(36).slice(2, 10);

const plans = new Map<string, PartialPlan>();

export function createPlan(input: Omit<PartialPlan, 'id' | 'createdAt' | 'completed'>): PartialPlan {
  const plan: PartialPlan = { id: id(), createdAt: Date.now(), completed: false, ...input };
  plans.set(plan.id, plan);
  return plan;
}

export function getPlan(planId: string): PartialPlan | undefined {
  return plans.get(planId);
}

export function markCompleted(planId: string) {
  const p = plans.get(planId);
  if (p) {
    p.completed = true;
    plans.set(planId, p);
  }
}


