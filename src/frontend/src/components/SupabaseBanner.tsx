import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SUPABASE_SCHEMA, isSupabaseConnected } from "@/lib/supabase";
import { Check, Copy, Database, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SupabaseBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [showRequestAccess, setShowRequestAccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isSupabaseConnected || dismissed) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestAccess = async () => {
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 600));
    setSubmitting(false);
    setShowRequestAccess(false);
    setRequestName("");
    setRequestEmail("");
    toast.success("Request received! We'll be in touch within 24 hours.");
  };

  return (
    <>
      <div
        className="bg-orange/10 border-b border-orange/20 px-4 py-2.5 flex items-center justify-between gap-4"
        data-ocid="supabase.toast"
      >
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <Database className="h-4 w-4 text-orange flex-shrink-0" />
          <span className="text-muted-foreground">
            <span className="text-orange font-semibold">Demo Mode</span> — App
            is running with mock data.
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-orange hover:text-orange hover:bg-orange/10"
            onClick={() => setShowSchema(true)}
            data-ocid="supabase.open_modal_button"
          >
            Connect Supabase →
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-teal hover:text-teal hover:bg-teal/10 border border-teal/20"
            onClick={() => setShowRequestAccess(true)}
            data-ocid="supabase.secondary_button"
          >
            ✦ Request Access
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground"
          data-ocid="supabase.close_button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Connect Supabase dialog */}
      <Dialog open={showSchema} onOpenChange={setShowSchema}>
        <DialogContent
          className="max-w-2xl bg-card border-border"
          data-ocid="supabase.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Database className="h-5 w-5 text-teal" /> Connect Supabase to
              HireNest OS
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>
                Create a project at{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal"
                >
                  supabase.com
                </a>
              </li>
              <li>Copy the SQL below and run it in your Supabase SQL Editor</li>
              <li>
                Add{" "}
                <code className="bg-muted px-1 rounded text-xs">
                  VITE_SUPABASE_URL
                </code>{" "}
                and{" "}
                <code className="bg-muted px-1 rounded text-xs">
                  VITE_SUPABASE_ANON_KEY
                </code>{" "}
                to your environment
              </li>
              <li>
                Redeploy — real-time data persistence will activate
                automatically
              </li>
            </ol>
            <div className="relative">
              <pre className="bg-muted rounded-lg p-3 text-xs text-muted-foreground overflow-auto max-h-64 font-mono">
                {SUPABASE_SCHEMA}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-7 px-2 border-border"
                onClick={handleCopy}
                data-ocid="supabase.toggle"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-teal" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <Button
              className="w-full bg-teal text-background hover:bg-teal-600"
              onClick={() => setShowSchema(false)}
              data-ocid="supabase.confirm_button"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Access dialog */}
      <Dialog open={showRequestAccess} onOpenChange={setShowRequestAccess}>
        <DialogContent
          className="max-w-md bg-card border-border"
          data-ocid="access.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              ✦ Request Early Access
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Join leading IT firms already using HireNest OS. We&apos;ll reach
            out within 24 hours with onboarding details.
          </p>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="req-name" className="text-sm text-foreground">
                Full Name
              </Label>
              <Input
                id="req-name"
                placeholder="Rajesh Kumar"
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
                className="bg-muted border-border"
                data-ocid="access.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="req-email" className="text-sm text-foreground">
                Work Email
              </Label>
              <Input
                id="req-email"
                type="email"
                placeholder="rajesh@company.com"
                value={requestEmail}
                onChange={(e) => setRequestEmail(e.target.value)}
                className="bg-muted border-border"
                data-ocid="access.search_input"
              />
            </div>
            <Button
              className="w-full bg-teal text-background hover:bg-teal/90 font-semibold"
              onClick={handleRequestAccess}
              disabled={submitting || !requestName || !requestEmail}
              data-ocid="access.submit_button"
            >
              {submitting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
