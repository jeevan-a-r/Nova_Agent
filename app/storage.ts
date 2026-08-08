import { createClient } from "redis";

let client: ReturnType<typeof createClient> | null = null;

async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
  }
  return client;
}

export type Post = {
  id: string;
  createdAt: string;
  text: string;
  rationale: string;
  sources: string[];
};

export async function addPost(post: Post) {
  const c = await getClient();
  // Save this post, and add it to a list of all post IDs (newest first)
  await c.set(`post:${post.id}`, JSON.stringify(post));
  await c.lPush("post_ids", post.id);
}

export async function getAllPosts(): Promise<Post[]> {
  const c = await getClient();
  const ids = await c.lRange("post_ids", 0, -1); // already newest-first since we lPush
  const posts: Post[] = [];

  for (const id of ids) {
    const raw = await c.get(`post:${id}`);
    if (raw) posts.push(JSON.parse(raw));
  }

  return posts;
}