import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard, Lightbulb, Wand2, Calendar as CalendarIcon, Settings,
  Sparkles, Clock, CheckCircle2, TrendingUp, Linkedin, Instagram, Twitter,
  Youtube, Facebook, Music2, Upload, Crown, Play,
  Loader2, Lock, ArrowRight, Send, Zap, ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: OmniForgeApp,
});

type View = "dashboard" | "ideas" | "composer" | "calendar" | "settings";

interface ComposerSeed {
  caption: string;
  thumbnail: string;
  title: string;
}

const ACCESS_CODES = ["admin123", "omni2026"];

// ---------- ASSET DATA ----------
const ASSET_GROUPS: { label: string; items: { url: string; duration: string; premium?: boolean }[] }[] = [
  {
    label: "Nature",
    items: [
      { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400", duration: "15.0s", premium: true },
      { url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400", duration: "11.0s" },
      { url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400", duration: "9.0s", premium: true },
      { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400", duration: "14.0s" },
    ],
  },
  {
    label: "Sky",
    items: [
      { url: "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=400", duration: "12.0s", premium: true },
      { url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400", duration: "10.0s" },
    ],
  },
  {
    label: "Aerial Shots",
    items: [
      { url: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=400", duration: "20.0s", premium: true },
      { url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400", duration: "18.0s" },
      { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400", duration: "13.0s" },
      { url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400", duration: "16.0s", premium: true },
    ],
  },
];

const INITIAL_CALENDAR: Record<string, { caption: string; thumb: string; platform: "linkedin" | "instagram" | "twitter" }[]> = {
  Mon: [{ caption: "5 ways AI saves teams 10 hrs/wk", thumb: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=120", platform: "linkedin" }],
  Tue: [{ caption: "Behind-the-scenes reel", thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=120", platform: "instagram" }],
  Wed: [
    { caption: "Thread: launch retrospective", thumb: "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=120", platform: "twitter" },
    { caption: "Product feature spotlight", thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=120", platform: "instagram" },
  ],
  Thu: [{ caption: "Customer story · ACME Co.", thumb: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=120", platform: "linkedin" }],
  Fri: [{ caption: "Friday inspiration drop", thumb: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=120", platform: "instagram" }],
  Sat: [],
  Sun: [{ caption: "Weekly recap thread", thumb: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=120", platform: "twitter" }],
};

const AI_CLIPS = [
  { name: "Hook Intro", duration: "15s", thumb: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600" },
  { name: "Feature Breakdown", duration: "30s", thumb: "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=600" },
  { name: "Call to Action", duration: "45s", thumb: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600" },
];

// ---------- ROOT ----------
function OmniForgeApp() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [composerSeed, setComposerSeed] = useState<ComposerSeed | null>(null);
  const [calendar, setCalendar] = useState(INITIAL_CALENDAR);

  const navigate = (v: View, seed?: ComposerSeed) => {
    if (seed) setComposerSeed(seed);
    setView(v);
  };

  if (!authed) return <PasswordWall onUnlock={() => setAuthed(true)} />;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar view={view} setView={setView} />
      <main className="flex-1 overflow-x-hidden">
        <div key={view} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {view === "dashboard" && <Dashboard navigate={navigate} />}
          {view === "ideas" && <IdeaEngine navigate={navigate} />}
          {view === "composer" && <Composer seed={composerSeed} onSchedule={(item) => {
            setCalendar((c) => ({ ...c, Thu: [...c.Thu, item] }));
          }} />}
          {view === "calendar" && <CalendarView calendar={calendar} />}
          {view === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

// ---------- PASSWORD WALL ----------
function PasswordWall({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ACCESS_CODES.includes(code.trim())) {
      toast.success("Workspace unlocked");
      onUnlock();
    } else {
      toast.error("Invalid workspace access code");
    }
  };
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <form onSubmit={submit} className="glass-card relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary shadow-lg shadow-primary/40">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">OmniForge</div>
            <div className="text-xs text-muted-foreground">AI Social Automation</div>
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Workspace Access</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your workspace access code to continue.</p>
        <div className="mt-6">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Access Code</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="•••••••••"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
        <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110">
          Enter Workspace <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">Hint: <span className="font-mono text-foreground/80">admin123</span> or <span className="font-mono text-foreground/80">omni2026</span></p>
      </form>
    </div>
  );
}

// ---------- SIDEBAR ----------
function Sidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const items: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ideas", label: "Idea Engine", icon: Lightbulb },
    { id: "composer", label: "Asset Composer", icon: Wand2 },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary shadow-md shadow-primary/40">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">OmniForge</div>
          <div className="text-[11px] text-muted-foreground">Automation Studio</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ id, label, icon: Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Pro Workspace</div>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">12 posts scheduled · 4.5 hrs saved this week.</p>
      </div>
    </aside>
  );
}

// ---------- DASHBOARD ----------
function Dashboard({ navigate }: { navigate: (v: View, seed?: ComposerSeed) => void }) {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!goal.trim()) {
      toast.error("Describe a goal or feature first");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Campaign generated");
      navigate("ideas");
    }, 2000);
  };

  return (
    <div className="px-8 py-8">
      <Header
        title="Welcome back. Your automated marketing engine is active."
        subtitle="Here's a snapshot of your week. Everything's running on autopilot."
      />
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Kpi icon={Clock} label="Time Saved This Week" value="4.5 hours" trend="+22% vs last week" />
        <Kpi icon={Send} label="Scheduled Posts" value="12" trend="Across 4 platforms" />
        <Kpi icon={TrendingUp} label="Campaign Efficiency" value="94%" trend="AI-assisted approvals" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Next Up in Queue" badge="Auto-scheduled" />
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="relative aspect-[16/9] w-full">
              <img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800" alt="Scheduled post" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute left-3 top-3 flex gap-2">
                <PlatformBadge platform="linkedin" />
                <PlatformBadge platform="instagram" />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/90">
            "Most teams overlook this one workflow that saved us 10 hours a week. Here's the full breakdown →"
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" /> Publishing tomorrow at 9:00 AM
            </div>
            <button onClick={() => navigate("composer", { caption: "Most teams overlook this one workflow that saved us 10 hours a week.", thumbnail: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800", title: "Next Up Post" })} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow shadow-primary/30 transition hover:brightness-110">
                Edit Now <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Instant Campaign Spark" badge="AI" />
          <p className="text-sm text-muted-foreground">Turn a single sentence into a multi-platform launch sequence.</p>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What business goal or product feature do we want to promote today?"
            className="mt-4 min-h-[120px] w-full resize-none rounded-xl border border-border bg-secondary/40 p-4 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <button onClick={generate} disabled={loading} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110 disabled:opacity-70">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating campaign…</> : <><Sparkles className="h-4 w-4" /> Generate Campaign</>}
          </button>
        </Card>
      </div>
    </div>
  );
}

// ---------- IDEA ENGINE ----------
function IdeaEngine({ navigate }: { navigate: (v: View, seed?: ComposerSeed) => void }) {
  const [campaignGoal, setCampaignGoal] = useState("Product Launch");
  const [brief, setBrief] = useState("Push our new AI scheduling feature to small business owners. Tone: confident, friendly.");

  const steps = useMemo(() => ([
    {
      day: "Day 1", platform: "LinkedIn Text Post", icon: Linkedin, color: "bg-[#0A66C2]",
      caption: "We rebuilt our scheduler from the ground up. Here's why business owners are calling it 'the unfair advantage' — a 3-minute read on the workflow change that saved our team 10 hours a week.",
      thumb: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600",
    },
    {
      day: "Day 3", platform: "Instagram Visual Reel", icon: Instagram, color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
      caption: "POV: Your social calendar fills itself. ✨ Tap to see the new AI scheduler in action.",
      thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600",
    },
    {
      day: "Day 5", platform: "X / Twitter Thread", icon: Twitter, color: "bg-foreground text-background",
      caption: "We shipped AI scheduling this week. 9 things we learned building it (a thread 🧵)",
      thumb: "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=600",
    },
  ]), []);

  return (
    <div className="px-8 py-8">
      <Header title="AI Campaign Engine" subtitle="Configure a goal. We'll architect the full content sequence." />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader title="Configuration" badge="Inputs" />
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Campaign Goal</label>
          <select value={campaignGoal} onChange={(e) => setCampaignGoal(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30">
            <option>Product Launch</option>
            <option>Lead Generation</option>
            <option>Brand Awareness</option>
            <option>Customer Retention</option>
          </select>
          <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Brief</label>
          <textarea value={brief} onChange={(e) => setBrief(e.target.value)} className="mt-2 min-h-[140px] w-full resize-none rounded-xl border border-border bg-secondary/40 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
          <button onClick={() => toast.success("Sequence regenerated")} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow shadow-primary/30 transition hover:brightness-110">
            <Sparkles className="h-4 w-4" /> Regenerate
          </button>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">Generated Sequence</div>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">Campaign: App Feature Push</h3>
            </div>
            <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">{campaignGoal}</span>
          </div>
          <div className="space-y-3">
            {steps.map((s) => (
              <div key={s.day} className="group flex flex-col gap-3 rounded-xl border border-border bg-secondary/30 p-4 md:flex-row md:items-center">
                <img src={s.thumb} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-6 w-6 place-items-center rounded-md ${s.color}`}>
                      <s.icon className="h-3.5 w-3.5 text-white" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.day} · {s.platform}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/90">{s.caption}</p>
                </div>
                <button
                  onClick={() => { toast.success(`${s.day} sent to Composer`); navigate("composer", { caption: s.caption, thumbnail: s.thumb, title: `${s.day} · ${s.platform}` }); }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow shadow-primary/30 transition hover:brightness-110"
                >
                  Send to Composer <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------- COMPOSER ----------
function Composer({ seed, onSchedule }: { seed: ComposerSeed | null; onSchedule: (item: { caption: string; thumb: string; platform: "linkedin" | "instagram" | "twitter" }) => void }) {
  const [selectedAsset, setSelectedAsset] = useState<string>(seed?.thumbnail || ASSET_GROUPS[0].items[0].url);
  const [overlayText, setOverlayText] = useState(seed?.title || "Your headline goes here");
  const [caption, setCaption] = useState(seed?.caption || "Write your cross-posting caption…");
  const [tab, setTab] = useState<"canvas" | "clips">("canvas");
  const [platforms, setPlatforms] = useState({ tiktok: true, youtube: true, facebook: false, linkedin: true });
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadedVideo(f.name);
    setTab("clips");
    toast.success(`Processed "${f.name}" — 3 AI clips ready`);
  };

  const approve = () => {
    onSchedule({ caption: caption.slice(0, 60), thumb: selectedAsset, platform: "instagram" });
    toast.success("Approved & scheduled to calendar");
  };

  return (
    <div className="grid h-[calc(100vh)] grid-cols-1 lg:grid-cols-[25%_50%_25%]">
      {/* LEFT */}
      <div className="flex h-screen flex-col overflow-y-auto border-r border-border bg-card/40 p-5">
        <h3 className="text-sm font-semibold tracking-tight">Source Video</h3>
        <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 p-6 text-center transition hover:border-primary hover:bg-primary/5">
          <Upload className="h-6 w-6 text-primary" />
          <span className="text-xs font-medium">{uploadedVideo ?? "Drop long-form source video"}</span>
          <span className="text-[11px] text-muted-foreground">.mp4, .mov up to 2GB</span>
          <input type="file" accept="video/*" className="hidden" onChange={onUpload} />
        </label>

        <h3 className="mt-6 text-sm font-semibold tracking-tight">Asset Library</h3>
        <div className="mt-3 space-y-5">
          {ASSET_GROUPS.map((g) => (
            <div key={g.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</span>
                <button className="text-[11px] text-primary hover:underline">See all</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {g.items.map((it) => {
                  const selected = selectedAsset === it.url;
                  return (
                    <button
                      key={it.url}
                      onClick={() => { setSelectedAsset(it.url); toast(`${g.label} clip selected`); }}
                      className={`group relative aspect-[3/4] overflow-hidden rounded-lg border transition ${selected ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/60"}`}
                    >
                      <img src={it.url} alt="" className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                      <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">{it.duration}</span>
                      {it.premium && (
                        <span className="absolute bottom-1.5 right-1.5 grid h-5 w-5 place-items-center rounded-md bg-amber-400 text-black shadow">
                          <Crown className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER */}
      <div className="flex h-screen flex-col overflow-y-auto p-6">
        <div className="mx-auto flex w-full max-w-md items-center rounded-xl border border-border bg-secondary/40 p-1">
          {([
            { id: "canvas", label: "Canvas Preview" },
            { id: "clips", label: "AI Clips Generated" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${tab === t.id ? "bg-primary text-primary-foreground shadow shadow-primary/30" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "canvas" ? (
          <div className="mt-6 flex flex-1 items-center justify-center">
            <div className="relative aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/40">
              <img src={selectedAsset} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
              <div className="absolute inset-x-4 bottom-12">
                <textarea
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  className="w-full resize-none rounded-xl border border-white/20 bg-black/40 p-3 text-center text-lg font-bold leading-tight text-white outline-none backdrop-blur focus:border-primary"
                  rows={2}
                />
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white">9:16 · Reel</div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="text-xs text-muted-foreground">3 AI-generated short clips from your source video. Click to preview in canvas.</p>
            {AI_CLIPS.map((c, i) => (
              <button
                key={c.name}
                onClick={() => { setSelectedAsset(c.thumb); setTab("canvas"); toast(`Loaded ${c.name} into canvas`); }}
                className="group flex w-full items-center gap-4 rounded-xl border border-border bg-secondary/30 p-3 text-left transition hover:border-primary"
              >
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
                  <img src={c.thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">{c.duration}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">Clip {i + 1}</div>
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">Optimal {c.duration} cut · 92% hook score</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex h-screen flex-col overflow-y-auto border-l border-border bg-card/40 p-5">
        <h3 className="text-sm font-semibold tracking-tight">Publish Settings</h3>
        <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-2 min-h-[140px] w-full resize-none rounded-xl border border-border bg-secondary/40 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />

        <div className="mt-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cross-post to</div>
          <div className="mt-2 space-y-2">
            <ToggleRow icon={Music2} label="TikTok" checked={platforms.tiktok} onChange={(v) => setPlatforms({ ...platforms, tiktok: v })} />
            <ToggleRow icon={Youtube} label="YouTube Shorts" checked={platforms.youtube} onChange={(v) => setPlatforms({ ...platforms, youtube: v })} />
            <ToggleRow icon={Facebook} label="Facebook Reels" checked={platforms.facebook} onChange={(v) => setPlatforms({ ...platforms, facebook: v })} />
            <ToggleRow icon={Linkedin} label="LinkedIn" checked={platforms.linkedin} onChange={(v) => setPlatforms({ ...platforms, linkedin: v })} />
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground"><Sparkles className="h-3.5 w-3.5 text-primary" /> AI optimizations</div>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Per-platform aspect ratio adapt</li>
            <li>Hashtag set per network</li>
            <li>Auto-caption + cover frame</li>
          </ul>
        </div>

        <button onClick={approve} className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110">
          <CheckCircle2 className="h-4 w-4" /> Approve & Schedule to Calendar
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, checked, onChange }: { icon: typeof Music2; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2.5 transition hover:border-primary/50">
      <span className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" /> {label}
      </span>
      <span className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      </span>
    </label>
  );
}

// ---------- CALENDAR ----------
function CalendarView({ calendar }: { calendar: typeof INITIAL_CALENDAR }) {
  const [locked, setLocked] = useState(false);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="px-8 py-8">
      <Header title="Smart Marketing Calendar" subtitle="Your week, fully orchestrated across platforms." />

      <button
        onClick={() => { setLocked(true); toast.success("Next 5 posts armed for auto-publish"); }}
        disabled={locked}
        className={`mt-6 flex w-full items-center justify-between gap-4 rounded-2xl border p-5 text-left transition ${
          locked ? "border-emerald-500/40 bg-emerald-500/10" : "border-primary/40 bg-primary/10 hover:bg-primary/15"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-xl ${locked ? "bg-emerald-500" : "bg-primary"} text-white shadow-lg`}>
            {locked ? <ShieldCheck className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          </div>
          <div>
            <div className="text-sm font-semibold">{locked ? "All Posts Locked & Armed" : "One-Click Approve Next 5 Suggested Posts"}</div>
            <div className="text-xs text-muted-foreground">{locked ? "Auto-publishing on schedule across all connected channels." : "AI selected the highest-performing slots this week."}</div>
          </div>
        </div>
        {!locked && <ArrowRight className="h-5 w-5 text-primary" />}
      </button>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((d, i) => (
          <div key={d} className="glass-card flex min-h-[280px] flex-col rounded-2xl p-3">
            <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{d}</span>
              <span className="text-lg font-semibold">{18 + i}</span>
            </div>
            <div className="space-y-2">
              {calendar[d]?.length ? calendar[d].map((p, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-secondary/40 p-2 transition hover:border-primary/50">
                  <div className="flex gap-2">
                    <img src={p.thumb} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                    <p className="line-clamp-2 text-[11px] leading-snug text-foreground/90">{p.caption}</p>
                  </div>
                  <div className="mt-2"><PlatformBadge platform={p.platform} small /></div>
                </div>
              )) : (
                <div className="grid h-20 place-items-center rounded-lg border border-dashed border-border text-[11px] text-muted-foreground">No posts</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- SETTINGS ----------
function SettingsView() {
  return (
    <div className="px-8 py-8">
      <Header title="Settings" subtitle="Workspace, integrations, and brand voice." />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Connected Accounts" badge="4 active" />
          <div className="space-y-3">
            {[
              { icon: Linkedin, name: "LinkedIn", handle: "@omniforge" },
              { icon: Instagram, name: "Instagram", handle: "@omniforge.app" },
              { icon: Twitter, name: "X / Twitter", handle: "@omniforge" },
              { icon: Youtube, name: "YouTube", handle: "OmniForge" },
            ].map((a) => (
              <div key={a.name} className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3">
                <div className="flex items-center gap-3"><a.icon className="h-4 w-4 text-primary" /><div><div className="text-sm font-semibold">{a.name}</div><div className="text-[11px] text-muted-foreground">{a.handle}</div></div></div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">Connected</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Brand Voice" badge="AI Tuned" />
          <p className="text-sm text-muted-foreground">Adjust how OmniForge writes for your audience.</p>
          <div className="mt-4 space-y-3">
            {["Tone: confident, friendly", "Avoid: jargon, hype words", "Preferred emoji: ✨ ⚡ 🚀"].map((t) => (
              <div key={t} className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">{t}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------- SHARED ----------
function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="glass-card rounded-2xl p-6">{children}</div>;
}

function CardHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      {badge && <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">{badge}</span>}
    </div>
  );
}

function Kpi({ icon: Icon, label, value, trend }: { icon: typeof Clock; label: string; value: string; trend: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><Icon className="h-5 w-5" /></div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">Live</span>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      <div className="mt-3 text-[11px] text-primary">{trend}</div>
    </div>
  );
}

function PlatformBadge({ platform, small }: { platform: "linkedin" | "instagram" | "twitter"; small?: boolean }) {
  const map = {
    linkedin: { label: "LinkedIn", Icon: Linkedin, color: "bg-[#0A66C2] text-white" },
    instagram: { label: "Instagram", Icon: Instagram, color: "bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white" },
    twitter: { label: "X", Icon: Twitter, color: "bg-black text-white" },
  } as const;
  const { label, Icon, color } = map[platform];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${color} ${small ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]"} font-semibold`}>
      <Icon className={small ? "h-2.5 w-2.5" : "h-3 w-3"} /> {label}
    </span>
  );
}
