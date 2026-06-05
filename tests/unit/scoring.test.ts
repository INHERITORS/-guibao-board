import { describe, expect, it } from "vitest";
import {
  calculateDeliveryScore,
  calculateMonthlyScore,
  calculatePeerScore
} from "@/lib/scoring/calculate";

describe("scoring", () => {
  it("calculates delivery from attendance and milestones", () => {
    expect(
      calculateDeliveryScore({
        attended: 3,
        held: 4,
        milestonesHit: 2,
        milestonesDue: 2
      })
    ).toBe(25);
  });

  it("caps peer score at 15", () => {
    expect(calculatePeerScore({ bestVotes: 5, improvedVotes: 4 })).toBe(15);
  });

  it("calculates monthly totals", () => {
    expect(
      calculateMonthlyScore({
        attended: 3,
        held: 4,
        milestonesHit: 2,
        milestonesDue: 2,
        b1Internal: 10,
        bestVotes: 2,
        improvedVotes: 1,
        contentDepthPoints: 30,
        fengyunPoints: 40
      })
    ).toMatchObject({
      delivery: 25,
      peer: 8,
      quality: 18,
      content: 30,
      baseTotal: 73,
      monthTotal: 113
    });
  });
});
