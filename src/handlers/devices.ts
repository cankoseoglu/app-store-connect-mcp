import { getClient } from "../client.js";

export async function listDevices(args: {
  platform?: string;
  status?: string;
  name?: string;
  limit?: number;
}) {
  const client = await getClient();
  const params: string[] = [];
  if (args.platform) params.push(`filter[platform]=${args.platform}`);
  if (args.status) params.push(`filter[status]=${args.status}`);
  if (args.name) params.push(`filter[name]=${args.name}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.length ? "?" + params.join("&") : "";
  const { data } = await client.read(`devices${qs}`);
  return data;
}

export async function registerDevice(args: {
  name: string;
  udid: string;
  platform: string;
}) {
  const client = await getClient();
  return client.create({
    type: "devices",
    attributes: {
      name: args.name,
      udid: args.udid,
      platform: args.platform,
    },
  });
}
