import { getClient } from "../client.js";

export async function listBetaGroups(args: {
  appId: string;
  limit?: number;
}) {
  const client = await getClient();
  const params: string[] = [`filter[app]=${args.appId}`];
  if (args.limit) params.push(`limit=${args.limit}`);
  const { data } = await client.read(`betaGroups?${params.join("&")}`);
  return data;
}

export async function createBetaGroup(args: {
  appId: string;
  name: string;
  isInternalGroup?: boolean;
  publicLinkEnabled?: boolean;
  publicLinkLimit?: number;
  feedbackEnabled?: boolean;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = { name: args.name };
  if (args.isInternalGroup !== undefined) attributes.isInternalGroup = args.isInternalGroup;
  if (args.publicLinkEnabled !== undefined) attributes.publicLinkEnabled = args.publicLinkEnabled;
  if (args.publicLinkLimit !== undefined) attributes.publicLinkLimit = args.publicLinkLimit;
  if (args.feedbackEnabled !== undefined) attributes.feedbackEnabled = args.feedbackEnabled;

  return client.create({
    type: "betaGroups",
    attributes,
    relationships: { app: { data: { type: "apps", id: args.appId } } },
  });
}

export async function deleteBetaGroup(args: { betaGroupId: string }) {
  const client = await getClient();
  return client.remove({ type: "betaGroups", id: args.betaGroupId });
}

export async function listBetaTesters(args: {
  email?: string;
  betaGroupId?: string;
  appId?: string;
  limit?: number;
}) {
  const client = await getClient();
  const params: string[] = [];
  if (args.email) params.push(`filter[email]=${args.email}`);
  if (args.betaGroupId) params.push(`filter[betaGroups]=${args.betaGroupId}`);
  if (args.appId) params.push(`filter[apps]=${args.appId}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.length ? "?" + params.join("&") : "";
  const { data } = await client.read(`betaTesters${qs}`);
  return data;
}

export async function addTesterToGroup(args: {
  betaGroupId: string;
  betaTesterId: string;
}) {
  const client = await getClient();
  const response = await client.fetch(`betaGroups/${args.betaGroupId}/relationships/betaTesters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [{ type: "betaTesters", id: args.betaTesterId }],
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
  return { success: true };
}

export async function removeTesterFromGroup(args: {
  betaGroupId: string;
  betaTesterId: string;
}) {
  const client = await getClient();
  const response = await client.fetch(`betaGroups/${args.betaGroupId}/relationships/betaTesters`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [{ type: "betaTesters", id: args.betaTesterId }],
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
  return { success: true };
}

export async function submitForBetaReview(args: { buildId: string }) {
  const client = await getClient();
  return client.create({
    type: "betaAppReviewSubmissions",
    relationships: {
      build: { data: { type: "builds", id: args.buildId } },
    },
  });
}
