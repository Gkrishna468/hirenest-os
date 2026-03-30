import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function EarlyAccess() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    role: "",
    goal: "",
    features: [],
    demo: "",
    name: "",
    email: "",
  });

  const roles = [
    { title: "Client", desc: "Hire faster & better talent" },
    { title: "Vendor", desc: "Get consistent requirements" },
    { title: "Recruiter", desc: "Submit & track candidates" },
  ];

  const goals: any = {
    Client: ["Hire faster", "Get quality candidates", "Reduce hiring chaos"],
    Vendor: ["Get more requirements", "Submit candidates faster", "Increase closures"],
    Recruiter: ["Track candidates", "Improve submissions", "Close more roles"],
  };

  const features = [
    "AI Matching",
    "Vendor Network",
    "Pipeline Tracking",
    "Resume Scoring",
  ];

  const toggleFeature = (f: string) => {
    setForm((prev: any) => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter((x: string) => x !== f)
        : [...prev.features, f],
    }));
  };

  // ================================
  // 🚀 SUBMIT FUNCTION
  // ================================
  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase.from("leads").insert([form]);

    if (error) {
      alert("Error saving lead ❌");
    } else {
      // 📲 WHATSAPP PING
      window.open(
        `https://wa.me/919392894747?text=New Lead 🚀%0A${form.role}%0A${form.name}%0A${form.email}`,
        "_blank"
      );

      alert("🚀 You're in! We’ll contact you soon.");
      setStep(1);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">

        {/* 🔥 PROGRESS BAR */}
        <div className="mb-6">
          <div className="w-full bg-white/10 h-2 rounded-full">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Step {step} of 5
          </p>
        </div>

        <h1 className="text-3xl font-bold mb-4">
          🚀 HireNest OS Early Access
        </h1>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <p className="mb-4">Who are you?</p>
            {roles.map((r) => (
              <div
                key={r.title}
                onClick={() => {
                  setForm({ ...form, role: r.title });
                  setStep(2);
                }}
                className="p-4 mb-3 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10"
              >
                <b>{r.title}</b>
                <p className="text-sm text-gray-400">{r.desc}</p>
              </div>
            ))}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <p className="mb-4">What do you want?</p>
            {goals[form.role].map((g: string) => (
              <div
                key={g}
                onClick={() => {
                  setForm({ ...form, goal: g });
                  setStep(3);
                }}
                className="p-3 mb-2 border border-white/20 rounded cursor-pointer hover:bg-white/10"
              >
                {g}
              </div>
            ))}
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <p className="mb-4">Select features</p>
            <div className="grid grid-cols-2 gap-3">
              {features.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFeature(f)}
                  className={`p-3 rounded border ${
                    form.features.includes(f)
                      ? "bg-blue-600"
                      : "border-white/20"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(4)}
              className="mt-6 w-full bg-blue-600 py-3 rounded"
            >
              Continue →
            </button>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <p className="mb-4">Want a demo?</p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setForm({ ...form, demo: "Yes" });
                  window.open("https://cal.com/your-link", "_blank");
                  setStep(5);
                }}
                className="flex-1 bg-green-600 py-3 rounded"
              >
                Yes
              </button>

              <button
                onClick={() => {
                  setForm({ ...form, demo: "No" });
                  setStep(5);
                }}
                className="flex-1 bg-white/10 py-3 rounded"
              >
                No
              </button>
            </div>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <input
              placeholder="Name"
              className="w-full p-3 mb-3 rounded bg-black border border-white/20"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="w-full p-3 mb-4 rounded bg-black border border-white/20"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-blue-600 rounded"
            >
              {loading ? "Saving..." : "🚀 Join Now"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}
