type Role = "admin" | "client" | "vendor" | "recruiter" | null;

export function getCurrentRole(): Role {
  return (localStorage.getItem("hirenest_role") as Role) ?? null;
}

export function setCurrentRole(role: Role): void {
  if (role) localStorage.setItem("hirenest_role", role);
  else localStorage.removeItem("hirenest_role");
}

export function clearRole(): void {
  localStorage.removeItem("hirenest_role");
}

export type { Role };
