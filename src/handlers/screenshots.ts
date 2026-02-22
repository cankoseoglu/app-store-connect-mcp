import { readFile, stat } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { getClient } from "../client.js";

export async function listScreenshotSets(args: { localizationId: string }) {
  const client = getClient();
  const { data } = await client.read(
    `appStoreVersionLocalizations/${args.localizationId}/appScreenshotSets`
  );
  return data;
}

export async function createScreenshotSet(args: {
  localizationId: string;
  screenshotDisplayType: string;
}) {
  const client = getClient();
  return client.create({
    type: "appScreenshotSets",
    attributes: { screenshotDisplayType: args.screenshotDisplayType },
    relationships: {
      appStoreVersionLocalization: {
        data: { type: "appStoreVersionLocalizations", id: args.localizationId },
      },
    },
  });
}

export async function uploadScreenshot(args: {
  screenshotSetId: string;
  filePath: string;
}) {
  const client = getClient();

  // Sanitize and resolve path
  const safePath = resolve(args.filePath);
  const fileName = basename(safePath);
  const fileStats = await stat(safePath);
  const fileSize = fileStats.size;
  const buffer = await readFile(safePath);

  // Create reservation
  const appScreenshot = await client.create({
    type: "appScreenshots",
    attributes: { fileName, fileSize },
    relationships: {
      appScreenshotSet: {
        data: { type: "appScreenshotSets", id: args.screenshotSetId },
      },
    },
  });

  // Upload + poll
  await client.uploadAsset(appScreenshot, buffer);
  await client.pollForUploadSuccess(appScreenshot.links.self);

  return { id: appScreenshot.id, fileName, fileSize, status: "uploaded" };
}

export async function deleteScreenshot(args: { screenshotId: string }) {
  const client = getClient();
  return client.remove({ type: "appScreenshots", id: args.screenshotId });
}

export async function listPreviewSets(args: { localizationId: string }) {
  const client = getClient();
  const { data } = await client.read(
    `appStoreVersionLocalizations/${args.localizationId}/appPreviewSets`
  );
  return data;
}

export async function uploadPreview(args: {
  previewSetId: string;
  filePath: string;
  mimeType?: string;
}) {
  const client = getClient();

  const safePath = resolve(args.filePath);
  const fileName = basename(safePath);
  const fileStats = await stat(safePath);
  const fileSize = fileStats.size;
  const buffer = await readFile(safePath);

  const attributes: Record<string, unknown> = { fileName, fileSize };
  if (args.mimeType) attributes.mimeType = args.mimeType;

  const appPreview = await client.create({
    type: "appPreviews",
    attributes,
    relationships: {
      appPreviewSet: {
        data: { type: "appPreviewSets", id: args.previewSetId },
      },
    },
  });

  await client.uploadAsset(appPreview, buffer);
  await client.pollForUploadSuccess(appPreview.links.self);

  return { id: appPreview.id, fileName, fileSize, status: "uploaded" };
}
