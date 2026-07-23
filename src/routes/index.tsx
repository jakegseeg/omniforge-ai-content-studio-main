import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef, type ReactNode } from "react";
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
  Moon,
  Sun,
  Table,
  Frame,
  LayoutGrid,
  Shirt,
  Box,
  Hexagon,
  Hash,
  Package,
  Megaphone,
  File,
  Search,
  X,
  Check,
  LayoutTemplate,
  Star,
  Palette,
  Sticker,
  Ghost,
  Layers,
  MoreVertical,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Maximize2,
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

type View =
  "metrics" | "dashboard" | "ideas" | "composer" | "calendar" | "settings" | "assetLibrary";

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

// ---------- COMPOSER: IDEA ENGINE DATA ----------
const CAMPAIGN_GOALS = [
  "Product Launch",
  "Raise Awareness",
  "Effective Advertisement",
  "Marketing Campaign",
  "Lead Generation",
  "Brand Retention",
];

type GeneratedIdea = {
  day: string;
  platform: string;
  icon: typeof Linkedin;
  iconBg: string;
  teaser: string;
  caption: string;
  thumb: string;
};

// Simulated AI output shown beneath the Generate button inside the Ideas card.
const GENERATED_IDEAS: GeneratedIdea[] = [
  {
    day: "Day 1",
    platform: "LinkedIn Text Post",
    icon: Linkedin,
    iconBg: "bg-[#0A66C2]",
    teaser: "We rebuilt our scheduler from the ground up — here's the unfair advantage.",
    caption:
      "We rebuilt our scheduler from the ground up. Here's why business owners are calling it 'the unfair advantage' — a 3-minute read on the workflow change that saved our team 10 hours a week.",
    thumb: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300",
  },
  {
    day: "Day 3",
    platform: "Instagram Visual Reel",
    icon: Instagram,
    iconBg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    teaser: "POV: Your social calendar fills itself. ✨",
    caption:
      "POV: Your social calendar fills itself. ✨ Tap to see the new AI scheduler in action.",
    thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300",
  },
  {
    day: "Day 5",
    platform: "X / Twitter Thread",
    icon: Twitter,
    iconBg: "bg-black",
    teaser: "We shipped AI scheduling this week. 9 things we learned (a thread 🧵)",
    caption: "We shipped AI scheduling this week. 9 things we learned building it (a thread 🧵)",
    thumb: "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=300",
  },
  {
    day: "Day 7",
    platform: "Facebook Carousel",
    icon: Facebook,
    iconBg: "bg-[#1877F2]",
    teaser: "5 ways small teams reclaim 10 hours a week with automation.",
    caption:
      "5 ways small teams reclaim 10 hours a week. Swipe through the workflow our customers can't stop talking about →",
    thumb: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=300",
  },
];

// ---------- RIGHT SIDEBAR: HASHTAG OPTIONS DATA ----------
type HashTag = { tag: string; reach: string };
type HashGroup = {
  id: string;
  name: string;
  badge: string;
  badgeTone: string;
  group: string; // which filter pill it belongs to
  desc: string;
  tags: HashTag[];
};
const HASHTAG_PILLS = ["All groups", "Summer", "Product", "Brand", "Local"];
const EDITOR_MODES = ["Captions", "Script", "Headlines"] as const;
const HASHTAG_GROUPS: HashGroup[] = [
  {
    id: "hg-summer",
    name: "Summer Campaign",
    badge: "High engagement",
    badgeTone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    group: "Summer",
    desc: "For summer sale and seasonal posts",
    tags: [
      { tag: "#summersale", reach: "840K" },
      { tag: "#summervibes", reach: "2.1M" },
      { tag: "#hotdeals", reach: "320K" },
      { tag: "#shopnow", reach: "1.4M" },
      { tag: "#seasonal", reach: "410K" },
    ],
  },
  {
    id: "hg-local",
    name: "Local & Community",
    badge: "Niche reach",
    badgeTone: "bg-muted text-muted-foreground",
    group: "Local",
    desc: "Location and community hashtags",
    tags: [
      { tag: "#utahbusiness", reach: "48K" },
      { tag: "#orem", reach: "22K" },
      { tag: "#supportlocal", reach: "1.9M" },
      { tag: "#utahentrepreneur", reach: "31K" },
    ],
  },
  {
    id: "hg-brand",
    name: "Brand Awareness",
    badge: "Steady reach",
    badgeTone: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    group: "Brand",
    desc: "Core brand hashtags for every post",
    tags: [
      { tag: "#checkinapp", reach: "12K" },
      { tag: "#socialmediatools", reach: "290K" },
      { tag: "#contentcreation", reach: "3.2M" },
      { tag: "#marketingtips", reach: "1.8M" },
      { tag: "#smallbusiness", reach: "4.1M" },
    ],
  },
  {
    id: "hg-engagement",
    name: "Engagement Boosters",
    badge: "Max reach",
    badgeTone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    group: "Brand",
    desc: "High-reach hashtags to broaden exposure",
    tags: [
      { tag: "#viral", reach: "12.4M" },
      { tag: "#trending", reach: "8.1M" },
      { tag: "#reels", reach: "9.2M" },
      { tag: "#fyp", reach: "22M" },
    ],
  },
  {
    id: "hg-stories",
    name: "Customer Stories",
    badge: "Steady reach",
    badgeTone: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    group: "Brand",
    desc: "Testimonials and UGC posts",
    tags: [
      { tag: "#customerreview", reach: "380K" },
      { tag: "#testimonial", reach: "210K" },
      { tag: "#happycustomer", reach: "920K" },
      { tag: "#ugc", reach: "1.6M" },
    ],
  },
  {
    id: "hg-product",
    name: "Product Launch",
    badge: "High engagement",
    badgeTone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    group: "Product",
    desc: "For new features and releases",
    tags: [
      { tag: "#productlaunch", reach: "720K" },
      { tag: "#buildinpublic", reach: "640K" },
      { tag: "#saas", reach: "950K" },
      { tag: "#techstartup", reach: "1.1M" },
    ],
  },
];

// ---------- RIGHT SIDEBAR: PACKAGE BUILDER TYPES ----------
// A saved Caption / Script / Headline from the Caption Editor card. Saves never
// overwrite — each press of the blue Save button appends a numbered entry.
type SavedText = {
  id: string;
  kind: "Caption" | "Script" | "Headline";
  label: string;
  text: string;
};
// A package references the items chosen in each dropdown.
type Pkg = {
  id: string;
  name: string;
  image: string;
  platforms: string[]; // content destinations from Content Options
  frameIds: string[];
  textIds: string[]; // SavedText ids from Caption Options
  tags: string[]; // hashtag strings from Hashtag Options
  campaigns: string[]; // idea day labels from Campaign Options
};
// What a "Save to Package" press is trying to add (shared Package Modal payload).
type PkgDraft = {
  kind: "content" | "captions" | "hashtags" | "campaign";
  platforms?: string[];
  frameIds?: string[];
  textIds?: string[];
  tags?: string[];
  campaigns?: string[];
  summary: string;
};

// One collapsible section of the restructured right sidebar.
function SidebarPanel({
  title,
  Icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  Icon: IconType;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[18px] bg-card shadow-[0_2px_6px_rgba(26,24,35,0.14)]">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3">
        <span className="flex items-center gap-2.5 text-sm font-bold text-foreground">
          <Icon className="h-4 w-4" /> {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-primary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// The one standardized green button used by every dropdown that can feed a package.
function SaveToPackage({
  onClick,
  label = "Save to Package",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
    >
      <Sparkles className="h-4 w-4" /> {label}
    </button>
  );
}

// ---------- COMPOSER: ASSET LIBRARY DATA ----------
// Horizontally-scrollable filter pills. "All" always shows everything.
const ASSET_TILE_FILTERS = ["All", "Top", "Recent", "Images", "Videos", "Logos", "Templates"];

type AssetTile = {
  label: string;
  icon: typeof ImageIcon;
  bg: string;
  cats: string[]; // which filters (besides "All") this tile belongs to
};

const ASSET_TILES: AssetTile[] = [
  { label: "Shapes", icon: ImageIcon, bg: "from-[#22d3ee] to-[#0ea5e9]", cats: ["Images"] },
  { label: "Graphics", icon: Sparkles, bg: "from-[#ff8a00] to-[#ff2d55]", cats: ["Images", "Top"] },
  {
    label: "Animations",
    icon: Play,
    bg: "from-[#a3e635] to-[#16a34a]",
    cats: ["Videos", "Recent"],
  },
  { label: "Photos", icon: ImageIcon, bg: "from-[#38bdf8] to-[#2563eb]", cats: ["Images", "Top"] },
  { label: "Videos", icon: Video, bg: "from-[#fb5cff] to-[#c026d3]", cats: ["Videos", "Top"] },
  { label: "Audio", icon: Music2, bg: "from-[#ff496f] to-[#e11d48]", cats: ["Recent"] },
  { label: "Charts", icon: TrendingUp, bg: "from-[#67e8f9] to-[#a855f7]", cats: ["Templates"] },
  { label: "Forms", icon: CheckCircle2, bg: "from-[#4ade80] to-[#16a34a]", cats: ["Templates"] },
  { label: "Sheets", icon: FileText, bg: "from-[#60a5fa] to-[#2563eb]", cats: ["Templates"] },
  {
    label: "Tables",
    icon: Table,
    bg: "from-[#f97316] to-[#ea580c]",
    cats: ["Templates", "Recent"],
  },
  { label: "Frames", icon: Frame, bg: "from-[#34d399] to-[#059669]", cats: ["Images"] },
  { label: "Grids", icon: LayoutGrid, bg: "from-[#c084fc] to-[#7c3aed]", cats: ["Templates"] },
  { label: "Mockups", icon: Shirt, bg: "from-[#38bdf8] to-[#2563eb]", cats: ["Images", "Recent"] },
  { label: "3D", icon: Box, bg: "from-[#f472b6] to-[#db2777]", cats: ["Images"] },
  { label: "Logo", icon: Hexagon, bg: "from-[#a78bfa] to-[#6d28d9]", cats: ["Logos", "Top"] },
  { label: "PDFs", icon: File, bg: "from-[#f87171] to-[#dc2626]", cats: [] },
  // Added creator categories (the Full Asset Library only tracks Image/Logo/Video/PDF,
  // so these fill common design-tool gaps without removing anything above).
  {
    label: "Templates",
    icon: LayoutTemplate,
    bg: "from-[#818cf8] to-[#4f46e5]",
    cats: ["Templates"],
  },
  { label: "Text", icon: Type, bg: "from-[#94a3b8] to-[#475569]", cats: ["Templates"] },
  { label: "Icons", icon: Star, bg: "from-[#fbbf24] to-[#f59e0b]", cats: ["Images"] },
  { label: "Stickers", icon: Sticker, bg: "from-[#fb7185] to-[#e11d48]", cats: ["Images"] },
  { label: "Backgrounds", icon: ImageIcon, bg: "from-[#2dd4bf] to-[#0d9488]", cats: ["Images"] },
  {
    label: "Gradients",
    icon: Palette,
    bg: "from-[#f472b6] via-[#a855f7] to-[#6366f1]",
    cats: ["Images"],
  },
  { label: "Uploads", icon: Upload, bg: "from-[#38bdf8] to-[#0284c7]", cats: [] },
];

// ---------- ASSET LIBRARY CATEGORY EXPLORER (in-sidebar detail view) ----------
const EX_POOL = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300",
  "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=300",
  "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=300",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=300",
];
// The 8 global section rows shown first, in this exact order, for every asset
// type (asset-library-category-structure-2026.md).
const GLOBAL_ROWS = [
  "Recently Used",
  "Trending",
  "Recommended",
  "Favorites",
  "Team Assets",
  "Brand Assets",
  "AI Generated",
  "Uploaded Assets",
];

// Metadata shown beneath each thumbnail, keyed by tile label
// (from asset-library-dimensions-2026.md; cycled across cards in a row).
const ASSET_META: Record<string, string[]> = {
  Photos: ["1080 × 1080", "1080 × 1350", "1080 × 1920", "1920 × 1080"],
  Videos: ["1080 × 1920", "1920 × 1080", "1080 × 1080", "1080 × 1350"],
  Graphics: ["Scalable Vector", "1000 × 1000", "1080 × 1080", "1920 × 1080"],
  Shapes: ["256 × 256", "512 × 512", "1000 × 1000"],
  Icons: ["24 × 24", "48 × 48", "128 × 128", "512 × 512"],
  Stickers: ["512 × 512", "1024 × 1024"],
  Logo: ["1000 × 400", "600 × 1000", "1000 × 1000", "SVG"],
  Backgrounds: ["1920 × 1080", "1080 × 1920", "1080 × 1080"],
  Gradients: ["1920 × 1080", "1080 × 1920", "1080 × 1080"],
  Animations: ["Vector", "1080 × 1080", "1080 × 1920"],
  Audio: ["3:12 · MP3 · 128 BPM", "2:05 · WAV", "1:48 · MP3"],
  Charts: ["1200 × 800", "1920 × 1080", "1080 × 1080"],
  Tables: ["1200 × 800 · 4×6", "1200 × 800"],
  Forms: ["600 × 900 · 6 fields", "500 × 700"],
  Sheets: ["1600 × 900"],
  Frames: ["1080 × 1080", "1080 × 1920", "1920 × 1080"],
  Grids: ["9 cells · 1080²", "1200 × 1200"],
  Mockups: ["1080 × 1920", "1920 × 1200", "2560 × 1440"],
  "3D": ["1000 × 1000 · GLTF"],
  PDFs: ["600 × 800 · 20 Pages"],
  Templates: ["1080 × 1080", "1080 × 1920"],
  Text: ["Montserrat Bold", "Inter Regular"],
  Uploads: ["Original size"],
};

// Per-type category rows shown after the 8 global rows, and the folder /
// subfolder options offered in the upload placement flow. Keyed by the tile
// label (asset-library-category-structure-2026.md). Folders with no subfolders
// browse flat; nested types (Photos, Shapes) expose their subfolders.
type Folder = { folder: string; subfolders: string[] };
const flat = (names: string[]): Folder[] => names.map((folder) => ({ folder, subfolders: [] }));
const TYPE_FOLDERS: Record<string, Folder[]> = {
  Photos: [
    {
      folder: "People",
      subfolders: ["Business", "Families", "Lifestyle", "Fitness", "Healthcare"],
    },
    { folder: "Nature", subfolders: ["Mountains", "Forests", "Beaches", "Lakes"] },
    { folder: "Food", subfolders: ["Restaurants", "Cooking", "Drinks", "Desserts"] },
    { folder: "Business", subfolders: ["Meetings", "Offices", "Technology", "Marketing"] },
    { folder: "Travel", subfolders: ["Cities", "Resorts", "Adventure"] },
    { folder: "Seasonal", subfolders: ["Christmas", "Summer", "Halloween"] },
  ],
  Videos: flat([
    "Hooks",
    "Leads",
    "Transitions",
    "B-Roll",
    "Product Shots",
    "Lifestyle",
    "Aerial",
    "Drone",
    "Nature",
    "Food",
    "Travel",
    "Business",
    "Sports",
    "Real Estate",
    "Education",
    "Cinematic",
    "Social Media",
  ]),
  Graphics: flat([
    "Social Graphics",
    "Marketing Graphics",
    "Business Graphics",
    "Infographics",
    "Decorative Graphics",
    "UI Graphics",
    "Abstract Graphics",
    "Hand Drawn",
    "Illustration Packs",
    "Brand Graphics",
    "Seasonal Graphics",
    "Sales Graphics",
    "Event Graphics",
    "Holiday Graphics",
  ]),
  Shapes: [
    { folder: "Basic", subfolders: ["Rectangle", "Circle", "Triangle"] },
    ...flat([
      "Geometric",
      "Organic",
      "Abstract",
      "Arrows",
      "Speech Bubbles",
      "Lines",
      "Dividers",
      "Decorative",
      "Social Media",
      "Callout Shapes",
      "Modern",
      "Minimal",
      "Rounded",
    ]),
  ],
  Icons: flat([
    "Business",
    "Marketing",
    "Technology",
    "Social Media",
    "Education",
    "Healthcare",
    "Finance",
    "Ecommerce",
    "Arrows",
    "UI",
    "Navigation",
    "Communication",
  ]),
  Stickers: flat([
    "Social Media",
    "Reactions",
    "Emojis",
    "Sale",
    "Promotional",
    "Seasonal",
    "Business",
    "Fun",
    "Educational",
  ]),
  Logo: flat([
    "Wordmarks",
    "Monograms",
    "Emblems",
    "Mascots",
    "Abstract",
    "Corporate",
    "Startup",
    "Technology",
    "Fitness",
    "Food",
    "Fashion",
  ]),
  Backgrounds: flat([
    "Gradients",
    "Abstract",
    "Nature",
    "Business",
    "Technology",
    "Minimal",
    "Textures",
    "Seasonal",
    "Luxury",
  ]),
  Gradients: flat([
    "Warm",
    "Cool",
    "Neon",
    "Luxury",
    "Sunset",
    "Corporate",
    "Vibrant",
    "Minimal",
    "Dark Mode",
  ]),
  Animations: flat([
    "Text Animations",
    "Entrances",
    "Exits",
    "Transitions",
    "Social Media",
    "Product",
    "Logo Reveals",
    "Lower Thirds",
    "Motion Graphics",
    "Effects",
    "Trending",
    "Viral",
    "Business",
    "Education",
  ]),
  Audio: flat([
    "Music",
    "Sound Effects",
    "Voiceovers",
    "Ambient",
    "Cinematic",
    "Corporate",
    "Upbeat",
    "Podcast",
    "Inspirational",
    "Electronic",
    "Acoustic",
    "Loops",
    "Beats",
    "Social Media",
  ]),
  Charts: flat([
    "Bar",
    "Line",
    "Pie",
    "Donut",
    "Area",
    "Funnel",
    "Growth",
    "Marketing",
    "Analytics",
    "Financial",
    "Presentation",
    "Dashboard",
  ]),
  Tables: flat([
    "Pricing Tables",
    "Comparison Tables",
    "Data Tables",
    "Schedules",
    "Calendars",
    "Product Tables",
    "Analytics Tables",
  ]),
  Forms: flat([
    "Contact",
    "Lead Capture",
    "Newsletter",
    "Registration",
    "Survey",
    "Event",
    "Booking",
    "Feedback",
    "Application",
    "Support",
  ]),
  Sheets: flat([
    "Budget",
    "Marketing",
    "Content Planning",
    "Social Media",
    "Editorial",
    "Campaign Tracking",
    "CRM",
    "Finance",
    "KPI",
    "Analytics",
  ]),
  Frames: flat([
    "Social Media",
    "Mobile",
    "Desktop",
    "Story",
    "Reel",
    "Presentation",
    "Device Frames",
    "Polaroid",
    "Modern",
    "Minimal",
  ]),
  Grids: flat([
    "Instagram",
    "Masonry",
    "Gallery",
    "Comparison",
    "Product",
    "Portfolio",
    "Editorial",
  ]),
  Mockups: flat([
    "Mobile Phones",
    "Tablets",
    "Laptops",
    "Desktop",
    "Billboards",
    "Packaging",
    "Apparel",
    "Books",
    "Business Cards",
    "Signage",
    "Social Media",
  ]),
  "3D": flat([
    "Objects",
    "Characters",
    "Abstract",
    "Icons",
    "Devices",
    "Furniture",
    "Technology",
    "Marketing",
    "Product Display",
    "Scenes",
  ]),
  PDFs: flat([
    "Reports",
    "Presentations",
    "White Papers",
    "Case Studies",
    "Brochures",
    "Sales Decks",
    "Training",
    "Proposals",
  ]),
  Templates: flat([
    "Social Posts",
    "Reels",
    "Stories",
    "Ads",
    "Carousels",
    "Blog Graphics",
    "YouTube",
    "LinkedIn",
    "Presentations",
    "Email",
    "Flyers",
    "Posters",
    "Events",
    "Product Launches",
    "Real Estate",
    "Healthcare",
    "Education",
  ]),
  Text: flat([
    "Headlines",
    "Subheads",
    "Quotes",
    "Captions",
    "CTA",
    "Minimal",
    "Bold",
    "Luxury",
    "Corporate",
    "Social Media",
    "Viral",
    "Trending",
  ]),
  Uploads: flat([
    "Recent Uploads",
    "Images",
    "Videos",
    "Audio",
    "Documents",
    "PDFs",
    "Team Assets",
    "Brand Assets",
    "Folders",
    "Shared Assets",
  ]),
};

// Drop behavior classes (source of truth: asset-behavior-matrix-2026.md).
// Photo/Video/Animation/PDF onto a frame → Fill/Fit/Place-Freely modal.
const MODAL_TYPES = new Set(["Photos", "Videos", "Animations", "PDFs"]);
// Icons/Stickers/Logo/Graphics/3D/Shapes → drop centered at original size, no modal.
const OVERLAY_TYPES = new Set(["Icons", "Stickers", "Logo", "Graphics", "3D", "Shapes"]);
// Backgrounds/Gradients → auto-fill the frame, no modal.
const FILL_TYPES = new Set(["Backgrounds", "Gradients"]);

type RowKind = "image" | "video" | "audio" | "pdf";
// Short overlay tag drawn on the thumbnail for time/page-based assets
// (asset-library-dimensions-2026.md: video/audio/pdf get an on-thumb tag).
function overlayTag(kind: RowKind, i: number): string | null {
  if (kind === "video") return `${8 + i * 3}.0s`;
  if (kind === "audio") return `${1 + (i % 5)}:${String((i * 13) % 60).padStart(2, "0")}`;
  if (kind === "pdf") return `${(i + 1) * 3} pp`;
  return null;
}

function ExplorerRow({
  title,
  kind,
  pool,
  meta,
  onPick,
}: {
  title: string;
  kind: RowKind;
  pool: string[];
  meta: string[];
  onPick: (img: string) => void;
}) {
  const tall = kind === "video";
  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
        <button
          onClick={() => toast(`See all ${title}`)}
          className="text-xs font-semibold text-primary transition hover:text-primary/80"
        >
          See all
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pool.map((img, i) => {
          const tag = overlayTag(kind, i);
          return (
            <div key={i} className="shrink-0">
              <button
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/omni-asset", img);
                  e.dataTransfer.effectAllowed = "copy";
                }}
                onClick={() => onPick(img)}
                title="Click to place, or drag onto the canvas"
                className={`relative block cursor-grab overflow-hidden rounded-lg border border-border transition hover:border-primary active:cursor-grabbing ${
                  tall ? "h-28 w-[86px]" : "h-20 w-[104px]"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {tag && (
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-semibold text-white">
                    {tag}
                  </span>
                )}
              </button>
              <div className="mt-1 w-[104px] max-w-full truncate text-[9px] font-medium text-muted-foreground">
                {meta[i % meta.length]}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Replaces the whole left sidebar when an asset tile is opened.
function AssetExplorer({
  category,
  onBack,
  onPick,
  uploads,
}: {
  category: string;
  onBack: () => void;
  onPick: (image: string, type: string) => void;
  uploads: string[];
}) {
  const [q, setQ] = useState("");
  const kind: RowKind =
    category === "Videos" || category === "Animations"
      ? "video"
      : category === "Audio"
        ? "audio"
        : category === "PDFs"
          ? "pdf"
          : "image";
  const typeCats = (TYPE_FOLDERS[category] ?? []).map((f) => f.folder);
  const rows = [...GLOBAL_ROWS, ...typeCats];
  const ql = q.trim().toLowerCase();
  const visible = ql ? rows.filter((r) => r.toLowerCase().includes(ql)) : rows;
  const meta = ASSET_META[category] ?? ["1080 × 1080"];
  const poolFor = (seed: number) =>
    EX_POOL.map((_, i) => EX_POOL[(i + seed) % EX_POOL.length]).slice(0, 8);
  // Uploaded assets surface at the front of the Uploaded Assets / Recently Used rows.
  const rowPool = (title: string, seed: number) => {
    const base = poolFor(seed);
    if (uploads.length && (title === "Uploaded Assets" || title === "Recently Used")) {
      return [...uploads, ...base].slice(0, 8);
    }
    return base;
  };

  return (
    <div className="shrink-0">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-base font-bold text-foreground transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> {category}
      </button>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${category.toLowerCase()}`}
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => toast(`Generating ${category.toLowerCase()}…`)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/40 py-2 text-sm font-bold text-primary transition hover:bg-primary/10"
        >
          <Sparkles className="h-4 w-4" /> Generate <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => toast("Searching library…")}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-sm font-bold text-white transition hover:brightness-110"
        >
          <Search className="h-4 w-4" /> Search
        </button>
      </div>

      {typeCats.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {typeCats.map((t) => (
            <button
              key={t}
              onClick={() => setQ(q === t ? "" : t)}
              className={`h-7 shrink-0 rounded-full px-3 text-xs font-semibold transition ${
                q === t
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {visible.map((title, i) => (
        <ExplorerRow
          key={title}
          title={title}
          kind={kind}
          pool={rowPool(title, i)}
          meta={meta}
          onPick={(img) => onPick(img, category)}
        />
      ))}
      {visible.length === 0 && (
        <p className="mt-6 text-center text-xs text-muted-foreground">No matches for “{q}”.</p>
      )}
    </div>
  );
}

// ---------- FULL ASSET LIBRARY PAGE DATA ----------
type LibraryAsset = {
  name: string;
  type: "Image" | "Logo" | "Video" | "PDF";
  date: string;
  grade: "A" | "B" | "C";
  status: "recent" | "top" | "unused";
  emoji: string;
};

const LIBRARY_ASSETS: LibraryAsset[] = [
  {
    name: "Summer Banner",
    type: "Image",
    date: "Jun 1",
    grade: "A",
    status: "recent",
    emoji: "🖼️",
  },
  { name: "Product Hero", type: "Image", date: "May 12", grade: "B", status: "top", emoji: "⛰️" },
  {
    name: "Brand Logo (Light)",
    type: "Logo",
    date: "Jan 3",
    grade: "C",
    status: "top",
    emoji: "🔵",
  },
  {
    name: "Brand Logo (Dark)",
    type: "Logo",
    date: "Jan 3",
    grade: "B",
    status: "recent",
    emoji: "⚫",
  },
  { name: "Intro Reel", type: "Video", date: "Jun 8", grade: "B", status: "unused", emoji: "🎬" },
  {
    name: "Holiday Graphic",
    type: "Image",
    date: "Nov 20",
    grade: "A",
    status: "unused",
    emoji: "🎄",
  },
  {
    name: "Brand Guidelines",
    type: "PDF",
    date: "Feb 14",
    grade: "A",
    status: "recent",
    emoji: "📄",
  },
  { name: "Customer Story", type: "Image", date: "May 28", grade: "A", status: "top", emoji: "🧑" },
  {
    name: "App Screenshot",
    type: "Image",
    date: "Jun 10",
    grade: "B",
    status: "unused",
    emoji: "📱",
  },
  { name: "Sale Badge", type: "Image", date: "Jun 2", grade: "A", status: "recent", emoji: "🏷️" },
  { name: "Promo Video", type: "Video", date: "May 30", grade: "A", status: "top", emoji: "📹" },
  { name: "Terms PDF", type: "PDF", date: "Mar 1", grade: "C", status: "unused", emoji: "📋" },
];

const LIBRARY_TYPE_FILTERS = ["All", "Images", "Videos", "Logos", "PDFs"];
const LIBRARY_NAV = {
  library: [
    { label: "All Assets", count: 34 },
    { label: "Brand Kit", count: null as number | null },
    { label: "Snippets", count: 12 },
    { label: "Hashtag Library", count: 8 },
  ],
  collections: ["Summer Campaign", "Product Launch", "Holiday Series"],
  app: ["Composer", "Calendar", "Analytics"],
};

// ---------- ROOT ----------
type Theme = "light" | "dark";

function OmniForgeApp() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<View>("metrics");
  const [composerSeed, setComposerSeed] = useState<ComposerSeed | null>(null);
  const [calendar, setCalendar] = useState(INITIAL_CALENDAR);
  // Frames sent from the Composer, waiting in the Calendar sidebar to be scheduled.
  const [sentPosts, setSentPosts] = useState<SentPost[]>([]);
  // Sent posts that have been dragged onto a specific day.
  const [scheduled, setScheduled] = useState<Record<string, SentPost[]>>({});
  // Light is the default (what users see on first login); choice persists.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("omniforge-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("omniforge-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const navigate = (v: View, seed?: ComposerSeed) => {
    if (seed) setComposerSeed(seed);
    setView(v);
  };

  if (!authed) return <PasswordWall onUnlock={() => setAuthed(true)} />;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <TopNav view={view} navigate={navigate} theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 overflow-x-hidden">
        <div key={view} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {view === "metrics" && <PlatformMetrics />}
          {view === "dashboard" && <Dashboard navigate={navigate} />}
          {view === "ideas" && <IdeaEngine navigate={navigate} />}
          {view === "composer" && (
            <Composer
              seed={composerSeed}
              onExplore={() => setView("ideas")}
              onEditLibrary={() => setView("assetLibrary")}
              onSendToCalendar={(posts) => setSentPosts((s) => [...s, ...posts])}
            />
          )}
          {view === "calendar" && (
            <CalendarView
              calendar={calendar}
              sentPosts={sentPosts}
              setSentPosts={setSentPosts}
              scheduled={scheduled}
              setScheduled={setScheduled}
            />
          )}
          {view === "settings" && <SettingsView />}
          {view === "assetLibrary" && <FullAssetLibrary onBack={() => setView("composer")} />}
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
  theme,
  toggleTheme,
}: {
  view: View;
  navigate: (v: View, seed?: ComposerSeed) => void;
  theme: Theme;
  toggleTheme: () => void;
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

      {/* Right cluster: theme toggle + Create */}
      <div className="ml-auto flex items-center gap-2">
        {/* Moon in light mode (→ dark), Sun in dark mode (→ light) */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {/* Create → AI Idea Engine */}
        <button
          onClick={() => navigate("ideas")}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
        >
          <Sparkles className="h-4 w-4" /> Create
        </button>
      </div>
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

type PostPerformancePost = {
  title: string;
  type: string;
  date: string;
  status: "up" | "down" | "flat";
  summary: string;
  values: Record<MetricKey, number[]>;
};

const POST_PERFORMANCE: Record<string, PostPerformancePost[]> = {
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

const lastMetricValue = (post: PostPerformancePost, metricKey: MetricKey) =>
  post.values[metricKey].at(-1) ?? 0;

const metricLift = (post: PostPerformancePost, metricKey: MetricKey) => {
  const values = post.values[metricKey];
  return (values.at(-1) ?? 0) - (values[0] ?? 0);
};

const getPostPerformanceScore = (post: PostPerformancePost) => {
  const finalEngagement =
    lastMetricValue(post, "likes") +
    lastMetricValue(post, "comments") * 2.2 +
    lastMetricValue(post, "shares") * 2.6 +
    lastMetricValue(post, "watchTime") * 1.4;
  const growth =
    metricLift(post, "likes") +
    metricLift(post, "comments") * 2 +
    metricLift(post, "shares") * 2.4 +
    metricLift(post, "watchTime") * 1.2;

  return Math.round(finalEngagement + growth);
};

const getRankedPosts = (posts: PostPerformancePost[]) =>
  [...posts].sort((a, b) => getPostPerformanceScore(b) - getPostPerformanceScore(a)).slice(0, 5);

const getMetricTone = (post: PostPerformancePost) => {
  const commentLift = metricLift(post, "comments");
  const shareLift = metricLift(post, "shares");
  const likeLift = metricLift(post, "likes");

  if (commentLift >= shareLift && commentLift >= likeLift) {
    return "Conversation is the main driver, with comments carrying the post more than passive likes.";
  }

  if (shareLift >= commentLift && shareLift >= likeLift) {
    return "Share behavior is strongest, which usually means the idea is practical enough for people to pass along.";
  }

  return "Likes are leading the response, so the creative is landing quickly even if deeper discussion is lighter.";
};

const getAiPostSummary = (post: PostPerformancePost, rank: number) => {
  const comments = lastMetricValue(post, "comments");
  const commentLift = metricLift(post, "comments");
  const likes = lastMetricValue(post, "likes");
  const shares = lastMetricValue(post, "shares");
  const watchTime = lastMetricValue(post, "watchTime");
  const score = getPostPerformanceScore(post);
  const sentiment =
    post.status === "down"
      ? "Mixed response: early likes did not hold, and the comment signal suggests some audience friction or weaker relevance."
      : commentLift >= 20
        ? "Mostly positive: comments are growing quickly, which suggests people understood the value and had something to add."
        : "Positive but quieter: likes are present, while the comment thread needs a stronger prompt to surface objections or praise.";
  const concern =
    post.status === "down"
      ? "The drop-off suggests the hook or audience match weakened after the first few days."
      : commentLift < 10
        ? "The main miss is comment depth; viewers reacted, but fewer people added a point of view."
        : "The risk is keeping the next post focused enough to repeat the same audience signal.";

  return {
    score,
    headline: `#${rank} by blended performance`,
    commentSummary: `Comment read: ${comments} total comments with ${commentLift >= 0 ? "+" : ""}${commentLift} growth. Audience response appears ${commentLift >= 20 ? "active and specific" : commentLift >= 10 ? "steady but not explosive" : "lighter than the reach suggests"}.`,
    sentiment,
    whyItWorked: `${getMetricTone(post)} Final snapshot: ${likes} likes, ${shares} shares, and ${watchTime} watch-time points.`,
    whatToImprove: concern,
  };
};

const getPlatformInsights = (platformName: string, posts: PostPerformancePost[]) => {
  const rankedPosts = getRankedPosts(posts);
  const topPost = rankedPosts[0];
  const strongestMetric = (["comments", "shares", "watchTime", "likes"] as MetricKey[])
    .map((metricKey) => ({
      metricKey,
      lift: rankedPosts.reduce((total, post) => total + metricLift(post, metricKey), 0),
    }))
    .sort((a, b) => b.lift - a.lift)[0];
  const label = METRIC_OPTIONS.find((option) => option.key === strongestMetric?.metricKey)?.label;
  const lowerVelocityPost = rankedPosts
    .filter((post) => post.status !== "up")
    .sort((a, b) => getPostPerformanceScore(a) - getPostPerformanceScore(b))[0];

  return {
    summary: topPost
      ? `${platformName} is being pulled forward by "${topPost.title}". ${label ?? "Engagement"} is the strongest signal across the current top posts, so the next edit should preserve the post structure that made people respond.`
      : "Once posts are connected, this panel will summarize what is working and what needs attention.",
    winning: topPost
      ? `${topPost.type} content is performing best when it has a fast payoff and a clear reason to comment or share.`
      : "No top post available yet.",
    opportunity: lowerVelocityPost
      ? `"${lowerVelocityPost.title}" needs a sharper first frame or clearer question to lift comments.`
      : "Keep testing follow-up posts while the current winners still have momentum.",
    nextMove: `Draft two variants: one that asks for a specific comment, and one that makes the ${label?.toLowerCase() ?? "engagement"} payoff obvious in the first few seconds.`,
  };
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
  const rankedPosts = getRankedPosts(posts);
  const visiblePosts = rankedPosts;
  const platformInsights = getPlatformInsights(platform.name, posts);
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
        <div className="min-w-0 space-y-5">
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Tracked posts</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ranked by blended performance, then summarized from comment momentum.
                </p>
              </div>
              <span className="w-fit rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Top {rankedPosts.length}
              </span>
            </div>

            <div className="mt-5 overflow-x-auto pb-1">
              <div className="flex gap-3">
                {rankedPosts.map((post, index) => {
                  const firstValue = post.values[selectedMetric][0];
                  const lastValue = post.values[selectedMetric].at(-1) ?? firstValue;
                  const movement = lastValue - firstValue;
                  const aiSummary = getAiPostSummary(post, index + 1);
                  return (
                    <div
                      key={post.title}
                      className="flex min-w-[290px] max-w-[330px] flex-1 flex-col rounded-xl border border-border bg-secondary/30 p-3 transition hover:border-primary/30 hover:bg-secondary/40"
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
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
                          {aiSummary.headline}
                        </span>
                        <span className="rounded-full border border-border bg-background/40 px-2 py-1 text-muted-foreground">
                          Score {aiSummary.score}
                        </span>
                      </div>
                      <div className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
                        <p>
                          <span className="font-semibold text-foreground">Comments: </span>
                          {aiSummary.commentSummary}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Sentiment: </span>
                          {aiSummary.sentiment}
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Edit: </span>
                          {aiSummary.whatToImprove}
                        </p>
                      </div>
                      <div className="mt-auto flex justify-end pt-4">
                        <button
                          onClick={() =>
                            toast.success(`Recommended edit applied to "${post.title}" draft`)
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow shadow-primary/25 transition hover:brightness-110"
                        >
                          <FileText className="h-3.5 w-3.5" /> Edit Post
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <section className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Insights</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                AI-style readout from top post momentum and comment signals.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Draft AI
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/10 p-4">
            <div className="text-sm font-semibold text-primary">Overall summary</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {platformInsights.summary}
            </p>
          </div>

          <div className="mt-3 grid gap-3">
            {[
              { label: "Where it is working", value: platformInsights.winning, icon: TrendingUp },
              {
                label: "Where to improve",
                value: platformInsights.opportunity,
                icon: SlidersHorizontal,
              },
              { label: "Recommended edit", value: platformInsights.nextMove, icon: Wand2 },
            ].map((insight) => (
              <div
                key={insight.label}
                className="rounded-xl border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <insight.icon className="h-3.5 w-3.5 text-primary" /> {insight.label}
                </div>
                <p className="mt-2 text-sm leading-relaxed">{insight.value}</p>
              </div>
            ))}
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
  const tooltipHideTimer = useRef<number | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPoint, setTooltipPoint] = useState<{
    postTitle: string;
    day: string;
    current: number;
    delta: number;
    color: string;
    x: number;
    y: number;
  } | null>(null);

  const getPoint = (value: number, index: number) => {
    const x = padding.left + (index / (days.length - 1)) * plotWidth;
    const y = padding.top + (1 - (value - minValue) / range) * plotHeight;
    return { x, y };
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
    if (tooltipHideTimer.current) window.clearTimeout(tooltipHideTimer.current);
    tooltipHideTimer.current = window.setTimeout(() => setTooltipPoint(null), 180);
  };

  useEffect(() => {
    return () => {
      if (tooltipHideTimer.current) window.clearTimeout(tooltipHideTimer.current);
    };
  }, []);

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="min-w-[760px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full overflow-visible"
          onPointerLeave={hideTooltip}
        >
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
                  const showTooltip = () => {
                    if (tooltipHideTimer.current) window.clearTimeout(tooltipHideTimer.current);
                    setTooltipPoint({
                      postTitle: post.title,
                      day: days[pointIndex],
                      current,
                      delta,
                      color,
                      x: point.x,
                      y: point.y,
                    });
                    window.requestAnimationFrame(() => setTooltipVisible(true));
                  };
                  return (
                    <g key={`${post.title}-${pointIndex}`} className="group">
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill={color}
                        className="cursor-pointer stroke-background"
                        strokeWidth="3"
                        onClick={showTooltip}
                        onPointerEnter={showTooltip}
                        onPointerLeave={hideTooltip}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {tooltipPoint && (
            <foreignObject
              x={Math.min(tooltipPoint.x + 14, width - 234)}
              y={Math.max(tooltipPoint.y - 104, 10)}
              width="220"
              height="96"
              className={`pointer-events-none overflow-visible transition-all duration-200 ease-out ${
                tooltipVisible ? "opacity-100" : "translate-y-1 opacity-0"
              }`}
            >
              <div className="h-full overflow-hidden rounded-2xl border border-white/35 bg-white/40 p-3 text-xs shadow-2xl shadow-slate-900/20 ring-1 ring-white/45 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/25 dark:border-white/15 dark:bg-slate-950/35 dark:shadow-black/30 dark:ring-white/10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.72),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.42),rgba(168,85,247,0.08),rgba(34,211,238,0.1))]" />
                <div
                  className="relative truncate text-sm font-bold"
                  style={{ color: tooltipPoint.color }}
                >
                  {tooltipPoint.postTitle}
                </div>
                <div className="relative mt-1 font-semibold" style={{ color: tooltipPoint.color }}>
                  {tooltipPoint.day} · {tooltipPoint.current}
                </div>
                <div
                  className="relative mt-2 flex items-center gap-1.5"
                  style={{ color: tooltipPoint.color }}
                >
                  {tooltipPoint.delta > 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : tooltipPoint.delta < 0 ? (
                    <TrendingDown className="h-3.5 w-3.5" />
                  ) : (
                    <Minus className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {tooltipPoint.delta > 0 ? "+" : ""}
                    {tooltipPoint.delta} from previous day
                  </span>
                </div>
              </div>
            </foreignObject>
          )}
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

// ---------- COMPOSER: CANVAS TOOLBARS ----------
type IconType = React.ComponentType<{ className?: string }>;

// Brand logos lucide doesn't ship (real simple-icons paths).
const IconTikTok: IconType = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);
const IconX: IconType = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const IconPinterest: IconType = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 12.018.026L12.017 0z" />
  </svg>
);

// Upper platform-selector toolbar (edit mode), left→right.
const PLATFORMS: { label: string; Icon: IconType }[] = [
  { label: "TikTok", Icon: IconTikTok },
  { label: "Instagram", Icon: Instagram },
  { label: "Facebook", Icon: Facebook },
  { label: "YouTube", Icon: Youtube },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "Snapchat", Icon: Ghost },
  { label: "Pinterest", Icon: IconPinterest },
  { label: "X (Twitter)", Icon: IconX },
];

// Lower editing toolbar, left→right.
const LOWER_TOOLS: { label: string; Icon: IconType }[] = [
  { label: "Audio", Icon: Music2 },
  { label: "Text", Icon: Type },
  { label: "Sound Effects", Icon: Mic },
  { label: "Captions", Icon: Captions },
  { label: "Overlay", Icon: Layers },
  { label: "Frame", Icon: Frame },
  { label: "Crop", Icon: Crop },
  { label: "Tools", Icon: SlidersHorizontal },
  { label: "Delete", Icon: Trash2 },
  { label: "More", Icon: MoreHorizontal },
];

// Blue selection handle positions (4 corners + 4 edge midpoints).
const SELECTION_HANDLES = [
  "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
  "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
  "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2",
  "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
];

// Toolbar icon button with a hover tooltip badge above it.
function ToolbarButton({
  label,
  Icon,
  onClick,
}: {
  label: string;
  Icon: IconType;
  onClick?: () => void;
}) {
  return (
    <div className="group/tt relative shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="grid h-9 w-9 place-items-center rounded-lg text-foreground/80 transition hover:bg-primary/10 hover:text-foreground"
      >
        <Icon className="h-[18px] w-[18px]" />
      </button>
      <span className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-semibold text-background opacity-0 shadow-md transition group-hover/tt:opacity-100">
        {label}
      </span>
    </div>
  );
}

// ---------- COMPOSER: DESIGN BOARD ----------
const FRAME_W = 300;
const FRAME_H = 533; // 9:16 (default frame: Instagram Reel 1080×1920)
// Board renders real px sizes scaled down: a 1080px-wide frame shows at 300px.
const DISPLAY_SCALE = 300 / 1080;

// Per-platform content sizes, curated from social-media-size-guide-2026.md
// (only the 8 platforms shown in the frame toolbar). Others in the guide aren't
// selectable here, so they're intentionally omitted.
type SizeOption = { content: string; oneWord: string; aspect: string; w: number; h: number };
const PLATFORM_SIZES: Record<string, SizeOption[]> = {
  TikTok: [
    { content: "Standard video", oneWord: "Video", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Photo Mode", oneWord: "Photo", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Carousel", oneWord: "Carousel", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Story", oneWord: "Story", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Video cover", oneWord: "Cover", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Cover (landscape)", oneWord: "Cover", aspect: "16:9", w: 1920, h: 1080 },
    { content: "Profile picture", oneWord: "Profile", aspect: "1:1", w: 400, h: 400 },
    { content: "Shop / product", oneWord: "Product", aspect: "1:1", w: 800, h: 800 },
    { content: "In-Feed Ad", oneWord: "Ad", aspect: "9:16", w: 1080, h: 1920 },
    { content: "TopView Ad", oneWord: "Ad", aspect: "9:16", w: 1080, h: 1920 },
  ],
  Instagram: [
    { content: "Feed post – portrait", oneWord: "Post", aspect: "3:4", w: 1080, h: 1440 },
    { content: "Feed post – portrait", oneWord: "Post", aspect: "4:5", w: 1080, h: 1350 },
    { content: "Feed post – square", oneWord: "Post", aspect: "1:1", w: 1080, h: 1080 },
    { content: "Feed post – landscape", oneWord: "Post", aspect: "1.91:1", w: 1080, h: 566 },
    { content: "Carousel", oneWord: "Carousel", aspect: "4:5", w: 1080, h: 1350 },
    { content: "Reel", oneWord: "Reel", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Story", oneWord: "Story", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Profile picture", oneWord: "Profile", aspect: "1:1", w: 320, h: 320 },
    { content: "Feed ad – portrait", oneWord: "Ad", aspect: "4:5", w: 1440, h: 1800 },
    { content: "Feed ad – square", oneWord: "Ad", aspect: "1:1", w: 1440, h: 1440 },
    { content: "Story/Reel ad", oneWord: "Ad", aspect: "9:16", w: 1440, h: 2560 },
  ],
  Facebook: [
    { content: "Feed post", oneWord: "Post", aspect: "4:5", w: 1080, h: 1350 },
    { content: "Feed post – square", oneWord: "Post", aspect: "1:1", w: 1080, h: 1080 },
    { content: "Link preview", oneWord: "Link", aspect: "1.91:1", w: 1200, h: 630 },
    { content: "Cover photo", oneWord: "Cover", aspect: "2.28:1", w: 1640, h: 924 },
    { content: "Story", oneWord: "Story", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Profile picture", oneWord: "Profile", aspect: "1:1", w: 2048, h: 2048 },
    { content: "Event cover", oneWord: "Event", aspect: "2:1", w: 1920, h: 1005 },
    { content: "Ad – image", oneWord: "Ad", aspect: "1:1", w: 800, h: 800 },
    { content: "Ad – standalone", oneWord: "Ad", aspect: "1.91:1", w: 1200, h: 628 },
    { content: "App ad", oneWord: "Ad", aspect: "1.91:1", w: 1200, h: 628 },
  ],
  YouTube: [
    { content: "Long-form video", oneWord: "Video", aspect: "16:9", w: 1920, h: 1080 },
    { content: "Shorts", oneWord: "Shorts", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Thumbnail", oneWord: "Thumbnail", aspect: "16:9", w: 1280, h: 720 },
    { content: "Channel banner", oneWord: "Banner", aspect: "16:9", w: 2560, h: 1440 },
    { content: "Intro / End screen", oneWord: "Intro", aspect: "16:9", w: 1920, h: 1080 },
    { content: "Podcast cover", oneWord: "Cover", aspect: "1:1", w: 1280, h: 1280 },
    { content: "Watermark", oneWord: "Icon", aspect: "1:1", w: 150, h: 150 },
  ],
  LinkedIn: [
    { content: "Post – portrait", oneWord: "Post", aspect: "4:5", w: 1080, h: 1350 },
    { content: "Post – square", oneWord: "Post", aspect: "1:1", w: 1080, h: 1080 },
    { content: "Post – link", oneWord: "Link", aspect: "1.91:1", w: 1200, h: 627 },
    { content: "Carousel – square", oneWord: "Carousel", aspect: "1:1", w: 1080, h: 1080 },
    { content: "Carousel – portrait", oneWord: "Carousel", aspect: "4:5", w: 1080, h: 1350 },
    { content: "Video – landscape", oneWord: "Video", aspect: "16:9", w: 1920, h: 1080 },
    { content: "Video – vertical", oneWord: "Video", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Profile picture", oneWord: "Profile", aspect: "1:1", w: 400, h: 400 },
    { content: "Cover banner", oneWord: "Banner", aspect: "4:1", w: 1584, h: 396 },
    { content: "Company logo", oneWord: "Logo", aspect: "1:1", w: 400, h: 400 },
  ],
  Snapchat: [
    { content: "Snap / Story", oneWord: "Story", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Snap Ad", oneWord: "Ad", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Profile picture", oneWord: "Profile", aspect: "1:1", w: 320, h: 320 },
  ],
  Pinterest: [
    { content: "Standard Pin", oneWord: "Pin", aspect: "2:3", w: 1000, h: 1500 },
    { content: "Square Pin", oneWord: "Pin", aspect: "1:1", w: 1000, h: 1000 },
    { content: "Long Pin", oneWord: "Pin", aspect: "1:2.1", w: 1000, h: 2100 },
    { content: "Idea Pin", oneWord: "Story", aspect: "9:16", w: 1080, h: 1920 },
    { content: "Profile picture", oneWord: "Profile", aspect: "1:1", w: 400, h: 400 },
    { content: "Board cover", oneWord: "Cover", aspect: "1:1", w: 600, h: 600 },
    { content: "Standard ad", oneWord: "Ad", aspect: "2:3", w: 1000, h: 1500 },
    { content: "Collection ad", oneWord: "Ad", aspect: "1:1", w: 1000, h: 1000 },
  ],
  "X (Twitter)": [
    { content: "Post – landscape", oneWord: "Post", aspect: "16:9", w: 1200, h: 675 },
    { content: "Video image", oneWord: "Video", aspect: "16:9", w: 1600, h: 900 },
    { content: "Post – vertical", oneWord: "Post", aspect: "4:5", w: 1080, h: 1350 },
    { content: "Profile picture", oneWord: "Profile", aspect: "1:1", w: 400, h: 400 },
    { content: "Header / banner", oneWord: "Header", aspect: "3:1", w: 1500, h: 500 },
    { content: "Image ad", oneWord: "Ad", aspect: "1.91:1", w: 800, h: 418 },
    { content: "Carousel ad", oneWord: "Ad", aspect: "1.91:1", w: 800, h: 418 },
  ],
};

type BoardFrameData = {
  id: string;
  x: number;
  y: number;
  platform: { label: string; Icon: IconType };
  aspect: string;
  contentLabel: string;
  w: number; // real px width
  h: number; // real px height
  headline: string;
  // Asset placed into this frame; ox/oy/scale reposition & zoom it in content-edit mode.
  content?: { image: string; fit: "fill" | "fit"; ox?: number; oy?: number; scale?: number };
};

// A free asset placed on the board (photo dropped on empty space, or an
// icon/sticker/logo overlay). World coordinates; not clipped to a frame.
type BoardObject = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  image: string;
  overlay: boolean; // overlays (icons/stickers/logos) use object-contain
};

// A frame sent from the Composer to the Calendar page's sidebar inventory.
type SentPost = {
  id: string;
  platform: string;
  Icon: IconType;
  contentLabel: string;
  aspect: string;
  w: number;
  h: number;
  headline: string;
  image: string;
  // Set only when the entry came from "Send Options to Calendar" — one entry per
  // platform in the package. Drag-to-schedule behaviour is unchanged.
  packageName?: string;
  packageDetail?: { captions: string[]; tags: string[]; campaigns: string[] };
};

// "Select to Send" lists these 5 by default; the Edit link can add the rest.
const DEFAULT_SEND_PLATFORMS = ["TikTok", "Instagram", "Facebook", "YouTube", "LinkedIn"];

// A single post frame placed on the infinite board (world coordinates).
function BoardFrame({
  frame,
  image,
  selected,
  editing,
  onHeadline,
  onItemPointerDown,
  onEnterEdit,
  onContentPointerDown,
}: {
  frame: BoardFrameData;
  image: string;
  selected: boolean;
  editing: boolean;
  onHeadline: (h: string) => void;
  onItemPointerDown: (e: React.PointerEvent) => void;
  onEnterEdit: () => void;
  onContentPointerDown: (e: React.PointerEvent) => void;
}) {
  const dispW = frame.w * DISPLAY_SCALE;
  const dispH = frame.h * DISPLAY_SCALE;
  const c = frame.content;
  const contentTransform = c
    ? `translate(${c.ox ?? 0}px, ${c.oy ?? 0}px) scale(${c.scale ?? 1})`
    : undefined;
  return (
    <div
      className="pointer-events-auto absolute cursor-move"
      style={{ left: frame.x, top: frame.y, width: dispW }}
      onPointerDown={onItemPointerDown}
      onDoubleClick={onEnterEdit}
    >
      {/* Title — left-aligned to the frame; purple in edit mode, black otherwise */}
      <div
        className={`mb-1.5 truncate text-[13px] font-bold ${
          selected ? "text-primary" : "text-foreground"
        }`}
      >
        {frame.platform.label} · {frame.aspect} {frame.contentLabel}
      </div>

      <div
        className={`relative rounded-[18px] ${
          editing
            ? "ring-2 ring-primary ring-offset-2 ring-offset-muted"
            : selected
              ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-muted"
              : ""
        }`}
        style={{ width: dispW, height: dispH }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[16px] shadow-[0_14px_30px_rgba(0,0,0,0.2)]">
          {c ? (
            <>
              <div className="absolute inset-0 bg-muted" />
              <img
                src={c.image}
                alt=""
                style={{ transform: contentTransform }}
                className={`absolute inset-0 h-full w-full ${
                  c.fit === "fill" ? "object-cover" : "object-contain"
                }`}
              />
              {/* In content-edit mode a drag layer moves the image within the clip. */}
              {editing && (
                <div
                  onPointerDown={onContentPointerDown}
                  className="absolute inset-0 cursor-move"
                  style={{ touchAction: "none" }}
                />
              )}
            </>
          ) : (
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          {!editing && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10" />
          )}
          {!editing && (
            <div className="absolute inset-x-4 bottom-[8%]">
              <textarea
                value={frame.headline}
                onChange={(e) => onHeadline(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                rows={2}
                className="w-full resize-none rounded-xl border border-white/30 bg-black/35 p-2.5 text-center text-xl font-black leading-tight text-white outline-none backdrop-blur-md focus:border-primary"
              />
            </div>
          )}
        </div>
        {selected &&
          !editing &&
          SELECTION_HANDLES.map((pos) => (
            <span
              key={pos}
              className={`absolute ${pos} h-3 w-3 rounded-[3px] border-2 border-blue-500 bg-white shadow-sm`}
            />
          ))}
      </div>

      {selected && (
        <div className="mt-2 inline-block rounded-md bg-blue-500 px-2.5 py-0.5 text-xs font-bold text-white">
          {frame.w} × {frame.h}
        </div>
      )}
    </div>
  );
}

// ---------- COMPOSER ----------
function Composer({
  seed,
  onExplore,
  onEditLibrary,
  onSendToCalendar,
}: {
  seed: ComposerSeed | null;
  onExplore: () => void;
  onEditLibrary: () => void;
  onSendToCalendar: (posts: SentPost[]) => void;
}) {
  const [selectedAsset, setSelectedAsset] = useState<string>(
    seed?.thumbnail || ASSET_GROUPS[0].items[0].url,
  );
  const [caption, setCaption] = useState(seed?.caption || "Write your cross-posting caption…");
  const [tab, setTab] = useState<"canvas" | "clips">("canvas");

  // ----- Design board (Figma/CapCut-style center canvas) -----
  const [frames, setFrames] = useState<BoardFrameData[]>(() => [
    {
      id: "f1",
      x: 0,
      y: 0,
      platform: PLATFORMS[1], // Instagram
      aspect: "9:16",
      contentLabel: "Reel",
      w: 1080,
      h: 1920,
      headline: seed?.title || "Your headline goes here",
    },
  ]);
  // Selection is a set of frame + object ids (Phase 2 multi-select).
  const [selection, setSelection] = useState<string[]>(["f1"]);
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 });
  const [placing, setPlacing] = useState(false);
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);
  // Which platform's size dropdown is open in the frame's top bar (null = closed).
  const [openPlatform, setOpenPlatform] = useState<string | null>(null);
  // Lower toolbar dock: hidden (slid to the right edge) or centered.
  const [dockHidden, setDockHidden] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  // ----- Asset placement (Phase 1) -----
  const [objects, setObjects] = useState<BoardObject[]>([]);
  // Click-to-place: an asset is "armed" and waiting for a canvas click.
  const [armed, setArmed] = useState<{ image: string; type: string } | null>(null);
  // Fill/Fit/Place-Freely modal for media dropped on a frame.
  const [placePrompt, setPlacePrompt] = useState<{
    image: string;
    type: string;
    frameId: string;
  } | null>(null);
  const [rememberChoice, setRememberChoice] = useState(false);
  const [placeDefaults, setPlaceDefaults] = useState<Record<string, "fill" | "fit" | "free">>({});
  const [panning, setPanning] = useState(false);
  // Space held → show the hand/grab cursor (Figma-style pan mode).
  const [spaceHeld, setSpaceHeld] = useState(false);
  // Brief ease only for the editable-zoom jump (not for continuous wheel/drag).
  const [animating, setAnimating] = useState(false);
  const animTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Editable zoom indicator.
  const [zoomEditing, setZoomEditing] = useState(false);
  const [zoomInput, setZoomInput] = useState("");

  // ----- Phase 2: multi-select, marquee, context menu -----
  const [lockedIds, setLockedIds] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<{
    frames: BoardFrameData[];
    objects: BoardObject[];
  } | null>(null);
  const [marquee, setMarquee] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(
    null,
  );
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const spaceRef = useRef(false);
  const marqueeRef = useRef<{ x0: number; y0: number; base: string[] } | null>(null);
  // Group drag: moves every selected frame/object together.
  const groupDragRef = useRef<{
    items: { id: string; kind: "frame" | "object"; ox: number; oy: number }[];
    startX: number;
    startY: number;
  } | null>(null);

  // ----- Phase 3: frame content-edit mode + object resize -----
  const [editingFrameId, setEditingFrameId] = useState<string | null>(null);
  const editingRef = useRef<string | null>(null);
  useEffect(() => {
    editingRef.current = editingFrameId;
  }, [editingFrameId]);
  const contentDragRef = useRef<{
    frameId: string;
    startX: number;
    startY: number;
    ox: number;
    oy: number;
  } | null>(null);
  const resizeRef = useRef<{
    id: string;
    corner: "tl" | "tr" | "bl" | "br";
    startX: number;
    startY: number;
    ox: number;
    oy: number;
    ow: number;
    oh: number;
  } | null>(null);

  const isSel = (id: string) => selection.includes(id);
  const toggleSel = (id: string) =>
    setSelection((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  // Latest selection for keyboard handlers (which capture an empty-deps closure).
  const selectionRef = useRef<string[]>(selection);
  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);

  // Fit the first frame into view on mount.
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const z = Math.min(1, (r.height - 90) / FRAME_H, (r.width - 90) / FRAME_W);
    setView({
      zoom: z,
      x: (r.width - FRAME_W * z) / 2,
      y: Math.max(16, (r.height - FRAME_H * z) / 2 - 10),
    });
  }, []);

  // Figma/CapCut-style wheel: pinch or Ctrl+wheel zooms to cursor; a plain
  // trackpad two-finger swipe / mouse wheel pans the board.
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      if (e.ctrlKey) {
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        setView((v) => {
          // Gentle continuous zoom (works for both pinch and Ctrl+wheel).
          const factor = Math.pow(1.0015, -e.deltaY);
          const nz = Math.min(3, Math.max(0.2, v.zoom * factor));
          return {
            zoom: nz,
            x: mx - (mx - v.x) * (nz / v.zoom),
            y: my - (my - v.y) * (nz / v.zoom),
          };
        });
      } else {
        // Two-finger swipe / scroll → pan.
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Keyboard: Escape cancels/deselects, Space enables panning, Delete removes selection.
  useEffect(() => {
    const typing = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setArmed(null);
        setPlacePrompt(null);
        setContextMenu(null);
        if (editingRef.current) setEditingFrameId(null);
        else setSelection([]);
      }
      if (e.code === "Space" && !typing(e.target)) {
        e.preventDefault(); // don't scroll the page
        spaceRef.current = true;
        setSpaceHeld(true);
      }
      if ((e.key === "Delete" || e.key === "Backspace") && !typing(e.target)) {
        setFrames((fs) => fs.filter((f) => !selectionRef.current.includes(f.id)));
        setObjects((os) => os.filter((o) => !selectionRef.current.includes(o.id)));
        setSelection([]);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spaceRef.current = false;
        setSpaceHeld(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // ----- Placement helpers (behavior per asset-behavior-matrix-2026.md) -----
  const toWorld = (clientX: number, clientY: number) => {
    const r = boardRef.current!.getBoundingClientRect();
    return {
      wx: (clientX - r.left - view.x) / view.zoom,
      wy: (clientY - r.top - view.y) / view.zoom,
    };
  };
  const hitFrame = (wx: number, wy: number) => {
    for (let i = frames.length - 1; i >= 0; i--) {
      const f = frames[i];
      const dw = f.w * DISPLAY_SCALE;
      const dh = f.h * DISPLAY_SCALE;
      if (wx >= f.x && wx <= f.x + dw && wy >= f.y && wy <= f.y + dh) return f;
    }
    return null;
  };
  const objSize = (type: string) => {
    if (type === "Icons" || type === "Stickers") return { w: 72, h: 72 };
    if (type === "Logo") return { w: 130, h: 60 };
    if (OVERLAY_TYPES.has(type)) return { w: 130, h: 130 };
    return { w: 200, h: 200 };
  };
  const addObject = (image: string, type: string, cx: number, cy: number, overlay: boolean) => {
    const { w, h } = objSize(type);
    const id = "o" + Date.now() + Math.random().toString(36).slice(2, 6);
    setObjects((os) => [...os, { id, x: cx - w / 2, y: cy - h / 2, w, h, image, overlay }]);
    setSelection([id]);
  };
  const setFrameContent = (frameId: string, image: string, fit: "fill" | "fit") =>
    setFrames((fs) => fs.map((f) => (f.id === frameId ? { ...f, content: { image, fit } } : f)));
  const applyFramePlacement = (frameId: string, image: string, mode: "fill" | "fit" | "free") => {
    if (mode === "free") {
      const f = frames.find((x) => x.id === frameId);
      addObject(
        image,
        "Photos",
        f ? f.x + (f.w * DISPLAY_SCALE) / 2 : 0,
        f ? f.y + (f.h * DISPLAY_SCALE) / 2 : 0,
        false,
      );
    } else {
      setFrameContent(frameId, image, mode);
    }
  };
  const placeAssetAt = (image: string, type: string, clientX: number, clientY: number) => {
    const { wx, wy } = toWorld(clientX, clientY);
    const frame = hitFrame(wx, wy);
    if (frame) {
      if (FILL_TYPES.has(type)) {
        setFrameContent(frame.id, image, "fill");
        toast.success("Filled the frame");
        return;
      }
      if (OVERLAY_TYPES.has(type)) {
        addObject(
          image,
          type,
          frame.x + (frame.w * DISPLAY_SCALE) / 2,
          frame.y + (frame.h * DISPLAY_SCALE) / 2,
          true,
        );
        return;
      }
      if (MODAL_TYPES.has(type)) {
        const def = placeDefaults[type];
        if (def) applyFramePlacement(frame.id, image, def);
        else {
          setRememberChoice(false);
          setPlacePrompt({ image, type, frameId: frame.id });
        }
        return;
      }
      // unsupported on a frame → re-route to the board (never reject)
    }
    addObject(image, type, wx, wy, OVERLAY_TYPES.has(type));
  };
  const armAsset = (image: string, type: string) => {
    setArmed({ image, type });
    toast("Click the canvas to place. Esc to cancel.");
  };
  const commitZoom = () => {
    setZoomEditing(false);
    const pct = parseInt(zoomInput, 10);
    if (!Number.isFinite(pct)) return;
    const nz = Math.min(3, Math.max(0.2, pct / 100));
    const el = boardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = r.width / 2;
    const my = r.height / 2;
    // Ease this discrete jump smoothly.
    setAnimating(true);
    if (animTimer.current) clearTimeout(animTimer.current);
    animTimer.current = setTimeout(() => setAnimating(false), 220);
    setView((v) => ({
      zoom: nz,
      x: mx - (mx - v.x) * (nz / v.zoom),
      y: my - (my - v.y) * (nz / v.zoom),
    }));
  };

  // ----- Selection + group drag (Phase 2) -----
  const startGroupDrag = (ids: string[], e: React.PointerEvent) => {
    const items = ids
      .filter((id) => !lockedIds.includes(id))
      .map((id) => {
        const f = frames.find((x) => x.id === id);
        if (f) return { id, kind: "frame" as const, ox: f.x, oy: f.y };
        const o = objects.find((x) => x.id === id)!;
        return { id, kind: "object" as const, ox: o.x, oy: o.y };
      });
    if (!items.length) return;
    groupDragRef.current = { items, startX: e.clientX, startY: e.clientY };
    boardRef.current?.setPointerCapture(e.pointerId);
  };
  // Pointer-down on any frame/object: resolve selection, then start a (group) drag.
  const onItemPointerDown = (id: string, e: React.PointerEvent) => {
    if (placing || armed) return; // board handles placement clicks
    if (e.button === 1 || spaceRef.current) return; // let the board pan instead
    // In content-edit mode, clicking the edited frame reposition its content.
    if (editingFrameId === id) return;
    e.stopPropagation();
    setContextMenu(null);
    setOpenPlatform(null);
    if (e.shiftKey) {
      toggleSel(id);
      return; // shift-click toggles membership, no drag
    }
    const sel = selection.includes(id) ? selection : [id];
    if (!selection.includes(id)) setSelection([id]);
    startGroupDrag(sel, e);
  };
  // Double-click a populated frame → content-edit mode (reposition/scale inside).
  const enterContentEdit = (id: string) => {
    const f = frames.find((x) => x.id === id);
    if (!f?.content) return;
    setSelection([id]);
    setOpenPlatform(null);
    setEditingFrameId(id);
  };
  const onContentDragStart = (frame: BoardFrameData, e: React.PointerEvent) => {
    e.stopPropagation();
    contentDragRef.current = {
      frameId: frame.id,
      startX: e.clientX,
      startY: e.clientY,
      ox: frame.content?.ox ?? 0,
      oy: frame.content?.oy ?? 0,
    };
    boardRef.current?.setPointerCapture(e.pointerId);
  };
  const scaleContent = (frameId: string, delta: number) =>
    setFrames((fs) =>
      fs.map((f) =>
        f.id === frameId && f.content
          ? {
              ...f,
              content: {
                ...f.content,
                scale: Math.min(4, Math.max(0.2, (f.content.scale ?? 1) + delta)),
              },
            }
          : f,
      ),
    );
  // Resize a placed object by dragging a corner (opposite corner stays fixed).
  const onObjectResizeStart = (
    obj: BoardObject,
    corner: "tl" | "tr" | "bl" | "br",
    e: React.PointerEvent,
  ) => {
    e.stopPropagation();
    resizeRef.current = {
      id: obj.id,
      corner,
      startX: e.clientX,
      startY: e.clientY,
      ox: obj.x,
      oy: obj.y,
      ow: obj.w,
      oh: obj.h,
    };
    boardRef.current?.setPointerCapture(e.pointerId);
  };

  const boardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = boardRef.current;
    if (!el) return;
    if (contextMenu) {
      setContextMenu(null);
      return;
    }
    // Clicking outside an open size dropdown just closes it; edit mode stays on.
    if (openPlatform) {
      setOpenPlatform(null);
      return;
    }
    // Click-to-place: drop the armed asset where the user clicked.
    if (armed) {
      placeAssetAt(armed.image, armed.type, e.clientX, e.clientY);
      setArmed(null);
      return;
    }
    const r = el.getBoundingClientRect();
    if (placing) {
      // Drop a new frame centered on the cursor, then select it.
      const wx = (e.clientX - r.left - view.x) / view.zoom - FRAME_W / 2;
      const wy = (e.clientY - r.top - view.y) / view.zoom - FRAME_H / 2;
      const id = "f" + Date.now();
      setFrames((fs) => [
        ...fs,
        {
          id,
          x: wx,
          y: wy,
          platform: PLATFORMS[(fs.length + 1) % PLATFORMS.length],
          aspect: "9:16",
          contentLabel: "Reel",
          w: 1080,
          h: 1920,
          headline: "Your headline goes here",
        },
      ]);
      setSelection([id]);
      setPlacing(false);
      setGhost(null);
      return;
    }
    // Clicking empty space while editing frame content commits and exits.
    if (editingFrameId) {
      setEditingFrameId(null);
      return;
    }
    // Hold Space (or use the middle mouse button) to pan; otherwise an
    // empty-space drag draws a marquee selection.
    if (spaceRef.current || e.button === 1) {
      setPanning(true);
      panRef.current = { startX: e.clientX, startY: e.clientY, ox: view.x, oy: view.y };
      el.setPointerCapture(e.pointerId);
      return;
    }
    const sx = e.clientX - r.left;
    const sy = e.clientY - r.top;
    const base = e.shiftKey ? [...selection] : [];
    if (!e.shiftKey) setSelection([]);
    marqueeRef.current = { x0: sx, y0: sy, base };
    setMarquee({ x0: sx, y0: sy, x1: sx, y1: sy });
    el.setPointerCapture(e.pointerId);
  };
  const boardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = boardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (placing) setGhost({ x: e.clientX - r.left, y: e.clientY - r.top });
    // Repositioning a frame's content in content-edit mode.
    const cd = contentDragRef.current;
    if (cd) {
      const dx = (e.clientX - cd.startX) / view.zoom;
      const dy = (e.clientY - cd.startY) / view.zoom;
      setFrames((fs) =>
        fs.map((f) =>
          f.id === cd.frameId && f.content
            ? { ...f, content: { ...f.content, ox: cd.ox + dx, oy: cd.oy + dy } }
            : f,
        ),
      );
      return;
    }
    // Resizing a placed object by a corner handle.
    const rz = resizeRef.current;
    if (rz) {
      const dx = (e.clientX - rz.startX) / view.zoom;
      const dy = (e.clientY - rz.startY) / view.zoom;
      let nx = rz.ox;
      let ny = rz.oy;
      let nw = rz.ow;
      let nh = rz.oh;
      if (rz.corner === "br") {
        nw = rz.ow + dx;
        nh = rz.oh + dy;
      } else if (rz.corner === "tr") {
        nw = rz.ow + dx;
        nh = rz.oh - dy;
        ny = rz.oy + dy;
      } else if (rz.corner === "bl") {
        nw = rz.ow - dx;
        nh = rz.oh + dy;
        nx = rz.ox + dx;
      } else {
        nw = rz.ow - dx;
        nh = rz.oh - dy;
        nx = rz.ox + dx;
        ny = rz.oy + dy;
      }
      const MIN = 24;
      if (nw < MIN) {
        if (rz.corner === "tl" || rz.corner === "bl") nx = rz.ox + rz.ow - MIN;
        nw = MIN;
      }
      if (nh < MIN) {
        if (rz.corner === "tl" || rz.corner === "tr") ny = rz.oy + rz.oh - MIN;
        nh = MIN;
      }
      setObjects((os) =>
        os.map((o) => (o.id === rz.id ? { ...o, x: nx, y: ny, w: nw, h: nh } : o)),
      );
      return;
    }
    const gd = groupDragRef.current;
    if (gd) {
      const dx = (e.clientX - gd.startX) / view.zoom;
      const dy = (e.clientY - gd.startY) / view.zoom;
      const m = new Map(gd.items.map((it) => [it.id, it]));
      setFrames((fs) =>
        fs.map((f) =>
          m.has(f.id) ? { ...f, x: m.get(f.id)!.ox + dx, y: m.get(f.id)!.oy + dy } : f,
        ),
      );
      setObjects((os) =>
        os.map((o) =>
          m.has(o.id) ? { ...o, x: m.get(o.id)!.ox + dx, y: m.get(o.id)!.oy + dy } : o,
        ),
      );
      return;
    }
    const mq = marqueeRef.current;
    if (mq) {
      const x1 = e.clientX - r.left;
      const y1 = e.clientY - r.top;
      setMarquee({ x0: mq.x0, y0: mq.y0, x1, y1 });
      const wx0 = (Math.min(mq.x0, x1) - view.x) / view.zoom;
      const wy0 = (Math.min(mq.y0, y1) - view.y) / view.zoom;
      const wx1 = (Math.max(mq.x0, x1) - view.x) / view.zoom;
      const wy1 = (Math.max(mq.y0, y1) - view.y) / view.zoom;
      const hits: string[] = [];
      frames.forEach((f) => {
        const dw = f.w * DISPLAY_SCALE;
        const dh = f.h * DISPLAY_SCALE;
        if (f.x < wx1 && f.x + dw > wx0 && f.y < wy1 && f.y + dh > wy0) hits.push(f.id);
      });
      objects.forEach((o) => {
        if (o.x < wx1 && o.x + o.w > wx0 && o.y < wy1 && o.y + o.h > wy0) hits.push(o.id);
      });
      setSelection([...new Set([...mq.base, ...hits])]);
      return;
    }
    const p = panRef.current;
    if (p)
      setView((v) => ({
        ...v,
        x: p.ox + (e.clientX - p.startX),
        y: p.oy + (e.clientY - p.startY),
      }));
  };
  const boardPointerUp = () => {
    groupDragRef.current = null;
    panRef.current = null;
    marqueeRef.current = null;
    contentDragRef.current = null;
    resizeRef.current = null;
    setMarquee(null);
    setPanning(false);
  };
  // ----- "Select to Send" panel -----
  const [sendPlatforms, setSendPlatforms] = useState<string[]>(DEFAULT_SEND_PLATFORMS);
  const [openSend, setOpenSend] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [checkedFrames, setCheckedFrames] = useState<string[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

  // ----- Update 3: Caption Editor toggle + package builder -----
  // Captions stays wired to the AI Idea Engine (existing `caption` state);
  // Script and Headlines each get their own independent draft + saved list.
  const [editorMode, setEditorMode] = useState<"Captions" | "Script" | "Headlines">("Captions");
  const [scriptDraft, setScriptDraft] = useState("");
  const [headlineDraft, setHeadlineDraft] = useState("");
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([]);
  // Which right-sidebar accordion is open (one at a time).
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  // "Select to Send" header settings menu — toggles which optional dropdowns show.
  const [sendSettingsOpen, setSendSettingsOpen] = useState(false);
  const [showScriptPanel, setShowScriptPanel] = useState(false);
  const [pickedScripts, setPickedScripts] = useState<string[]>([]);
  // Selections awaiting a "Save to Package" press.
  const [pickedTexts, setPickedTexts] = useState<string[]>([]);
  const [pickedCampaigns, setPickedCampaigns] = useState<string[]>([]);
  const [pickedTags, setPickedTags] = useState<string[]>([]);
  const [hashPill, setHashPill] = useState("All groups");
  const [hashGroups, setHashGroups] = useState<HashGroup[]>(HASHTAG_GROUPS);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  // Packages + the shared Save-to-Package modal.
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [pkgDraft, setPkgDraft] = useState<PkgDraft | null>(null);
  const [pkgMode, setPkgMode] = useState<"choose" | "existing" | "new">("choose");
  const [pkgPick, setPkgPick] = useState<string>("");
  const [pkgName, setPkgName] = useState("");
  const [openPkg, setOpenPkg] = useState<string | null>(null); // detail view
  const [pickedPkg, setPickedPkg] = useState<string | null>(null); // selection dot

  // Escape closes the package modal (capture phase so it doesn't also clear the
  // canvas selection via the global Escape handler).
  useEffect(() => {
    if (!pkgDraft) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        setPkgDraft(null);
      }
    };
    window.addEventListener("keydown", onEsc, true);
    return () => window.removeEventListener("keydown", onEsc, true);
  }, [pkgDraft]);

  const newId = (p: string) =>
    `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const editorValue =
    editorMode === "Captions" ? caption : editorMode === "Script" ? scriptDraft : headlineDraft;
  const setEditorValue = (v: string) =>
    editorMode === "Captions"
      ? setCaption(v)
      : editorMode === "Script"
        ? setScriptDraft(v)
        : setHeadlineDraft(v);
  // Save always appends a new numbered entry — it never overwrites a prior save.
  const saveEditorText = () => {
    const text = editorValue.trim();
    if (!text) {
      toast.error(`Nothing to save — write a ${editorMode.replace(/s$/, "").toLowerCase()} first`);
      return;
    }
    const kind: SavedText["kind"] =
      editorMode === "Captions" ? "Caption" : editorMode === "Script" ? "Script" : "Headline";
    const n = savedTexts.filter((t) => t.kind === kind).length + 1;
    setSavedTexts((s) => [...s, { id: newId("txt"), kind, label: `${kind} ${n}`, text }]);
    toast.success(`${kind} ${n} saved to Caption Options`);
  };

  // Open the shared Package Modal with whatever this dropdown selected.
  const askPackage = (draft: PkgDraft) => {
    setPkgDraft(draft);
    setPkgMode(packages.length ? "choose" : "new");
    setPkgPick(packages[0]?.id ?? "");
    setPkgName("");
  };
  const closePkgModal = () => setPkgDraft(null);
  const mergeIntoPkg = (p: Pkg, d: PkgDraft): Pkg => ({
    ...p,
    platforms: [...new Set([...p.platforms, ...(d.platforms ?? [])])],
    frameIds: [...new Set([...p.frameIds, ...(d.frameIds ?? [])])],
    textIds: [...new Set([...p.textIds, ...(d.textIds ?? [])])],
    tags: [...new Set([...p.tags, ...(d.tags ?? [])])],
    campaigns: [...new Set([...p.campaigns, ...(d.campaigns ?? [])])],
  });
  const commitPackage = () => {
    if (!pkgDraft) return;
    if (pkgMode === "existing") {
      const target = packages.find((p) => p.id === pkgPick);
      if (!target) {
        toast.error("Pick a package first");
        return;
      }
      setPackages((ps) => ps.map((p) => (p.id === pkgPick ? mergeIntoPkg(p, pkgDraft) : p)));
      toast.success(`${pkgDraft.summary} added to “${target.name}”`);
    } else {
      const name = pkgName.trim();
      if (!name) {
        toast.error("Give your package a name");
        return;
      }
      const fresh: Pkg = {
        id: newId("pkg"),
        name,
        image: selectedAsset,
        platforms: [],
        frameIds: [],
        textIds: [],
        tags: [],
        campaigns: [],
      };
      setPackages((ps) => [...ps, mergeIntoPkg(fresh, pkgDraft)]);
      toast.success(`Package “${name}” created with ${pkgDraft.summary.toLowerCase()}`);
    }
    setPkgDraft(null);
  };
  // Remove one item from a package (the detail view's Edit action).
  const removeFromPkg = (pkgId: string, field: keyof Pkg, value: string) =>
    setPackages((ps) =>
      ps.map((p) =>
        p.id === pkgId ? { ...p, [field]: (p[field] as string[]).filter((v) => v !== value) } : p,
      ),
    );

  // ----- Context menu (Phase 2) — actions operate on the current selection -----
  const uid = (p: string) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const openContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = boardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const { wx, wy } = toWorld(e.clientX, e.clientY);
    const frame = hitFrame(wx, wy);
    const obj = frame
      ? null
      : [...objects]
          .reverse()
          .find((o) => wx >= o.x && wx <= o.x + o.w && wy >= o.y && wy <= o.y + o.h);
    const hitId = frame?.id ?? obj?.id ?? null;
    if (hitId && !selection.includes(hitId)) setSelection([hitId]);
    if (!hitId && selection.length === 0) return;
    setContextMenu({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const selectedFrameIds = () => selection.filter((id) => frames.some((f) => f.id === id));
  const cmDelete = () => {
    setFrames((fs) => fs.filter((f) => !selection.includes(f.id)));
    setObjects((os) => os.filter((o) => !selection.includes(o.id)));
    setSelection([]);
    setContextMenu(null);
  };
  const cmCopy = () => {
    setClipboard({
      frames: frames.filter((f) => selection.includes(f.id)),
      objects: objects.filter((o) => selection.includes(o.id)),
    });
    setContextMenu(null);
  };
  const cmDuplicate = () => {
    const nf = frames
      .filter((f) => selection.includes(f.id))
      .map((f) => ({ ...f, id: uid("f"), x: f.x + 24, y: f.y + 24 }));
    const no = objects
      .filter((o) => selection.includes(o.id))
      .map((o) => ({ ...o, id: uid("o"), x: o.x + 24, y: o.y + 24 }));
    setFrames((fs) => [...fs, ...nf]);
    setObjects((os) => [...os, ...no]);
    setSelection([...nf.map((f) => f.id), ...no.map((o) => o.id)]);
    setContextMenu(null);
  };
  const cmPaste = () => {
    if (!clipboard) return;
    const nf = clipboard.frames.map((f) => ({ ...f, id: uid("f"), x: f.x + 24, y: f.y + 24 }));
    const no = clipboard.objects.map((o) => ({ ...o, id: uid("o"), x: o.x + 24, y: o.y + 24 }));
    setFrames((fs) => [...fs, ...nf]);
    setObjects((os) => [...os, ...no]);
    setSelection([...nf.map((f) => f.id), ...no.map((o) => o.id)]);
    setContextMenu(null);
  };
  const cmCut = () => {
    cmCopy();
    cmDelete();
  };
  const cmForward = () => {
    setFrames((fs) => [
      ...fs.filter((f) => !selection.includes(f.id)),
      ...fs.filter((f) => selection.includes(f.id)),
    ]);
    setObjects((os) => [
      ...os.filter((o) => !selection.includes(o.id)),
      ...os.filter((o) => selection.includes(o.id)),
    ]);
    setContextMenu(null);
  };
  const cmBackward = () => {
    setFrames((fs) => [
      ...fs.filter((f) => selection.includes(f.id)),
      ...fs.filter((f) => !selection.includes(f.id)),
    ]);
    setObjects((os) => [
      ...os.filter((o) => selection.includes(o.id)),
      ...os.filter((o) => !selection.includes(o.id)),
    ]);
    setContextMenu(null);
  };
  const cmLock = () => {
    setLockedIds((l) => [...new Set([...l, ...selection])]);
    setContextMenu(null);
  };
  const cmUnlock = () => {
    setLockedIds((l) => l.filter((id) => !selection.includes(id)));
    setContextMenu(null);
  };
  const cmSendToPost = () => {
    const fIds = selectedFrameIds();
    setContextMenu(null);
    if (!fIds.length) {
      toast.error("Select at least one frame to send");
      return;
    }
    setCheckedFrames((c) => [...new Set([...c, ...fIds])]);
    toast.success(`${fIds.length} frame${fIds.length > 1 ? "s" : ""} added to Select to Send`);
  };

  // Ideas card (collapsible AI Idea Engine)
  const [ideasOpen, setIdeasOpen] = useState(false);
  const [campaignGoal, setCampaignGoal] = useState(CAMPAIGN_GOALS[0]);
  const [brief, setBrief] = useState("");
  const [generating, setGenerating] = useState(false);
  const [ideas, setIdeas] = useState<GeneratedIdea[] | null>(null);
  const [pendingIdea, setPendingIdea] = useState<GeneratedIdea | null>(null);

  // Asset Library filter
  const [assetFilter, setAssetFilter] = useState("All");
  // When set, the left sidebar shows the category explorer instead of the tile grid.
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  // Assets the user uploaded this session, and the in-progress "Content Loaded"
  // placement draft (null when the modal is closed).
  const [uploads, setUploads] = useState<
    {
      id: string;
      name: string;
      url: string | null;
      type: string;
      folder: string | null;
      sub: string | null;
    }[]
  >([]);
  const [uploadDraft, setUploadDraft] = useState<{
    name: string;
    url: string | null;
    type: string;
    folder: string | null;
    sub: string | null;
  } | null>(null);
  // Auto-detect which Asset Library type a freshly uploaded file belongs to.
  const detectAssetType = (file: File): string => {
    const name = file.name.toLowerCase();
    if (name.endsWith(".svg")) return "Graphics";
    if (file.type.startsWith("image/")) return "Photos";
    if (file.type.startsWith("video/")) return "Videos";
    if (file.type.startsWith("audio/")) return "Audio";
    if (file.type === "application/pdf" || name.endsWith(".pdf")) return "PDFs";
    return "Uploads";
  };
  const commitUpload = (withFolder: boolean) => {
    if (!uploadDraft) return;
    const { name, url, type, folder, sub } = uploadDraft;
    setUploads((u) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        url,
        type,
        folder: withFolder ? folder : null,
        sub: withFolder ? sub : null,
      },
      ...u,
    ]);
    const dest =
      withFolder && folder
        ? `${type} › ${folder}${sub ? ` › ${sub}` : ""}`
        : `${type} › Uploaded Assets`;
    toast.success(`“${name}” added to ${dest}`);
    setUploadDraft(null);
  };
  const visibleTiles =
    assetFilter === "All" ? ASSET_TILES : ASSET_TILES.filter((t) => t.cats.includes(assetFilter));

  const generateIdeas = () => {
    setIdeasOpen(true);
    setGenerating(true);
    setIdeas(null);
    setTimeout(() => {
      setGenerating(false);
      setIdeas(GENERATED_IDEAS);
      toast.success(`Generated ${GENERATED_IDEAS.length} ideas for ${campaignGoal}`);
    }, 1400);
  };

  const applyIdea = (idea: GeneratedIdea) => {
    setCaption(idea.caption);
    setPendingIdea(null);
    toast.success(`${idea.day} caption added to your post`);
  };
  const composerShellRef = useRef<HTMLDivElement>(null);
  const [composerColumns, setComposerColumns] = useState({ left: 21, right: 22 });
  const centerColumn = 100 - composerColumns.left - composerColumns.right;
  const clampColumn = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);
  const resetComposerColumns = () => setComposerColumns({ left: 21, right: 22 });

  const startColumnResize = (
    divider: "left" | "right",
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const updateColumns = (clientX: number) => {
      const shell = composerShellRef.current;
      if (!shell) return;

      const bounds = shell.getBoundingClientRect();
      const pointerPercent = ((clientX - bounds.left) / bounds.width) * 100;

      setComposerColumns((current) => {
        if (divider === "left") {
          return {
            ...current,
            left: clampColumn(pointerPercent, 18, 100 - current.right - 34),
          };
        }

        return {
          ...current,
          right: clampColumn(100 - pointerPercent, 18, 100 - current.left - 34),
        };
      });
    };

    updateColumns(event.clientX);

    const onPointerMove = (moveEvent: PointerEvent) => updateColumns(moveEvent.clientX);
    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadedVideo(f.name);
    setTab("clips");
    toast.success(`Processed "${f.name}" — 3 AI clips ready`);
    // After the source upload finishes, open the "Content Loaded" placement
    // flow so the file can be filed into an Asset Library type/folder.
    const url = f.type.startsWith("image/") ? URL.createObjectURL(f) : null;
    setUploadDraft({ name: f.name, url, type: detectAssetType(f), folder: null, sub: null });
    e.target.value = "";
  };

  // Turn a board frame into a post for the Calendar sidebar.
  const toSentPost = (f: BoardFrameData): SentPost => ({
    id: `${f.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    platform: f.platform.label,
    Icon: f.platform.Icon,
    contentLabel: f.contentLabel,
    aspect: f.aspect,
    w: f.w,
    h: f.h,
    headline: f.headline,
    image: selectedAsset,
  });

  // Persistent bottom CTA: send every frame on the board.
  const sendAllFrames = () => {
    if (!frames.length) {
      toast.error("No frames on the board yet");
      return;
    }
    onSendToCalendar(frames.map(toSentPost));
    toast.success(`Sent all ${frames.length} frames to the calendar`);
  };

  // Green button inside Packaging Options: send the selected package to the
  // calendar as ONE entry per platform in it. The package itself stays a single
  // card here — only the calendar view splits per platform.
  const sendPackageToCalendar = () => {
    const pkg = packages.find((p) => p.id === pickedPkg);
    if (!pkg) {
      toast.error("Select a package first");
      return;
    }
    if (!pkg.platforms.length) {
      toast.error(`“${pkg.name}” has no platforms — add them from Content Options`);
      return;
    }
    const detail = {
      captions: pkg.textIds
        .map((id) => savedTexts.find((t) => t.id === id))
        .filter(Boolean)
        .map((t) => `${t!.label}: ${t!.text}`),
      tags: pkg.tags,
      campaigns: pkg.campaigns,
    };
    const entries: SentPost[] = pkg.platforms.map((label) => {
      const entry = PLATFORMS.find((p) => p.label === label);
      const frame = frames.find((f) => f.platform.label === label);
      return {
        id: `${pkg.id}-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        platform: label,
        Icon: entry?.Icon ?? Sparkles,
        contentLabel: pkg.name,
        aspect: frame?.aspect ?? "—",
        w: frame?.w ?? 1080,
        h: frame?.h ?? 1080,
        headline: frame?.headline ?? pkg.name,
        image: pkg.image,
        packageName: pkg.name,
        packageDetail: detail,
      };
    });
    onSendToCalendar(entries);
    toast.success(
      `“${pkg.name}” sent to the calendar as ${entries.length} entr${entries.length > 1 ? "ies" : "y"}`,
    );
  };

  // Group a platform's frames for the dropdown, numbering duplicate content types.
  const sendItemsFor = (label: string) => {
    const list = frames.filter((f) => f.platform.label === label);
    const counts: Record<string, number> = {};
    list.forEach((f) => (counts[f.contentLabel] = (counts[f.contentLabel] || 0) + 1));
    const seen: Record<string, number> = {};
    return list.map((f) => {
      seen[f.contentLabel] = (seen[f.contentLabel] || 0) + 1;
      const n = counts[f.contentLabel] > 1 ? ` ${seen[f.contentLabel]}` : "";
      return { frame: f, display: `${f.contentLabel}${n}` };
    });
  };

  return (
    <div
      ref={composerShellRef}
      className="grid min-h-screen grid-cols-1 bg-background text-foreground lg:min-h-0 lg:h-[calc(100vh-4rem)] lg:[grid-template-columns:minmax(220px,var(--composer-left))_4px_minmax(360px,var(--composer-center))_4px_minmax(260px,var(--composer-right))]"
      style={
        {
          "--composer-left": `${composerColumns.left}%`,
          "--composer-center": `${centerColumn}%`,
          "--composer-right": `${composerColumns.right}%`,
        } as React.CSSProperties
      }
    >
      {/* LEFT */}
      <div className="relative flex h-auto flex-col overflow-y-auto bg-card p-7 lg:h-full">
        {openCategory ? (
          <AssetExplorer
            category={openCategory}
            onBack={() => setOpenCategory(null)}
            onPick={(image, type) => armAsset(image, type)}
            uploads={uploads
              .filter((u) => u.type === openCategory && u.url)
              .map((u) => u.url as string)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold tracking-tight text-foreground">AI Idea Engine</h3>
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary/80"
              >
                Explore All <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <section className="mt-5 rounded-[20px] bg-card p-6 shadow-[0_2px_8px_rgba(26,24,35,0.16)]">
              <button
                type="button"
                onClick={() => setIdeasOpen((o) => !o)}
                aria-expanded={ideasOpen}
                className="flex w-full items-center justify-between"
              >
                <h4 className="text-base font-bold text-foreground">Ideas</h4>
                <ChevronDown
                  className={`h-4 w-4 text-primary transition-transform ${ideasOpen ? "rotate-180" : ""}`}
                />
              </button>

              {ideasOpen && (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Campaign Goal
                    </label>
                    <select
                      value={campaignGoal}
                      onChange={(e) => setCampaignGoal(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    >
                      {CAMPAIGN_GOALS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Brief
                    </label>
                    <textarea
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      placeholder="Describe your idea or just push generate ..."
                      className="mt-2 min-h-[110px] w-full resize-none rounded-xl border border-border bg-secondary/40 p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={generateIdeas}
                disabled={generating}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:opacity-70"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate
                  </>
                )}
              </button>

              {ideasOpen && ideas && (
                <div className="mt-5 space-y-2 border-t border-border pt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                    Generated Ideas
                  </div>
                  {ideas.map((idea) => (
                    <button
                      key={idea.day}
                      onClick={() => setPendingIdea(idea)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-2.5 text-left transition hover:border-primary hover:bg-muted"
                    >
                      <img
                        src={idea.thumb}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`grid h-4 w-4 shrink-0 place-items-center rounded ${idea.iconBg}`}
                          >
                            <idea.icon className="h-2.5 w-2.5 text-white" />
                          </span>
                          <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {idea.day} · {idea.platform}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-foreground/90">
                          {idea.teaser}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <h3 className="mt-8 text-base font-bold tracking-tight text-foreground">Source</h3>
            <label className="mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-border bg-card p-6 text-center transition hover:border-primary hover:bg-card">
              <Upload className="h-8 w-8 text-primary" />
              <span className="text-sm font-bold text-foreground">
                {uploadedVideo ?? "Drop long-form source video"}
              </span>
              <span className="text-sm font-bold text-muted-foreground">.mp4, .mov up to 2GB</span>
              <input type="file" accept="video/*" className="hidden" onChange={onUpload} />
            </label>

            <div className="mt-8 flex items-center justify-between">
              <h3 className="text-base font-bold tracking-tight text-foreground">Asset Library</h3>
              <button
                onClick={onEditLibrary}
                className="text-sm font-semibold text-primary transition hover:text-primary/80"
              >
                Edit Library
              </button>
            </div>

            {/* Horizontally-scrollable filter pills — shrink-0 keeps them from being
            collapsed by the sidebar's flex column (overflow-x sets min-height:0). */}
            <div className="mt-4 flex shrink-0 gap-2 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {ASSET_TILE_FILTERS.map((filter) => {
                const active = assetFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setAssetFilter(filter)}
                    className={`h-7 shrink-0 rounded-full px-3.5 text-xs font-bold transition ${
                      active
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {/* Tiles flow directly in the sidebar — the whole left bar is the single
            scroll container, so rows cut off at the bottom cue scrolling the bar.
            shrink-0 keeps rows at full height instead of being squished by the flex column. */}
            <div className="mt-5 grid shrink-0 grid-cols-3 gap-x-5 gap-y-6">
              {visibleTiles.map((asset) => (
                <button
                  key={asset.label}
                  onClick={() => setOpenCategory(asset.label)}
                  className="group flex min-w-0 flex-col items-center gap-2 text-center"
                >
                  <span
                    className={`grid h-[54px] w-[54px] place-items-center rounded-xl bg-gradient-to-br ${asset.bg} text-white shadow-[3px_4px_0_rgba(255,255,255,0.75)_inset,0_5px_12px_rgba(18,20,30,0.2)] transition group-hover:-translate-y-0.5`}
                  >
                    <asset.icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs text-foreground">{asset.label}</span>
                </button>
              ))}
            </div>
            {visibleTiles.length === 0 && (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No assets in this filter.
              </p>
            )}
          </>
        )}
      </div>

      <ComposerResizeHandle
        label="Resize idea engine and canvas"
        onPointerDown={(event) => startColumnResize("left", event)}
        onReset={resetComposerColumns}
      />

      {/* CENTER */}
      <div className="flex min-h-screen flex-col overflow-y-auto bg-muted px-6 py-5 lg:min-h-0 lg:h-full">
        {tab === "canvas" ? (
          <div
            ref={boardRef}
            onPointerDown={boardPointerDown}
            onPointerMove={boardPointerMove}
            onPointerUp={boardPointerUp}
            onContextMenu={openContextMenu}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
            onDrop={(e) => {
              e.preventDefault();
              const img = e.dataTransfer.getData("text/omni-asset");
              if (img) placeAssetAt(img, openCategory ?? "Photos", e.clientX, e.clientY);
            }}
            className="relative min-h-[420px] flex-1 overflow-hidden rounded-2xl lg:min-h-0"
            style={{
              cursor:
                placing || armed
                  ? "crosshair"
                  : panning
                    ? "grabbing"
                    : spaceHeld
                      ? "grab"
                      : "default",
              touchAction: "none",
            }}
          >
            {/* World — pans and zooms; frames and placed objects live in its space */}
            <div
              className="pointer-events-none absolute left-0 top-0 origin-top-left"
              style={{
                transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
                transition: animating ? "transform 160ms ease-out" : "none",
              }}
            >
              {frames.map((f) => (
                <BoardFrame
                  key={f.id}
                  frame={f}
                  image={selectedAsset}
                  selected={isSel(f.id)}
                  editing={editingFrameId === f.id}
                  onHeadline={(h) =>
                    setFrames((fs) => fs.map((x) => (x.id === f.id ? { ...x, headline: h } : x)))
                  }
                  onItemPointerDown={(e) => onItemPointerDown(f.id, e)}
                  onEnterEdit={() => enterContentEdit(f.id)}
                  onContentPointerDown={(e) => onContentDragStart(f, e)}
                />
              ))}

              {/* Placed assets (free objects / overlays) */}
              {objects.map((o) => {
                const one = isSel(o.id) && selection.length === 1 && !lockedIds.includes(o.id);
                return (
                  <div
                    key={o.id}
                    className="pointer-events-auto absolute"
                    style={{ left: o.x, top: o.y, width: o.w, height: o.h }}
                    onPointerDown={(e) => onItemPointerDown(o.id, e)}
                  >
                    <div
                      className={`h-full w-full cursor-move overflow-hidden rounded-md ${
                        isSel(o.id) ? "ring-2 ring-blue-500" : ""
                      } ${lockedIds.includes(o.id) ? "opacity-90" : ""}`}
                    >
                      <img
                        src={o.image}
                        alt=""
                        draggable={false}
                        className={`h-full w-full ${o.overlay ? "object-contain" : "object-cover"}`}
                      />
                    </div>
                    {one &&
                      (
                        [
                          ["tl", "-left-1 -top-1 cursor-nwse-resize"],
                          ["tr", "-right-1 -top-1 cursor-nesw-resize"],
                          ["bl", "-left-1 -bottom-1 cursor-nesw-resize"],
                          ["br", "-right-1 -bottom-1 cursor-nwse-resize"],
                        ] as ["tl" | "tr" | "bl" | "br", string][]
                      ).map(([corner, cls]) => (
                        <span
                          key={corner}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            onObjectResizeStart(o, corner, e);
                          }}
                          className={`absolute ${cls} h-2.5 w-2.5 rounded-[2px] border-2 border-blue-500 bg-white shadow-sm`}
                        />
                      ))}
                  </div>
                );
              })}

              {/* Marquee selection box (rendered in screen space via the world's inverse) */}
            </div>

            {/* Marquee selection rectangle (screen space) */}
            {marquee && (
              <div
                className="pointer-events-none absolute rounded-sm border border-blue-500 bg-blue-500/10"
                style={{
                  left: Math.min(marquee.x0, marquee.x1),
                  top: Math.min(marquee.y0, marquee.y1),
                  width: Math.abs(marquee.x1 - marquee.x0),
                  height: Math.abs(marquee.y1 - marquee.y0),
                }}
              />
            )}

            {/* Content-edit control bar (screen space) */}
            {editingFrameId &&
              (() => {
                const ef = frames.find((f) => f.id === editingFrameId);
                const pct = Math.round(((ef?.content?.scale ?? 1) as number) * 100);
                return (
                  <div
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-border bg-card px-2 py-1.5 text-sm shadow-lg"
                    style={{ cursor: "default" }}
                  >
                    <span className="px-1 text-xs font-semibold text-muted-foreground">
                      Editing content — drag to reposition
                    </span>
                    <button
                      onClick={() => scaleContent(editingFrameId, -0.1)}
                      aria-label="Scale down"
                      className="grid h-7 w-7 place-items-center rounded-lg hover:bg-muted"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-xs font-semibold tabular-nums">
                      {pct}%
                    </span>
                    <button
                      onClick={() => scaleContent(editingFrameId, 0.1)}
                      aria-label="Scale up"
                      className="grid h-7 w-7 place-items-center rounded-lg hover:bg-muted"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="mx-1 h-6 w-px bg-border" />
                    <button
                      onClick={() => setEditingFrameId(null)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110"
                    >
                      Done
                    </button>
                  </div>
                );
              })()}

            {/* Ghost frame trailing the cursor while placing (CapCut-style + badge) */}
            {placing && ghost && (
              <div
                className="pointer-events-none absolute rounded-xl border-2 border-dashed border-primary bg-primary/5"
                style={{
                  left: ghost.x - (FRAME_W * view.zoom) / 2,
                  top: ghost.y - (FRAME_H * view.zoom) / 2,
                  width: FRAME_W * view.zoom,
                  height: FRAME_H * view.zoom,
                }}
              >
                <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-md bg-primary text-white shadow">
                  <Plus className="h-4 w-4" />
                </span>
              </div>
            )}

            {/* Upper platform toolbar — anchored above the selected frame.
                Rendered in screen space so it stays a constant size (font/size don't
                shrink on zoom); its position tracks the frame through pan/zoom/drag. */}
            {(() => {
              // Only show the per-frame toolbar when exactly one frame is selected
              // and not in content-edit mode (that has its own bar).
              const sf =
                !editingFrameId && selection.length === 1
                  ? frames.find((f) => f.id === selection[0])
                  : null;
              if (!sf) return null;
              const barX = view.x + (sf.x + (sf.w * DISPLAY_SCALE) / 2) * view.zoom;
              const barY = view.y + sf.y * view.zoom - 8;
              const openEntry = openPlatform
                ? PLATFORMS.find((p) => p.label === openPlatform)
                : null;
              return (
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute z-30 -translate-x-1/2 -translate-y-full"
                  style={{ left: barX, top: barY, cursor: "default" }}
                >
                  <div className="relative flex items-center gap-0.5 rounded-2xl border border-border bg-card px-2 py-1.5 shadow-lg">
                    {PLATFORMS.map((p) => (
                      <ToolbarButton
                        key={p.label}
                        label={p.label}
                        Icon={p.Icon}
                        onClick={() =>
                          setOpenPlatform((prev) => (prev === p.label ? null : p.label))
                        }
                      />
                    ))}
                    <span className="mx-1 h-6 w-px shrink-0 bg-border" />
                    <ToolbarButton label="Settings" Icon={MoreVertical} />

                    {/* Platform size dropdown — drops below the bar, left-aligned to it */}
                    {openEntry && (
                      <div className="absolute left-0 top-full mt-2 max-h-[55vh] w-64 overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl">
                        {PLATFORM_SIZES[openEntry.label]?.map((opt, i) => {
                          const active = sf.w === opt.w && sf.h === opt.h;
                          return (
                            <button
                              key={`${opt.content}-${i}`}
                              onClick={() => {
                                setFrames((fs) =>
                                  fs.map((x) =>
                                    x.id === sf.id
                                      ? {
                                          ...x,
                                          platform: openEntry,
                                          aspect: opt.aspect,
                                          contentLabel: opt.oneWord,
                                          w: opt.w,
                                          h: opt.h,
                                        }
                                      : x,
                                  ),
                                );
                                setOpenPlatform(null);
                              }}
                              className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition hover:bg-muted"
                            >
                              <span className="flex min-w-0 items-center gap-2 text-sm text-foreground">
                                {active ? (
                                  <Check className="h-4 w-4 shrink-0 text-primary" />
                                ) : (
                                  <span className="w-4 shrink-0" />
                                )}
                                <span className="truncate">{opt.content}</span>
                              </span>
                              <span className="shrink-0 text-xs text-muted-foreground">
                                {opt.w} × {opt.h}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Zoom indicator — click to type an exact percentage */}
            <div onPointerDown={(e) => e.stopPropagation()} className="absolute bottom-3 left-3">
              {zoomEditing ? (
                <div className="flex items-center rounded-lg bg-card px-2 py-1 text-xs font-semibold shadow ring-2 ring-primary/40">
                  <input
                    autoFocus
                    value={zoomInput}
                    onChange={(e) => setZoomInput(e.target.value.replace(/[^0-9]/g, ""))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitZoom();
                      if (e.key === "Escape") setZoomEditing(false);
                    }}
                    onBlur={commitZoom}
                    className="w-9 bg-transparent text-right outline-none"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setZoomInput(String(Math.round(view.zoom * 100)));
                    setZoomEditing(true);
                  }}
                  title="Click to set an exact zoom"
                  className="rounded-lg bg-card/90 px-2 py-1 text-xs font-semibold text-muted-foreground shadow transition hover:text-foreground hover:ring-1 hover:ring-primary/40"
                >
                  {Math.round(view.zoom * 100)}%
                </button>
              )}
            </div>

            {/* Right-click context menu (screen space) */}
            {contextMenu && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                onContextMenu={(e) => e.preventDefault()}
                className="absolute z-40 w-44 rounded-xl border border-border bg-popover p-1 text-sm text-popover-foreground shadow-xl"
                style={{
                  left: Math.min(contextMenu.x, 9999),
                  top: contextMenu.y,
                  cursor: "default",
                }}
              >
                {(
                  [
                    ["Cut", cmCut],
                    ["Copy", cmCopy],
                    ["Paste", cmPaste],
                    ["Duplicate", cmDuplicate],
                    ["Delete", cmDelete],
                    ["divider"],
                    ["Group", () => toast("Group — coming soon")],
                    ["Ungroup", () => toast("Ungroup — coming soon")],
                    ["Lock", cmLock],
                    ["Unlock", cmUnlock],
                    ["divider"],
                    ["Bring Forward", cmForward],
                    ["Send Backward", cmBackward],
                    ["Align", () => toast("Align — coming soon")],
                    ["Distribute", () => toast("Distribute — coming soon")],
                    ["Rename", () => toast("Rename — coming soon")],
                    ["divider"],
                    ["Send to Post", cmSendToPost],
                  ] as [string, (() => void)?][]
                ).map(([label, action], i) =>
                  label === "divider" ? (
                    <div key={i} className="my-1 h-px bg-border" />
                  ) : (
                    <button
                      key={label}
                      onClick={action}
                      disabled={label === "Paste" && !clipboard}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition hover:bg-muted disabled:opacity-40 ${
                        label === "Send to Post" ? "font-semibold text-primary" : ""
                      } ${label === "Delete" ? "text-rose-600 dark:text-rose-300" : ""}`}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>
            )}

            {/* Lower editing toolbar with collapsible dock */}
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-1/2 flex h-14 -translate-x-1/2 items-center justify-center"
              style={{ cursor: "default" }}
            >
              {/* Centered dock (slides to the right edge + fades when hidden) */}
              <div
                className={`group flex items-center gap-0.5 rounded-2xl border border-border bg-card px-2 py-1.5 shadow-lg transition-all duration-300 ${
                  dockHidden ? "pointer-events-none translate-x-[130%] opacity-0" : "opacity-100"
                }`}
              >
                {LOWER_TOOLS.map((t) => (
                  <ToolbarButton
                    key={t.label}
                    label={t.label}
                    Icon={t.Icon}
                    onClick={
                      t.label === "Frame"
                        ? () => {
                            setPlacing((p) => !p);
                            setSelection([]);
                          }
                        : undefined
                    }
                  />
                ))}
                {/* Hover reveals a divider + hide (chevron-right) button */}
                <div className="flex items-center overflow-hidden opacity-0 [max-width:0px] transition-all duration-300 group-hover:opacity-100 group-hover:[max-width:44px]">
                  <span className="mx-1 h-6 w-px shrink-0 bg-border" />
                  <button
                    type="button"
                    onClick={() => setDockHidden(true)}
                    aria-label="Hide toolbar"
                    title="Hide toolbar"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-foreground/80 transition hover:bg-primary/10 hover:text-foreground"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Docked tab (fades in when hidden) */}
              <button
                type="button"
                onClick={() => setDockHidden(false)}
                aria-label="Show toolbar"
                title="Show toolbar"
                className={`group absolute right-[-14px] top-1/2 grid h-11 w-9 -translate-y-1/2 place-items-center rounded-l-xl border border-border bg-card shadow-md transition-all duration-300 ${
                  dockHidden ? "opacity-100" : "pointer-events-none translate-x-full opacity-0"
                }`}
              >
                <ChevronLeft className="h-5 w-5 group-hover:hidden" />
                <Maximize2 className="hidden h-4 w-4 group-hover:block" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 space-y-3">
            <p className="text-xs text-muted-foreground">
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
                className="group flex w-full items-center gap-4 rounded-xl border border-border bg-card p-3 text-left shadow-sm transition hover:border-primary"
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
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Clip {i + 1}
                  </div>
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Optimal {c.duration} cut · 92% hook score
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
              </button>
            ))}
          </div>
        )}
      </div>

      <ComposerResizeHandle
        label="Resize canvas and publish settings"
        onPointerDown={(event) => startColumnResize("right", event)}
        onReset={resetComposerColumns}
      />

      {/* RIGHT */}
      <div className="relative flex h-auto flex-col overflow-y-auto bg-card p-7 lg:h-full">
        {/* Caption Editor */}
        <h3 className="text-base font-bold tracking-tight text-foreground">Caption Editor</h3>
        <div className="mt-3 rounded-[18px] bg-card p-3 shadow-[0_2px_8px_rgba(26,24,35,0.12)]">
          {/* True sliding segmented toggle — the highlight animates between modes.
              Captions stays wired to the Idea Engine; Script/Headlines are independent. */}
          <div className="relative grid grid-cols-3 rounded-full bg-muted p-1 text-xs font-bold text-muted-foreground">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-card shadow-sm transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${EDITOR_MODES.indexOf(editorMode) * 100}%)`,
              }}
            />
            {EDITOR_MODES.map((m) => (
              <button
                key={m}
                onClick={() => setEditorMode(m)}
                aria-pressed={editorMode === m}
                className={`relative z-10 rounded-full px-3 py-2 transition-colors ${
                  editorMode === m ? "text-foreground" : "hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={() => toast(`Auto-generating ${editorMode.toLowerCase()}…`)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 py-2 text-sm font-bold text-primary transition hover:bg-primary/10"
          >
            <Type className="h-4 w-4" /> Auto-Generate {editorMode}
          </button>
          <textarea
            value={editorValue}
            onChange={(e) => setEditorValue(e.target.value)}
            placeholder={
              editorMode === "Captions"
                ? "Write your description of your cross-posting caption.."
                : `Write your ${editorMode.toLowerCase().replace(/s$/, "")}…`
            }
            className="mt-3 min-h-[104px] w-full resize-none rounded-[16px] border border-border bg-card p-3 text-sm font-bold text-foreground outline-none placeholder:font-medium placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/40"
          />
          {/* Blue save button — always appends a new numbered entry, never overwrites. */}
          <button
            onClick={saveEditorText}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f80ed] py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" />
            {editorMode === "Captions"
              ? "Save Caption"
              : editorMode === "Script"
                ? "Save Script"
                : "Save Headline"}
          </button>
        </div>

        {/* "Select to Send" header row — the gear opens settings for which
            optional dropdowns appear below. */}
        <div className="mt-5 flex items-center justify-between">
          <div className="text-base font-bold text-foreground">Select to Send</div>
          <div className="relative">
            <button
              onClick={() => setSendSettingsOpen((o) => !o)}
              aria-label="Sidebar settings"
              className="text-primary transition hover:text-primary/80"
            >
              <Settings className="h-4 w-4" />
            </button>
            {sendSettingsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSendSettingsOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Show dropdowns
                  </div>
                  <button
                    onClick={() => {
                      setShowScriptPanel((s) => !s);
                      setSendSettingsOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm transition hover:bg-muted"
                  >
                    <span>Script Options</span>
                    {showScriptPanel && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Update 3 — workflow accordions; each one can feed the package builder. */}
        <div className="mt-3 space-y-2">
          {/* 1 — CONTENT OPTIONS: the existing Select to Send panel, relocated as-is */}
          <SidebarPanel
            title="Content Options"
            Icon={Layers}
            open={openPanel === "content"}
            onToggle={() => setOpenPanel((o) => (o === "content" ? null : "content"))}
          >
            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-foreground">Select to Send</div>
              <div className="relative">
                <button
                  onClick={() => setEditOpen((o) => !o)}
                  className="text-sm font-semibold text-primary transition hover:text-primary/80"
                >
                  Edit
                </button>
                {editOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setEditOpen(false)} />
                    <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl">
                      <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Add platform
                      </div>
                      {PLATFORMS.filter((p) => !sendPlatforms.includes(p.label)).map((p) => (
                        <button
                          key={p.label}
                          onClick={() => {
                            setSendPlatforms((s) => [...s, p.label]);
                            setEditOpen(false);
                            toast.success(`${p.label} added to Select to Send`);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition hover:bg-muted"
                        >
                          <Plus className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <p.Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{p.label}</span>
                        </button>
                      ))}
                      {PLATFORMS.filter((p) => !sendPlatforms.includes(p.label)).length === 0 && (
                        <p className="px-2 py-2 text-xs text-muted-foreground">
                          All platforms added.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {sendPlatforms.map((label) => {
                const entry = PLATFORMS.find((p) => p.label === label);
                if (!entry) return null;
                const open = openSend === label;
                const items = sendItemsFor(label);
                const vertical = items.filter((i) => i.frame.h > i.frame.w);
                const horizontal = items.filter((i) => i.frame.w >= i.frame.h);
                const Row = ({ it }: { it: (typeof items)[number] }) => {
                  const on = checkedFrames.includes(it.frame.id);
                  return (
                    <button
                      onClick={() =>
                        setCheckedFrames((c) =>
                          c.includes(it.frame.id)
                            ? c.filter((x) => x !== it.frame.id)
                            : [...c, it.frame.id],
                        )
                      }
                      className="flex w-full items-center justify-between gap-2 py-1.5"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-primary ${
                            on ? "bg-primary" : ""
                          }`}
                        >
                          {on && <Check className="h-2.5 w-2.5 text-white" />}
                        </span>
                        <span className="truncate text-sm text-muted-foreground">{it.display}</span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-foreground">
                        {it.frame.aspect}
                      </span>
                    </button>
                  );
                };
                return (
                  <div
                    key={label}
                    className="rounded-[18px] bg-card shadow-[0_2px_6px_rgba(26,24,35,0.14)]"
                  >
                    <button
                      onClick={() => setOpenSend((o) => (o === label ? null : label))}
                      className="flex w-full items-center justify-between px-4 py-3"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                        <entry.Icon className="h-4 w-4" /> {label}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-primary transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <div className="px-4 pb-3">
                        <div className="text-sm font-bold text-foreground">
                          Choose Sizes to Post
                        </div>
                        {items.length === 0 ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            No {label} frames yet — size a frame for {label} on the board.
                          </p>
                        ) : (
                          <>
                            {vertical.length > 0 && (
                              <div className="mt-2">
                                <div className="text-sm font-bold text-foreground">Vertical</div>
                                {vertical.map((it) => (
                                  <Row key={it.frame.id} it={it} />
                                ))}
                              </div>
                            )}
                            {horizontal.length > 0 && (
                              <div className="mt-2">
                                <div className="text-sm font-bold text-foreground">Horizontal</div>
                                {horizontal.map((it) => (
                                  <Row key={it.frame.id} it={it} />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <SaveToPackage
              onClick={() => {
                const plats = [
                  ...new Set(
                    frames.filter((f) => checkedFrames.includes(f.id)).map((f) => f.platform.label),
                  ),
                ];
                if (!plats.length) {
                  toast.error("Select at least one size to package");
                  return;
                }
                askPackage({
                  kind: "content",
                  platforms: plats,
                  frameIds: checkedFrames,
                  summary: `${plats.length} content destination${plats.length > 1 ? "s" : ""}`,
                });
              }}
            />
          </SidebarPanel>

          {/* 2 — CAPTION OPTIONS: every saved Caption / Script / Headline */}
          <SidebarPanel
            title="Caption Options"
            Icon={Captions}
            open={openPanel === "captions"}
            onToggle={() => setOpenPanel((o) => (o === "captions" ? null : "captions"))}
          >
            <div className="text-sm font-bold text-foreground">Select to Send</div>
            {savedTexts.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Nothing saved yet — write a caption, script, or headline above and press Save.
              </p>
            ) : (
              <div className="mt-2 max-h-64 space-y-3 overflow-y-auto pr-1">
                {savedTexts.map((t) => {
                  const on = pickedTexts.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() =>
                        setPickedTexts((s) => (on ? s.filter((x) => x !== t.id) : [...s, t.id]))
                      }
                      className="flex w-full items-start gap-2.5 text-left"
                    >
                      <span
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-primary ${
                          on ? "bg-primary" : ""
                        }`}
                      >
                        {on && <Check className="h-2.5 w-2.5 text-white" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t.label}
                        </span>
                        <span className="block text-sm font-bold text-foreground">{t.text}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            <SaveToPackage
              onClick={() => {
                if (!pickedTexts.length) {
                  toast.error("Select at least one entry");
                  return;
                }
                askPackage({
                  kind: "captions",
                  textIds: pickedTexts,
                  summary: `${pickedTexts.length} caption entr${pickedTexts.length > 1 ? "ies" : "y"}`,
                });
              }}
            />
          </SidebarPanel>

          {/* 3 — HASHTAG OPTIONS: per-card Edit + its own Save to Package */}
          <SidebarPanel
            title="Hashtag Options"
            Icon={Hash}
            open={openPanel === "hashtags"}
            onToggle={() => setOpenPanel((o) => (o === "hashtags" ? null : "hashtags"))}
          >
            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-foreground">Hashtag Options</div>
              <button
                onClick={() =>
                  setHashGroups((gs) => [
                    ...gs,
                    {
                      id: newId("hg"),
                      name: `New Group ${gs.length + 1}`,
                      badge: "Steady reach",
                      badgeTone: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                      group: hashPill === "All groups" ? "Brand" : hashPill,
                      desc: "Your new hashtag group",
                      tags: [{ tag: "#newtag", reach: "—" }],
                    },
                  ])
                }
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110"
              >
                New group
              </button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {HASHTAG_PILLS.map((p) => (
                <button
                  key={p}
                  onClick={() => setHashPill(p)}
                  className={`h-7 shrink-0 rounded-full px-3 text-xs font-semibold transition ${
                    hashPill === p
                      ? "border border-primary/40 bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-3">
              {hashGroups
                .filter((g) => hashPill === "All groups" || g.group === hashPill)
                .map((g) => (
                  <div key={g.id} className="rounded-2xl border border-border bg-card p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-bold text-foreground">{g.name}</div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${g.badgeTone}`}
                      >
                        {g.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{g.desc}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {g.tags.map((t) => {
                        const on = pickedTags.includes(t.tag);
                        return (
                          <button
                            key={t.tag}
                            onClick={() =>
                              setPickedTags((s) =>
                                on ? s.filter((x) => x !== t.tag) : [...s, t.tag],
                              )
                            }
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                              on
                                ? "bg-primary text-white"
                                : "bg-secondary text-foreground hover:bg-muted"
                            }`}
                          >
                            {t.tag}{" "}
                            <span className={on ? "text-white/70" : "text-muted-foreground"}>
                              {t.reach}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {editingGroup === g.id && (
                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                        {g.tags.map((t, i) => (
                          <input
                            key={i}
                            value={t.tag}
                            onChange={(e) =>
                              setHashGroups((gs) =>
                                gs.map((x) =>
                                  x.id === g.id
                                    ? {
                                        ...x,
                                        tags: x.tags.map((tt, ii) =>
                                          ii === i ? { ...tt, tag: e.target.value } : tt,
                                        ),
                                      }
                                    : x,
                                ),
                              )
                            }
                            className="w-full rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-primary"
                          />
                        ))}
                        <button
                          onClick={() =>
                            setHashGroups((gs) =>
                              gs.map((x) =>
                                x.id === g.id
                                  ? { ...x, tags: [...x.tags, { tag: "#newtag", reach: "—" }] }
                                  : x,
                              ),
                            )
                          }
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add hashtag
                        </button>
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setEditingGroup((e) => (e === g.id ? null : g.id))}
                        className="flex-1 rounded-xl border border-border py-2 text-xs font-bold text-foreground transition hover:bg-muted"
                      >
                        {editingGroup === g.id ? "Done" : "Edit"}
                      </button>
                      <button
                        onClick={() => {
                          const sel = g.tags
                            .filter((t) => pickedTags.includes(t.tag))
                            .map((t) => t.tag);
                          if (!sel.length) {
                            toast.error("Select tags in this group first");
                            return;
                          }
                          askPackage({
                            kind: "hashtags",
                            tags: sel,
                            summary: `${sel.length} hashtag${sel.length > 1 ? "s" : ""}`,
                          });
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-white transition hover:brightness-110"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Save to Package
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </SidebarPanel>

          {/* 4 — CAMPAIGN OPTIONS: the same Generated Ideas from the left Idea Engine */}
          <SidebarPanel
            title="Campaign Options"
            Icon={Megaphone}
            open={openPanel === "campaign"}
            onToggle={() => setOpenPanel((o) => (o === "campaign" ? null : "campaign"))}
          >
            {!ideas ? (
              <p className="text-xs text-muted-foreground">
                No ideas yet — press Generate in the AI Idea Engine on the left.
              </p>
            ) : (
              <div className="space-y-2">
                {ideas.map((idea) => {
                  const on = pickedCampaigns.includes(idea.day);
                  return (
                    <button
                      key={idea.day}
                      onClick={() =>
                        setPickedCampaigns((s) =>
                          on ? s.filter((x) => x !== idea.day) : [...s, idea.day],
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                        on ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-primary ${
                          on ? "bg-primary" : ""
                        }`}
                      >
                        {on && <Check className="h-2.5 w-2.5 text-white" />}
                      </span>
                      <img
                        src={idea.thumb}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`grid h-4 w-4 shrink-0 place-items-center rounded ${idea.iconBg}`}
                          >
                            <idea.icon className="h-2.5 w-2.5 text-white" />
                          </span>
                          <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {idea.day} · {idea.platform}
                          </span>
                        </span>
                        <span className="mt-1 line-clamp-2 block text-xs text-foreground/90">
                          {idea.teaser}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            <SaveToPackage
              onClick={() => {
                if (!pickedCampaigns.length) {
                  toast.error("Select at least one campaign idea");
                  return;
                }
                askPackage({
                  kind: "campaign",
                  campaigns: pickedCampaigns,
                  summary: `${pickedCampaigns.length} campaign concept${pickedCampaigns.length > 1 ? "s" : ""}`,
                });
              }}
            />
          </SidebarPanel>

          {/* 5 — PACKAGING OPTIONS: the package manager */}
          <SidebarPanel
            title="Packaging Options"
            Icon={Package}
            open={openPanel === "packaging"}
            onToggle={() => setOpenPanel((o) => (o === "packaging" ? null : "packaging"))}
          >
            {packages.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No packages yet — use any “Save to Package” button above to create your first one.
              </p>
            ) : (
              <div className="space-y-2">
                {packages.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-border bg-card p-2.5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPickedPkg((x) => (x === p.id ? null : p.id))}
                        aria-label={`Select ${p.name}`}
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-primary ${
                          pickedPkg === p.id ? "bg-primary" : ""
                        }`}
                      >
                        {pickedPkg === p.id && <Check className="h-2.5 w-2.5 text-white" />}
                      </button>
                      <button
                        onClick={() => setOpenPkg((o) => (o === p.id ? null : p.id))}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <img
                          src={p.image}
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-xl object-cover"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-foreground">
                            {p.name}
                          </span>
                          <span className="block text-[11px] text-muted-foreground">
                            {p.platforms.length} platforms · {p.textIds.length} text ·{" "}
                            {p.tags.length} tags · {p.campaigns.length} ideas
                          </span>
                        </span>
                      </button>
                    </div>
                    {openPkg === p.id && (
                      <div className="mt-3 space-y-3 border-t border-border pt-3">
                        {[
                          {
                            label: "Content destinations",
                            field: "platforms" as const,
                            items: p.platforms.map((v) => ({ v, text: v })),
                          },
                          {
                            label: "Captions / Scripts / Headlines",
                            field: "textIds" as const,
                            items: p.textIds.map((id) => ({
                              v: id,
                              text: savedTexts.find((t) => t.id === id)?.label ?? "Removed",
                            })),
                          },
                          {
                            label: "Hashtags",
                            field: "tags" as const,
                            items: p.tags.map((v) => ({ v, text: v })),
                          },
                          {
                            label: "Campaign concepts",
                            field: "campaigns" as const,
                            items: p.campaigns.map((v) => ({ v, text: v })),
                          },
                        ].map((sec) => (
                          <div key={sec.label}>
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {sec.label}
                            </div>
                            {sec.items.length === 0 ? (
                              <p className="mt-1 text-xs text-muted-foreground/70">None yet</p>
                            ) : (
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {sec.items.map((it) => (
                                  <span
                                    key={it.v}
                                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground"
                                  >
                                    {it.text}
                                    <button
                                      onClick={() => removeFromPkg(p.id, sec.field, it.v)}
                                      aria-label={`Remove ${it.text}`}
                                      className="text-muted-foreground transition hover:text-foreground"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={sendPackageToCalendar}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110"
            >
              <Send className="h-4 w-4" /> Send Options to Calendar
            </button>
          </SidebarPanel>

          {/* Optional — shown only when enabled from the Select to Send settings gear. */}
          {showScriptPanel && (
            <SidebarPanel
              title="Script Options"
              Icon={FileText}
              open={openPanel === "scripts"}
              onToggle={() => setOpenPanel((o) => (o === "scripts" ? null : "scripts"))}
            >
              {savedTexts.filter((t) => t.kind === "Script").length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No scripts saved yet — switch the Caption Editor to Script and press Save Script.
                </p>
              ) : (
                <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                  {savedTexts
                    .filter((t) => t.kind === "Script")
                    .map((t) => {
                      const on = pickedScripts.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          onClick={() =>
                            setPickedScripts((s) =>
                              on ? s.filter((x) => x !== t.id) : [...s, t.id],
                            )
                          }
                          className="flex w-full items-start gap-2.5 text-left"
                        >
                          <span
                            className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-primary ${
                              on ? "bg-primary" : ""
                            }`}
                          >
                            {on && <Check className="h-2.5 w-2.5 text-white" />}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {t.label}
                            </span>
                            <span className="block text-sm font-bold text-foreground">
                              {t.text}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                </div>
              )}
              <SaveToPackage
                onClick={() => {
                  if (!pickedScripts.length) {
                    toast.error("Select at least one script");
                    return;
                  }
                  askPackage({
                    kind: "captions",
                    textIds: pickedScripts,
                    summary: `${pickedScripts.length} script${pickedScripts.length > 1 ? "s" : ""}`,
                  });
                }}
              />
            </SidebarPanel>
          )}
        </div>

        {/* Persistent bottom CTA — the only one on this bar, in the solid purple
            fill the Approve & Schedule button used to have. */}
        <div className="mt-auto pt-5">
          <button
            onClick={sendAllFrames}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" /> Send All Frames to Calendar
          </button>
        </div>
      </div>

      {/* "Place Asset in Frame" modal (photo/video/animation/pdf onto a frame) */}
      {placePrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setPlacePrompt(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold">Place Asset in Frame</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              How would you like this content placed?
            </p>
            <div className="mt-4 space-y-2">
              {(
                [
                  ["fill", "Fill Frame", "Cover the frame; crop overflow."],
                  ["fit", "Fit Entire Asset", "Show the whole asset; letterbox."],
                  ["free", "Place Freely", "Drop on the frame; move it yourself."],
                ] as const
              ).map(([mode, label, desc]) => (
                <button
                  key={mode}
                  onClick={() => {
                    applyFramePlacement(placePrompt.frameId, placePrompt.image, mode);
                    if (rememberChoice)
                      setPlaceDefaults((d) => ({ ...d, [placePrompt.type]: mode }));
                    setPlacePrompt(null);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-left transition hover:border-primary hover:bg-muted"
                >
                  <span>
                    <span className="block text-sm font-bold">{label}</span>
                    <span className="block text-xs text-muted-foreground">{desc}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={rememberChoice}
                onChange={(e) => setRememberChoice(e.target.checked)}
                className="accent-[color:var(--primary)]"
              />
              Always do this for {placePrompt.type} this session
            </label>
          </div>
        </div>
      )}

      {/* "Use this idea?" confirmation modal */}
      {pendingIdea && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setPendingIdea(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <img
                src={pendingIdea.thumb}
                alt=""
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {pendingIdea.day} · {pendingIdea.platform}
                </div>
                <p className="mt-1 line-clamp-3 text-sm text-foreground/90">
                  {pendingIdea.caption}
                </p>
              </div>
            </div>
            <h3 className="mt-5 text-lg font-bold">Do you want to use this idea?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              It will fill the Caption in your Publish Settings.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setPendingIdea(null)}
                className="flex-1 rounded-xl border border-border bg-secondary py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                No
              </button>
              <button
                onClick={() => applyIdea(pendingIdea)}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Yes, use it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Content Loaded" upload placement modal — pick a type, then a folder /
          subfolder from that type's category list (or skip to Uploaded Assets). */}
      {uploadDraft &&
        (() => {
          const folders = TYPE_FOLDERS[uploadDraft.type] ?? [];
          const activeFolder = folders.find((f) => f.folder === uploadDraft.folder);
          const subs = activeFolder?.subfolders ?? [];
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
              onClick={() => setUploadDraft(null)}
            >
              <div
                className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold">Content Loaded</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Where would you like to place it?
                </p>

                <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                  {uploadDraft.url ? (
                    <img
                      src={uploadDraft.url}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </span>
                  )}
                  <span className="truncate text-sm font-semibold">{uploadDraft.name}</span>
                </div>

                {/* Step 1 — asset type (defaulted from the file) */}
                <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Asset type
                </label>
                <select
                  value={uploadDraft.type}
                  onChange={(e) =>
                    setUploadDraft((d) =>
                      d ? { ...d, type: e.target.value, folder: null, sub: null } : d,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                >
                  {ASSET_TILES.map((t) => (
                    <option key={t.label} value={t.label}>
                      {t.label}
                    </option>
                  ))}
                </select>

                {/* Step 2 — folder */}
                {folders.length > 0 && (
                  <>
                    <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Folder
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {folders.map((f) => (
                        <button
                          key={f.folder}
                          onClick={() =>
                            setUploadDraft((d) =>
                              d
                                ? {
                                    ...d,
                                    folder: d.folder === f.folder ? null : f.folder,
                                    sub: null,
                                  }
                                : d,
                            )
                          }
                          className={`h-8 rounded-full px-3 text-xs font-semibold transition ${
                            uploadDraft.folder === f.folder
                              ? "bg-primary text-white"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {f.folder}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 3 — subfolder (only for folders that have them) */}
                {subs.length > 0 && (
                  <>
                    <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {uploadDraft.folder} subfolder
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {subs.map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            setUploadDraft((d) => (d ? { ...d, sub: d.sub === s ? null : s } : d))
                          }
                          className={`h-8 rounded-full px-3 text-xs font-semibold transition ${
                            uploadDraft.sub === s
                              ? "bg-primary text-white"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => commitUpload(false)}
                    className="flex-1 rounded-xl border border-border bg-secondary py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    Skip — Uploaded Assets
                  </button>
                  <button
                    onClick={() => commitUpload(true)}
                    disabled={folders.length > 0 && !uploadDraft.folder}
                    className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                  >
                    Confirm placement
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Shared "Save to Package" modal — used identically by Content Options,
          Caption Options, Hashtag Options and Campaign Options. */}
      {pkgDraft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closePkgModal}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePkgModal}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {packages.length === 0 ? (
              <>
                <h3 className="text-lg font-bold">Let’s create your first package</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Adding {pkgDraft.summary.toLowerCase()}.
                </p>
                <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Package name
                </label>
                <input
                  autoFocus
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="e.g. Summer Launch"
                  className="mt-2 w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold">Save to Package</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Adding {pkgDraft.summary.toLowerCase()}.
                </p>
                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => setPkgMode("existing")}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      pkgMode === "existing"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <Package className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm font-bold">Add to Package</span>
                  </button>
                  {pkgMode === "existing" && (
                    <select
                      value={pkgPick}
                      onChange={(e) => setPkgPick(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary"
                    >
                      {packages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={() => setPkgMode("new")}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      pkgMode === "new"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <FolderPlus className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm font-bold">Create New Package</span>
                  </button>
                  {pkgMode === "new" && (
                    <input
                      autoFocus
                      value={pkgName}
                      onChange={(e) => setPkgName(e.target.value)}
                      placeholder="New package name"
                      className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                </div>
              </>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={closePkgModal}
                className="flex-1 rounded-xl border border-border bg-secondary py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={commitPackage}
                disabled={packages.length > 0 && pkgMode === "choose"}
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComposerResizeHandle({
  label,
  onPointerDown,
  onReset,
}: {
  label: string;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onReset: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title="Drag to resize. Double-click to reset."
      onPointerDown={onPointerDown}
      onDoubleClick={onReset}
      className="group relative z-20 hidden cursor-col-resize touch-none items-center justify-center bg-[#9258ff] outline-none transition hover:bg-[#7d42ee] focus-visible:ring-2 focus-visible:ring-[#9258ff]/50 lg:flex"
    >
      <span className="absolute left-1/2 top-1/2 flex h-12 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-md transition group-hover:scale-105 group-active:scale-95">
        <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        <ChevronRight className="-ml-0.5 h-4 w-4" strokeWidth={2.5} />
      </span>
    </button>
  );
}

// ---------- FULL ASSET LIBRARY PAGE ----------
const STATUS_META: Record<LibraryAsset["status"], { label: string; text: string; tint: string }> = {
  recent: { label: "Used recently", text: "text-primary", tint: "bg-primary/10" },
  top: {
    label: "Top performing",
    text: "text-emerald-600 dark:text-emerald-300",
    tint: "bg-emerald-500/10",
  },
  unused: { label: "Unused", text: "text-muted-foreground", tint: "bg-muted" },
};

const GRADE_COLOR: Record<LibraryAsset["grade"], string> = {
  A: "text-emerald-600 dark:text-emerald-300",
  B: "text-amber-600 dark:text-amber-300",
  C: "text-rose-600 dark:text-rose-300",
};

function FullAssetLibrary({ onBack }: { onBack: () => void }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [activeNav, setActiveNav] = useState("All Assets");
  const [selected, setSelected] = useState<LibraryAsset | null>(null);
  const [aiAssist, setAiAssist] = useState(true);
  const [sort, setSort] = useState("Recently uploaded");

  const typeOf: Record<string, LibraryAsset["type"]> = {
    Images: "Image",
    Videos: "Video",
    Logos: "Logo",
    PDFs: "PDF",
  };
  const filteredAssets =
    typeFilter === "All"
      ? LIBRARY_ASSETS
      : LIBRARY_ASSETS.filter((a) => a.type === typeOf[typeFilter]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-background text-foreground lg:h-[calc(100vh-4rem)] lg:flex-row">
      {/* LEFT — navigation tree */}
      <aside className="flex w-full shrink-0 flex-col overflow-y-auto border-b border-border bg-card p-5 lg:w-64 lg:border-b-0 lg:border-r">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Asset Library</h2>
          <p className="text-xs text-muted-foreground">OmniForge</p>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search assets…"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground/70"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {LIBRARY_TYPE_FILTERS.map((f) => {
            const active = typeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <NavGroup title="Library">
          {LIBRARY_NAV.library.map((item) => (
            <NavItem
              key={item.label}
              label={item.label}
              count={item.count}
              active={activeNav === item.label}
              onClick={() => setActiveNav(item.label)}
            />
          ))}
        </NavGroup>

        <NavGroup title="Collections">
          {LIBRARY_NAV.collections.map((label) => (
            <NavItem
              key={label}
              label={label}
              active={activeNav === label}
              onClick={() => setActiveNav(label)}
            />
          ))}
        </NavGroup>

        <NavGroup title="App">
          {LIBRARY_NAV.app.map((label) => (
            <NavItem
              key={label}
              label={label}
              muted
              onClick={label === "Composer" ? onBack : () => toast(`${label} — coming soon`)}
            />
          ))}
        </NavGroup>
      </aside>

      {/* CENTER — asset grid */}
      <section className="flex min-w-0 flex-1 flex-col overflow-y-auto p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{activeNav}</h1>
            <p className="text-xs text-muted-foreground">{filteredAssets.length} assets</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option>Recently uploaded</option>
              <option>Oldest first</option>
              <option>Name (A–Z)</option>
            </select>
            <button
              onClick={() => setAiAssist((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold"
            >
              <span>AI assist {aiAssist ? "on" : "off"}</span>
              <span
                className={`relative h-4 w-7 rounded-full transition ${aiAssist ? "bg-primary" : "bg-muted"}`}
              >
                <span
                  className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${aiAssist ? "left-3.5" : "left-0.5"}`}
                />
              </span>
            </button>
            <button
              onClick={() => toast.success("Upload dialog opened")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              <Upload className="h-4 w-4" /> Upload
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredAssets.map((asset) => {
            const meta = STATUS_META[asset.status];
            const isSel = selected?.name === asset.name;
            return (
              <button
                key={asset.name}
                onClick={() => setSelected(asset)}
                className={`overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                  isSel ? "border-primary ring-2 ring-primary/30" : "border-border"
                }`}
              >
                <div className={`relative grid h-28 place-items-center ${meta.tint}`}>
                  <span className="text-4xl">{asset.emoji}</span>
                  <span
                    className={`absolute right-2 top-2 rounded-full bg-card/80 px-2 py-0.5 text-[10px] font-semibold ${meta.text}`}
                  >
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-card p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{asset.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {asset.type} · {asset.date}
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${GRADE_COLOR[asset.grade]}`}>
                    {asset.grade}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* RIGHT — asset detail */}
      <aside className="w-full shrink-0 overflow-y-auto border-t border-border bg-card p-5 lg:w-72 lg:border-l lg:border-t-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">Select an asset</h3>
          {selected && (
            <button
              onClick={() => setSelected(null)}
              aria-label="Clear selection"
              className="text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {!selected ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            Click any asset to see its details and AI report.
          </p>
        ) : (
          <div className="mt-5">
            <div
              className={`grid h-32 place-items-center rounded-xl ${STATUS_META[selected.status].tint}`}
            >
              <span className="text-6xl">{selected.emoji}</span>
            </div>
            <h4 className="mt-4 text-lg font-bold">{selected.name}</h4>
            <div className="mt-3 space-y-2 text-sm">
              <DetailRow label="Type" value={selected.type} />
              <DetailRow label="Uploaded" value={selected.date} />
              <DetailRow label="Status" value={STATUS_META[selected.status].label} />
              <DetailRow label="AI grade" value={selected.grade} />
            </div>
            <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> AI Report
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {selected.status === "top"
                  ? "This asset is outperforming your library average. Reuse it in upcoming campaigns for a projected engagement lift."
                  : selected.status === "recent"
                    ? "Recently used and performing steadily. Consider refreshing the caption to extend its shelf life."
                    : "This asset hasn't been used yet. AI suggests pairing it with a Product Launch campaign to test performance."}
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function NavGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({
  label,
  count,
  active,
  muted,
  onClick,
}: {
  label: string;
  count?: number | null;
  active?: boolean;
  muted?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-primary/12 text-primary"
          : muted
            ? "text-muted-foreground hover:bg-secondary hover:text-foreground"
            : "text-foreground hover:bg-secondary"
      }`}
    >
      <span className="truncate">{label}</span>
      {count != null && (
        <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {count}
        </span>
      )}
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

// ---------- CALENDAR ----------
function CalendarView({
  calendar,
  sentPosts,
  setSentPosts,
  scheduled,
  setScheduled,
}: {
  calendar: typeof INITIAL_CALENDAR;
  sentPosts: SentPost[];
  setSentPosts: React.Dispatch<React.SetStateAction<SentPost[]>>;
  scheduled: Record<string, SentPost[]>;
  setScheduled: React.Dispatch<React.SetStateAction<Record<string, SentPost[]>>>;
}) {
  const [locked, setLocked] = useState(false);
  const [inboxView, setInboxView] = useState<"grid" | "list">("grid");
  // Double-clicking a package entry opens its detail view.
  const [openEntry, setOpenEntry] = useState<SentPost | null>(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Drop a sidebar post onto a day: schedule it and remove it from the inbox.
  const dropOnDay = (day: string, e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const post = sentPosts.find((p) => p.id === id);
    if (!post) return;
    setScheduled((s) => ({ ...s, [day]: [...(s[day] || []), post] }));
    setSentPosts((ps) => ps.filter((p) => p.id !== id));
    toast.success(`${post.platform} ${post.contentLabel} scheduled for ${day}`);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* LEFT — posts sent from the Post Composer, waiting to be scheduled */}
      <aside className="w-full shrink-0 border-b border-border bg-card p-4 lg:min-h-[calc(100vh-4rem)] lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold tracking-tight">Ready to Schedule</h3>
          <div className="flex rounded-lg bg-muted p-0.5">
            <button
              onClick={() => setInboxView("grid")}
              aria-label="Grid view"
              className={`grid h-7 w-7 place-items-center rounded-md transition ${
                inboxView === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setInboxView("list")}
              aria-label="List view"
              className={`grid h-7 w-7 place-items-center rounded-md transition ${
                inboxView === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Drag a post onto a day to schedule it.
        </p>

        {sentPosts.length === 0 ? (
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Nothing here yet. Send frames from the Post Composer.
          </p>
        ) : inboxView === "grid" ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {sentPosts.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", p.id)}
                onDoubleClick={() => p.packageDetail && setOpenEntry(p)}
                title={p.packageName ? "Double-click to see what's in this package" : undefined}
                className="cursor-grab overflow-hidden rounded-lg border border-border bg-card transition hover:border-primary active:cursor-grabbing"
              >
                <div className="relative h-24">
                  <img
                    src={p.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded bg-black/60">
                    <p.Icon className="h-3 w-3 text-white" />
                  </span>
                  {p.packageName && (
                    <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-semibold text-white">
                      {p.platform}
                    </span>
                  )}
                </div>
                <div className="p-1.5">
                  <div className="truncate text-[11px] font-semibold">{p.contentLabel}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {p.packageName ? p.platform : p.aspect}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {sentPosts.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", p.id)}
                onDoubleClick={() => p.packageDetail && setOpenEntry(p)}
                title={p.packageName ? "Double-click to see what's in this package" : undefined}
                className="flex cursor-grab items-center gap-2 rounded-lg border border-border bg-card p-2 transition hover:border-primary active:cursor-grabbing"
              >
                <img src={p.image} alt="" className="h-9 w-9 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold">
                    {p.platform} · {p.contentLabel}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {p.packageName
                      ? "Package · double-click for details"
                      : `${p.aspect} · ${p.w}×${p.h}`}
                  </div>
                </div>
                <p.Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Package entry detail (double-click a calendar-sidebar package) */}
      {openEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setOpenEntry(null)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenEntry(null)}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <img src={openEntry.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <div className="min-w-0">
                <div className="truncate text-base font-bold">{openEntry.packageName}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <openEntry.Icon className="h-3.5 w-3.5" /> {openEntry.platform}
                </div>
              </div>
            </div>
            {[
              {
                label: "Captions / Scripts / Headlines",
                items: openEntry.packageDetail?.captions ?? [],
              },
              { label: "Hashtags", items: openEntry.packageDetail?.tags ?? [] },
              { label: "Campaign concepts", items: openEntry.packageDetail?.campaigns ?? [] },
            ].map((sec) => (
              <div key={sec.label} className="mt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {sec.label}
                </div>
                {sec.items.length === 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground/70">None</p>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {sec.items.map((it, i) => (
                      <li key={i} className="rounded-lg bg-secondary px-2.5 py-1.5 text-xs">
                        {it}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN — the week */}
      <div className="min-w-0 flex-1 px-8 py-8">
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
            <div
              key={d}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => dropOnDay(d, e)}
              className="glass-card flex min-h-[280px] flex-col rounded-2xl p-3 transition"
            >
              <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {d}
                </span>
                <span className="text-lg font-semibold">{18 + i}</span>
              </div>
              <div className="space-y-2">
                {calendar[d]?.map((p, idx) => (
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
                ))}

                {/* Posts dragged in from the sidebar */}
                {scheduled[d]?.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-lg border border-primary/40 bg-primary/5 p-2 transition hover:border-primary"
                  >
                    <div className="flex gap-2">
                      <img
                        src={p.image}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-md object-cover"
                      />
                      <p className="line-clamp-2 text-[11px] leading-snug text-foreground/90">
                        {p.headline}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                      <p.Icon className="h-3 w-3" />
                      {p.platform} · {p.contentLabel} · {p.aspect}
                    </div>
                  </div>
                ))}

                {!calendar[d]?.length && !scheduled[d]?.length && (
                  <div className="grid h-20 place-items-center rounded-lg border border-dashed border-border text-[11px] text-muted-foreground">
                    Drop a post here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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
