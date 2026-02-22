import { getClient } from "../client.js";

export async function listBuilds(args: {
  appId: string;
  version?: string;
  processingState?: string;
  preReleaseVersion?: string;
  limit?: number;
}) {
  const client = getClient();
  const params: string[] = [`filter[app]=${args.appId}`];
  if (args.version) params.push(`filter[version]=${args.version}`);
  if (args.processingState) params.push(`filter[processingState]=${args.processingState}`);
  if (args.preReleaseVersion)
    params.push(`filter[preReleaseVersion.version]=${args.preReleaseVersion}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.join("&");
  const { data } = await client.read(`builds?${qs}`);
  return data;
}

export async function getBuild(args: {
  buildId: string;
  include?: string[];
}) {
  const client = getClient();
  let url = `builds/${args.buildId}`;
  if (args.include?.length) url += `?include=${args.include.join(",")}`;
  const { data } = await client.read(url);
  return data;
}

export async function updateBuild(args: {
  buildId: string;
  expired?: boolean;
  usesNonExemptEncryption?: boolean;
}) {
  const client = getClient();
  const attributes: Record<string, unknown> = {};
  if (args.expired !== undefined) attributes.expired = args.expired;
  if (args.usesNonExemptEncryption !== undefined)
    attributes.usesNonExemptEncryption = args.usesNonExemptEncryption;

  return client.update(
    { type: "builds", id: args.buildId },
    { attributes }
  );
}
