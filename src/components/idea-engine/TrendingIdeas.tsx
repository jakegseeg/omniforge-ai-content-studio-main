import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  generateAdditionalTrends,
  generateTrends,
  INITIAL_TRENDS,
  type TrendIdea,
} from "./mock-data";

export function TrendingIdeas({ onSelectIdea }: { onSelectIdea: (idea: TrendIdea) => void }) {
  const [trends, setTrends] = useState<TrendIdea[]>(INITIAL_TRENDS);
  const [loadingMore, setLoadingMore] = useState(false);

  // "Generate more ideas" — appends a fresh batch of 9 below the existing
  // list instead of replacing it, so the total keeps growing with each click
  // and the user can scroll through everything seen so far. Simulated
  // latency — swap for a real backend/AI request later.
  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setTrends((prev) => [
        ...prev,
        ...generateAdditionalTrends(
          prev.map((t) => t.title),
          9,
        ),
      ]);
      setLoadingMore(false);
    }, 900);
  };

  // Mocked daily-at-midnight refresh — replaces the whole list with a fresh
  // day's trends. Backend integration point: replace this client-side timer
  // with a server-side cron/webhook — client timers don't survive tab sleep
  // or the tab being closed.
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleNextRefresh = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0,
      );
      const ms = nextMidnight.getTime() - now.getTime();
      timeoutId = setTimeout(() => {
        setTrends(generateTrends());
        scheduleNextRefresh();
      }, ms);
    };
    scheduleNextRefresh();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section className="rounded-[20px] bg-card p-6 shadow-[0_2px_8px_rgba(26,24,35,0.16)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold tracking-tight text-foreground">
            See what's trending right now
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Refreshes automatically every day at 12:00 AM · click an idea to brainstorm it below
          </p>
        </div>
      </div>

      <div className="mt-5 max-h-[620px] overflow-y-auto scroll-smooth pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trends.map((trend) => (
            <div
              key={trend.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectIdea(trend)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectIdea(trend);
                }
              }}
              className="flex cursor-pointer flex-col rounded-xl border border-border bg-card p-4 transition hover:border-primary/40"
            >
              <h4 className="text-sm font-bold text-foreground">{trend.title}</h4>
              <p className="mt-1.5 line-clamp-3 text-xs text-muted-foreground">
                {trend.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {trend.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center border-t border-border pt-5">
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary/80 disabled:opacity-70"
        >
          {loadingMore ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5" /> Generate more ideas
            </>
          )}
        </button>
      </div>
    </section>
  );
}
