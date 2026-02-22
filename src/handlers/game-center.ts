import { getClient } from "../client.js";

export async function listGameCenterLeaderboards(args: {
  appId: string;
  limit?: number;
}) {
  const client = getClient();
  const qs = args.limit ? `?limit=${args.limit}` : "";
  const { data } = await client.read(
    `apps/${args.appId}/gameCenterDetail`, { version: 1 }
  );

  // Get leaderboards from the game center detail
  if (data?.relationships?.gameCenterLeaderboards?.links?.related) {
    const lbUrl = data.relationships.gameCenterLeaderboards.links.related;
    const lbQs = args.limit ? `?limit=${args.limit}` : "";
    const { data: leaderboards } = await client.read(`${lbUrl}${lbQs}`);
    return leaderboards;
  }

  // Fallback: direct v1 leaderboards endpoint
  const { data: leaderboards } = await client.read(
    `gameCenterLeaderboards?filter[gameCenterDetail]=${args.appId}${args.limit ? `&limit=${args.limit}` : ""}`
  );
  return leaderboards;
}

export async function createGameCenterLeaderboard(args: {
  gameCenterDetailId: string;
  referenceName: string;
  vendorIdentifier: string;
  defaultFormatter: string;
  submissionType: string;
  scoreSortType: string;
  scoreRangeStart?: string;
  scoreRangeEnd?: string;
  recurrenceStartDate?: string;
  recurrenceDuration?: string;
  recurrenceRule?: string;
}) {
  const client = getClient();
  const attributes: Record<string, unknown> = {
    referenceName: args.referenceName,
    vendorIdentifier: args.vendorIdentifier,
    defaultFormatter: args.defaultFormatter,
    submissionType: args.submissionType,
    scoreSortType: args.scoreSortType,
  };
  if (args.scoreRangeStart) attributes.scoreRangeStart = args.scoreRangeStart;
  if (args.scoreRangeEnd) attributes.scoreRangeEnd = args.scoreRangeEnd;
  if (args.recurrenceStartDate) attributes.recurrenceStartDate = args.recurrenceStartDate;
  if (args.recurrenceDuration) attributes.recurrenceDuration = args.recurrenceDuration;
  if (args.recurrenceRule) attributes.recurrenceRule = args.recurrenceRule;

  return client.create({
    type: "gameCenterLeaderboards",
    attributes,
    relationships: {
      gameCenterDetail: {
        data: { type: "gameCenterDetails", id: args.gameCenterDetailId },
      },
    },
  });
}

export async function listGameCenterAchievements(args: {
  appId: string;
  limit?: number;
}) {
  const client = getClient();
  const { data } = await client.read(
    `apps/${args.appId}/gameCenterDetail`, { version: 1 }
  );

  if (data?.relationships?.gameCenterAchievements?.links?.related) {
    const url = data.relationships.gameCenterAchievements.links.related;
    const qs = args.limit ? `?limit=${args.limit}` : "";
    const { data: achievements } = await client.read(`${url}${qs}`);
    return achievements;
  }

  const { data: achievements } = await client.read(
    `gameCenterAchievements?filter[gameCenterDetail]=${args.appId}${args.limit ? `&limit=${args.limit}` : ""}`
  );
  return achievements;
}

export async function createGameCenterAchievement(args: {
  gameCenterDetailId: string;
  referenceName: string;
  vendorIdentifier: string;
  points: number;
  showBeforeEarned: boolean;
  repeatable: boolean;
}) {
  const client = getClient();
  return client.create({
    type: "gameCenterAchievements",
    attributes: {
      referenceName: args.referenceName,
      vendorIdentifier: args.vendorIdentifier,
      points: args.points,
      showBeforeEarned: args.showBeforeEarned,
      repeatable: args.repeatable,
    },
    relationships: {
      gameCenterDetail: {
        data: { type: "gameCenterDetails", id: args.gameCenterDetailId },
      },
    },
  });
}
