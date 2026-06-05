export type Role = "public" | "curator" | "judge" | "admin";

export type ChallengeType = "intellectual" | "action" | "result";

export type BoardRow = {
  rank: number;
  curationSlug: string;
  curationName: string;
  curatorName: string;
  delivery: number;
  quality: number;
  content: number;
  fengyun: number;
  baseTotal: number;
  monthTotal: number;
  ytd: number;
  rankChange: number;
};

export type MonthlyScoreInput = {
  attended: number;
  held: number;
  milestonesHit: number;
  milestonesDue: number;
  b1Internal: 5 | 10 | 15;
  bestVotes: number;
  improvedVotes: number;
  contentDepthPoints: number;
  fengyunPoints: number;
};
