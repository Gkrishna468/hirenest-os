import { isSupabaseConnected, supabase } from "./supabase";

export type PlanTier = "starter" | "pro" | "enterprise";

export interface PlanStatus {
  tier: PlanTier;
  submissionsUsed: number;
  submissionsLimit: number | null;
  canSubmit: boolean;
  resetDate: string;
}

export const TIER_LIMITS: Record<PlanTier, number | null> = {
  starter: 3,
  pro: null,
  enterprise: null,
};

export function getPlanStatus(vendorId: string): PlanStatus {
  const key = `plan_${vendorId}`;
  const stored = JSON.parse(localStorage.getItem(key) || "{}");
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth()}`;

  if (stored.monthKey !== monthKey) {
    stored.monthKey = monthKey;
    stored.submissionsUsed = 0;
    stored.tier = stored.tier || "starter";
    localStorage.setItem(key, JSON.stringify(stored));
  }

  const tier: PlanTier = stored.tier || "starter";
  const used = stored.submissionsUsed || 0;
  const limit = TIER_LIMITS[tier];
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    tier,
    submissionsUsed: used,
    submissionsLimit: limit,
    canSubmit: limit === null || used < limit,
    resetDate: nextMonth.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
    }),
  };
}

export function recordSubmission(vendorId: string): void {
  const key = `plan_${vendorId}`;
  const stored = JSON.parse(localStorage.getItem(key) || "{}");
  stored.submissionsUsed = (stored.submissionsUsed || 0) + 1;
  localStorage.setItem(key, JSON.stringify(stored));
}

export function upgradePlan(vendorId: string, tier: PlanTier): void {
  const key = `plan_${vendorId}`;
  const stored = JSON.parse(localStorage.getItem(key) || "{}");
  stored.tier = tier;
  localStorage.setItem(key, JSON.stringify(stored));
}

export async function getPlanStatusAsync(
  vendorId: string,
): Promise<PlanStatus> {
  const syncStatus = getPlanStatus(vendorId);
  if (!isSupabaseConnected || !supabase) return syncStatus;
  try {
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();
    const { count } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", vendorId)
      .gte("created_at", startOfMonth);
    const dbCount = count || 0;
    const tier = syncStatus.tier;
    const limit = TIER_LIMITS[tier];
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return {
      tier,
      submissionsUsed: dbCount,
      submissionsLimit: limit,
      canSubmit: limit === null || dbCount < limit,
      resetDate: nextMonth.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
      }),
    };
  } catch {
    return syncStatus;
  }
}
