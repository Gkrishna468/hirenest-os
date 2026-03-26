import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { motion } from "motion/react";

interface AdminLockScreenProps {
  input: string;
  setInput: (v: string) => void;
  error: string;
  setError: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUnlock: () => void;
}

export function AdminLockScreen({
  input,
  setInput,
  error,
  setError,
  inputRef,
  onUnlock,
}: AdminLockScreenProps) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <Lock className="h-8 w-8 text-sky-600" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground font-display mb-1">
              Admin Access Required
            </h1>
            <p className="text-sm text-muted-foreground">
              This area is restricted to HireNest administrators.
            </p>
          </div>
          <div className="w-full space-y-3">
            <Input
              ref={inputRef}
              type="password"
              placeholder="Enter admin passphrase"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && onUnlock()}
              className="text-center tracking-widest"
              data-ocid="admin.input"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 text-center"
                data-ocid="admin.error_state"
              >
                {error}
              </motion.p>
            )}
            <Button
              className="w-full bg-sky-600 hover:bg-sky-700 text-white"
              onClick={onUnlock}
              data-ocid="admin.submit_button"
            >
              <Lock className="h-4 w-4 mr-2" />
              Unlock
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
