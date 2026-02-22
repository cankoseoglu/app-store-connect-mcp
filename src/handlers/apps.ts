import { getClient } from "../client.js";

export async function listApps(args: {
  bundleId?: string;
  limit?: number;
}) {
  const client = getClient();
  let url = "apps";
  const params: string[] = [];
  if (args.bundleId) params.push(`filter[bundleId]=${args.bundleId}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  if (params.length) url += "?" + params.join("&");

  const { data } = args.limit
    ? await client.read(url)
    : await client.readAll(url + (url.includes("?") ? "&" : "?") + "limit=200");
  return data;
}

export async function getApp(args: { appId: string; include?: string[] }) {
  const client = getClient();
  let url = `apps/${args.appId}`;
  if (args.include?.length) url += `?include=${args.include.join(",")}`;
  const { data } = await client.read(url);
  return data;
}

export async function updateApp(args: {
  appId: string;
  primaryLocale?: string;
  contentRightsDeclaration?: string;
  availableInNewTerritories?: boolean;
}) {
  const client = getClient();
  const attributes: Record<string, unknown> = {};
  if (args.primaryLocale !== undefined) attributes.primaryLocale = args.primaryLocale;
  if (args.contentRightsDeclaration !== undefined)
    attributes.contentRightsDeclaration = args.contentRightsDeclaration;
  if (args.availableInNewTerritories !== undefined)
    attributes.availableInNewTerritories = args.availableInNewTerritories;

  return client.update(
    { type: "apps", id: args.appId },
    { attributes }
  );
}
