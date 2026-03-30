import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        // 🔥 FORCE REDIRECT (reliable)
        window.location.href = "/auth";
        return;
      }

      setUser(data.user);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
