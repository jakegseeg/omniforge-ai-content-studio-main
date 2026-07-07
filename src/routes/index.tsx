import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Wand2,
  Calendar as CalendarIcon,
  Settings,
  Sparkles,
  Clock,
  CheckCircle2,
  TrendingUp,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Music2,
  Upload,
  Crown,
  Play,
  Loader2,
  Lock,
  ArrowRight,
  Send,
  Zap,
  ShieldCheck,
  ChevronDown,
  Type,
  Mic,
  Captions,
  Crop,
  SlidersHorizontal,
  Trash2,
  ImageIcon,
  Video,
  FileText,
  PanelLeftClose,
  PanelRightClose,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Timer,
  BarChart3,
  FolderKanban,
  Repeat,
  FolderPlus,
  User,
  UserCog,
  ArrowLeft,
  Eye,
  Minus,
  TrendingDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/")({
  component: OmniForgeApp,
});

type View = "metrics" | "dashboard" | "ideas" | "composer" | "calendar" | "settings";

interface ComposerSeed {
  caption: string;
  thumbnail: string;
  title: string;
}

const ACCESS_CODES = ["admin123", "omni2026"];

// ---------- ASSET DATA ----------
const ASSET_GROUPS: {
  label: string;
  items: { url: string; duration: string; premium?: boolean }[];
}[] = [
  {
    label: "Nature",
    items: [
      {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
        duration: "15.0s",
        premium: true,
      },
      {
        url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
        duration: "11.0s",
      },
      {
        url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400",
        duration: "9.0s",
        premium: true,
      },
      {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
        duration: "14.0s",
      },
    ],
  },
  {
    label: "Sky",
    items: [
      {
        url: "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=400",
        duration: "12.0s",
        premium: true,
      },
      {
        url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400",
        duration: "10.0s",
      },
    ],
  },
  {
    label: "Aerial Shots",
    items: [
      {
        url: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=400",
        duration: "20.0s",
        premium: true,
      },
      {
        url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400",
        duration: "18.0s",
      },
      {
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
        duration: "13.0s",
      },
      {
        url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400",
        duration: "16.0s",
        premium: true,
      },
    ],
  },
];

const INITIAL_CALENDAR: Record<
  string,
  { caption: string; thumb: string; platform: "linkedin" | "instagram" | "twitter" }[]
> = {
  Mon: [
    {
      caption: "5 ways AI saves teams 10 hrs/wk",
      thumb: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=120",
      platform: "linkedin",
    },
  ],
  Tue: [
    {
      caption: "Behind-the-scenes reel",
      thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=120",
      platform: "instagram",
    },
  ],
  Wed: [
    {
      caption: "Thread: launch retrospective",
      thumb: "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=120",
      platform: "twitter",
    },
    {
      caption: "Product feature spotlight",
      thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=120",
      platform: "instagram",
    },
  ],
  Thu: [
    {
      caption: "Customer story · ACME Co.",
      thumb: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=120",
      platform: "linkedin",
    },
  ],
  Fri: [
    {
      caption: "Friday inspiration drop",
      thumb: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=120",
      platform: "instagram",
    },
  ],
  Sat: [],
  Sun: [
    {
      caption: "Weekly recap thread",
      thumb: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=120",
      platform: "twitter",
    },
  ],
};

const AI_CLIPS = [
  {
    name: "Hook Intro",
    duration: "15s",
    thumb: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600",
  },
  {
    name: "Feature Breakdown",
    duration: "30s",
    thumb: "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=600",
  },
  {
    name: "Call to Action",
    duration: "45s",
    thumb: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600",
  },
];

// ---------- ROOT ----------
function OmniForgeApp() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<View>("metrics");
  const [composerSeed, setComposerSeed] = useState<ComposerSeed | null>(null);
  const [calendar, setCalendar] = useState(INITIAL_CALENDAR);

  const navigate = (v: View, seed?: ComposerSeed) => {
    if (seed) setComposerSeed(seed);
    setView(v);
  };

  if (!authed) return <PasswordWall onUnlock={() => setAuthed(true)} />;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <TopNav view={view} navigate={navigate} />
      <main className="flex-1 overflow-x-hidden">
        <div key={view} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {view === "metrics" && <PlatformMetrics />}
          {view === "dashboard" && <Dashboard navigate={navigate} />}
          {view === "ideas" && <IdeaEngine navigate={navigate} />}
          {view === "composer" && (
            <Composer
              seed={composerSeed}
              onExplore={() => setView("ideas")}
              onSchedule={(item) => {
                setCalendar((c) => ({ ...c, Thu: [...c.Thu, item] }));
              }}
            />
          )}
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
      <form
        onSubmit={submit}
        className="glass-card relative z-10 w-full max-w-md rounded-2xl p-8 shadow-2xl"
      >
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
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your workspace access code to continue.
        </p>
        <div className="mt-6">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Access Code
          </label>
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
        <button
          type="submit"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
        >
          Enter Workspace <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Hint: <span className="font-mono text-foreground/80">admin123</span> or{" "}
          <span className="font-mono text-foreground/80">omni2026</span>
        </p>
      </form>
    </div>
  );
}

// ---------- TOP NAVIGATION ----------
function TopNav({
  view,
  navigate,
}: {
  view: View;
  navigate: (v: View, seed?: ComposerSeed) => void;
}) {
  const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "composer", label: "Post Composer", icon: Wand2 },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "metrics", label: "Metrics", icon: BarChart3 },
  ];
  // "My Projects" surfaces the Dashboard (View Projects) and Settings (Project Settings).
  const projectsActive = view === "dashboard" || view === "settings";

  const navBtn = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
      active
        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar/95 px-4 backdrop-blur md:px-6">
      {/* Brand → Dashboard (home) */}
      <button
        onClick={() => navigate("dashboard")}
        className="mr-1 flex items-center gap-3 rounded-xl px-1 py-1 transition hover:opacity-90"
        aria-label="Go to dashboard"
      >
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary shadow-md shadow-primary/40">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="hidden text-left sm:block">
          <div className="text-sm font-semibold leading-tight tracking-tight">OmniForge</div>
          <div className="text-[11px] leading-tight text-muted-foreground">Automation Studio</div>
        </div>
      </button>

      {/* Primary navigation */}
      <nav className="ml-1 flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={navBtn(projectsActive)} aria-label="My Projects menu">
              <FolderKanban className="h-4 w-4" />
              <span className="hidden md:inline">My Projects</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Projects</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("dashboard")}>
              <LayoutDashboard className="mr-2 h-4 w-4" /> View Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Switch project — coming soon")}>
              <Repeat className="mr-2 h-4 w-4" /> Switch Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Create project — coming soon")}>
              <FolderPlus className="mr-2 h-4 w-4" /> Create Project
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Project Settings</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate("settings")}>
              <Settings className="mr-2 h-4 w-4" /> Project Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => toast("User profile — coming soon")}>
              <User className="mr-2 h-4 w-4" /> User Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("settings")}>
              <UserCog className="mr-2 h-4 w-4" /> Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("settings")}>
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Preferences
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => navigate(id)} className={navBtn(view === id)}>
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Create → AI Idea Engine */}
      <button
        onClick={() => navigate("ideas")}
        className="ml-auto inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
      >
        <Sparkles className="h-4 w-4" /> Create
      </button>
    </header>
  );
}

// ---------- PLATFORM METRICS ----------
const PLATFORM_METRICS: {
  name: string;
  handle: string;
  Icon: typeof Instagram;
  color: string;
  accent: string;
  summary: string;
  metrics: { label: string; value: string; delta: string; icon: typeof Heart }[];
}[] = [
  {
    name: "Instagram",
    handle: "@omniforge.app",
    Icon: Instagram,
    color: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    accent: "text-pink-300",
    summary: "Reels and carousel posts are carrying the strongest engagement this week.",
    metrics: [
      { label: "Overall likes", value: "48.2K", delta: "+18%", icon: Heart },
      { label: "Comments", value: "3.8K", delta: "+9%", icon: MessageCircle },
      { label: "Shares", value: "9.6K", delta: "+22%", icon: Share2 },
      { label: "Saves", value: "6.1K", delta: "+14%", icon: Bookmark },
      { label: "Watch time", value: "412h", delta: "+31%", icon: Timer },
    ],
  },
  {
    name: "TikTok",
    handle: "@omniforge",
    Icon: Music2,
    color: "from-[#25F4EE] via-[#111827] to-[#FE2C55]",
    accent: "text-cyan-200",
    summary: "Short hooks under 12 seconds are producing the highest completion rate.",
    metrics: [
      { label: "Overall likes", value: "86.4K", delta: "+27%", icon: Heart },
      { label: "Comments", value: "5.2K", delta: "+16%", icon: MessageCircle },
      { label: "Shares", value: "14.8K", delta: "+34%", icon: Share2 },
      { label: "Saves", value: "3.4K", delta: "+8%", icon: Bookmark },
      { label: "Watch time", value: "690h", delta: "+41%", icon: Timer },
    ],
  },
  {
    name: "Facebook",
    handle: "OmniForge Studio",
    Icon: Facebook,
    color: "from-[#1877F2] to-[#0A4EA8]",
    accent: "text-blue-200",
    summary: "Longer captions are driving comments while short clips lift shares.",
    metrics: [
      { label: "Overall likes", value: "22.7K", delta: "+11%", icon: Heart },
      { label: "Comments", value: "2.1K", delta: "+7%", icon: MessageCircle },
      { label: "Shares", value: "4.9K", delta: "+13%", icon: Share2 },
      { label: "Saves", value: "1.8K", delta: "+5%", icon: Bookmark },
      { label: "Watch time", value: "238h", delta: "+19%", icon: Timer },
    ],
  },
  {
    name: "YouTube",
    handle: "OmniForge",
    Icon: Youtube,
    color: "from-[#FF0033] to-[#991B1B]",
    accent: "text-red-200",
    summary: "Shorts are expanding reach and pushing more viewers into repeat sessions.",
    metrics: [
      { label: "Overall likes", value: "31.9K", delta: "+15%", icon: Heart },
      { label: "Comments", value: "1.9K", delta: "+6%", icon: MessageCircle },
      { label: "Shares", value: "3.7K", delta: "+12%", icon: Share2 },
      { label: "Subscribers", value: "1.2K", delta: "+10%", icon: TrendingUp },
      { label: "Watch time", value: "884h", delta: "+25%", icon: Timer },
    ],
  },
  {
    name: "LinkedIn",
    handle: "OmniForge",
    Icon: Linkedin,
    color: "from-[#0A66C2] to-[#064A8A]",
    accent: "text-sky-200",
    summary: "Educational posts are earning saves and profile visits from operators.",
    metrics: [
      { label: "Overall likes", value: "12.4K", delta: "+8%", icon: Heart },
      { label: "Comments", value: "980", delta: "+12%", icon: MessageCircle },
      { label: "Shares", value: "2.6K", delta: "+17%", icon: Share2 },
      { label: "Saves", value: "1.1K", delta: "+15%", icon: Bookmark },
      { label: "Watch time", value: "116h", delta: "+9%", icon: Timer },
    ],
  },
];

type MetricKey = "likes" | "comments" | "shares" | "watchTime";

const METRIC_OPTIONS: { key: MetricKey; label: string; icon: typeof Heart }[] = [
  { key: "likes", label: "Likes", icon: Heart },
  { key: "comments", label: "Comments", icon: MessageCircle },
  { key: "shares", label: "Shares", icon: Share2 },
  { key: "watchTime", label: "Watch Time", icon: Timer },
];

const POST_PERFORMANCE: Record<
  string,
  {
    title: string;
    type: string;
    date: string;
    status: "up" | "down" | "flat";
    summary: string;
    values: Record<MetricKey, number[]>;
  }[]
> = {
  Instagram: [
    {
      title: "Launch Reel",
      type: "Reel",
      date: "Apr 10",
      status: "up",
      summary: "Hook retention lifted shares after day 2.",
      values: {
        likes: [22, 31, 34, 47, 58, 64, 71],
        comments: [10, 12, 15, 19, 23, 24, 29],
        shares: [8, 11, 13, 20, 28, 34, 39],
        watchTime: [18, 25, 30, 38, 49, 55, 62],
      },
    },
    {
      title: "Workflow Carousel",
      type: "Carousel",
      date: "Apr 11",
      status: "flat",
      summary: "Strong saves, but comment velocity settled.",
      values: {
        likes: [18, 23, 29, 31, 32, 33, 35],
        comments: [9, 13, 13, 14, 14, 15, 15],
        shares: [6, 8, 11, 12, 13, 13, 14],
        watchTime: [10, 13, 17, 19, 20, 21, 21],
      },
    },
    {
      title: "Behind the Build",
      type: "Reel",
      date: "Apr 13",
      status: "up",
      summary: "Late pickup from saves and reposts.",
      values: {
        likes: [14, 18, 26, 39, 46, 60, 74],
        comments: [7, 9, 15, 21, 26, 31, 38],
        shares: [5, 7, 14, 19, 27, 35, 44],
        watchTime: [16, 20, 29, 43, 54, 68, 79],
      },
    },
    {
      title: "Customer Proof",
      type: "Story",
      date: "Apr 15",
      status: "down",
      summary: "Initial interest dipped after day 3.",
      values: {
        likes: [20, 28, 30, 25, 22, 21, 20],
        comments: [8, 12, 11, 9, 7, 7, 6],
        shares: [7, 10, 9, 8, 6, 6, 5],
        watchTime: [22, 29, 27, 23, 20, 18, 17],
      },
    },
  ],
  TikTok: [
    {
      title: "One-Minute Demo",
      type: "Short",
      date: "Apr 10",
      status: "up",
      summary: "Fast hook kept completion high.",
      values: {
        likes: [30, 42, 55, 69, 78, 88, 96],
        comments: [14, 20, 27, 34, 40, 48, 53],
        shares: [12, 20, 32, 45, 57, 66, 74],
        watchTime: [24, 39, 55, 70, 82, 91, 100],
      },
    },
    {
      title: "Founder POV",
      type: "Short",
      date: "Apr 12",
      status: "flat",
      summary: "Good reach, modest share velocity.",
      values: {
        likes: [21, 33, 39, 42, 44, 45, 46],
        comments: [8, 12, 14, 15, 16, 16, 17],
        shares: [7, 10, 13, 15, 16, 17, 17],
        watchTime: [18, 26, 31, 34, 36, 37, 38],
      },
    },
    {
      title: "Scheduler Hack",
      type: "Short",
      date: "Apr 14",
      status: "up",
      summary: "Shared heavily into small-business niches.",
      values: {
        likes: [25, 37, 48, 63, 80, 92, 104],
        comments: [12, 18, 22, 31, 41, 47, 55],
        shares: [15, 26, 38, 52, 69, 80, 91],
        watchTime: [28, 43, 61, 78, 92, 108, 121],
      },
    },
  ],
  Facebook: [
    {
      title: "Customer Story",
      type: "Reel",
      date: "Apr 9",
      status: "up",
      summary: "Shares are rising from community groups.",
      values: {
        likes: [12, 16, 21, 28, 33, 36, 40],
        comments: [6, 8, 11, 15, 17, 18, 21],
        shares: [5, 9, 13, 19, 23, 27, 31],
        watchTime: [14, 20, 26, 34, 39, 43, 48],
      },
    },
    {
      title: "Weekly Recap",
      type: "Video",
      date: "Apr 13",
      status: "flat",
      summary: "Steady watch time, low comment lift.",
      values: {
        likes: [10, 14, 18, 19, 20, 21, 22],
        comments: [4, 6, 8, 8, 9, 9, 9],
        shares: [3, 5, 7, 8, 8, 9, 9],
        watchTime: [15, 19, 23, 25, 26, 27, 27],
      },
    },
  ],
  YouTube: [
    {
      title: "AI Scheduler Shorts",
      type: "Short",
      date: "Apr 10",
      status: "up",
      summary: "Watch time compounded after recommendations.",
      values: {
        likes: [18, 26, 39, 51, 65, 73, 84],
        comments: [7, 10, 15, 20, 26, 31, 35],
        shares: [5, 8, 12, 18, 24, 28, 33],
        watchTime: [30, 48, 66, 88, 110, 129, 146],
      },
    },
    {
      title: "Product Walkthrough",
      type: "Video",
      date: "Apr 12",
      status: "up",
      summary: "Longer watch sessions are improving search lift.",
      values: {
        likes: [16, 22, 28, 36, 45, 52, 60],
        comments: [5, 8, 11, 13, 18, 22, 25],
        shares: [4, 6, 8, 10, 13, 15, 18],
        watchTime: [42, 55, 71, 89, 103, 117, 134],
      },
    },
  ],
  LinkedIn: [
    {
      title: "Operations Playbook",
      type: "Text Post",
      date: "Apr 11",
      status: "up",
      summary: "Saves and profile visits are outpacing likes.",
      values: {
        likes: [9, 12, 18, 24, 30, 34, 39],
        comments: [5, 7, 10, 14, 18, 20, 23],
        shares: [4, 6, 9, 13, 17, 20, 24],
        watchTime: [8, 10, 13, 17, 20, 23, 26],
      },
    },
    {
      title: "Launch Retrospective",
      type: "Document",
      date: "Apr 15",
      status: "flat",
      summary: "High quality comments, slower share curve.",
      values: {
        likes: [8, 13, 16, 18, 19, 20, 21],
        comments: [6, 9, 11, 12, 13, 13, 14],
        shares: [3, 5, 6, 7, 7, 8, 8],
        watchTime: [6, 8, 10, 12, 13, 14, 14],
      },
    },
  ],
};

function PlatformMetrics() {
  const [selectedPlatformName, setSelectedPlatformName] = useState<string | null>(null);
  const selectedPlatform = PLATFORM_METRICS.find(
    (platform) => platform.name === selectedPlatformName,
  );
  const scrollToMetricsTop = () => {
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };
  const openPlatform = (platformName: string) => {
    setSelectedPlatformName(platformName);
    scrollToMetricsTop();
  };
  const closePlatform = () => {
    setSelectedPlatformName(null);
    scrollToMetricsTop();
  };

  if (selectedPlatform) {
    return <PlatformMetricDetail platform={selectedPlatform} onBack={closePlatform} />;
  }

  return (
    <div className="min-h-screen px-6 py-8 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <Header
          title="Platform Metrics"
          subtitle="A quick performance window across every connected channel."
        />
        <button
          onClick={() => toast.success("New post draft opened")}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Post
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Heart} label="Total Engagement" value="312K" trend="+19% this week" />
        <Kpi icon={Share2} label="Total Shares" value="35.6K" trend="+24% across channels" />
        <Kpi icon={MessageCircle} label="Comments" value="14K" trend="+11% audience lift" />
        <Kpi icon={Timer} label="Watch Time" value="2,340h" trend="+29% video momentum" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {PLATFORM_METRICS.map((platform) => (
          <PlatformMetricWindow
            key={platform.name}
            platform={platform}
            onOpen={() => openPlatform(platform.name)}
          />
        ))}
      </div>
    </div>
  );
}

function PlatformMetricWindow({
  platform,
  onOpen,
}: {
  platform: (typeof PLATFORM_METRICS)[number];
  onOpen: () => void;
}) {
  const Icon = platform.Icon;

  return (
    <section
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="glass-card group flex min-h-[430px] cursor-pointer flex-col overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      <div className={`h-1.5 bg-gradient-to-r ${platform.color}`} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div
                className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${platform.color} shadow-lg shadow-black/20`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">{platform.name}</h3>
                <p className="text-xs text-muted-foreground">{platform.handle}</p>
              </div>
            </div>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            Live
          </span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{platform.summary}</p>

        <div className="mt-6 space-y-3">
          {platform.metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
                  <metric.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{metric.label}</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-300">
                    <TrendingUp className="h-3 w-3" /> {metric.delta}
                  </div>
                </div>
              </div>
              <div className="text-right text-lg font-semibold tracking-tight">{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className={`text-xs font-semibold uppercase tracking-wider ${platform.accent}`}>
            Weekly summary
          </span>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition hover:text-primary/80"
          >
            View report <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function PlatformMetricDetail({
  platform,
  onBack,
}: {
  platform: (typeof PLATFORM_METRICS)[number];
  onBack: () => void;
}) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("likes");
  const posts = POST_PERFORMANCE[platform.name] ?? [];
  const visiblePosts = posts.slice(0, 5);
  const selectedMetricLabel =
    METRIC_OPTIONS.find((option) => option.key === selectedMetric)?.label ?? "Metric";

  return (
    <div className="min-h-screen px-6 py-8 md:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" /> All platforms
          </button>
          <div className="flex items-center gap-4">
            <div
              className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${platform.color} shadow-lg shadow-black/25`}
            >
              <platform.Icon className="h-6 w-6 text-white" />
            </div>
            <Header
              title={`${platform.name} Post Performance`}
              subtitle="Track top posts by lifecycle day, metric movement, and post-level momentum."
            />
          </div>
        </div>
        <button
          onClick={() => toast.success(`${platform.name} post draft opened`)}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Post
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {platform.metrics.slice(0, 4).map((metric) => (
          <Kpi
            key={metric.label}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            trend={metric.delta}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="glass-card rounded-2xl p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                {selectedMetricLabel} over time
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comparing top posts by days since publish keeps posts with different dates fair.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              {METRIC_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSelectedMetric(option.key)}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    selectedMetric === option.key
                      ? "bg-primary text-primary-foreground shadow shadow-primary/30"
                      : "border border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <option.icon className="h-3.5 w-3.5" /> {option.label}
                </button>
              ))}
            </div>
          </div>

          <PostTrendChart posts={visiblePosts} metricKey={selectedMetric} />

          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
              Showing top {visiblePosts.length}
            </span>
            <span>Use the list to pin a focused set when a platform has many posts.</span>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Tracked posts</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Top posts are plotted by default.
              </p>
            </div>
            <span className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Top 5
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {posts.map((post, index) => {
              const firstValue = post.values[selectedMetric][0];
              const lastValue = post.values[selectedMetric].at(-1) ?? firstValue;
              const movement = lastValue - firstValue;
              return (
                <div
                  key={post.title}
                  className="rounded-xl border border-border bg-secondary/30 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/15 text-[11px] font-semibold text-primary">
                          {index + 1}
                        </span>
                        <div className="truncate text-sm font-semibold">{post.title}</div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {post.type} · posted {post.date}
                      </div>
                    </div>
                    <TrendBadge status={post.status} value={movement} />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {post.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function PostTrendChart({
  posts,
  metricKey,
}: {
  posts: (typeof POST_PERFORMANCE)[string];
  metricKey: MetricKey;
}) {
  const days = ["Day 0", "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"];
  const allValues = posts.flatMap((post) => post.values[metricKey]);
  const maxValue = Math.max(...allValues, 1);
  const minValue = Math.min(...allValues, 0);
  const range = Math.max(maxValue - minValue, 1);
  const width = 760;
  const height = 360;
  const padding = { top: 28, right: 28, bottom: 52, left: 54 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const colors = ["#a855f7", "#22d3ee", "#f472b6", "#34d399", "#f59e0b"];

  const getPoint = (value: number, index: number) => {
    const x = padding.left + (index / (days.length - 1)) * plotWidth;
    const y = padding.top + (1 - (value - minValue) / range) * plotHeight;
    return { x, y };
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="min-w-[760px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + plotHeight}
            className="stroke-border"
            strokeWidth="2"
          />
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={padding.left + plotWidth}
            y2={padding.top + plotHeight}
            className="stroke-border"
            strokeWidth="2"
          />

          {[0, 1, 2, 3].map((step) => {
            const value = minValue + (range / 3) * step;
            const y = padding.top + plotHeight - (step / 3) * plotHeight;
            return (
              <g key={step}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + plotWidth}
                  y2={y}
                  className="stroke-border/60"
                  strokeDasharray="4 8"
                />
                <text
                  x={padding.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground text-[11px]"
                >
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {days.map((day, index) => {
            const x = padding.left + (index / (days.length - 1)) * plotWidth;
            return (
              <g key={day}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + plotHeight}
                  className="stroke-muted-foreground/30"
                  strokeDasharray="6 8"
                />
                <text
                  x={x}
                  y={height - 18}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[12px]"
                >
                  {day}
                </text>
              </g>
            );
          })}

          {posts.map((post, postIndex) => {
            const points = post.values[metricKey].map(getPoint);
            const path = points.map((point) => `${point.x},${point.y}`).join(" ");
            const color = colors[postIndex % colors.length];
            return (
              <g key={post.title}>
                <polyline
                  points={path}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={postIndex % 2 ? "8 8" : undefined}
                />
                {points.map((point, pointIndex) => {
                  const current = post.values[metricKey][pointIndex];
                  const previous = post.values[metricKey][Math.max(0, pointIndex - 1)];
                  const delta = current - previous;
                  return (
                    <g key={`${post.title}-${pointIndex}`} className="group">
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill={color}
                        className="cursor-pointer stroke-background"
                        strokeWidth="3"
                      />
                      <foreignObject
                        x={Math.min(point.x + 12, width - 190)}
                        y={Math.max(point.y - 82, 8)}
                        width="176"
                        height="72"
                        className="pointer-events-none opacity-0 transition group-hover:opacity-100"
                      >
                        <div className="rounded-xl border border-border bg-background/95 p-3 text-xs shadow-xl shadow-black/30">
                          <div className="truncate font-semibold text-foreground">{post.title}</div>
                          <div className="mt-1 text-muted-foreground">
                            {days[pointIndex]} · {current}
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-emerald-300">
                            {delta > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : delta < 0 ? (
                              <TrendingDown className="h-3 w-3 text-rose-300" />
                            ) : (
                              <Minus className="h-3 w-3 text-muted-foreground" />
                            )}
                            <span
                              className={
                                delta < 0
                                  ? "text-rose-300"
                                  : delta === 0
                                    ? "text-muted-foreground"
                                    : ""
                              }
                            >
                              {delta > 0 ? "+" : ""}
                              {delta} from previous day
                            </span>
                          </div>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function TrendBadge({ status, value }: { status: "up" | "down" | "flat"; value: number }) {
  const content =
    status === "up"
      ? { icon: TrendingUp, className: "bg-emerald-400/10 text-emerald-300", label: `+${value}` }
      : status === "down"
        ? { icon: TrendingDown, className: "bg-rose-400/10 text-rose-300", label: `${value}` }
        : { icon: Minus, className: "bg-muted/40 text-muted-foreground", label: "Flat" };
  const Icon = content.icon;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${content.className}`}
    >
      <Icon className="h-3 w-3" /> {content.label}
    </span>
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
        <Kpi
          icon={Clock}
          label="Time Saved This Week"
          value="4.5 hours"
          trend="+22% vs last week"
        />
        <Kpi icon={Send} label="Scheduled Posts" value="12" trend="Across 4 platforms" />
        <Kpi
          icon={TrendingUp}
          label="Campaign Efficiency"
          value="94%"
          trend="AI-assisted approvals"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Next Up in Queue" badge="Auto-scheduled" />
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="relative aspect-[16/9] w-full">
              <img
                src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800"
                alt="Scheduled post"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3 flex gap-2">
                <PlatformBadge platform="linkedin" />
                <PlatformBadge platform="instagram" />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/90">
            "Most teams overlook this one workflow that saved us 10 hours a week. Here's the full
            breakdown →"
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" /> Publishing tomorrow at 9:00 AM
            </div>
            <button
              onClick={() =>
                navigate("composer", {
                  caption: "Most teams overlook this one workflow that saved us 10 hours a week.",
                  thumbnail: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800",
                  title: "Next Up Post",
                })
              }
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow shadow-primary/30 transition hover:brightness-110"
            >
              Edit Now <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Instant Campaign Spark" badge="AI" />
          <p className="text-sm text-muted-foreground">
            Turn a single sentence into a multi-platform launch sequence.
          </p>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What business goal or product feature do we want to promote today?"
            className="mt-4 min-h-[120px] w-full resize-none rounded-xl border border-border bg-secondary/40 p-4 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={generate}
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating campaign…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate Campaign
              </>
            )}
          </button>
        </Card>
      </div>
    </div>
  );
}

// ---------- IDEA ENGINE ----------
function IdeaEngine({ navigate }: { navigate: (v: View, seed?: ComposerSeed) => void }) {
  const [campaignGoal, setCampaignGoal] = useState("Product Launch");
  const [brief, setBrief] = useState(
    "Push our new AI scheduling feature to small business owners. Tone: confident, friendly.",
  );

  const steps = useMemo(
    () => [
      {
        day: "Day 1",
        platform: "LinkedIn Text Post",
        icon: Linkedin,
        color: "bg-[#0A66C2]",
        caption:
          "We rebuilt our scheduler from the ground up. Here's why business owners are calling it 'the unfair advantage' — a 3-minute read on the workflow change that saved our team 10 hours a week.",
        thumb: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600",
      },
      {
        day: "Day 3",
        platform: "Instagram Visual Reel",
        icon: Instagram,
        color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
        caption:
          "POV: Your social calendar fills itself. ✨ Tap to see the new AI scheduler in action.",
        thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600",
      },
      {
        day: "Day 5",
        platform: "X / Twitter Thread",
        icon: Twitter,
        color: "bg-foreground text-background",
        caption:
          "We shipped AI scheduling this week. 9 things we learned building it (a thread 🧵)",
        thumb: "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=600",
      },
    ],
    [],
  );

  return (
    <div className="px-8 py-8">
      <Header
        title="AI Campaign Engine"
        subtitle="Configure a goal. We'll architect the full content sequence."
      />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader title="Configuration" badge="Inputs" />
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Campaign Goal
          </label>
          <select
            value={campaignGoal}
            onChange={(e) => setCampaignGoal(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          >
            <option>Product Launch</option>
            <option>Lead Generation</option>
            <option>Brand Awareness</option>
            <option>Customer Retention</option>
          </select>
          <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Brief
          </label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            className="mt-2 min-h-[140px] w-full resize-none rounded-xl border border-border bg-secondary/40 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={() => toast.success("Sequence regenerated")}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow shadow-primary/30 transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" /> Regenerate
          </button>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                Generated Sequence
              </div>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">
                Campaign: App Feature Push
              </h3>
            </div>
            <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
              {campaignGoal}
            </span>
          </div>
          <div className="space-y-3">
            {steps.map((s) => (
              <div
                key={s.day}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-secondary/30 p-4 md:flex-row md:items-center"
              >
                <img src={s.thumb} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-6 w-6 place-items-center rounded-md ${s.color}`}>
                      <s.icon className="h-3.5 w-3.5 text-white" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {s.day} · {s.platform}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/90">{s.caption}</p>
                </div>
                <button
                  onClick={() => {
                    toast.success(`${s.day} sent to Composer`);
                    navigate("composer", {
                      caption: s.caption,
                      thumbnail: s.thumb,
                      title: `${s.day} · ${s.platform}`,
                    });
                  }}
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
function Composer({
  seed,
  onExplore,
  onSchedule,
}: {
  seed: ComposerSeed | null;
  onExplore: () => void;
  onSchedule: (item: {
    caption: string;
    thumb: string;
    platform: "linkedin" | "instagram" | "twitter";
  }) => void;
}) {
  const [selectedAsset, setSelectedAsset] = useState<string>(
    seed?.thumbnail || ASSET_GROUPS[0].items[0].url,
  );
  const [overlayText, setOverlayText] = useState(seed?.title || "Your headline goes here");
  const [caption, setCaption] = useState(seed?.caption || "Write your cross-posting caption…");
  const [tab, setTab] = useState<"canvas" | "clips">("canvas");
  const [platforms, setPlatforms] = useState({
    tiktok: true,
    youtube: true,
    facebook: false,
    linkedin: true,
  });
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
    <div className="grid min-h-screen grid-cols-1 bg-[#eef0f4] text-[#16151c] lg:h-screen lg:grid-cols-[26%_48%_26%]">
      {/* LEFT */}
      <div className="relative flex h-auto flex-col overflow-y-auto border-r-2 border-[#9258ff] bg-[#f8f9fb] p-7 lg:h-screen">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold tracking-tight text-[#33333a]">AI Idea Engine</h3>
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#9258ff] transition hover:text-[#7a42ed]"
          >
            Explore All <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <section className="mt-5 rounded-[20px] bg-white p-7 shadow-[0_2px_8px_rgba(26,24,35,0.16)]">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-black">Ideas</h4>
            <ChevronDown className="h-4 w-4 text-[#9258ff]" />
          </div>
          <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#9258ee] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#824be0]">
            <Sparkles className="h-4 w-4" /> Generate
          </button>
        </section>

        <h3 className="mt-8 text-base font-bold tracking-tight text-[#3d3d42]">Source</h3>
        <label className="mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-[#8f929c] bg-[#f7f8fb] p-6 text-center transition hover:border-[#9258ff] hover:bg-white">
          <Upload className="h-8 w-8 text-[#a77cf3]" />
          <span className="text-sm font-bold text-[#1f1f24]">
            {uploadedVideo ?? "Drop long-form source video"}
          </span>
          <span className="text-sm font-bold text-[#72747a]">.mp4, .mov up to 2GB</span>
          <input type="file" accept="video/*" className="hidden" onChange={onUpload} />
        </label>

        <div className="mt-8 flex items-center justify-between">
          <h3 className="text-base font-bold tracking-tight text-[#222228]">Asset Library</h3>
          <button className="text-sm font-semibold text-[#9258ff] transition hover:text-[#7a42ed]">
            Edit Library
          </button>
        </div>
        <div className="mt-4 flex gap-2">
          {["All", "Top", "Recent"].map((filter, index) => (
            <button
              key={filter}
              className={`h-6 flex-1 rounded-full text-xs font-bold text-white ${index === 0 ? "bg-[#22c55e]" : index === 1 ? "bg-[#1ea7e1]" : "bg-[#d92b72]"}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-3 gap-x-6 gap-y-7">
          {[
            { label: "Shapes", icon: ImageIcon, bg: "from-[#22d3ee] to-[#0ea5e9]" },
            { label: "Graphics", icon: Sparkles, bg: "from-[#ff8a00] to-[#ff2d55]" },
            { label: "Animations", icon: Play, bg: "from-[#a3e635] to-[#16a34a]" },
            { label: "Photos", icon: ImageIcon, bg: "from-[#38bdf8] to-[#2563eb]" },
            { label: "Videos", icon: Video, bg: "from-[#fb5cff] to-[#c026d3]" },
            { label: "Audio", icon: Music2, bg: "from-[#ff496f] to-[#e11d48]" },
            { label: "Charts", icon: TrendingUp, bg: "from-[#67e8f9] to-[#a855f7]" },
            { label: "Forms", icon: CheckCircle2, bg: "from-[#4ade80] to-[#16a34a]" },
            { label: "Sheets", icon: FileText, bg: "from-[#60a5fa] to-[#2563eb]" },
          ].map((asset) => (
            <button
              key={asset.label}
              className="group flex min-w-0 flex-col items-center gap-2 text-center"
            >
              <span
                className={`grid h-[58px] w-[58px] place-items-center rounded-xl bg-gradient-to-br ${asset.bg} text-white shadow-[3px_4px_0_rgba(255,255,255,0.75)_inset,0_5px_12px_rgba(18,20,30,0.2)] transition group-hover:-translate-y-0.5`}
              >
                <asset.icon className="h-7 w-7" />
              </span>
              <span className="text-xs text-[#33343a]">{asset.label}</span>
            </button>
          ))}
        </div>

        <button className="absolute right-[-17px] top-1/2 z-10 grid h-11 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-md">
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* CENTER */}
      <div className="flex min-h-screen flex-col overflow-y-auto bg-[#e9ebf0] px-6 py-6 lg:h-screen">
        <div className="mx-auto flex w-full max-w-md items-center rounded-xl border border-[#d9dbe2] bg-white/80 p-1 shadow-sm">
          {(
            [
              { id: "canvas", label: "Canvas Preview" },
              { id: "clips", label: "AI Clips Generated" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${tab === t.id ? "bg-[#9258ee] text-white shadow shadow-[#9258ee]/25" : "text-[#7b7d86] hover:text-[#16151c]"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "canvas" ? (
          <div className="mt-6 flex flex-1 flex-col items-center justify-center">
            <h2 className="mb-5 text-center text-2xl font-black text-black">9:16 Reel</h2>
            <div className="relative aspect-[9/16] w-full max-w-[368px] overflow-hidden rounded-[22px] shadow-[0_14px_30px_rgba(0,0,0,0.2)]">
              <img
                src={selectedAsset}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10" />
              <div className="absolute inset-x-5 bottom-[64px]">
                <textarea
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  className="w-full resize-none rounded-xl border border-white/30 bg-black/35 p-3 text-center text-2xl font-black leading-tight text-white outline-none backdrop-blur-md focus:border-[#9258ff]"
                  rows={2}
                />
              </div>
            </div>
            <div className="mt-7 flex h-12 w-full max-w-[520px] items-center justify-between rounded-2xl bg-white px-5 text-black shadow-[0_2px_8px_rgba(20,20,26,0.25)]">
              {[
                Music2,
                Type,
                Mic,
                Captions,
                FileText,
                SlidersHorizontal,
                Crop,
                PanelRightClose,
                Trash2,
              ].map((Icon, index) => (
                <button
                  key={index}
                  className="grid h-9 w-9 place-items-center rounded-lg transition hover:bg-[#f0ebff]"
                  aria-label="Editor tool"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="text-xs text-[#666975]">
              3 AI-generated short clips from your source video. Click to preview in canvas.
            </p>
            {AI_CLIPS.map((c, i) => (
              <button
                key={c.name}
                onClick={() => {
                  setSelectedAsset(c.thumb);
                  setTab("canvas");
                  toast(`Loaded ${c.name} into canvas`);
                }}
                className="group flex w-full items-center gap-4 rounded-xl border border-[#d9dbe2] bg-white p-3 text-left shadow-sm transition hover:border-[#9258ff]"
              >
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={c.thumb}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {c.duration}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9258ff]">
                    Clip {i + 1}
                  </div>
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-[#666975]">
                    Optimal {c.duration} cut · 92% hook score
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#666975] transition group-hover:text-[#9258ff]" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="relative flex h-auto flex-col overflow-y-auto border-l-2 border-[#9258ff] bg-[#f8f9fb] p-7 lg:h-screen">
        <button className="absolute left-[-17px] top-1/2 z-10 grid h-11 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow-md">
          <PanelRightClose className="h-4 w-4" />
        </button>
        <h3 className="text-base font-bold tracking-tight text-[#3d3d42]">Publish Settings</h3>
        <label className="mt-5 block text-base font-bold text-[#3d3d42]">Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-4 min-h-[158px] w-full resize-none rounded-[20px] border-0 bg-white p-5 text-sm font-bold text-[#1f1f24] shadow-[0_2px_8px_rgba(26,24,35,0.16)] outline-none focus:ring-2 focus:ring-[#9258ff]/40"
        />

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-base font-bold text-[#3d3d42]">Edit Post Size & Send</div>
            <button className="text-sm font-semibold text-[#9258ff] transition hover:text-[#7a42ed]">
              Edit Posts
            </button>
          </div>
          <div className="mt-4 space-y-3">
            <ToggleRow
              icon={Music2}
              label="TikTok"
              checked={platforms.tiktok}
              onChange={(v) => setPlatforms({ ...platforms, tiktok: v })}
            />
            <ToggleRow
              icon={Facebook}
              label="Facebook"
              checked={platforms.facebook}
              onChange={(v) => setPlatforms({ ...platforms, facebook: v })}
            />
            <ToggleRow
              icon={Instagram}
              label="Instagram"
              checked={platforms.linkedin}
              onChange={(v) => setPlatforms({ ...platforms, linkedin: v })}
            />
            <ToggleRow
              icon={Youtube}
              label="YouTube"
              checked={platforms.youtube}
              onChange={(v) => setPlatforms({ ...platforms, youtube: v })}
            />
            <ToggleRow
              icon={Linkedin}
              label="LinkedIn"
              checked={platforms.linkedin}
              onChange={(v) => setPlatforms({ ...platforms, linkedin: v })}
            />
          </div>
        </div>

        <div className="mt-9 rounded-[18px] bg-white p-4 shadow-[0_2px_8px_rgba(26,24,35,0.12)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-black text-[#3b4559]">
              <Sparkles className="h-5 w-5 text-[#9258ff]" /> AI Features
            </div>
            <ChevronDown className="h-4 w-4 text-[#9258ff]" />
          </div>
          <div className="mt-4 grid grid-cols-3 rounded-full bg-[#eef0f4] p-1 text-xs font-bold text-[#9aa0ad]">
            <button className="rounded-full bg-white px-3 py-2 text-[#3b4559] shadow-sm">
              Captions
            </button>
            <button className="px-3 py-2">Script</button>
            <button className="px-3 py-2">Shorts</button>
          </div>
        </div>

        <button
          onClick={approve}
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#9258ee] py-3 text-sm font-bold text-white shadow-lg shadow-[#9258ee]/25 transition hover:bg-[#824be0]"
        >
          <Sparkles className="h-4 w-4" /> Approve & Schedule to Calendar
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: typeof Music2;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-[18px] bg-white px-5 py-3.5 shadow-[0_2px_6px_rgba(26,24,35,0.14)] transition hover:shadow-[0_4px_12px_rgba(26,24,35,0.18)]">
      <span className="flex items-center gap-3 text-sm font-bold text-[#1f1f24]">
        <Icon className="h-4 w-4 text-black" /> {label}
      </span>
      <span className="flex items-center gap-2">
        <ChevronDown className="h-4 w-4 text-[#9258ff]" />
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
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
      <Header
        title="Smart Marketing Calendar"
        subtitle="Your week, fully orchestrated across platforms."
      />

      <button
        onClick={() => {
          setLocked(true);
          toast.success("Next 5 posts armed for auto-publish");
        }}
        disabled={locked}
        className={`mt-6 flex w-full items-center justify-between gap-4 rounded-2xl border p-5 text-left transition ${
          locked
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-primary/40 bg-primary/10 hover:bg-primary/15"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`grid h-12 w-12 place-items-center rounded-xl ${locked ? "bg-emerald-500" : "bg-primary"} text-white shadow-lg`}
          >
            {locked ? <ShieldCheck className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          </div>
          <div>
            <div className="text-sm font-semibold">
              {locked ? "All Posts Locked & Armed" : "One-Click Approve Next 5 Suggested Posts"}
            </div>
            <div className="text-xs text-muted-foreground">
              {locked
                ? "Auto-publishing on schedule across all connected channels."
                : "AI selected the highest-performing slots this week."}
            </div>
          </div>
        </div>
        {!locked && <ArrowRight className="h-5 w-5 text-primary" />}
      </button>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((d, i) => (
          <div key={d} className="glass-card flex min-h-[280px] flex-col rounded-2xl p-3">
            <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {d}
              </span>
              <span className="text-lg font-semibold">{18 + i}</span>
            </div>
            <div className="space-y-2">
              {calendar[d]?.length ? (
                calendar[d].map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border bg-secondary/40 p-2 transition hover:border-primary/50"
                  >
                    <div className="flex gap-2">
                      <img
                        src={p.thumb}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-md object-cover"
                      />
                      <p className="line-clamp-2 text-[11px] leading-snug text-foreground/90">
                        {p.caption}
                      </p>
                    </div>
                    <div className="mt-2">
                      <PlatformBadge platform={p.platform} small />
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid h-20 place-items-center rounded-lg border border-dashed border-border text-[11px] text-muted-foreground">
                  No posts
                </div>
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
              <div
                key={a.name}
                className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <a.icon className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm font-semibold">{a.name}</div>
                    <div className="text-[11px] text-muted-foreground">{a.handle}</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Connected
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Brand Voice" badge="AI Tuned" />
          <p className="text-sm text-muted-foreground">
            Adjust how OmniForge writes for your audience.
          </p>
          <div className="mt-4 space-y-3">
            {[
              "Tone: confident, friendly",
              "Avoid: jargon, hype words",
              "Preferred emoji: ✨ ⚡ 🚀",
            ].map((t) => (
              <div key={t} className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                {t}
              </div>
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
      {badge && (
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          {badge}
        </span>
      )}
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
          Live
        </span>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      <div className="mt-3 text-[11px] text-primary">{trend}</div>
    </div>
  );
}

function PlatformBadge({
  platform,
  small,
}: {
  platform: "linkedin" | "instagram" | "twitter";
  small?: boolean;
}) {
  const map = {
    linkedin: { label: "LinkedIn", Icon: Linkedin, color: "bg-[#0A66C2] text-white" },
    instagram: {
      label: "Instagram",
      Icon: Instagram,
      color: "bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white",
    },
    twitter: { label: "X", Icon: Twitter, color: "bg-black text-white" },
  } as const;
  const { label, Icon, color } = map[platform];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${color} ${small ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]"} font-semibold`}
    >
      <Icon className={small ? "h-2.5 w-2.5" : "h-3 w-3"} /> {label}
    </span>
  );
}
