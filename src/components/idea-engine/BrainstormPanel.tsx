import { useEffect, useRef, useState } from "react";
import { Loader2, Megaphone, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  FOLLOW_UP_QUESTIONS,
  GOAL_OPTIONS,
  IMPROVEMENT_SUGGESTIONS,
  PLACEHOLDER_IDEA_THUMB,
  firstAiReply,
  generateFinalCaption,
  generateHeadline,
  nextClosingMessage,
  pickEchoWord,
  type ChatMessage,
  type Goal,
  type IdeaSeed,
  type PrefillIdea,
} from "./mock-data";
import type { CampaignContext } from "./campaign-data";

export function BrainstormPanel({
  prefillIdea,
  onSendToComposer,
  onMakeCampaign,
}: {
  prefillIdea: PrefillIdea | null;
  onSendToComposer: (seed: IdeaSeed, hashtags: string[]) => void;
  onMakeCampaign: (ctx: CampaignContext) => void;
}) {
  const [ideaText, setIdeaText] = useState("");
  const [ideaHashtags, setIdeaHashtags] = useState<string[]>([]);
  const [ideaCategory, setIdeaCategory] = useState<string>("Lifestyle");
  const [ideaTitle, setIdeaTitle] = useState<string>("");
  const [goal, setGoal] = useState<Goal>(GOAL_OPTIONS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [usedFollowUps, setUsedFollowUps] = useState<Set<number>>(new Set());
  const [usedImprovements, setUsedImprovements] = useState<Set<number>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isReplying]);

  // Fill the idea input when a trend/similar idea is clicked elsewhere on the page.
  useEffect(() => {
    if (!prefillIdea) return;
    if (messages.length > 0) {
      toast("Finish or send your current brainstorm before picking a new idea.");
      return;
    }
    setIdeaText(prefillIdea.text);
    setIdeaHashtags(prefillIdea.hashtags);
    if (prefillIdea.category) setIdeaCategory(prefillIdea.category);
    if (prefillIdea.title) setIdeaTitle(prefillIdea.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillIdea]);

  // Backend integration point: replace with a real LLM call. Picks an unused
  // follow-up question or improvement suggestion so the conversation doesn't
  // repeat itself within a session; winds down once both pools are exhausted.
  const nextAiReply = (userText: string): string => {
    const echo = pickEchoWord(userText);
    const availableFollowUps = FOLLOW_UP_QUESTIONS.map((_, i) => i).filter(
      (i) => !usedFollowUps.has(i),
    );
    const availableImprovements = IMPROVEMENT_SUGGESTIONS.map((_, i) => i).filter(
      (i) => !usedImprovements.has(i),
    );

    if (!availableFollowUps.length && !availableImprovements.length) {
      return nextClosingMessage();
    }

    const useFollowUp =
      availableFollowUps.length > 0 && (Math.random() < 0.5 || availableImprovements.length === 0);

    if (useFollowUp) {
      const idx = availableFollowUps[Math.floor(Math.random() * availableFollowUps.length)];
      setUsedFollowUps((s) => new Set(s).add(idx));
      const lead = echo ? `Good point about "${echo}." ` : "";
      return `${lead}${FOLLOW_UP_QUESTIONS[idx]}`;
    }

    const idx = availableImprovements[Math.floor(Math.random() * availableImprovements.length)];
    setUsedImprovements((s) => new Set(s).add(idx));
    const lead = echo ? `Building on "${echo}" — ` : "";
    return `${lead}${IMPROVEMENT_SUGGESTIONS[idx]}`;
  };

  const startBrainstorm = () => {
    const text = ideaText.trim();
    if (!text || isReplying) return;
    setMessages([{ id: crypto.randomUUID(), role: "user", text }]);
    setIsReplying(true);
    // Simulated latency — swap for a real backend/AI request later.
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "ai", text: firstAiReply(text, goal) },
      ]);
      setIsReplying(false);
    }, 1400);
  };

  const sendReply = () => {
    const text = replyText.trim();
    if (!text || isReplying) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text }]);
    setReplyText("");
    setIsReplying(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: nextAiReply(text) }]);
      setIsReplying(false);
    }, 1300);
  };

  const hasConversation = messages.length > 0;
  const hasAiResponse = messages.some((m) => m.role === "ai");
  const lastAiResponse = [...messages].reverse().find((m) => m.role === "ai")?.text ?? "";

  // Builds the finished post content from the brainstorm — caption is what
  // actually gets posted, title becomes the Composer canvas headline. Hashtags
  // ride along so they land in the Composer's hashtag dropdown.
  const handleSendToComposer = () => {
    onSendToComposer(
      {
        caption: generateFinalCaption(ideaText, goal, ideaHashtags),
        thumbnail: PLACEHOLDER_IDEA_THUMB,
        title: generateHeadline(ideaText, goal),
      },
      ideaHashtags,
    );
  };

  // Hands the full brainstorm session to the campaign generator — the user
  // never retypes anything (spec §3).
  const handleMakeCampaign = () => {
    onMakeCampaign({
      trendTitle: ideaTitle || ideaText.split(":")[0].trim(),
      category: ideaCategory,
      hook: ideaText.split(":")[0].trim(),
      brainstorm: ideaText,
      aiResponse: lastAiResponse,
      caption: generateFinalCaption(ideaText, goal, ideaHashtags),
      hashtags: ideaHashtags,
      goal,
    });
  };

  return (
    <section className="mt-6 rounded-[20px] bg-card p-6 shadow-[0_2px_8px_rgba(26,24,35,0.16)]">
      <h3 className="text-base font-bold tracking-tight text-foreground">What's on your mind?</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          startBrainstorm();
        }}
        className="mt-4 space-y-4"
      >
        <input
          value={ideaText}
          onChange={(e) => {
            setIdeaText(e.target.value);
            setIdeaHashtags([]);
          }}
          disabled={hasConversation}
          placeholder="Describe your idea..."
          className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-70"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
              disabled={hasConversation}
              className="mt-2 w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-70"
            >
              {GOAL_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {!hasConversation && (
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 self-end rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:opacity-70"
            >
              <Sparkles className="h-4 w-4" /> Brainstorm
            </button>
          )}
        </div>
      </form>

      {hasConversation && (
        <div className="mt-5 border-t border-border pt-5">
          <div className="max-h-80 space-y-3 overflow-y-auto scroll-smooth pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user" ? "bg-primary text-white" : "bg-secondary/60 text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isReplying && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-secondary/60 px-4 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendReply();
            }}
            className="mt-4 flex items-center gap-2"
          >
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply to the AI…"
              className="flex-1 rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              disabled={isReplying || !replyText.trim()}
              aria-label="Send reply"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition hover:brightness-110 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Two peer actions appear only once the AI has responded (spec §1). */}
          {hasAiResponse && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleSendToComposer}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Send to Composer
              </button>
              <button
                type="button"
                onClick={handleMakeCampaign}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/50 px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary/10"
              >
                <Megaphone className="h-4 w-4" /> Make a Marketing Campaign
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
