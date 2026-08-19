import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { ComposerSeed, View } from "@/routes/index";
import { TrendingIdeas } from "./TrendingIdeas";
import { BrainstormPanel } from "./BrainstormPanel";
import { CampaignSection } from "./CampaignSection";
import { ideaToPrefillText, type IdeaSeed, type PrefillIdea, type TrendIdea } from "./mock-data";
import {
  generateCampaign,
  generatePostCaption,
  regenerateForDuration,
  regeneratePost,
  type Campaign,
  type CampaignContext,
  type CampaignDuration,
  type CampaignGoal,
  type CampaignPost,
} from "./campaign-data";
import { PLACEHOLDER_IDEA_THUMB } from "./mock-data";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function AiIdeaEngine({
  navigate,
  campaign,
  setCampaign,
}: {
  navigate: (v: View, seed?: ComposerSeed) => void;
  // Lifted to the app root so the campaign survives navigating to the Composer
  // and back within the session (spec §14).
  campaign: Campaign | null;
  setCampaign: (c: Campaign | null) => void;
}) {
  const [lastIdea, setLastIdea] = useState<IdeaSeed | null>(null);
  const [prefillIdea, setPrefillIdea] = useState<PrefillIdea | null>(null);
  const [generating, setGenerating] = useState(false);
  const brainstormRef = useRef<HTMLDivElement>(null);
  const campaignRef = useRef<HTMLDivElement>(null);

  const backToComposer = () => navigate("composer", lastIdea ?? undefined);

  // Single path to the Composer, carrying hashtags (→ hashtag dropdown) and,
  // when present, the campaign (→ Campaign Options dropdown). Spec §11.
  const sendToComposer = (payload: {
    caption: string;
    title: string;
    thumbnail: string;
    hashtags?: string[];
    campaign?: Campaign;
  }) => {
    const seed: ComposerSeed = {
      caption: payload.caption,
      title: payload.title,
      thumbnail: payload.thumbnail,
      hashtags: payload.hashtags,
      campaign: payload.campaign,
    };
    setLastIdea({ caption: payload.caption, title: payload.title, thumbnail: payload.thumbnail });
    navigate("composer", seed);
  };

  const handleSelectIdea = (idea: TrendIdea) => {
    setPrefillIdea({
      text: ideaToPrefillText(idea),
      hashtags: idea.hashtags,
      nonce: Date.now(),
      category: idea.category,
      title: idea.title,
    });
    brainstormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // "Make a Marketing Campaign" — generate from the session and scroll down.
  const handleMakeCampaign = (ctx: CampaignContext) => {
    setGenerating(true);
    campaignRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      setCampaign(generateCampaign(ctx, "1 Week"));
      setGenerating(false);
    }, 1400);
  };

  const changeDuration = (d: CampaignDuration) => {
    if (!campaign) return;
    setCampaign(regenerateForDuration(campaign, d));
  };

  const overrideGoal = (g: CampaignGoal) => {
    if (!campaign) return;
    setCampaign({ ...campaign, goal: g });
  };

  const writeCaption = (postId: string) => {
    if (!campaign) return;
    setCampaign({
      ...campaign,
      posts: campaign.posts.map((p) =>
        p.id === postId ? { ...p, caption: generatePostCaption(campaign, p) } : p,
      ),
    });
  };

  const regenerateOnePost = (postId: string) => {
    if (!campaign) return;
    const fresh = regeneratePost(campaign, postId);
    setCampaign({
      ...campaign,
      posts: campaign.posts.map((p) => (p.id === postId ? fresh : p)),
    });
  };

  const sendPost = (post: CampaignPost) => {
    if (!campaign) return;
    const caption = post.caption ?? generatePostCaption(campaign, post);
    sendToComposer({
      caption,
      title: post.title,
      thumbnail: PLACEHOLDER_IDEA_THUMB,
      hashtags: post.hashtags.length ? post.hashtags : campaign.hashtags,
      campaign,
    });
  };

  const sendCampaign = () => {
    if (!campaign) return;
    sendToComposer({
      caption: campaign.sourceCaption || campaign.coreMessage,
      title: campaign.name,
      thumbnail: PLACEHOLDER_IDEA_THUMB,
      hashtags: campaign.hashtags,
      campaign,
    });
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
          <BrainstormPanel
            prefillIdea={prefillIdea}
            onSendToComposer={(seed, hashtags) => sendToComposer({ ...seed, hashtags })}
            onMakeCampaign={handleMakeCampaign}
          />
        </div>
        <div ref={campaignRef}>
          <CampaignSection
            campaign={campaign}
            generating={generating}
            onChangeDuration={changeDuration}
            onOverrideGoal={overrideGoal}
            onWriteCaption={writeCaption}
            onRegeneratePost={regenerateOnePost}
            onSendPost={sendPost}
            onSendCampaign={sendCampaign}
          />
        </div>
      </div>
    </div>
  );
}
