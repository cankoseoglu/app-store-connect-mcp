import { getClient } from "../client.js";

export async function listVersions(args: {
  appId: string;
  platform?: string;
  versionState?: string;
  limit?: number;
}) {
  const client = await getClient();
  const params: string[] = [];
  if (args.platform) params.push(`filter[platform]=${args.platform}`);
  if (args.versionState) params.push(`filter[appStoreState]=${args.versionState}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.length ? "?" + params.join("&") : "";
  const { data } = await client.read(`apps/${args.appId}/appStoreVersions${qs}`);
  return data;
}

export async function getVersion(args: {
  versionId: string;
  include?: string[];
}) {
  const client = await getClient();
  let url = `appStoreVersions/${args.versionId}`;
  if (args.include?.length) url += `?include=${args.include.join(",")}`;
  const { data } = await client.read(url);
  return data;
}

export async function createVersion(args: {
  appId: string;
  platform: string;
  versionString: string;
  releaseType?: string;
  earliestReleaseDate?: string;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = {
    platform: args.platform,
    versionString: args.versionString,
  };
  if (args.releaseType) attributes.releaseType = args.releaseType;
  if (args.earliestReleaseDate) attributes.earliestReleaseDate = args.earliestReleaseDate;

  return client.create({
    type: "appStoreVersions",
    attributes,
    relationships: { app: { data: { type: "apps", id: args.appId } } },
  });
}

export async function updateVersion(args: {
  versionId: string;
  versionString?: string;
  releaseType?: string;
  earliestReleaseDate?: string;
  copyright?: string;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = {};
  if (args.versionString !== undefined) attributes.versionString = args.versionString;
  if (args.releaseType !== undefined) attributes.releaseType = args.releaseType;
  if (args.earliestReleaseDate !== undefined)
    attributes.earliestReleaseDate = args.earliestReleaseDate;
  if (args.copyright !== undefined) attributes.copyright = args.copyright;

  return client.update(
    { type: "appStoreVersions", id: args.versionId },
    { attributes }
  );
}

export async function deleteVersion(args: { versionId: string }) {
  const client = await getClient();
  return client.remove({ type: "appStoreVersions", id: args.versionId });
}
