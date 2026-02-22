import { getClient } from "../client.js";

export async function listCustomerReviews(args: {
  appId: string;
  rating?: string;
  territory?: string;
  sort?: string;
  limit?: number;
}) {
  const client = await getClient();
  const params: string[] = [];
  if (args.rating) params.push(`filter[rating]=${args.rating}`);
  if (args.territory) params.push(`filter[territory]=${args.territory}`);
  if (args.sort) params.push(`sort=${args.sort}`);
  if (args.limit) params.push(`limit=${args.limit}`);
  const qs = params.length ? "?" + params.join("&") : "";
  const { data } = await client.read(`apps/${args.appId}/customerReviews${qs}`);
  return data;
}

export async function getCustomerReview(args: { reviewId: string }) {
  const client = await getClient();
  const { data } = await client.read(`customerReviews/${args.reviewId}`);
  return data;
}

export async function createReviewResponse(args: {
  reviewId: string;
  responseBody: string;
}) {
  const client = await getClient();
  return client.create({
    type: "customerReviewResponses",
    attributes: { responseBody: args.responseBody },
    relationships: {
      review: { data: { type: "customerReviews", id: args.reviewId } },
    },
  });
}
