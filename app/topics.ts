export type Topic = {
  title: string;
  url: string;
};

export async function discoverTopics(): Promise<Topic[]> {
  // Get the IDs of currently popular Hacker News stories
  const topStoriesRes = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const topStoryIds: number[] = await topStoriesRes.json();

  // Only look at the first 15 to keep things fast
  const idsToCheck = topStoryIds.slice(0, 15);

  const stories = await Promise.all(
    idsToCheck.map(async (id) => {
      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return res.json();
    })
  );

  // Keep only stories that look AI/tech related and have both a title and a link
  const aiKeywords = ["ai", "gpt", "llm", "model", "openai", "anthropic", "claude", "gemini", "machine learning", "neural"];

  const relevant = stories.filter((story) => {
    if (!story?.title || !story?.url) return false;
    const lowerTitle = story.title.toLowerCase();
    return aiKeywords.some((keyword) => lowerTitle.includes(keyword));
  });

  return relevant.map((story) => ({
    title: story.title,
    url: story.url,
  }));
}