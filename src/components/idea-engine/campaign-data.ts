// ---------- MARKETING CAMPAIGN: TYPES + MOCK GENERATOR ----------
// Backend integration point: every generator below stands in for a real LLM
// request. The *logic* (not the copy) follows the campaign-research findings:
// one core message carried across many buying moments (Ehrenberg-Bass CEPs),
// a Trend Window / Evergreen split built on the trend's durable insight,
// Campaign Codes for continuity, 60/40 brand-vs-activation by duration, and
// post counts sized to real platform cadence rather than to the calendar.

import type { Goal } from "./mock-data";

export type CampaignDuration = "1 Week" | "2 Weeks" | "1 Month";

export const CAMPAIGN_DURATIONS: CampaignDuration[] = ["1 Week", "2 Weeks", "1 Month"];

// Inferred campaign goals (shown as an editable pill; not asked up front).
export const CAMPAIGN_GOAL_OPTIONS = [
  "Awareness",
  "Engagement",
  "Product discovery",
  "Website traffic",
  "Lead generation",
  "Sales/conversions",
  "Product launch",
  "Event promotion",
  "Community growth",
  "Brand positioning",
] as const;
export type CampaignGoal = (typeof CAMPAIGN_GOAL_OPTIONS)[number];

export type PostFormat =
  | "Feed post"
  | "Carousel"
  | "Reel"
  | "Short-form video"
  | "Story"
  | "Educational"
  | "Behind-the-scenes"
  | "UGC"
  | "Testimonial"
  | "Poll/question"
  | "Before/after"
  | "Tutorial"
  | "List/tips";

export type CampaignPost = {
  id: string;
  position: string; // "Day 1" / "Week 2 · Post 3"
  title: string;
  phase: "Trend Window" | "Evergreen";
  type: "BRAND" | "ACTIVATION";
  buyingMoment: string;
  purpose: string;
  hook: string;
  format: PostFormat;
  creativeDirection: string;
  asset: string;
  cta: string;
  hashtags: string[];
  keywords: string[];
  platforms: string[];
  connection: string;
  timeSensitive: boolean;
  openSlot: boolean;
  caption?: string; // generated on demand
};

export type ShootSession = { label: string; minutes: number; covers: number[] };
export type Kpi = { metric: string; target: string };

export type Campaign = {
  id: string;
  createdAt: number;
  // Source context inherited from the Idea Engine session.
  sourceTrend: string;
  sourceCategory: string;
  sourceCaption: string;
  brandContext: string;
  // Strategy.
  name: string;
  concept: string;
  goal: CampaignGoal;
  audience: string;
  coreHook: string;
  coreMessage: string;
  cta: string;
  style: string;
  durableInsight: string;
  fitCheck: string;
  buyingMoments: string[];
  codes: string[];
  assumptions: string;
  // Structure.
  duration: CampaignDuration;
  brandPct: number;
  activationPct: number;
  posts: CampaignPost[];
  shoots: ShootSession[];
  graphicsCount: number;
  hashtags: string[];
  keywords: string[];
  kpis: Kpi[];
  checkInDay: string;
  ifNotWorking: string;
};

// The full session handed to the generator when "Make a Marketing Campaign"
// is clicked — the user never retypes anything.
export type CampaignContext = {
  trendTitle: string;
  category: string;
  hook: string;
  brainstorm: string;
  aiResponse: string;
  caption: string;
  hashtags: string[];
  goal: Goal;
  brandContext?: string;
};

// ---------- POOLS ----------
// Buying moments are about the *buyer* (Ehrenberg-Bass CEPs), so we key them
// off the trend category and fall back to universal moments.
const MOMENTS_BY_CATEGORY: Record<string, string[]> = {
  Food: [
    "the Sunday-night meal-prep scramble",
    "the 6pm 'what's for dinner' blank",
    "hosting friends on short notice",
    "packing lunches before work",
    "the post-gym protein craving",
    "a lazy weekend brunch at home",
  ],
  "Health & Wellness": [
    "the Monday 'this week I restart' moment",
    "squeezing a workout into a packed day",
    "the 3pm energy crash",
    "recovering after a stressful week",
    "wanting results without the gym",
    "building a habit that finally sticks",
  ],
  "AI & Tech": [
    "drowning in repetitive busywork",
    "trying a tool before a big deadline",
    "explaining new tech to a skeptical team",
    "upgrading an outdated workflow",
    "researching what to actually buy",
    "keeping up when everything changes weekly",
  ],
  Business: [
    "the founder doing everything alone",
    "losing hours to manual work",
    "onboarding a first hire",
    "chasing the next month of revenue",
    "deciding what to automate first",
    "proving ROI to a nervous boss",
  ],
  Travel: [
    "the pre-trip planning rabbit hole",
    "booking a last-minute getaway",
    "the 'I need a break' Sunday scroll",
    "packing the night before a flight",
    "finding something to do in a new city",
    "saving for the big trip of the year",
  ],
  Finance: [
    "the payday 'where did it go' moment",
    "setting up a first budget",
    "deciding to start investing",
    "cutting a subscription you forgot about",
    "planning for a big purchase",
    "the end-of-month money check-in",
  ],
  "Work & Careers": [
    "the Sunday-scaries before the week",
    "setting up a productive workspace",
    "asking for the raise",
    "switching to a new role",
    "protecting focus in a noisy day",
    "building a personal brand after hours",
  ],
  Sports: [
    "game day with friends",
    "getting back into training",
    "gearing up for the new season",
    "the highlight everyone's replaying",
    "picking a team to follow",
    "the pre-match hype",
  ],
  Sustainability: [
    "the first swap toward less waste",
    "decluttering with a conscience",
    "shopping second-hand on purpose",
    "cutting single-use out of a routine",
    "explaining why it matters to family",
    "a small change that actually sticks",
  ],
  Entertainment: [
    "the 'what do I read/watch next' gap",
    "the group-chat recommendation ask",
    "a cozy night in",
    "finishing something and needing more",
    "sharing a favorite with a friend",
    "the weekend binge decision",
  ],
  Lifestyle: [
    "resetting a space that feels off",
    "a small upgrade to the daily routine",
    "treating yourself after a long week",
    "getting organized before a busy season",
    "the 'new season, new me' moment",
    "sharing a slice of everyday life",
  ],
};

const GENERIC_MOMENTS = [
  "the moment they first feel the problem",
  "when a friend asks for a recommendation",
  "the deadline that forces a decision",
  "the quiet Sunday-night scroll",
  "when the old way finally breaks",
  "the 'treat myself' moment after a hard week",
];

const FORMAT_LIBRARY: PostFormat[] = [
  "Reel",
  "Carousel",
  "Feed post",
  "Behind-the-scenes",
  "Educational",
  "UGC",
  "Testimonial",
  "Before/after",
  "Tutorial",
  "List/tips",
  "Poll/question",
  "Short-form video",
];

const KPIS_BY_GOAL: Record<string, Kpi[]> = {
  Awareness: [
    { metric: "Reach", target: "aim for 2× your usual post" },
    { metric: "Video views", target: "aim for 1.5× your recent average" },
    { metric: "Impressions", target: "beat your best week this month" },
  ],
  Engagement: [
    { metric: "Saves", target: "aim for 2× your usual post" },
    { metric: "Comments", target: "aim for 1.5× your average" },
    { metric: "Shares", target: "beat your last campaign" },
  ],
  "Website traffic": [
    { metric: "Link clicks", target: "aim for 2× your usual post" },
    { metric: "Site visits", target: "beat last week's total" },
    { metric: "Profile taps", target: "aim for 1.5× your average" },
  ],
  "Lead generation": [
    { metric: "Sign-ups", target: "aim for 1.5× your usual week" },
    { metric: "DMs / inquiries", target: "double your typical week" },
    { metric: "Form submissions", target: "beat your best day this month" },
  ],
  "Sales/conversions": [
    { metric: "Purchases", target: "aim for 1.5× a normal week" },
    { metric: "Conversion rate", target: "hold or beat your baseline" },
    { metric: "Revenue", target: "beat the last comparable week" },
  ],
};

function kpisForGoal(goal: CampaignGoal): Kpi[] {
  if (KPIS_BY_GOAL[goal]) return KPIS_BY_GOAL[goal];
  if (goal === "Product discovery" || goal === "Product launch") return KPIS_BY_GOAL["Awareness"];
  if (goal === "Community growth") return KPIS_BY_GOAL["Engagement"];
  if (goal === "Event promotion") return KPIS_BY_GOAL["Website traffic"];
  return KPIS_BY_GOAL["Engagement"];
}

// Map the brainstorm's Goal onto an inferred campaign goal.
const GOAL_MAP: Record<Goal, CampaignGoal> = {
  "Effective Advertisement": "Sales/conversions",
  "Marketing Campaign": "Brand positioning",
  "Raise Awareness": "Awareness",
  "Product Launch": "Product launch",
  "Lead Generation": "Lead generation",
  "Brand Retention": "Community growth",
};

// Per-duration jobs (campaign-research §2): different mix, not just more posts.
const DURATION_PLAN: Record<
  CampaignDuration,
  { posts: number; brandPct: number; trendWindow: number; openSlots: number; weeks: number }
> = {
  "1 Week": { posts: 4, brandPct: 30, trendWindow: 2, openSlots: 1, weeks: 1 },
  "2 Weeks": { posts: 8, brandPct: 50, trendWindow: 2, openSlots: 2, weeks: 2 },
  "1 Month": { posts: 14, brandPct: 60, trendWindow: 2, openSlots: 4, weeks: 4 },
};

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
function titleCaseTopic(trend: string): string {
  return trend.replace(/\s*\d{4}$/, "").trim();
}

// A short, human durable-insight under the trend (research §5, Step 1).
function deriveDurableInsight(topic: string, category: string): string {
  const map: Record<string, string> = {
    Food: "people want to eat well without the time or effort it usually takes",
    "Health & Wellness": "people want to feel better without overhauling their whole life",
    "AI & Tech": "people want to save time and look sharp without becoming an expert",
    Business: "people want to grow without hiring or burning out",
    Travel: "people want a break and a story worth telling",
    Finance: "people want to feel in control of their money without shame",
    "Work & Careers": "people want to do good work without it eating their life",
    Sports: "people want to belong to a moment bigger than themselves",
    Sustainability: "people want to do the right thing without it being hard or preachy",
    Entertainment: "people want the next thing that makes them feel something",
    Lifestyle: "people want small upgrades that make everyday life feel better",
  };
  return (
    map[category] ??
    `people care about ${topic.toLowerCase()} because it touches something real in their day`
  );
}

function buyingMomentsFor(category: string): string[] {
  const base = MOMENTS_BY_CATEGORY[category] ?? GENERIC_MOMENTS;
  // 5–8 moments, filtered/prioritised (research §3, three Cs). Mock: take up to 7.
  return base.slice(0, Math.min(7, base.length));
}

// Build the campaign hashtag from the topic, plus a tiered 5–8 set (research §7).
function buildHashtags(topic: string, source: string[]): { campaignTag: string; set: string[] } {
  const slug = topic.replace(/[^a-zA-Z0-9]/g, "");
  const campaignTag = `#${slug}Campaign`;
  const brandTag = "#OmniForge";
  const trendTags = source.slice(0, 4);
  const set = [campaignTag, brandTag, ...trendTags].filter((t, i, a) => a.indexOf(t) === i);
  return { campaignTag, set: set.slice(0, 8) };
}

function captionKeywords(topic: string, category: string): string[] {
  const t = topic.toLowerCase();
  const pools: Record<string, string[]> = {
    Food: [`easy ${t}`, "quick dinner ideas", "meal prep for the week", "high protein recipes"],
    "AI & Tech": [
      `${t} for beginners`,
      "save time at work",
      "best AI tools 2026",
      "automate busywork",
    ],
    Business: [
      "grow a small business",
      "automate your workflow",
      "solo founder tips",
      "do more with less",
    ],
    Travel: [`${t} guide`, "hidden travel gems", "weekend getaway ideas", "budget travel tips"],
    Finance: ["how to budget", "start investing", "money habits that work", "save more each month"],
  };
  const generic = [
    `${t} explained`,
    `why ${t} matters`,
    "how to get started",
    "what to know first",
  ];
  return (pools[category] ?? generic).slice(0, 4);
}

function campaignCodes(topic: string, hook: string, campaignTag: string): string[] {
  return [
    `Repeated line: "${(hook || topic).slice(0, 40)}"`,
    "Visual signature: same warm open shot every post",
    "Format signature: 2-second hook before anything else",
    `Campaign hashtag: ${campaignTag}`,
  ];
}

function fitCheck(topic: string, category: string): string {
  return `${topic} fits a ${category.toLowerCase()} voice and reads as genuine rather than forced. Watch that it doesn't look like bandwagon-jumping — lead with your own angle, not the format. The trend is still fresh, so move in the first 24–48 hours before it saturates.`;
}

// Assign BRAND/ACTIVATION to hit the duration ratio, front-loading activation
// in the Trend Window (research §2 + §5).
function assignTypes(
  count: number,
  brandPct: number,
  trendWindow: number,
): ("BRAND" | "ACTIVATION")[] {
  const brandCount = Math.round((count * brandPct) / 100);
  const types: ("BRAND" | "ACTIVATION")[] = [];
  let brandLeft = brandCount;
  let actLeft = count - brandCount;
  for (let i = 0; i < count; i++) {
    // Trend Window rides the live trend → activation-leaning.
    if (i < trendWindow && actLeft > 0) {
      types.push("ACTIVATION");
      actLeft--;
    } else if (brandLeft >= actLeft && brandLeft > 0) {
      types.push("BRAND");
      brandLeft--;
    } else if (actLeft > 0) {
      types.push("ACTIVATION");
      actLeft--;
    } else {
      types.push("BRAND");
      brandLeft--;
    }
  }
  return types;
}

function makePost(
  i: number,
  moment: string,
  phase: "Trend Window" | "Evergreen",
  type: "BRAND" | "ACTIVATION",
  ctx: { topic: string; coreMessage: string; cta: string; hashtags: string[]; keywords: string[] },
  weeks: number,
  postsPerWeek: number,
): CampaignPost {
  const format = FORMAT_LIBRARY[i % FORMAT_LIBRARY.length];
  const week = Math.floor(i / Math.max(1, postsPerWeek)) + 1;
  const position = weeks > 1 ? `Week ${week} · Post ${i + 1}` : `Day ${i + 1}`;
  return {
    id: uid("post"),
    position,
    title: type === "ACTIVATION" ? `Meet them in ${moment}` : `The story behind ${moment}`,
    phase,
    type,
    buyingMoment: moment,
    purpose:
      type === "ACTIVATION"
        ? `Turn ${moment} into a reason to act now.`
        : `Build the association between your brand and ${moment}.`,
    hook:
      phase === "Trend Window"
        ? `Ride the trend while it's live — open on ${moment}.`
        : `Open on ${moment} — the feeling that outlasts the trend.`,
    format,
    creativeDirection:
      format === "Carousel"
        ? `3–5 frames walking through ${moment}, ending on the payoff.`
        : format === "Before/after"
          ? `Show ${moment} before, then the calmer after your product creates.`
          : `Shoot the real ${moment} in one take, warm natural light, quick cut to the payoff.`,
    asset: format === "Carousel" ? "Graphic set" : "Short video / photo",
    cta: ctx.cta,
    hashtags: ctx.hashtags.slice(0, 6),
    keywords: ctx.keywords,
    platforms: ["Instagram"],
    connection: `Same core message ("${ctx.coreMessage.slice(0, 48)}…") aimed at a new moment.`,
    timeSensitive: phase === "Trend Window",
    openSlot: false,
  };
}

function openSlotPost(weekIndex: number): CampaignPost {
  return {
    id: uid("slot"),
    position: `Week ${weekIndex + 1} · Open slot`,
    title: "Open slot — leave this for a live trend",
    phase: "Evergreen",
    type: "ACTIVATION",
    buyingMoment: "whatever's trending that week",
    purpose: "Reactive space the pros always leave open — fill it live, don't pre-plan it.",
    hook: "",
    format: "Reel",
    creativeDirection: "Keep empty until something worth reacting to shows up.",
    asset: "None (reactive)",
    cta: "",
    hashtags: [],
    keywords: [],
    platforms: ["Instagram"],
    connection: "Keeps the campaign feeling alive instead of pre-canned.",
    timeSensitive: false,
    openSlot: true,
  };
}

export function generateCampaign(
  ctx: CampaignContext,
  duration: CampaignDuration = "1 Week",
  keep?: Partial<
    Pick<
      Campaign,
      | "id"
      | "name"
      | "concept"
      | "goal"
      | "coreMessage"
      | "codes"
      | "createdAt"
      | "hashtags"
      | "keywords"
    >
  >,
): Campaign {
  const topic = titleCaseTopic(ctx.trendTitle || "Your Trend");
  const goal = keep?.goal ?? GOAL_MAP[ctx.goal] ?? "Awareness";
  const plan = DURATION_PLAN[duration];
  const moments = buyingMomentsFor(ctx.category);
  const built = buildHashtags(topic, ctx.hashtags);
  const campaignTag = built.campaignTag;
  // Preserve the tiered hashtags/keywords across a duration change so re-tiering
  // an already-tiered set can't shrink or drop tags.
  const hashtags = keep?.hashtags ?? built.set;
  const keywords = keep?.keywords ?? captionKeywords(topic, ctx.category);
  const coreMessage =
    keep?.coreMessage ?? `${topic} should feel effortless — and we make that moment easier.`;
  const cta = "Tap the link in bio to see how.";
  const durableInsight = deriveDurableInsight(topic, ctx.category);

  const types = assignTypes(plan.posts, plan.brandPct, plan.trendWindow);
  const postsPerWeek = Math.ceil(plan.posts / plan.weeks);

  const posts: CampaignPost[] = [];
  for (let i = 0; i < plan.posts; i++) {
    const moment = moments[i % moments.length];
    const phase: "Trend Window" | "Evergreen" = i < plan.trendWindow ? "Trend Window" : "Evergreen";
    posts.push(
      makePost(
        i,
        moment,
        phase,
        types[i],
        { topic, coreMessage, cta, hashtags, keywords },
        plan.weeks,
        postsPerWeek,
      ),
    );
  }
  // Reserve 1–2 reactive open slots per week (research §6).
  for (let w = 0; w < plan.weeks && posts.filter((p) => p.openSlot).length < plan.openSlots; w++) {
    posts.push(openSlotPost(w));
  }

  // Group real posts into shoot sessions with reuse (research §7).
  const realIdx = posts.map((p, i) => (p.openSlot ? -1 : i)).filter((i) => i >= 0);
  const shoots: ShootSession[] = [];
  const chunk = Math.ceil(realIdx.length / 2);
  if (realIdx.length) {
    shoots.push({
      label: "Shoot 1",
      minutes: 20,
      covers: realIdx.slice(0, chunk).map((i) => i + 1),
    });
    if (realIdx.length > chunk)
      shoots.push({
        label: "Shoot 2",
        minutes: 30,
        covers: realIdx.slice(chunk).map((i) => i + 1),
      });
  }
  const graphicsCount = posts.filter((p) => p.asset === "Graphic set").length;

  return {
    id: keep?.id ?? uid("campaign"),
    createdAt: keep?.createdAt ?? Date.now(),
    sourceTrend: ctx.trendTitle,
    sourceCategory: ctx.category,
    sourceCaption: ctx.caption,
    brandContext: ctx.brandContext ?? "",
    name: keep?.name ?? `${topic}, Everyday`,
    concept:
      keep?.concept ??
      `Take the ${topic} moment everyone's watching and attach it to the small, real situations your buyers already live in — so the trend becomes a reason to remember you, not just a post.`,
    goal,
    audience: `People who feel ${durableInsight.replace(/^people /, "")} — reachable through the ${ctx.category.toLowerCase()} conversation happening right now.`,
    coreHook: ctx.hook || `${topic}: the part nobody's talking about.`,
    coreMessage,
    cta,
    style: "Warm, plain-spoken, human. Feeling first, features second. Made to be shot on a phone.",
    durableInsight,
    fitCheck: fitCheck(topic, ctx.category),
    buyingMoments: moments,
    codes: keep?.codes ?? campaignCodes(topic, ctx.hook, campaignTag),
    assumptions: ctx.brandContext
      ? ""
      : "No brand profile on file — assumed a small brand posting mainly to Instagram. Add what you sell to sharpen this.",
    duration,
    brandPct: plan.brandPct,
    activationPct: 100 - plan.brandPct,
    posts,
    shoots,
    graphicsCount,
    hashtags,
    keywords,
    kpis: kpisForGoal(goal),
    checkInDay: plan.weeks >= 4 ? "Day 14" : plan.weeks === 2 ? "Day 7" : "Day 4",
    ifNotWorking:
      "If saves and shares are flat by the check-in, swap the next post's format to a Reel and lead harder on the feeling, not the product.",
  };
}

// Change duration but preserve identity (research §14 / spec §10).
export function regenerateForDuration(campaign: Campaign, duration: CampaignDuration): Campaign {
  const ctx: CampaignContext = {
    trendTitle: campaign.sourceTrend,
    category: campaign.sourceCategory,
    hook: campaign.coreHook,
    brainstorm: "",
    aiResponse: "",
    caption: campaign.sourceCaption,
    hashtags: campaign.hashtags,
    goal: "Marketing Campaign",
    brandContext: campaign.brandContext,
  };
  return generateCampaign(ctx, duration, {
    id: campaign.id,
    name: campaign.name,
    concept: campaign.concept,
    goal: campaign.goal,
    coreMessage: campaign.coreMessage,
    codes: campaign.codes,
    createdAt: campaign.createdAt,
    hashtags: campaign.hashtags,
    keywords: campaign.keywords,
  });
}

// Regenerate a single post without touching the rest (spec §10 / §14).
export function regeneratePost(campaign: Campaign, postId: string): CampaignPost {
  const idx = campaign.posts.findIndex((p) => p.id === postId);
  const old = campaign.posts[idx];
  if (!old || old.openSlot) return old;
  const moment =
    rand(campaign.buyingMoments.filter((m) => m !== old.buyingMoment)) ?? old.buyingMoment;
  const fresh = makePost(
    idx,
    moment,
    old.phase,
    old.type,
    {
      topic: titleCaseTopic(campaign.sourceTrend),
      coreMessage: campaign.coreMessage,
      cta: campaign.cta,
      hashtags: campaign.hashtags,
      keywords: campaign.keywords,
    },
    campaign.duration === "1 Week" ? 1 : campaign.duration === "2 Weeks" ? 2 : 4,
    Math.ceil(
      campaign.posts.filter((p) => !p.openSlot).length /
        (campaign.duration === "1 Month" ? 4 : campaign.duration === "2 Weeks" ? 2 : 1),
    ),
  );
  return { ...fresh, id: old.id, position: old.position };
}

// Full caption for one post — generated on demand (research pushback / spec §9).
export function generatePostCaption(campaign: Campaign, post: CampaignPost): string {
  const opener = post.hook || `About ${post.buyingMoment}…`;
  const body = `${campaign.coreMessage} You know ${post.buyingMoment} — that's exactly where this fits.`;
  const cta = post.cta || campaign.cta;
  const tags = (post.hashtags.length ? post.hashtags : campaign.hashtags).slice(0, 6).join(" ");
  return `${opener}\n\n${body}\n\n${cta}\n\n${tags}`;
}
