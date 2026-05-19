import { createClient } from "@/lib/supabase/server";
import type { AdminOverviewData } from "@/lib/types";

export async function getAdminOverview(): Promise<AdminOverviewData> {
  const supabase = await createClient();

  const [
    { count: users },
    { count: pharmacies },
    { count: medicines },
    { count: stockItems },
    { data: userRows, error: usersError },
    { data: pharmacyRows, error: pharmacyRowsError }
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("pharmacies").select("*", { count: "exact", head: true }),
    supabase.from("medicines").select("*", { count: "exact", head: true }),
    supabase.from("stock").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("id, email, full_name, role").order("created_at", { ascending: false }).limit(20),
    supabase.from("pharmacies").select(`id, name, city, phone, profiles:user_id (email)`).order("created_at", { ascending: false }).limit(12)
  ]);

  if (usersError) throw new Error(usersError.message);
  if (pharmacyRowsError) throw new Error(pharmacyRowsError.message);

  return {
    metrics: {
      users: users ?? 0,
      pharmacies: pharmacies ?? 0,
      medicines: medicines ?? 0,
      stockItems: stockItems ?? 0
    },
    users: (userRows ?? []).map((row) => ({ id: row.id, email: row.email, fullName: row.full_name, role: row.role })),
    pharmacies: (pharmacyRows ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      city: row.city,
      phone: row.phone,
      ownerEmail: Array.isArray(row.profiles) ? row.profiles[0]?.email ?? null : (row.profiles as { email?: string } | null)?.email ?? null
    }))
  };
}
