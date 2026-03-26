import { useEffect, useRef, useState } from "react";

const PASSPHRASE = "hirenest2026";
const SESSION_KEY = "hn_admin_auth";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleUnlock = () => {
    if (input === PASSPHRASE) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect passphrase");
      setInput("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setInput("");
    setError("");
  };

  return {
    isAuthenticated,
    input,
    setInput,
    error,
    setError,
    inputRef,
    handleUnlock,
    handleLock,
  };
}
