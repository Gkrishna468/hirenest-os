import {
  type Candidate,
  type DealRoom,
  type DealRoomMessage,
  MOCK_DEAL_ROOMS,
  type Requirement,
  getCandidates,
  getDealRoomMessages,
  getRequirements,
  sendDealRoomMessage,
} from "@/lib/db";
import { Link } from "@tanstack/react-router";
import { MessageSquare, Send } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type SenderType = "client" | "vendor" | "recruiter";

const SENDER_COLORS: Record<SenderType, string> = {
  client: "bg-sky-100 text-sky-900 border-sky-200",
  vendor: "bg-emerald-100 text-emerald-900 border-emerald-200",
  recruiter: "bg-purple-100 text-purple-900 border-purple-200",
};

const SENDER_BADGE: Record<SenderType, string> = {
  client: "bg-sky-500 text-white",
  vendor: "bg-emerald-500 text-white",
  recruiter: "bg-purple-500 text-white",
};

const DEMO_SENDERS: { type: SenderType; name: string }[] = [
  { type: "client", name: "Infosys Digital" },
  { type: "vendor", name: "TechBridge Staffing" },
  { type: "recruiter", name: "Gopala (HireNest)" },
];

export function DealRoomPage() {
  const [selectedRoom, setSelectedRoom] = useState<DealRoom | null>(
    MOCK_DEAL_ROOMS[0],
  );
  const [messages, setMessages] = useState<DealRoomMessage[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [text, setText] = useState("");
  const [senderType, setSenderType] = useState<SenderType>("client");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRequirements().then(setRequirements);
    getCandidates().then(setCandidates);
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      getDealRoomMessages(selectedRoom.id).then((msgs) => {
        setMessages(msgs);
        setTimeout(
          () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
          50,
        );
      });
    }
  }, [selectedRoom]);

  const handleSend = async () => {
    if (!text.trim() || !selectedRoom) return;
    const senderName =
      DEMO_SENDERS.find((s) => s.type === senderType)?.name || senderType;
    const msg = await sendDealRoomMessage(
      selectedRoom.id,
      senderName,
      senderType,
      text.trim(),
    );
    setMessages((prev) => [...prev, msg]);
    setText("");
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const getContextForRoom = (room: DealRoom) => ({
    candidate: candidates.find((c) => c.id === room.candidate_id),
    requirement: requirements.find((r) => r.id === room.requirement_id),
  });

  const selectedContext = selectedRoom ? getContextForRoom(selectedRoom) : null;

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <Link to="/" className="text-sm text-teal hover:underline">
            ← Back to Home
          </Link>
        </div>
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Deal Room
          </h1>
          <p className="text-muted-foreground mt-1">
            3-way chat between client, vendor & recruiter
          </p>
        </div>

        <div className="flex gap-4 h-[calc(100vh-260px)] min-h-[500px]">
          {/* Left: Deal List */}
          <div className="w-72 flex-shrink-0 card-surface rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-teal" /> Active Deals
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {MOCK_DEAL_ROOMS.map((room, i) => {
                const ctx = getContextForRoom(room);
                const selected = selectedRoom?.id === room.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    className={`w-full text-left p-4 hover:bg-muted/40 transition-colors ${selected ? "bg-teal/5 border-l-2 border-teal" : ""}`}
                    onClick={() => setSelectedRoom(room)}
                    data-ocid={`dealroom.item.${i + 1}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-xs flex-shrink-0">
                        {ctx.candidate?.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {ctx.candidate?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {ctx.candidate?.role}
                        </p>
                        <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                          {ctx.requirement?.title}
                        </p>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs mt-1 ${
                            room.status === "joined"
                              ? "bg-green-100 text-green-700"
                              : room.status === "offer_extended"
                                ? "bg-orange-100 text-orange-700"
                                : room.status === "interview"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {room.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Chat */}
          <div className="flex-1 card-surface rounded-xl overflow-hidden flex flex-col">
            {!selectedRoom ? (
              <div
                className="flex-1 flex items-center justify-center text-muted-foreground"
                data-ocid="dealroom.empty_state"
              >
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Select a deal from the left to open the chat</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {selectedContext?.candidate?.name} —{" "}
                        {selectedContext?.requirement?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedContext?.requirement?.company}
                      </p>
                    </div>
                  </div>
                  {/* Shared context card */}
                  {selectedContext?.candidate && (
                    <div className="mt-3 p-3 bg-muted/30 rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-xs flex-shrink-0">
                        {selectedContext.candidate.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {selectedContext.candidate.name} ·{" "}
                          {selectedContext.candidate.role}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedContext.candidate.skills
                            .slice(0, 4)
                            .map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-accent text-accent-foreground border border-border"
                              >
                                {s}
                              </span>
                            ))}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          selectedRoom.status === "joined"
                            ? "bg-green-100 text-green-700"
                            : selectedRoom.status === "offer_extended"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {selectedRoom.status.replace("_", " ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex flex-col gap-1"
                      data-ocid={`dealroom.message.${i + 1}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${SENDER_BADGE[msg.sender_type]}`}
                        >
                          {msg.sender_type}
                        </span>
                        <span className="text-xs font-medium text-foreground">
                          {msg.sender}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.sent_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div
                        className={`inline-block max-w-xl px-4 py-2.5 rounded-xl text-sm border ${SENDER_COLORS[msg.sender_type]}`}
                      >
                        {msg.message}
                      </div>
                    </motion.div>
                  ))}
                  {messages.length === 0 && (
                    <div
                      className="text-center text-muted-foreground text-sm py-8"
                      data-ocid="dealroom.empty_messages"
                    >
                      No messages yet. Start the conversation.
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">
                      Speaking as:
                    </span>
                    {DEMO_SENDERS.map((s) => (
                      <button
                        key={s.type}
                        type="button"
                        onClick={() => setSenderType(s.type)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                          senderType === s.type
                            ? `${SENDER_BADGE[s.type]} border-transparent`
                            : "bg-muted/30 text-muted-foreground border-border"
                        }`}
                        data-ocid={`dealroom.sender_${s.type}`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleSend()
                      }
                      placeholder="Type a message..."
                      className="flex-1 bg-muted/20 border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/50"
                      data-ocid="dealroom.message_input"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!text.trim()}
                      className="w-10 h-10 rounded-lg bg-teal text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity"
                      data-ocid="dealroom.send_button"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
