const BREETH_API_KEY = process.env.BREETH_API_KEY;

export async function saveMemory(postTitle: string, postText: string) {
  await fetch("https://api.thebreeth.com/v1/episodes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BREETH_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `Nova posted about: "${postTitle}". Post text: "${postText}"`,
      group_id: "nova-posts",
      extract_intent: true,
    }),
  });
}

export async function getPastTopics(): Promise<string[]> {
  const res = await fetch("https://api.thebreeth.com/v1/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BREETH_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: "What has Nova posted about?",
      limit: 20,
    }),
  });
  const data = await res.json();
  // The response gives back "edges" - each with a "fact" describing what happened
  return data.edges?.map((edge: any) => edge.fact) ?? [];
}