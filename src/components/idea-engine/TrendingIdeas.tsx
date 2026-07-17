import { useEffect, useState } from "react";
import { ChevronDown, Loader2, RefreshCw, Sparkles } from "lucide-react";
import {
  generateAdditionalTrends,
  generateSimilarIdeas,
  generateTrends,
  INITIAL_TRENDS,
  type TrendIdea,
} from "./mock-data";

export function TrendingIdeas({ onSelectIdea }: { onSelectIdea: (idea: TrendIdea) => void }) {
  const [trends, setTrends] = useState<TrendIdea[]>(INITIAL_TRENDS);
  const [expandedTrendId, setExpandedTrendId] = useState<string | null>(null);
  const [similarByTrend, setSimilarByTrend] = useState<Record<string, TrendIdea[]>>({});
  const [loadingMore, setLoadingMore] = useState(false);

  // "Generate more ideas" — appends a fresh batch below the existing list
  // instead of replacing it, so the user can scroll through everything seen
  // so far. Simulated latency — swap for a real backend/AI request later.
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
        setExpandedTrendId(null);
        setSimilarByTrend({});
        scheduleNextRefresh();
      }, ms);
    };
    scheduleNextRefresh();
    return () => clearTimeout(timeoutId);
  }, []);

  const toggleSimilar = (trend: TrendIdea) => {
    setExpandedTrendId((cur) => {
      const next = cur === trend.id ? null : trend.id;
      if (next && !similarByTrend[trend.id]) {
        setSimilarByTrend((s) => ({ ...s, [trend.id]: generateSimilarIdeas(trend) }));
      }
      return next;
    });
  };

  return (
    <section className="rounded-[20px] bg-card p-6 shadow-[0_2px_8px_rgba(26,24,35,0.16)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold tracking-tight text-foreground">
            See what's trending right now
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Refreshes automatically every day at 12:00 AM
          </p>
        </div>
      </div>

      <div className="mt-5 max-h-[620px] overflow-y-auto scroll-smooth pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trends.map((trend) => {
            const isExpanded = expandedTrendId === trend.id;
            const similar = similarByTrend[trend.id];
            return (
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

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSimilar(trend);
                  }}
                  aria-expanded={isExpanded}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate Similar Ideas
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="mt-3 max-h-56 space-y-2 overflow-y-auto scroll-smooth pr-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {similar ? (
                      similar.map((idea) => (
                        <div
                          key={idea.id}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectIdea(idea);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              onSelectIdea(idea);
                            }
                          }}
                          className="cursor-pointer rounded-lg border border-border bg-secondary/20 p-2.5 transition hover:border-primary"
                        >
                          <p className="text-xs font-semibold text-foreground">{idea.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                            {idea.description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating similar ideas…
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
