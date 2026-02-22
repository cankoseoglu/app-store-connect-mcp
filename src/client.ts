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

export function getClient(): ASCClient {
  if (!clientInstance) {
    throw new Error(
      "ASC client not initialized. Ensure APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_ID, and APP_STORE_CONNECT_PRIVATE_KEY are set."
    );
  }
  return clientInstance;
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

  return clientInstance;
}
