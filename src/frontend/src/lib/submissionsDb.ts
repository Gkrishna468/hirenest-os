import {
  type Submission,
  createSubmission,
  getCandidates,
  getRequirements,
  getSubmissions,
} from "./db";
import { calculateMatchScore } from "./matching";
import { isSupabaseConnected, supabase } from "./supabase";

export async function getSubmissionsForRequirement(
  reqId: string,
): Promise<Submission[]> {
  if (!isSupabaseConnected || !supabase) return getSubmissions(reqId);
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("requirement_id", reqId)
    .order("created_at", { ascending: false });
  if (!data) return getSubmissions(reqId);
  const [candidates, requirements] = await Promise.all([
    getCandidates(),
    getRequirements(),
  ]);
  return data.map((s: any) => ({
    ...s,
    candidate: candidates.find((c) => c.id === s.candidate_id),
    requirement: requirements.find((r) => r.id === s.requirement_id),
  }));
}

export async function getSubmissionsForVendor(
  vendorId: string,
): Promise<Submission[]> {
  if (!isSupabaseConnected || !supabase) return getSubmissions();
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (!data?.length) return getSubmissions();
  const [candidates, requirements] = await Promise.all([
    getCandidates(),
    getRequirements(),
  ]);
  return data.map((s: any) => ({
    ...s,
    candidate: candidates.find((c) => c.id === s.candidate_id),
    requirement: requirements.find((r) => r.id === s.requirement_id),
  }));
}

export async function createSubmissionDB(data: {
  requirement_id: string;
  candidate_id: string;
  vendor_id: string;
  notes?: string;
}): Promise<Submission> {
  if (!isSupabaseConnected || !supabase) return createSubmission(data);
  const [requirements, candidates] = await Promise.all([
    getRequirements(),
    getCandidates(),
  ]);
  const req = requirements.find((r) => r.id === data.requirement_id);
  const cand = candidates.find((c) => c.id === data.candidate_id);
  const score =
    req && cand ? calculateMatchScore(req.skills, cand.skills).score : 0;
  const { data: inserted, error } = await supabase
    .from("submissions")
    .insert({
      requirement_id: data.requirement_id,
      candidate_id: data.candidate_id,
      vendor_id: data.vendor_id,
      match_score: score,
      status: "submitted",
      notes: data.notes || "",
    })
    .select()
    .single();
  if (error || !inserted) return createSubmission(data);
  return { ...inserted, candidate: cand, requirement: req };
}

export async function updateSubmissionStatusDB(
  id: string,
  status: Submission["status"],
): Promise<void> {
  if (!isSupabaseConnected || !supabase) return;
  await supabase.from("submissions").update({ status }).eq("id", id);
}

export async function getMonthlySubmissionCount(
  vendorId: string,
): Promise<number> {
  if (!isSupabaseConnected || !supabase) return 0;
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
  return count || 0;
}

export function subscribeToRequirementSubmissions(
  reqId: string,
  onUpdate: (subs: Submission[]) => void,
): () => void {
  if (!isSupabaseConnected || !supabase) return () => {};
  const channel = supabase
    .channel(`subs-req-${reqId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "submissions",
        filter: `requirement_id=eq.${reqId}`,
      },
      async () => {
        const subs = await getSubmissionsForRequirement(reqId);
        onUpdate(subs);
      },
    )
    .subscribe();
  return () => {
    supabase?.removeChannel(channel);
  };
}
