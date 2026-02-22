import { getClient } from "../client.js";

export async function listInAppPurchases(args: {
  appId: string;
  filterProductId?: string;
  filterState?: string;
  limit?: number;
}) {
  const client = getClient();
  const params: string[] = [];
  if (args.filterProductId) params.push(`filter[productId]=${args.filterProductId}`);
  if (args.filterState) params.push(`filter[state]=${args.filterState}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.length ? "?" + params.join("&") : "";
  const { data } = await client.read(`apps/${args.appId}/inAppPurchasesV2${qs}`);
  return data;
}

export async function getInAppPurchase(args: {
  inAppPurchaseId: string;
  include?: string[];
}) {
  const client = getClient();
  let url = `inAppPurchases/${args.inAppPurchaseId}`;
  if (args.include?.length) url += `?include=${args.include.join(",")}`;
  const { data } = await client.read(url, { version: 2 });
  return data;
}

export async function createInAppPurchase(args: {
  appId: string;
  name: string;
  productId: string;
  inAppPurchaseType: string;
  reviewNote?: string;
}) {
  const client = getClient();
  const attributes: Record<string, unknown> = {
    name: args.name,
    productId: args.productId,
    inAppPurchaseType: args.inAppPurchaseType,
  };
  if (args.reviewNote) attributes.reviewNote = args.reviewNote;

  return client.create({
    type: "inAppPurchases",
    attributes,
    relationships: { app: { data: { type: "apps", id: args.appId } } },
    version: 2,
  });
}

export async function deleteInAppPurchase(args: { inAppPurchaseId: string }) {
  const client = getClient();
  return client.remove(
    { type: "inAppPurchases", id: args.inAppPurchaseId },
    { version: 2 }
  );
}
