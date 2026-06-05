import { z } from "zod";

export const monthlyScoreInputSchema = z.object({
  attended: z.number().int().min(0),
  held: z.number().int().min(0),
  milestonesHit: z.number().int().min(0),
  milestonesDue: z.number().int().min(0),
  b1Internal: z.union([z.literal(5), z.literal(10), z.literal(15)]),
  bestVotes: z.number().int().min(0),
  improvedVotes: z.number().int().min(0),
  contentDepthPoints: z.number().int().min(0).max(40),
  fengyunPoints: z.number().int().min(0)
});

export const peerVoteSchema = z
  .object({
    yearMonth: z.string().regex(/^\d{4}-\d{2}$/),
    voterCurationId: z.string().uuid(),
    bestCurationId: z.string().uuid(),
    improvedCurationId: z.string().uuid()
  })
  .refine((value) => value.voterCurationId !== value.bestCurationId, {
    message: "不能投给自己的策展",
    path: ["bestCurationId"]
  })
  .refine((value) => value.voterCurationId !== value.improvedCurationId, {
    message: "不能投给自己的策展",
    path: ["improvedCurationId"]
  });

export const fengyunSubmissionSchema = z.object({
  challengeId: z.string().uuid(),
  curationId: z.string().uuid(),
  evidenceText: z.string().min(1).max(4000),
  evidenceFileIds: z.array(z.string().uuid()).max(5).default([])
});
