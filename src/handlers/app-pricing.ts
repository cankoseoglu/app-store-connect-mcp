import { getClient } from "../client.js";

export async function listAppPricePoints(args: {
  appId: string;
  territory?: string;
  limit?: number;
}) {
  const client = await getClient();
  const params: string[] = [];
  if (args.territory) params.push(`filter[territory]=${args.territory}`);
  params.push(`include=priceTier`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.join("&");
  const { data, included } = await client.readAll(
    `apps/${args.appId}/pricePoints?${qs}`
  );
  return { pricePoints: data, included };
}

export async function listTerritories(args: { limit?: number }) {
  const client = await getClient();
  const qs = args.limit ? `?limit=${args.limit}` : "?limit=200";
  const { data } = await client.readAll(`territories${qs}`);
  return data;
}

export async function listAppAvailabilities(args: { appId: string }) {
  const client = await getClient();
  const { data } = await client.read(
    `apps/${args.appId}/appAvailability?include=availableTerritories`
  );
  return data;
}
