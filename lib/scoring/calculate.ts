import type { MonthlyScoreInput } from "@/lib/types";

export function calculateDeliveryScore(input: {
  attended: number;
  held: number;
  milestonesHit: number;
  milestonesDue: number;
}) {
  const denominator = input.held + input.milestonesDue;
  if (denominator === 0) {
    return 0;
  }

  const numerator = input.attended + input.milestonesHit;
  return roundOneDecimal((numerator / denominator) * 30);
}

export function calculatePeerScore(input: { bestVotes: number; improvedVotes: number }) {
  return Math.min(15, input.bestVotes * 3 + input.improvedVotes * 2);
}

export function calculateMonthlyScore(input: MonthlyScoreInput) {
  const delivery = calculateDeliveryScore(input);
  const peer = calculatePeerScore(input);
  const quality = input.b1Internal + peer;
  const content = Math.min(40, input.contentDepthPoints);
  const baseTotal = roundOneDecimal(delivery + quality + content);
  const monthTotal = roundOneDecimal(baseTotal + input.fengyunPoints);

  return {
    delivery,
    peer,
    quality,
    content,
    baseTotal,
    fengyun: input.fengyunPoints,
    monthTotal
  };
}

function roundOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}
