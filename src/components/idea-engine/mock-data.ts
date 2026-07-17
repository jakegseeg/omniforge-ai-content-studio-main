// ---------- AI IDEA ENGINE: TYPES ----------
export type TrendIdea = {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};

// Structurally matches the app's ComposerSeed (src/routes/index.tsx) so it can
// be handed straight to navigate("composer", seed) without extra mapping.
export type IdeaSeed = {
  caption: string;
  thumbnail: string;
  title: string;
};

export const PLACEHOLDER_IDEA_THUMB =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300";

// A trend/similar idea the user clicked, to prefill the brainstorm input.
// `nonce` makes every selection distinct so re-clicking the same idea still
// re-triggers the prefill effect.
export type PrefillIdea = {
  text: string;
  nonce: number;
};

export function ideaToPrefillText(idea: TrendIdea): string {
  return `${idea.title}: ${idea.description}`;
}

// ---------- TRENDING IDEAS ----------
// Backend integration point: replace with a scheduled AI request that returns
// today's trend set. For now we rotate through a realistic placeholder pool.
const TREND_POOL: TrendIdea[] = [
  {
    id: "fifa-world-cup",
    title: "FIFA World Cup 2026",
    description:
      "World Cup match highlights, fan cams, and goal reels flood every feed daily.",
    hashtags: ["#WorldCup", "#Ronaldo", "#WorldCupHighlights"],
  },
  {
    id: "ai-generated-content",
    title: "AI Generated Content",
    description:
      "AI-generated artwork, editing workflows, and productivity tools inspire users everywhere.",
    hashtags: ["#AIGeneratedContent", "#AIArt", "#AITools"],
  },
  {
    id: "summer-travel",
    title: "Summer Travel 2026",
    description:
      "Travelers share destination guides, hidden gems, and unforgettable summer experiences worldwide.",
    hashtags: ["#Summer2026", "#TravelTok", "#VacationMode"],
  },
  {
    id: "booktok",
    title: "BookTok",
    description: "Readers recommend emotional favorites and monthly reads through short-form videos.",
    hashtags: ["#BookTok", "#CurrentlyReading", "#BookRec"],
  },
  {
    id: "healthy-recipes",
    title: "Healthy Recipes",
    description: "Easy meal prep, nutritious recipes, and high-protein cooking videos dominate food feeds.",
    hashtags: ["#HealthyRecipes", "#MealPrep", "#HighProtein"],
  },
  {
    id: "tech-reviews",
    title: "Tech Reviews",
    description: "Creators review smartphones, gadgets, laptops, and innovative new technology.",
    hashtags: ["#TechReviews", "#TechTok", "#Gadgets"],
  },
  {
    id: "small-biz-automation",
    title: "Small Business Automation",
    description: "Founders share the tools and workflows saving them hours every week.",
    hashtags: ["#SmallBiz", "#Automation", "#Productivity"],
  },
  {
    id: "sustainable-living",
    title: "Sustainable Living",
    description: "Eco swaps, zero-waste hacks, and thrifted fashion hauls keep gaining traction.",
    hashtags: ["#Sustainability", "#EcoFriendly", "#ThriftFlip"],
  },
  {
    id: "remote-work",
    title: "Remote Work Setups",
    description: "Desk tours, productivity hacks, and hybrid-work debates trend across every platform.",
    hashtags: ["#RemoteWork", "#DeskSetup", "#WFH"],
  },
  {
    id: "fitness-challenges",
    title: "Fitness Challenges",
    description: "30-day challenges and quick home workouts drive some of the highest completion rates.",
    hashtags: ["#FitnessChallenge", "#HomeWorkout", "#30DayChallenge"],
  },
  {
    id: "personal-finance",
    title: "Personal Finance Tips",
    description: "Budgeting hacks, side-hustle breakdowns, and investing basics resonate with young audiences.",
    hashtags: ["#PersonalFinance", "#MoneyTips", "#SideHustle"],
  },
  {
    id: "pet-content",
    title: "Pet Content",
    description: "Rescue stories, training tips, and everyday pet moments consistently outperform other niches.",
    hashtags: ["#PetsOfInstagram", "#DogTok", "#RescueStory"],
  },
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Simulated AI trend generation — called on manual refresh and on the mocked
// midnight schedule. Swap this out for a real backend/AI call later.
export function generateTrends(count = 9): TrendIdea[] {
  return shuffle(TREND_POOL)
    .slice(0, count)
    .map((t) => ({ ...t, id: `${t.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }));
}

export const INITIAL_TRENDS: TrendIdea[] = TREND_POOL.slice(0, 9);

// Simulated "related ideas" generation for a single trend. Swap this out for
// a real backend/AI call later.
export function generateSimilarIdeas(trend: TrendIdea): TrendIdea[] {
  const angles = [
    "Behind-the-scenes look",
    "Beginner-friendly breakdown",
    "Myth-busting explainer",
    "Before-and-after story",
    "Expert Q&A format",
    "Community poll or challenge",
  ];
  return angles.map((angle, i) => ({
    id: `${trend.id}-similar-${i}`,
    title: `${angle}: ${trend.title}`,
    description: `${angle} take on "${trend.title}" — tailored for fast, scroll-stopping engagement.`,
    hashtags: trend.hashtags,
  }));
}

// ---------- BRAINSTORM GOALS ----------
// Order matches the client spec exactly (intentionally not reusing the
// differently-ordered CAMPAIGN_GOALS constant used elsewhere in the app).
export const GOAL_OPTIONS = [
  "Effective Advertisement",
  "Marketing Campaign",
  "Raise Awareness",
  "Product Launch",
  "Lead Generation",
  "Brand Retention",
] as const;

export type Goal = (typeof GOAL_OPTIONS)[number];

// ---------- MOCK CHAT ----------
// Backend integration point: everything below stands in for a real LLM call.
// Replace GOAL_RATIONALE / FOLLOW_UP_QUESTIONS / IMPROVEMENT_SUGGESTIONS and
// the turn-taking logic in BrainstormPanel with an actual API request.
export const GOAL_RATIONALE: Record<Goal, string> = {
  "Effective Advertisement":
    "it leads with a clear hook and a single call to action, which is exactly what performs best in paid placements",
  "Marketing Campaign":
    "it gives you a strong anchor concept you can spin across multiple posts and platforms over a few weeks",
  "Raise Awareness":
    "it's built to be easy to share and instantly understandable, which is what drives reach over conversions",
  "Product Launch":
    "it creates curiosity before revealing the payoff, which is the classic pattern for launch-day momentum",
  "Lead Generation":
    "it gives people a clear reason to tap through and leave their info, rather than just scroll past",
  "Brand Retention":
    "it reinforces your existing voice and keeps current followers engaged between bigger campaign pushes",
};

export const IMPROVEMENT_SUGGESTIONS: string[] = [
  "Tighten the opening line so the hook lands in the first two seconds.",
  "Add a concrete number or stat — specificity tends to boost credibility fast.",
  "Close with a direct call to action so viewers know exactly what to do next.",
  "Consider a native format for the platform (Reel, carousel, or thread) instead of a static post.",
  "Lean into a relatable pain point before introducing the solution.",
  "Try a bolder, higher-contrast thumbnail or cover frame to stop the scroll.",
];

export const FOLLOW_UP_QUESTIONS: string[] = [
  "What platform are you most focused on for this — Instagram, TikTok, LinkedIn, or somewhere else?",
  "Who's the primary audience you're picturing for this post?",
  "Is there a specific call to action you want people to take?",
  "Do you have any brand voice or style guidelines I should keep in mind?",
  "Should this be a one-off post, or part of a bigger series?",
  "Is there a visual or format you already have in mind (video, carousel, single image)?",
];

const CLOSING_MESSAGES: string[] = [
  "I think we've landed on a solid direction here — want me to send this over to the Composer so you can start building it out?",
  "This is shaping up nicely. Ready to send it to Composer, or is there anything else you'd like to refine first?",
];

let closingIndex = 0;
export function nextClosingMessage(): string {
  const msg = CLOSING_MESSAGES[closingIndex % CLOSING_MESSAGES.length];
  closingIndex++;
  return msg;
}

// Cheap "listening" veneer — echoes a keyword from the user's message.
export function pickEchoWord(text: string): string | null {
  const words = text
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 4);
  if (!words.length) return null;
  return words[Math.floor(Math.random() * words.length)];
}

export function firstAiReply(userIdea: string, goal: Goal): string {
  const rationale = GOAL_RATIONALE[goal];
  const improvement = IMPROVEMENT_SUGGESTIONS[Math.floor(Math.random() * IMPROVEMENT_SUGGESTIONS.length)];
  return `That's a strong direction for ${goal.toLowerCase()}. Here's how it lands: ${rationale}. One thing I'd tighten up — ${improvement.toLowerCase()} Want me to sketch a follow-up angle, or do you have questions about the approach?`;
}
