import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Requirement } from "@/lib/db";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  requirement: Requirement | null;
  open: boolean;
  onClose: () => void;
}

const MOCK_CANDIDATES = [
  {
    id: "c1",
    name: "Arjun Sharma",
    role: "Senior React Developer",
    experience: 6,
  },
  { id: "c2", name: "Priya Nair", role: "Full Stack Developer", experience: 4 },
  { id: "c3", name: "Rahul Verma", role: "React Developer", experience: 5 },
  { id: "c4", name: "Sneha Patel", role: "Frontend Developer", experience: 3 },
];

export function SubmitCandidateModal({ requirement, open, onClose }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!selectedId) {
      toast.error("Please select a candidate");
      return;
    }
    toast.success("Candidate submitted to pipeline! Client will be notified.");
    setSelectedId(null);
    setNote("");
    onClose();
  };

  if (!requirement) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg bg-card border-border"
        data-ocid="requirements.modal"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Submit Candidate
          </DialogTitle>
          <div className="mt-1">
            <p className="text-sm font-medium text-foreground">
              {requirement.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {requirement.company}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Select Candidate
            </p>
            <div className="space-y-2" data-ocid="requirements.list">
              {MOCK_CANDIDATES.map((c, i) => (
                <label
                  key={c.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedId === c.id
                      ? "border-teal bg-teal/5"
                      : "border-border hover:border-teal/40"
                  }`}
                  data-ocid={`requirements.item.${i + 1}`}
                >
                  <input
                    type="radio"
                    name="candidate"
                    value={c.id}
                    checked={selectedId === c.id}
                    onChange={() => setSelectedId(c.id)}
                    className="accent-teal"
                    data-ocid={`requirements.radio.${i + 1}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {c.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.role} &middot; {c.experience} yrs exp
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-1.5">
              Note to client (optional)
            </p>
            <Textarea
              placeholder="Add a message to the client..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="bg-background border-input resize-none"
              data-ocid="requirements.textarea"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              className="flex-1 bg-teal text-white hover:opacity-90"
              onClick={handleSubmit}
              data-ocid="requirements.submit_button"
            >
              Submit Candidate
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-border"
              onClick={onClose}
              data-ocid="requirements.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
