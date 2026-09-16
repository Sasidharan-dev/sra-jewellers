import { randomUUID } from "node:crypto";
import { currentUser } from "@/lib/server/auth";
import { createReview, listReviews } from "@/lib/server/db";
import { jsonError, requiredString } from "@/lib/server/validation";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  return Response.json({ reviews: await listReviews(slug) });
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ error: "Please sign in to review" }, { status: 401 });
    const { slug } = await context.params;
    const body = await request.json();
    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");
    const review = await createReview({ id: randomUUID(), productId: slug, userId: user.id, name: user.name, rating, comment: requiredString(body.comment, "Review", 1000), createdAt: new Date().toISOString() });
    return Response.json({ review }, { status: 201 });
  } catch (error) { return jsonError(error); }
}
