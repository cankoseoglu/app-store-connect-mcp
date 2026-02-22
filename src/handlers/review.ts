import { getClient } from "../client.js";

export async function createReviewSubmission(args: {
  appId: string;
  platform: string;
}) {
  const client = getClient();
  return client.create({
    type: "reviewSubmissions",
    attributes: { platform: args.platform },
    relationships: { app: { data: { type: "apps", id: args.appId } } },
  });
}

export async function listReviewSubmissions(args: {
  appId: string;
  platform?: string;
  state?: string;
  limit?: number;
}) {
  const client = getClient();
  const params: string[] = [`filter[app]=${args.appId}`];
  if (args.platform) params.push(`filter[platform]=${args.platform}`);
  if (args.state) params.push(`filter[state]=${args.state}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const { data } = await client.read(`reviewSubmissions?${params.join("&")}`);
  return data;
}
