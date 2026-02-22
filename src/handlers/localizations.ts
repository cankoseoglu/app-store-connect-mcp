import { getClient } from "../client.js";

export async function listLocalizations(args: {
  versionId: string;
  limit?: number;
}) {
  const client = await getClient();
  const qs = args.limit ? `?limit=${args.limit}` : "";
  const { data } = await client.read(
    `appStoreVersions/${args.versionId}/appStoreVersionLocalizations${qs}`
  );
  return data;
}

export async function getLocalization(args: { localizationId: string }) {
  const client = await getClient();
  const { data } = await client.read(
    `appStoreVersionLocalizations/${args.localizationId}`
  );
  return data;
}

export async function createLocalization(args: {
  versionId: string;
  locale: string;
  description?: string;
  keywords?: string;
  whatsNew?: string;
  promotionalText?: string;
  marketingUrl?: string;
  supportUrl?: string;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = { locale: args.locale };
  if (args.description !== undefined) attributes.description = args.description;
  if (args.keywords !== undefined) attributes.keywords = args.keywords;
  if (args.whatsNew !== undefined) attributes.whatsNew = args.whatsNew;
  if (args.promotionalText !== undefined) attributes.promotionalText = args.promotionalText;
  if (args.marketingUrl !== undefined) attributes.marketingUrl = args.marketingUrl;
  if (args.supportUrl !== undefined) attributes.supportUrl = args.supportUrl;

  return client.create({
    type: "appStoreVersionLocalizations",
    attributes,
    relationships: {
      appStoreVersion: {
        data: { type: "appStoreVersions", id: args.versionId },
      },
    },
  });
}

export async function updateLocalization(args: {
  localizationId: string;
  description?: string;
  keywords?: string;
  whatsNew?: string;
  promotionalText?: string;
  subtitle?: string;
  marketingUrl?: string;
  supportUrl?: string;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = {};
  if (args.description !== undefined) attributes.description = args.description;
  if (args.keywords !== undefined) attributes.keywords = args.keywords;
  if (args.whatsNew !== undefined) attributes.whatsNew = args.whatsNew;
  if (args.promotionalText !== undefined) attributes.promotionalText = args.promotionalText;
  if (args.subtitle !== undefined) attributes.subtitle = args.subtitle;
  if (args.marketingUrl !== undefined) attributes.marketingUrl = args.marketingUrl;
  if (args.supportUrl !== undefined) attributes.supportUrl = args.supportUrl;

  return client.update(
    { type: "appStoreVersionLocalizations", id: args.localizationId },
    { attributes }
  );
}
