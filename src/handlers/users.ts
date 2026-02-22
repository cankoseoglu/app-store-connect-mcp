import { getClient } from "../client.js";

export async function listUsers(args: {
  role?: string;
  username?: string;
  limit?: number;
}) {
  const client = await getClient();
  const params: string[] = [];
  if (args.role) params.push(`filter[roles]=${args.role}`);
  if (args.username) params.push(`filter[username]=${args.username}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.length ? "?" + params.join("&") : "";
  const { data } = await client.read(`users${qs}`);
  return data;
}

export async function getUser(args: { userId: string }) {
  const client = await getClient();
  const { data } = await client.read(`users/${args.userId}`);
  return data;
}

export async function updateUserRoles(args: {
  userId: string;
  roles: string[];
  allAppsVisible?: boolean;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = { roles: args.roles };
  if (args.allAppsVisible !== undefined) attributes.allAppsVisible = args.allAppsVisible;

  return client.update(
    { type: "users", id: args.userId },
    { attributes }
  );
}

export async function removeUser(args: { userId: string }) {
  const client = await getClient();
  return client.remove({ type: "users", id: args.userId });
}
