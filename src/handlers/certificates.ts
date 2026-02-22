import { getClient } from "../client.js";

export async function listCertificates(args: {
  certificateType?: string;
  displayName?: string;
  limit?: number;
}) {
  const client = getClient();
  const params: string[] = [];
  if (args.certificateType) params.push(`filter[certificateType]=${args.certificateType}`);
  if (args.displayName) params.push(`filter[displayName]=${args.displayName}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.length ? "?" + params.join("&") : "";
  const { data } = await client.read(`certificates${qs}`);
  return data;
}

export async function getCertificate(args: { certificateId: string }) {
  const client = getClient();
  const { data } = await client.read(`certificates/${args.certificateId}`);
  return data;
}

export async function revokeCertificate(args: { certificateId: string }) {
  const client = getClient();
  return client.remove({ type: "certificates", id: args.certificateId });
}
