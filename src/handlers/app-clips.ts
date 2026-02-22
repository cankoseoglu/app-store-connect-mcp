import { getClient } from "../client.js";

export async function listAppClipDefaultExperiences(args: {
  appClipId: string;
  limit?: number;
}) {
  const client = getClient();
  const qs = args.limit ? `?limit=${args.limit}` : "";
  const { data } = await client.read(
    `appClips/${args.appClipId}/appClipDefaultExperiences${qs}`
  );
  return data;
}

export async function updateAppClipDefaultExperience(args: {
  appClipDefaultExperienceId: string;
  action?: string;
}) {
  const client = getClient();
  const attributes: Record<string, unknown> = {};
  if (args.action !== undefined) attributes.action = args.action;

  return client.update(
    { type: "appClipDefaultExperiences", id: args.appClipDefaultExperienceId },
    { attributes }
  );
}
