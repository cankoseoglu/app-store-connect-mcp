declare module "node-app-store-connect-api" {
  export function api(options: {
    issuerId: string;
    apiKey: string;
    privateKey: string;
    version?: number;
    urlBase?: string;
    tokenExpiresInSeconds?: number;
    automaticRetries?: number;
    logRequests?: boolean;
    fetch?: typeof globalThis.fetch;
    haltPaginationOnEmptyData?: boolean;
  }): Promise<{
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
    uploadAsset: (
      assetData: any,
      buffer: Buffer,
      maxTriesPerPart?: number,
      version?: number
    ) => Promise<void>;
    pollForUploadSuccess: (
      assetUrl: string,
      logHeader?: string,
      delayInMilliseconds?: number,
      maxTries?: number
    ) => Promise<void>;
    fetch: (url: string, options?: Record<string, unknown>) => Promise<Response>;
    fetchJson: (url: string, options?: Record<string, unknown>) => Promise<any>;
    postJson: (
      url: string,
      data: unknown,
      options?: Record<string, unknown>
    ) => Promise<any>;
  }>;
}
