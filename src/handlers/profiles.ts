import { getClient } from "../client.js";

export async function listProfiles(args: {
  profileType?: string;
  name?: string;
  profileState?: string;
  limit?: number;
}) {
  const client = await getClient();
  const params: string[] = [];
  if (args.profileType) params.push(`filter[profileType]=${args.profileType}`);
  if (args.name) params.push(`filter[name]=${args.name}`);
  if (args.profileState) params.push(`filter[profileState]=${args.profileState}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.length ? "?" + params.join("&") : "";
  const { data } = await client.read(`profiles${qs}`);
  return data;
}

export async function createProfile(args: {
  name: string;
  profileType: string;
  bundleIdId: string;
  certificateIds: string[];
  deviceIds?: string[];
}) {
  const client = await getClient();
  const relationships: Record<string, unknown> = {
    bundleId: { data: { type: "bundleIds", id: args.bundleIdId } },
    certificates: {
      data: args.certificateIds.map((id) => ({ type: "certificates", id })),
    },
  };
  if (args.deviceIds?.length) {
    relationships.devices = {
      data: args.deviceIds.map((id) => ({ type: "devices", id })),
    };
  }

  return client.create({
    type: "profiles",
    attributes: { name: args.name, profileType: args.profileType },
    relationships,
  });
}

export async function deleteProfile(args: { profileId: string }) {
  const client = await getClient();
  return client.remove({ type: "profiles", id: args.profileId });
}
