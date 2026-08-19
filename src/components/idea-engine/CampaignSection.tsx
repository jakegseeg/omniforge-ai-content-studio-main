import { useState } from "react";
import { Loader2, Sparkles, Send, RefreshCw, X, Clock, Zap } from "lucide-react";
import {
  CAMPAIGN_DURATIONS,
  CAMPAIGN_GOAL_OPTIONS,
  type Campaign,
  type CampaignDuration,
  type CampaignGoal,
  type CampaignPost,
} from "./campaign-data";

// Small labelled block used across the section + detail view.
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm text-foreground">{children}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
      {children}
    </span>
  );
}

function PhaseBadge({ post }: { post: CampaignPost }) {
  if (post.openSlot)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
        Open slot
      </span>
    );
  return post.phase === "Trend Window" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
      <Clock className="h-2.5 w-2.5" /> Trend Window
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
      Evergreen
    </span>
  );
}

function TypeBadge({ type }: { type: "BRAND" | "ACTIVATION" }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
        type === "ACTIVATION"
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          : "bg-secondary text-muted-foreground"
      }`}
    >
      {type}
    </span>
  );
}

function PostCard({
  post,
  onWriteCaption,
  onRegenerate,
  onSend,
}: {
  post: CampaignPost;
  onWriteCaption: (id: string) => void;
  onRegenerate: (id: string) => void;
  onSend: (post: CampaignPost) => void;
}) {
  if (post.openSlot) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {post.position}
          </span>
          <PhaseBadge post={post} />
        </div>
        <div className="mt-1.5 text-sm font-bold text-muted-foreground">{post.title}</div>
        <p className="mt-1 text-xs text-muted-foreground">{post.purpose}</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {post.position}
        </span>
        <div className="flex items-center gap-1.5">
          <PhaseBadge post={post} />
          <TypeBadge type={post.type} />
        </div>
      </div>
      <h4 className="mt-1.5 text-sm font-bold text-foreground">{post.title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{post.purpose}</p>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        <Field label="Buying moment">{post.buyingMoment}</Field>
        <Field label="Format">{post.format}</Field>
      </div>
      <div className="mt-2">
        <Field label="Creative direction">{post.creativeDirection}</Field>
      </div>

      {post.caption && (
        <div className="mt-3 whitespace-pre-line rounded-lg bg-secondary/40 p-3 text-xs text-foreground">
          {post.caption}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.hashtags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
        {!post.caption && (
          <button
            type="button"
            onClick={() => onWriteCaption(post.id)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition hover:text-primary/80"
          >
            <Sparkles className="h-3.5 w-3.5" /> Write caption
          </button>
        )}
        <button
          type="button"
          onClick={() => onRegenerate(post.id)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Regenerate
        </button>
        <button
          type="button"
          onClick={() => onSend(post)}
          className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-primary transition hover:text-primary/80"
        >
          <Send className="h-3.5 w-3.5" /> Send to Composer
        </button>
      </div>
    </div>
  );
}

function Timeline({
  campaign,
  onWriteCaption,
  onRegenerate,
  onSend,
}: {
  campaign: Campaign;
  onWriteCaption: (id: string) => void;
  onRegenerate: (id: string) => void;
  onSend: (post: CampaignPost) => void;
}) {
  const trendWindow = campaign.posts.filter((p) => p.phase === "Trend Window" && !p.openSlot);
  const evergreen = campaign.posts.filter((p) => p.phase === "Evergreen" || p.openSlot);
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
          <Zap className="h-4 w-4" /> Trend Window · first 24–72 hours
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {trendWindow.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onWriteCaption={onWriteCaption}
              onRegenerate={onRegenerate}
              onSend={onSend}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm font-bold text-foreground">
          Evergreen Extension · built on the durable insight
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {evergreen.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onWriteCaption={onWriteCaption}
              onRegenerate={onRegenerate}
              onSend={onSend}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CampaignSection({
  campaign,
  generating,
  onChangeDuration,
  onOverrideGoal,
  onWriteCaption,
  onRegeneratePost,
  onSendPost,
  onSendCampaign,
}: {
  campaign: Campaign | null;
  generating: boolean;
  onChangeDuration: (d: CampaignDuration) => void;
  onOverrideGoal: (g: CampaignGoal) => void;
  onWriteCaption: (postId: string) => void;
  onRegeneratePost: (postId: string) => void;
  onSendPost: (post: CampaignPost) => void;
  onSendCampaign: () => void;
}) {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <section className="rounded-[20px] bg-card p-6 shadow-[0_2px_8px_rgba(26,24,35,0.16)]">
      <h3 className="text-base font-bold tracking-tight text-foreground">
        Turn This Idea Into a Campaign
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Build a complete marketing campaign from your trend, hook, caption, and content ideas.
      </p>

      {/* A. Empty */}
      {!campaign && !generating && (
        <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Brainstorm an idea above, then choose “Make a Marketing Campaign” to build it out.
          </p>
        </div>
      )}

      {/* B. Generating */}
      {generating && !campaign && (
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/30 p-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Building your campaign…
        </div>
      )}

      {/* C. Generated */}
      {campaign && (
        <div className="mt-5 space-y-5">
          {/* Header: name + goal pill + ratio */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-lg font-bold text-foreground">{campaign.name}</h4>
              <span className="text-[11px] font-semibold text-muted-foreground">
                {campaign.brandPct}% brand / {campaign.activationPct}% activation
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{campaign.concept}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Goal
              </span>
              <select
                value={campaign.goal}
                onChange={(e) => onOverrideGoal(e.target.value as CampaignGoal)}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-bold text-foreground outline-none focus:border-primary"
              >
                {CAMPAIGN_GOAL_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand fit + durable insight */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <Field label="Brand fit check">{campaign.fitCheck}</Field>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <Field label="Durable insight under the trend">{campaign.durableInsight}</Field>
            </div>
          </div>

          {/* Buying moments */}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Buying moments this campaign targets
            </div>
            <div className="flex flex-wrap gap-2">
              {campaign.buyingMoments.map((m) => (
                <Pill key={m}>{m}</Pill>
              ))}
            </div>
          </div>

          {/* Campaign Codes */}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Campaign Codes · appear in every post
            </div>
            <div className="flex flex-wrap gap-2">
              {campaign.codes.map((c) => (
                <Pill key={c}>{c}</Pill>
              ))}
            </div>
          </div>

          {/* Duration selector */}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Duration
            </div>
            <div className="inline-flex rounded-full bg-muted p-1">
              {CAMPAIGN_DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChangeDuration(d)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    campaign.duration === d
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <Timeline
            campaign={campaign}
            onWriteCaption={onWriteCaption}
            onRegenerate={onRegeneratePost}
            onSend={onSendPost}
          />

          {/* Asset plan */}
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="text-sm font-bold text-foreground">
              This campaign needs {campaign.shoots.length} shoot session
              {campaign.shoots.length !== 1 ? "s" : ""} and {campaign.graphicsCount} graphic
              {campaign.graphicsCount !== 1 ? "s" : ""}.
            </div>
            <div className="mt-2 space-y-1">
              {campaign.shoots.map((s) => (
                <div key={s.label} className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {s.label} (~{s.minutes} min)
                  </span>{" "}
                  — covers posts {s.covers.join(", ")}
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags + keywords */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Hashtags ({campaign.hashtags.length})
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {campaign.hashtags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Caption keywords (for search)
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {campaign.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-foreground"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              How we'll know it's working
            </div>
            <div className="mt-2 space-y-1">
              {campaign.kpis.map((k) => (
                <div key={k.metric} className="text-xs text-foreground">
                  <span className="font-semibold">{k.metric}</span> — {k.target}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Check in on:{" "}
              <span className="font-semibold text-foreground">{campaign.checkInDay}</span>. If it's
              not working: {campaign.ifNotWorking}
            </p>
          </div>

          {campaign.assumptions && (
            <p className="text-xs italic text-muted-foreground">{campaign.assumptions}</p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setDetailOpen(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-bold text-foreground transition hover:bg-muted"
            >
              View full campaign
            </button>
            <button
              type="button"
              onClick={onSendCampaign}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
            >
              <Send className="h-4 w-4" /> Send Campaign to Composer
            </button>
          </div>
        </div>
      )}

      {/* Detail view */}
      {campaign && detailOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetailOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-xl font-bold">{campaign.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{campaign.concept}</p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Goal">{campaign.goal}</Field>
              <Field label="Duration">
                {campaign.duration} · {campaign.brandPct}/{campaign.activationPct} brand/activation
              </Field>
              <Field label="Target audience">{campaign.audience}</Field>
              <Field label="Core hook (inherited)">{campaign.coreHook}</Field>
              <Field label="Core message">{campaign.coreMessage}</Field>
              <Field label="CTA">{campaign.cta}</Field>
              <Field label="Campaign style">{campaign.style}</Field>
              <Field label="Durable insight">{campaign.durableInsight}</Field>
            </div>

            <div className="mt-4">
              <Field label="Brand fit check">{campaign.fitCheck}</Field>
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <div className="mb-3 text-sm font-bold text-foreground">Full content timeline</div>
              <Timeline
                campaign={campaign}
                onWriteCaption={onWriteCaption}
                onRegenerate={onRegeneratePost}
                onSend={onSendPost}
              />
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row">
              <div className="inline-flex flex-1 items-center rounded-full bg-muted p-1">
                {CAMPAIGN_DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onChangeDuration(d)}
                    className={`flex-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      campaign.duration === d
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  onSendCampaign();
                  setDetailOpen(false);
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Send Campaign to Composer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
