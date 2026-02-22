import { api } from "node-app-store-connect-api";

export interface ASCClient {
  read: (url: string, options?: Record<string, unknown>) => Promise<any>;
  readAll: (url: string, options?: Record<string, unknown>) => Promise<any>;
  create: (payload: {
    type: string;
    attributes?: Record<string, unknown>;
    relationships?: Record<string, unknown>;
    included?: unknown[];
    version?: number;
  }) => Promise<any>;
  update: (
    data: { type: string; id: string },
    payload: {
      attributes?: Record<string, unknown>;
      relationships?: Record<string, unknown>;
      included?: unknown[];
      version?: number;
    }
  ) => Promise<any>;
  remove: (
    data: { type: string; id: string },
    options?: { version?: number }
  ) => Promise<any>;
  uploadAsset: (assetData: any, buffer: Buffer) => Promise<void>;
  pollForUploadSuccess: (assetUrl: string) => Promise<void>;
  fetch: (url: string, options?: Record<string, unknown>) => Promise<Response>;
}

let clientInstance: ASCClient | null = null;
let clientCreatedAt: number | null = null;

// Token expires after 20 minutes; refresh after 15 to leave buffer
const TOKEN_MAX_AGE_MS = 15 * 60 * 1000;

function isTokenExpired(): boolean {
  if (!clientCreatedAt) return true;
  return Date.now() - clientCreatedAt > TOKEN_MAX_AGE_MS;
}

export async function getClient(): Promise<ASCClient> {
  if (!clientInstance || isTokenExpired()) {
    await initClient();
  }
  return clientInstance!;
}

export async function initClient(): Promise<ASCClient> {
  const issuerId = process.env.APP_STORE_CONNECT_ISSUER_ID;
  const apiKey = process.env.APP_STORE_CONNECT_KEY_ID;
  let privateKey = process.env.APP_STORE_CONNECT_PRIVATE_KEY;
  const privateKeyPath = process.env.APP_STORE_CONNECT_PRIVATE_KEY_PATH;

  if (!issuerId) throw new Error("Missing APP_STORE_CONNECT_ISSUER_ID");
  if (!apiKey) throw new Error("Missing APP_STORE_CONNECT_KEY_ID");

  if (!privateKey && privateKeyPath) {
    const fs = await import("node:fs/promises");
    privateKey = await fs.readFile(privateKeyPath, "utf8");
  }

  if (!privateKey) {
    throw new Error(
      "Missing APP_STORE_CONNECT_PRIVATE_KEY or APP_STORE_CONNECT_PRIVATE_KEY_PATH"
    );
  }

  // The env var may have literal \n instead of actual newlines
  privateKey = privateKey.replace(/\\n/g, "\n");

  clientInstance = (await api({
    issuerId,
    apiKey,
    privateKey,
  })) as unknown as ASCClient;

  clientCreatedAt = Date.now();

  return clientInstance;
}
