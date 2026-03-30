import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("vendor");

  const handleAuth = async () => {
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      // ✅ GET USER ROLE FROM DB
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user?.id)
        .single();

      // ✅ STORE ROLE (used in your guards)
      localStorage.setItem("role", profile?.role || "vendor");

      // 🔥 REDIRECT BASED ON ROLE
      if (profile?.role === "vendor") {
        window.location.href = "/vendor/dashboard";
      } else if (profile?.role === "client") {
        window.location.href = "/client/dashboard";
      } else if (profile?.role === "recruiter") {
        window.location.href = "/recruiter/dashboard";
      } else {
        window.location.href = "/";
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      // ✅ Save role
      await supabase.from("profiles").insert({
        id: data.user?.id,
        role: role,
      });

      alert("Signup successful 🎉");

      // 🔥 After signup → go to login
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 border rounded w-96 bg-white">
        <h2 className="text-xl font-bold mb-4">
          {isLogin ? "Login" : "Signup"}
        </h2>

        {!isLogin && (
          <select
            className="w-full mb-3 p-2 border"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="vendor">Vendor</option>
            <option value="client">Client</option>
            <option value="recruiter">Recruiter</option>
          </select>
        )}

        <input
          className="w-full mb-3 p-2 border"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 border"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          onClick={handleAuth}
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          className="mt-3 text-sm cursor-pointer text-blue-500"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
