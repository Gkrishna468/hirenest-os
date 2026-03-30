import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "@tanstack/react-router";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        navigate({ to: "/auth" });
      } else {
        setUser(data.user);
      }

      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
