import { getClient } from "../client.js";

export async function listBundleIds(args: {
  identifier?: string;
  platform?: string;
  limit?: number;
}) {
  const client = await getClient();
  const params: string[] = [];
  if (args.identifier) params.push(`filter[identifier]=${args.identifier}`);
  if (args.platform) params.push(`filter[platform]=${args.platform}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.length ? "?" + params.join("&") : "";
  const { data } = await client.read(`bundleIds${qs}`);
  return data;
}

export async function getBundleId(args: {
  bundleIdId: string;
  include?: string[];
}) {
  const client = await getClient();
  let url = `bundleIds/${args.bundleIdId}`;
  if (args.include?.length) url += `?include=${args.include.join(",")}`;
  const { data } = await client.read(url);
  return data;
}

export async function registerBundleId(args: {
  identifier: string;
  name: string;
  platform: string;
  seedId?: string;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = {
    identifier: args.identifier,
    name: args.name,
    platform: args.platform,
  };
  if (args.seedId) attributes.seedId = args.seedId;

  return client.create({
    type: "bundleIds",
    attributes,
  });
}

export async function enableCapability(args: {
  bundleIdId: string;
  capabilityType: string;
  settings?: Array<{ key: string; options: Array<{ key: string; enabled: boolean }> }>;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = {
    capabilityType: args.capabilityType,
  };
  if (args.settings) attributes.settings = args.settings;

  return client.create({
    type: "bundleIdCapabilities",
    attributes,
    relationships: {
      bundleId: { data: { type: "bundleIds", id: args.bundleIdId } },
    },
  });
}

export async function disableCapability(args: { capabilityId: string }) {
  const client = await getClient();
  return client.remove({ type: "bundleIdCapabilities", id: args.capabilityId });
}
