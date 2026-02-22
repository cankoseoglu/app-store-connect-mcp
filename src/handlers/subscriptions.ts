import { getClient } from "../client.js";

export async function listSubscriptionGroups(args: {
  appId: string;
  limit?: number;
}) {
  const client = getClient();
  const qs = args.limit ? `?limit=${args.limit}` : "";
  const { data } = await client.read(
    `apps/${args.appId}/subscriptionGroups${qs}`
  );
  return data;
}

export async function createSubscriptionGroup(args: {
  appId: string;
  referenceName: string;
}) {
  const client = getClient();
  return client.create({
    type: "subscriptionGroups",
    attributes: { referenceName: args.referenceName },
    relationships: { app: { data: { type: "apps", id: args.appId } } },
  });
}

export async function listSubscriptions(args: {
  subscriptionGroupId: string;
  limit?: number;
}) {
  const client = getClient();
  const qs = args.limit ? `?limit=${args.limit}` : "";
  const { data } = await client.read(
    `subscriptionGroups/${args.subscriptionGroupId}/subscriptions${qs}`
  );
  return data;
}

export async function createSubscription(args: {
  subscriptionGroupId: string;
  name: string;
  productId: string;
  subscriptionPeriod?: string;
  familySharable?: boolean;
  reviewNote?: string;
  groupLevel?: number;
}) {
  const client = getClient();
  const attributes: Record<string, unknown> = {
    name: args.name,
    productId: args.productId,
  };
  if (args.subscriptionPeriod) attributes.subscriptionPeriod = args.subscriptionPeriod;
  if (args.familySharable !== undefined) attributes.familySharable = args.familySharable;
  if (args.reviewNote) attributes.reviewNote = args.reviewNote;
  if (args.groupLevel !== undefined) attributes.groupLevel = args.groupLevel;

  return client.create({
    type: "subscriptions",
    attributes,
    relationships: {
      group: {
        data: { type: "subscriptionGroups", id: args.subscriptionGroupId },
      },
    },
  });
}

export async function deleteSubscription(args: { subscriptionId: string }) {
  const client = getClient();
  return client.remove({ type: "subscriptions", id: args.subscriptionId });
}
