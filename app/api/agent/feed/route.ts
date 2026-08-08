import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "../../../storage";

export async function GET(request: NextRequest) {
  const posts = await getAllPosts();

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      createdAt: p.createdAt,
      text: p.text,
      rationale: p.rationale,
      sources: p.sources,
    })),
  });
}