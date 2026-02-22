import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Handler imports
import { listApps, getApp, updateApp } from "./handlers/apps.js";
import {
  listVersions,
  getVersion,
  createVersion,
  updateVersion,
  deleteVersion,
} from "./handlers/versions.js";
import {
  listLocalizations,
  getLocalization,
  createLocalization,
  updateLocalization,
} from "./handlers/localizations.js";
import {
  listScreenshotSets,
  createScreenshotSet,
  uploadScreenshot,
  deleteScreenshot,
  listPreviewSets,
  uploadPreview,
} from "./handlers/screenshots.js";
import { listBuilds, getBuild, updateBuild } from "./handlers/builds.js";
import {
  listBetaGroups,
  createBetaGroup,
  deleteBetaGroup,
  listBetaTesters,
  addTesterToGroup,
  removeTesterFromGroup,
  submitForBetaReview,
} from "./handlers/beta-testing.js";
import {
  listBundleIds,
  getBundleId,
  registerBundleId,
  enableCapability,
  disableCapability,
} from "./handlers/bundle-ids.js";
import { listDevices, registerDevice } from "./handlers/devices.js";
import {
  listCertificates,
  getCertificate,
  revokeCertificate,
} from "./handlers/certificates.js";
import {
  listProfiles,
  createProfile,
  deleteProfile,
} from "./handlers/profiles.js";
import {
  listUsers,
  getUser,
  updateUserRoles,
  removeUser,
} from "./handlers/users.js";
import {
  listInAppPurchases,
  getInAppPurchase,
  createInAppPurchase,
  deleteInAppPurchase,
} from "./handlers/in-app-purchases.js";
import {
  listSubscriptionGroups,
  createSubscriptionGroup,
  listSubscriptions,
  createSubscription,
  deleteSubscription,
} from "./handlers/subscriptions.js";
import {
  createReviewSubmission,
  listReviewSubmissions,
} from "./handlers/review.js";
import {
  listAppPricePoints,
  listTerritories,
  listAppAvailabilities,
} from "./handlers/app-pricing.js";
import {
  listCustomerReviews,
  getCustomerReview,
  createReviewResponse,
} from "./handlers/customer-reviews.js";
import {
  listGameCenterLeaderboards,
  createGameCenterLeaderboard,
  listGameCenterAchievements,
  createGameCenterAchievement,
} from "./handlers/game-center.js";
import {
  listAppClipDefaultExperiences,
  updateAppClipDefaultExperience,
} from "./handlers/app-clips.js";
import {
  listCiWorkflows,
  startCiBuild,
  listCiBuildRuns,
} from "./handlers/xcode-cloud.js";
import {
  getAgeRatingDeclaration,
  updateAgeRatingDeclaration,
} from "./handlers/age-ratings.js";

// Wrap handler calls with error handling
async function handle(fn: () => Promise<unknown>): Promise<{
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}> {
  try {
    const result = await fn();
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    // Never expose stack traces
    console.error("Tool error:", message);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
}

export function registerTools(server: McpServer) {
  // ─── 1. APPS ───────────────────────────────────────────────

  server.tool(
    "list_apps",
    "List all apps in App Store Connect, optionally filtered by bundle ID",
    { bundleId: z.string().optional().describe("Filter by bundle ID"), limit: z.number().optional().describe("Max results to return") },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listApps(args))
  );

  server.tool(
    "get_app",
    "Get details for a specific app by its App Store Connect ID",
    {
      appId: z.string().describe("The app's App Store Connect ID"),
      include: z.array(z.string()).optional().describe("Related resources to include (e.g. appStoreVersions, builds)"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => getApp(args))
  );

  server.tool(
    "update_app",
    "Update an app's metadata (primaryLocale, contentRightsDeclaration)",
    {
      appId: z.string().describe("The app's App Store Connect ID"),
      primaryLocale: z.string().optional().describe("Primary locale (e.g. en-US)"),
      contentRightsDeclaration: z.string().optional().describe("Content rights declaration"),
      availableInNewTerritories: z.boolean().optional().describe("Auto-available in new territories"),
    },
    { idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => updateApp(args))
  );

  // ─── 2. APP STORE VERSIONS ─────────────────────────────────

  server.tool(
    "list_versions",
    "List App Store versions for an app, optionally filtered by platform or state",
    {
      appId: z.string().describe("The app ID"),
      platform: z.string().optional().describe("Filter by platform (IOS, MAC_OS, TV_OS)"),
      versionState: z.string().optional().describe("Filter by version state (e.g. READY_FOR_SALE, PREPARE_FOR_SUBMISSION)"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listVersions(args))
  );

  server.tool(
    "get_version",
    "Get details for a specific App Store version",
    {
      versionId: z.string().describe("The version ID"),
      include: z.array(z.string()).optional().describe("Related resources to include"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => getVersion(args))
  );

  server.tool(
    "create_version",
    "Create a new App Store version for an app",
    {
      appId: z.string().describe("The app ID"),
      platform: z.string().describe("Platform (IOS, MAC_OS, TV_OS)"),
      versionString: z.string().describe("Version string (e.g. 1.0.0)"),
      releaseType: z.string().optional().describe("MANUAL, AFTER_APPROVAL, or SCHEDULED"),
      earliestReleaseDate: z.string().optional().describe("ISO 8601 date for scheduled release"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createVersion(args))
  );

  server.tool(
    "update_version",
    "Update an existing App Store version's metadata",
    {
      versionId: z.string().describe("The version ID"),
      versionString: z.string().optional().describe("Updated version string"),
      releaseType: z.string().optional().describe("MANUAL, AFTER_APPROVAL, or SCHEDULED"),
      earliestReleaseDate: z.string().optional().describe("ISO 8601 date for scheduled release"),
      copyright: z.string().optional().describe("Copyright text"),
    },
    { idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => updateVersion(args))
  );

  server.tool(
    "delete_version",
    "Delete an App Store version (cannot be undone)",
    { versionId: z.string().describe("The version ID to delete") },
    { destructiveHint: true, idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => deleteVersion(args))
  );

  // ─── 3. LOCALIZATIONS ──────────────────────────────────────

  server.tool(
    "list_localizations",
    "List all localizations for an App Store version",
    {
      versionId: z.string().describe("The version ID"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listLocalizations(args))
  );

  server.tool(
    "get_localization",
    "Get details for a specific localization",
    { localizationId: z.string().describe("The localization ID") },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => getLocalization(args))
  );

  server.tool(
    "create_localization",
    "Create a new localization for an App Store version (new language/locale)",
    {
      versionId: z.string().describe("The version ID"),
      locale: z.string().describe("Locale code (e.g. en-US, fr-FR, ja)"),
      description: z.string().optional().describe("App description for this locale"),
      keywords: z.string().optional().describe("Search keywords (comma-separated)"),
      whatsNew: z.string().optional().describe("What's new in this version"),
      promotionalText: z.string().optional().describe("Promotional text"),
      marketingUrl: z.string().optional().describe("Marketing URL"),
      supportUrl: z.string().optional().describe("Support URL"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createLocalization(args))
  );

  server.tool(
    "update_localization",
    "Update localization text (description, keywords, whatsNew, etc.)",
    {
      localizationId: z.string().describe("The localization ID"),
      description: z.string().optional().describe("App description"),
      keywords: z.string().optional().describe("Search keywords (comma-separated)"),
      whatsNew: z.string().optional().describe("What's new in this version"),
      promotionalText: z.string().optional().describe("Promotional text"),
      subtitle: z.string().optional().describe("App subtitle"),
      marketingUrl: z.string().optional().describe("Marketing URL"),
      supportUrl: z.string().optional().describe("Support URL"),
    },
    { idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => updateLocalization(args))
  );

  // ─── 4. SCREENSHOTS & PREVIEWS ─────────────────────────────

  server.tool(
    "list_screenshot_sets",
    "List screenshot sets for a localization",
    { localizationId: z.string().describe("The localization ID") },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listScreenshotSets(args))
  );

  server.tool(
    "create_screenshot_set",
    "Create a screenshot set for a specific display type and localization",
    {
      localizationId: z.string().describe("The localization ID"),
      screenshotDisplayType: z.string().describe("Screenshot display type (e.g. APP_IPHONE_67, APP_IPAD_PRO_129)"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createScreenshotSet(args))
  );

  server.tool(
    "upload_screenshot",
    "Upload a screenshot file to a screenshot set (reserves, uploads, polls for completion)",
    {
      screenshotSetId: z.string().describe("The screenshot set ID"),
      filePath: z.string().describe("Absolute path to the screenshot image file"),
    },
    { openWorldHint: true },
    async (args) => handle(() => uploadScreenshot(args))
  );

  server.tool(
    "delete_screenshot",
    "Delete a single screenshot (cannot be undone)",
    { screenshotId: z.string().describe("The screenshot ID to delete") },
    { destructiveHint: true, idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => deleteScreenshot(args))
  );

  server.tool(
    "list_preview_sets",
    "List app preview (video) sets for a localization",
    { localizationId: z.string().describe("The localization ID") },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listPreviewSets(args))
  );

  server.tool(
    "upload_preview",
    "Upload an app preview video to a preview set",
    {
      previewSetId: z.string().describe("The preview set ID"),
      filePath: z.string().describe("Absolute path to the video file"),
      mimeType: z.string().optional().describe("MIME type of the video file"),
    },
    { openWorldHint: true },
    async (args) => handle(() => uploadPreview(args))
  );

  // ─── 5. BUILDS ──────────────────────────────────────────────

  server.tool(
    "list_builds",
    "List builds for an app, optionally filtered by version or processing state",
    {
      appId: z.string().describe("The app ID"),
      version: z.string().optional().describe("Filter by build version"),
      processingState: z.string().optional().describe("Filter by processing state (PROCESSING, FAILED, INVALID, VALID)"),
      preReleaseVersion: z.string().optional().describe("Filter by pre-release version string"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listBuilds(args))
  );

  server.tool(
    "get_build",
    "Get details for a specific build",
    {
      buildId: z.string().describe("The build ID"),
      include: z.array(z.string()).optional().describe("Related resources to include"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => getBuild(args))
  );

  server.tool(
    "update_build",
    "Update build attributes (expired, usesNonExemptEncryption)",
    {
      buildId: z.string().describe("The build ID"),
      expired: z.boolean().optional().describe("Set build as expired"),
      usesNonExemptEncryption: z.boolean().optional().describe("Whether the build uses non-exempt encryption"),
    },
    { idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => updateBuild(args))
  );

  // ─── 6. BETA TESTING / TESTFLIGHT ──────────────────────────

  server.tool(
    "list_beta_groups",
    "List beta groups (TestFlight groups) for an app",
    {
      appId: z.string().describe("The app ID"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listBetaGroups(args))
  );

  server.tool(
    "create_beta_group",
    "Create a new beta group (internal or external) for TestFlight",
    {
      appId: z.string().describe("The app ID"),
      name: z.string().describe("Group name"),
      isInternalGroup: z.boolean().optional().describe("Internal group (true) or external (false)"),
      publicLinkEnabled: z.boolean().optional().describe("Enable public TestFlight link"),
      publicLinkLimit: z.number().optional().describe("Limit for public link"),
      feedbackEnabled: z.boolean().optional().describe("Enable feedback from testers"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createBetaGroup(args))
  );

  server.tool(
    "delete_beta_group",
    "Delete a beta group (cannot be undone)",
    { betaGroupId: z.string().describe("The beta group ID to delete") },
    { destructiveHint: true, idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => deleteBetaGroup(args))
  );

  server.tool(
    "list_beta_testers",
    "List beta testers, optionally filtered by email, group, or app",
    {
      email: z.string().optional().describe("Filter by tester email"),
      betaGroupId: z.string().optional().describe("Filter by beta group ID"),
      appId: z.string().optional().describe("Filter by app ID"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listBetaTesters(args))
  );

  server.tool(
    "add_tester_to_group",
    "Add a beta tester to a TestFlight group",
    {
      betaGroupId: z.string().describe("The beta group ID"),
      betaTesterId: z.string().describe("The beta tester ID to add"),
    },
    { openWorldHint: true },
    async (args) => handle(() => addTesterToGroup(args))
  );

  server.tool(
    "remove_tester_from_group",
    "Remove a beta tester from a TestFlight group",
    {
      betaGroupId: z.string().describe("The beta group ID"),
      betaTesterId: z.string().describe("The beta tester ID to remove"),
    },
    { destructiveHint: true, idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => removeTesterFromGroup(args))
  );

  server.tool(
    "submit_for_beta_review",
    "Submit a build for TestFlight beta review",
    { buildId: z.string().describe("The build ID to submit for beta review") },
    { openWorldHint: true },
    async (args) => handle(() => submitForBetaReview(args))
  );

  // ─── 7. BUNDLE IDS & CAPABILITIES ──────────────────────────

  server.tool(
    "list_bundle_ids",
    "List registered bundle IDs in your team",
    {
      identifier: z.string().optional().describe("Filter by bundle ID identifier"),
      platform: z.string().optional().describe("Filter by platform (IOS, MAC_OS)"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listBundleIds(args))
  );

  server.tool(
    "get_bundle_id",
    "Get details for a specific bundle ID",
    {
      bundleIdId: z.string().describe("The bundle ID resource ID"),
      include: z.array(z.string()).optional().describe("Related resources to include (e.g. bundleIdCapabilities)"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => getBundleId(args))
  );

  server.tool(
    "register_bundle_id",
    "Register a new bundle ID",
    {
      identifier: z.string().describe("The bundle ID (e.g. com.example.app)"),
      name: z.string().describe("A name for this bundle ID"),
      platform: z.string().describe("Platform (IOS, MAC_OS)"),
      seedId: z.string().optional().describe("Prefix seed ID"),
    },
    { openWorldHint: true },
    async (args) => handle(() => registerBundleId(args))
  );

  server.tool(
    "enable_capability",
    "Enable a capability (push notifications, iCloud, etc.) for a bundle ID",
    {
      bundleIdId: z.string().describe("The bundle ID resource ID"),
      capabilityType: z.string().describe("Capability type (e.g. PUSH_NOTIFICATIONS, ICLOUD, SIGN_IN_WITH_APPLE)"),
      settings: z.array(z.object({
        key: z.string(),
        options: z.array(z.object({
          key: z.string(),
          enabled: z.boolean(),
        })),
      })).optional().describe("Capability settings"),
    },
    { openWorldHint: true },
    async (args) => handle(() => enableCapability(args))
  );

  server.tool(
    "disable_capability",
    "Disable a capability for a bundle ID (cannot be undone easily)",
    { capabilityId: z.string().describe("The capability ID to disable") },
    { destructiveHint: true, idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => disableCapability(args))
  );

  // ─── 8. DEVICES ─────────────────────────────────────────────

  server.tool(
    "list_devices",
    "List registered test devices",
    {
      platform: z.string().optional().describe("Filter by platform (IOS, MAC_OS)"),
      status: z.string().optional().describe("Filter by status (ENABLED, DISABLED)"),
      name: z.string().optional().describe("Filter by device name"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listDevices(args))
  );

  server.tool(
    "register_device",
    "Register a new test device (UDID)",
    {
      name: z.string().describe("Device name"),
      udid: z.string().describe("Device UDID"),
      platform: z.string().describe("Platform (IOS, MAC_OS)"),
    },
    { openWorldHint: true },
    async (args) => handle(() => registerDevice(args))
  );

  // ─── 9. CERTIFICATES ───────────────────────────────────────

  server.tool(
    "list_certificates",
    "List signing certificates",
    {
      certificateType: z.string().optional().describe("Filter by type (IOS_DEVELOPMENT, IOS_DISTRIBUTION, etc.)"),
      displayName: z.string().optional().describe("Filter by display name"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listCertificates(args))
  );

  server.tool(
    "get_certificate",
    "Get details for a specific certificate",
    { certificateId: z.string().describe("The certificate ID") },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => getCertificate(args))
  );

  server.tool(
    "revoke_certificate",
    "Revoke a signing certificate (DESTRUCTIVE — cannot be undone)",
    { certificateId: z.string().describe("The certificate ID to revoke") },
    { destructiveHint: true, openWorldHint: true },
    async (args) => handle(() => revokeCertificate(args))
  );

  // ─── 10. PROVISIONING PROFILES ──────────────────────────────

  server.tool(
    "list_profiles",
    "List provisioning profiles",
    {
      profileType: z.string().optional().describe("Filter by type (IOS_APP_DEVELOPMENT, IOS_APP_STORE, etc.)"),
      name: z.string().optional().describe("Filter by profile name"),
      profileState: z.string().optional().describe("Filter by state (ACTIVE, INVALID)"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listProfiles(args))
  );

  server.tool(
    "create_profile",
    "Create a new provisioning profile",
    {
      name: z.string().describe("Profile name"),
      profileType: z.string().describe("Profile type (IOS_APP_DEVELOPMENT, IOS_APP_STORE, etc.)"),
      bundleIdId: z.string().describe("Bundle ID resource ID"),
      certificateIds: z.array(z.string()).describe("Certificate IDs to include"),
      deviceIds: z.array(z.string()).optional().describe("Device IDs to include (for development profiles)"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createProfile(args))
  );

  server.tool(
    "delete_profile",
    "Delete a provisioning profile",
    { profileId: z.string().describe("The profile ID to delete") },
    { destructiveHint: true, idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => deleteProfile(args))
  );

  // ─── 11. USERS & ACCESS ────────────────────────────────────

  server.tool(
    "list_users",
    "List users in your App Store Connect team",
    {
      role: z.string().optional().describe("Filter by role (ADMIN, DEVELOPER, etc.)"),
      username: z.string().optional().describe("Filter by username/email"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listUsers(args))
  );

  server.tool(
    "get_user",
    "Get details for a specific team user",
    { userId: z.string().describe("The user ID") },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => getUser(args))
  );

  server.tool(
    "update_user_roles",
    "Update a user's roles and visibility settings",
    {
      userId: z.string().describe("The user ID"),
      roles: z.array(z.string()).describe("Roles to assign (ADMIN, DEVELOPER, MARKETING, etc.)"),
      allAppsVisible: z.boolean().optional().describe("Whether user can see all apps"),
    },
    { idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => updateUserRoles(args))
  );

  server.tool(
    "remove_user",
    "Remove a user from the team (DESTRUCTIVE)",
    { userId: z.string().describe("The user ID to remove") },
    { destructiveHint: true, openWorldHint: true },
    async (args) => handle(() => removeUser(args))
  );

  // ─── 12. IN-APP PURCHASES ──────────────────────────────────

  server.tool(
    "list_in_app_purchases",
    "List in-app purchases for an app (v2 API)",
    {
      appId: z.string().describe("The app ID"),
      filterProductId: z.string().optional().describe("Filter by product ID"),
      filterState: z.string().optional().describe("Filter by state"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listInAppPurchases(args))
  );

  server.tool(
    "get_in_app_purchase",
    "Get details for a specific in-app purchase (v2 API)",
    {
      inAppPurchaseId: z.string().describe("The IAP ID"),
      include: z.array(z.string()).optional().describe("Related resources to include"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => getInAppPurchase(args))
  );

  server.tool(
    "create_in_app_purchase",
    "Create a new in-app purchase (v2 API)",
    {
      appId: z.string().describe("The app ID"),
      name: z.string().describe("IAP display name"),
      productId: z.string().describe("Product ID (e.g. com.example.premium)"),
      inAppPurchaseType: z.string().describe("Type: CONSUMABLE, NON_CONSUMABLE, NON_RENEWING_SUBSCRIPTION"),
      reviewNote: z.string().optional().describe("Review note for App Review"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createInAppPurchase(args))
  );

  server.tool(
    "delete_in_app_purchase",
    "Delete an in-app purchase (DESTRUCTIVE)",
    { inAppPurchaseId: z.string().describe("The IAP ID to delete") },
    { destructiveHint: true, openWorldHint: true },
    async (args) => handle(() => deleteInAppPurchase(args))
  );

  // ─── 13. SUBSCRIPTIONS ─────────────────────────────────────

  server.tool(
    "list_subscription_groups",
    "List subscription groups for an app",
    {
      appId: z.string().describe("The app ID"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listSubscriptionGroups(args))
  );

  server.tool(
    "create_subscription_group",
    "Create a new subscription group",
    {
      appId: z.string().describe("The app ID"),
      referenceName: z.string().describe("Reference name for the group"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createSubscriptionGroup(args))
  );

  server.tool(
    "list_subscriptions",
    "List subscriptions within a subscription group",
    {
      subscriptionGroupId: z.string().describe("The subscription group ID"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listSubscriptions(args))
  );

  server.tool(
    "create_subscription",
    "Create a new auto-renewable subscription",
    {
      subscriptionGroupId: z.string().describe("The subscription group ID"),
      name: z.string().describe("Subscription name"),
      productId: z.string().describe("Product ID"),
      subscriptionPeriod: z.string().optional().describe("Period: ONE_WEEK, ONE_MONTH, TWO_MONTHS, THREE_MONTHS, SIX_MONTHS, ONE_YEAR"),
      familySharable: z.boolean().optional().describe("Family sharing enabled"),
      reviewNote: z.string().optional().describe("Review note for App Review"),
      groupLevel: z.number().optional().describe("Level within the subscription group"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createSubscription(args))
  );

  server.tool(
    "delete_subscription",
    "Delete a subscription (DESTRUCTIVE)",
    { subscriptionId: z.string().describe("The subscription ID to delete") },
    { destructiveHint: true, openWorldHint: true },
    async (args) => handle(() => deleteSubscription(args))
  );

  // ─── 14. REVIEW SUBMISSIONS ────────────────────────────────

  server.tool(
    "create_review_submission",
    "Submit an app version for App Store review",
    {
      appId: z.string().describe("The app ID"),
      platform: z.string().describe("Platform (IOS, MAC_OS, TV_OS)"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createReviewSubmission(args))
  );

  server.tool(
    "list_review_submissions",
    "List review submission status for an app",
    {
      appId: z.string().describe("The app ID"),
      platform: z.string().optional().describe("Filter by platform"),
      state: z.string().optional().describe("Filter by state"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listReviewSubmissions(args))
  );

  // ─── 15. APP PRICING & AVAILABILITY ────────────────────────

  server.tool(
    "list_app_price_points",
    "List price points for an app, optionally filtered by territory",
    {
      appId: z.string().describe("The app ID"),
      territory: z.string().optional().describe("Filter by territory (e.g. USA, GBR, JPN)"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listAppPricePoints(args))
  );

  server.tool(
    "list_territories",
    "List all available App Store territories",
    { limit: z.number().optional().describe("Max results") },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listTerritories(args))
  );

  server.tool(
    "list_app_availabilities",
    "Check which territories an app is available in",
    { appId: z.string().describe("The app ID") },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listAppAvailabilities(args))
  );

  // ─── 16. CUSTOMER REVIEWS ──────────────────────────────────

  server.tool(
    "list_customer_reviews",
    "List customer reviews for an app",
    {
      appId: z.string().describe("The app ID"),
      rating: z.string().optional().describe("Filter by rating (1-5)"),
      territory: z.string().optional().describe("Filter by territory"),
      sort: z.string().optional().describe("Sort order (e.g. -createdDate, rating)"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listCustomerReviews(args))
  );

  server.tool(
    "get_customer_review",
    "Get details for a specific customer review",
    { reviewId: z.string().describe("The review ID") },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => getCustomerReview(args))
  );

  server.tool(
    "create_review_response",
    "Respond to a customer review",
    {
      reviewId: z.string().describe("The review ID to respond to"),
      responseBody: z.string().describe("Your response text"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createReviewResponse(args))
  );

  // ─── 17. GAME CENTER ───────────────────────────────────────

  server.tool(
    "list_game_center_leaderboards",
    "List Game Center leaderboards for an app",
    {
      appId: z.string().describe("The app ID"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listGameCenterLeaderboards(args))
  );

  server.tool(
    "create_game_center_leaderboard",
    "Create a new Game Center leaderboard",
    {
      gameCenterDetailId: z.string().describe("The Game Center detail ID"),
      referenceName: z.string().describe("Reference name"),
      vendorIdentifier: z.string().describe("Vendor identifier"),
      defaultFormatter: z.string().describe("Default formatter (INTEGER, DECIMAL_POINT_1, TIME, etc.)"),
      submissionType: z.string().describe("BEST_SCORE or MOST_RECENT_SCORE"),
      scoreSortType: z.string().describe("ASC or DESC"),
      scoreRangeStart: z.string().optional().describe("Min score"),
      scoreRangeEnd: z.string().optional().describe("Max score"),
      recurrenceStartDate: z.string().optional().describe("ISO date for recurring leaderboard"),
      recurrenceDuration: z.string().optional().describe("Duration (e.g. P7D)"),
      recurrenceRule: z.string().optional().describe("Recurrence rule"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createGameCenterLeaderboard(args))
  );

  server.tool(
    "list_game_center_achievements",
    "List Game Center achievements for an app",
    {
      appId: z.string().describe("The app ID"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listGameCenterAchievements(args))
  );

  server.tool(
    "create_game_center_achievement",
    "Create a new Game Center achievement",
    {
      gameCenterDetailId: z.string().describe("The Game Center detail ID"),
      referenceName: z.string().describe("Reference name"),
      vendorIdentifier: z.string().describe("Vendor identifier"),
      points: z.number().describe("Point value (1-100)"),
      showBeforeEarned: z.boolean().describe("Show before player earns it"),
      repeatable: z.boolean().describe("Can be earned multiple times"),
    },
    { openWorldHint: true },
    async (args) => handle(() => createGameCenterAchievement(args))
  );

  // ─── 18. APP CLIPS ─────────────────────────────────────────

  server.tool(
    "list_app_clip_default_experiences",
    "List App Clip default experiences",
    {
      appClipId: z.string().describe("The App Clip ID"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listAppClipDefaultExperiences(args))
  );

  server.tool(
    "update_app_clip_default_experience",
    "Update an App Clip default experience",
    {
      appClipDefaultExperienceId: z.string().describe("The experience ID"),
      action: z.string().optional().describe("App Clip action (OPEN, VIEW, PLAY)"),
    },
    { idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => updateAppClipDefaultExperience(args))
  );

  // ─── 19. XCODE CLOUD ───────────────────────────────────────

  server.tool(
    "list_ci_workflows",
    "List Xcode Cloud CI/CD workflows",
    {
      productId: z.string().optional().describe("Filter by product ID"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listCiWorkflows(args))
  );

  server.tool(
    "start_ci_build",
    "Trigger a new Xcode Cloud build for a workflow",
    { workflowId: z.string().describe("The workflow ID to trigger") },
    { openWorldHint: true },
    async (args) => handle(() => startCiBuild(args))
  );

  server.tool(
    "list_ci_build_runs",
    "List Xcode Cloud build run results",
    {
      workflowId: z.string().optional().describe("Filter by workflow ID"),
      limit: z.number().optional().describe("Max results"),
    },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => listCiBuildRuns(args))
  );

  // ─── 20. AGE RATINGS & ENCRYPTION ──────────────────────────

  server.tool(
    "get_age_rating_declaration",
    "Get the age rating declaration for an App Store version",
    { versionId: z.string().describe("The version ID") },
    { readOnlyHint: true, openWorldHint: true },
    async (args) => handle(() => getAgeRatingDeclaration(args))
  );

  server.tool(
    "update_age_rating_declaration",
    "Update age/content rating declaration for a version",
    {
      ageRatingDeclarationId: z.string().describe("The age rating declaration ID"),
      alcoholTobaccoOrDrugUseOrReferences: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      contests: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      gamblingAndContests: z.boolean().optional().describe("Includes gambling and contests"),
      gambling: z.boolean().optional().describe("Includes simulated gambling"),
      gamblingSimulated: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      horrorOrFearThemes: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      matureOrSuggestiveThemes: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      medicalOrTreatmentInformation: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      profanityOrCrudeHumor: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      sexualContentGraphicAndNudity: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      sexualContentOrNudity: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      seventeenPlus: z.boolean().optional().describe("Restricted to 17+"),
      unrestrictedWebAccess: z.boolean().optional().describe("Unrestricted web access"),
      violenceCartoonOrFantasy: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      violenceRealistic: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
      violenceRealisticProlongedGraphicOrSadistic: z.string().optional().describe("NONE, INFREQUENT_OR_MILD, FREQUENT_OR_INTENSE"),
    },
    { idempotentHint: true, openWorldHint: true },
    async (args) => handle(() => updateAgeRatingDeclaration(args))
  );
}
