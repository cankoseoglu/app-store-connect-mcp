import { getClient } from "../client.js";

export async function listSubscriptionGroups(args: {
  appId: string;
  limit?: number;
}) {
  const client = await getClient();
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
  const client = await getClient();
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
  const client = await getClient();
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
  const client = await getClient();
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
  const client = await getClient();
  return client.remove({ type: "subscriptions", id: args.subscriptionId });
}

// ─── Subscription Localizations ──────────────────────────────

export async function listSubscriptionLocalizations(args: {
  subscriptionId: string;
  limit?: number;
}) {
  const client = await getClient();
  const qs = args.limit ? `?limit=${args.limit}` : "";
  const { data } = await client.read(
    `subscriptions/${args.subscriptionId}/subscriptionLocalizations${qs}`
  );
  return data;
}

export async function createSubscriptionLocalization(args: {
  subscriptionId: string;
  locale: string;
  name: string;
  description: string;
}) {
  const client = await getClient();
  return client.create({
    type: "subscriptionLocalizations",
    attributes: {
      locale: args.locale,
      name: args.name,
      description: args.description,
    },
    relationships: {
      subscription: {
        data: { type: "subscriptions", id: args.subscriptionId },
      },
    },
  });
}

export async function updateSubscriptionLocalization(args: {
  subscriptionLocalizationId: string;
  name?: string;
  description?: string;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = {};
  if (args.name !== undefined) attributes.name = args.name;
  if (args.description !== undefined) attributes.description = args.description;

  return client.update(
    { type: "subscriptionLocalizations", id: args.subscriptionLocalizationId },
    { attributes }
  );
}

export async function deleteSubscriptionLocalization(args: {
  subscriptionLocalizationId: string;
}) {
  const client = await getClient();
  return client.remove({
    type: "subscriptionLocalizations",
    id: args.subscriptionLocalizationId,
  });
}

// ─── Subscription Group Localizations ────────────────────────

export async function listSubscriptionGroupLocalizations(args: {
  subscriptionGroupId: string;
  limit?: number;
}) {
  const client = await getClient();
  const qs = args.limit ? `?limit=${args.limit}` : "";
  const { data } = await client.read(
    `subscriptionGroups/${args.subscriptionGroupId}/subscriptionGroupLocalizations${qs}`
  );
  return data;
}

export async function createSubscriptionGroupLocalization(args: {
  subscriptionGroupId: string;
  locale: string;
  name: string;
  customAppName?: string;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = {
    locale: args.locale,
    name: args.name,
  };
  if (args.customAppName !== undefined) attributes.customAppName = args.customAppName;

  return client.create({
    type: "subscriptionGroupLocalizations",
    attributes,
    relationships: {
      subscriptionGroup: {
        data: { type: "subscriptionGroups", id: args.subscriptionGroupId },
      },
    },
  });
}

export async function updateSubscriptionGroupLocalization(args: {
  subscriptionGroupLocalizationId: string;
  name?: string;
  customAppName?: string;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = {};
  if (args.name !== undefined) attributes.name = args.name;
  if (args.customAppName !== undefined) attributes.customAppName = args.customAppName;

  return client.update(
    { type: "subscriptionGroupLocalizations", id: args.subscriptionGroupLocalizationId },
    { attributes }
  );
}

export async function deleteSubscriptionGroupLocalization(args: {
  subscriptionGroupLocalizationId: string;
}) {
  const client = await getClient();
  return client.remove({
    type: "subscriptionGroupLocalizations",
    id: args.subscriptionGroupLocalizationId,
  });
}
