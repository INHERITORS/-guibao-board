import type { ChallengeType } from "@/lib/types";

export type FengyunChallenge = {
  id: string;
  yearMonth: string;
  type: ChallengeType;
  name: string;
  criterion: string;
  maxPoints: number;
  status: "draft" | "announced" | "closed";
  deadline: string;
};

export const sampleFengyunChallenges: FengyunChallenge[] = [
  {
    id: "fy-2026-06-team",
    yearMonth: "2026-06",
    type: "action",
    name: "班底成形",
    criterion: "首个完成全队出席小组会议",
    maxPoints: 20,
    status: "closed",
    deadline: "2026-06-25"
  },
  {
    id: "fy-2026-06-story",
    yearMonth: "2026-06",
    type: "intellectual",
    name: "我的主题为什么值得一年",
    criterion: "100字短文 · 6/25前提交 · 文化营朗读",
    maxPoints: 10,
    status: "announced",
    deadline: "2026-06-25"
  },
  {
    id: "fy-2026-06-intro",
    yearMonth: "2026-06",
    type: "result",
    name: "迎新会主题展现",
    criterion: "最佳策展介绍 · 策划组评选",
    maxPoints: 10,
    status: "draft",
    deadline: "2026-06-30"
  }
];

export function typeLabel(type: ChallengeType) {
  return {
    intellectual: "认知题",
    action: "行动题",
    result: "成果题"
  }[type];
}
