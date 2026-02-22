import { getClient } from "../client.js";

export async function listCiWorkflows(args: {
  productId?: string;
  limit?: number;
}) {
  const client = await getClient();
  const params: string[] = [];
  if (args.productId) params.push(`filter[product]=${args.productId}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.length ? "?" + params.join("&") : "";
  const { data } = await client.read(`ciWorkflows${qs}`);
  return data;
}

export async function startCiBuild(args: { workflowId: string }) {
  const client = await getClient();
  return client.create({
    type: "ciBuildRuns",
    relationships: {
      workflow: { data: { type: "ciWorkflows", id: args.workflowId } },
    },
  });
}

export async function listCiBuildRuns(args: {
  workflowId?: string;
  limit?: number;
}) {
  const client = await getClient();
  if (args.workflowId) {
    const qs = args.limit ? `?limit=${args.limit}` : "";
    const { data } = await client.read(
      `ciWorkflows/${args.workflowId}/buildRuns${qs}`
    );
    return data;
  }
  const qs = args.limit ? `?limit=${args.limit}` : "";
  const { data } = await client.read(`ciBuildRuns${qs}`);
  return data;
}
