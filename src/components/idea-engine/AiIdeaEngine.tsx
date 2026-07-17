import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { ComposerSeed, View } from "@/routes/index";
import { TrendingIdeas } from "./TrendingIdeas";
import { BrainstormPanel } from "./BrainstormPanel";
import { ideaToPrefillText, type IdeaSeed, type PrefillIdea, type TrendIdea } from "./mock-data";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function AiIdeaEngine({
  navigate,
}: {
  navigate: (v: View, seed?: ComposerSeed) => void;
}) {
  // Tracks the most recent idea sent toward the Composer, so the back arrow
  // can hand it along (spec: preserve data if any idea was generated/selected).
  const [lastIdea, setLastIdea] = useState<IdeaSeed | null>(null);
  const [prefillIdea, setPrefillIdea] = useState<PrefillIdea | null>(null);
  const brainstormRef = useRef<HTMLDivElement>(null);

  const backToComposer = () => navigate("composer", lastIdea ?? undefined);

  const handleSendToComposer = (seed: IdeaSeed) => {
    setLastIdea(seed);
    navigate("composer", seed);
  };

  const handleSelectIdea = (idea: TrendIdea) => {
    setPrefillIdea({ text: ideaToPrefillText(idea), nonce: Date.now() });
    brainstormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="px-8 py-8">
      <button
        onClick={backToComposer}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Composer
      </button>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">{getGreeting()}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Discover trending ideas or brainstorm something new for your next post.
      </p>

      <div className="mt-8 space-y-6">
        <TrendingIdeas onSelectIdea={handleSelectIdea} />
        <div ref={brainstormRef}>
          <BrainstormPanel prefillIdea={prefillIdea} onSendToComposer={handleSendToComposer} />
        </div>
      </div>
    </div>
  );
}
