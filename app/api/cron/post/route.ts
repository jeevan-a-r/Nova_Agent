import { NextResponse } from "next/server";
import { discoverTopics } from "../../../topics";
import { judgeAndWrite } from "../../../generatePost";
import { getPastTopics, saveMemory } from "../../../memory";
import { addPost } from "../../../storage";

export async function GET() {
  try {
    const topics = await discoverTopics();
    const pastTopics = await getPastTopics();
    const result = await judgeAndWrite(topics, pastTopics);

    if (result.shouldPublish && result.chosenTopic) {
      const post = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        text: result.text!,
        rationale: result.rationale!,
        sources: [result.chosenTopic.url],
      };

      await addPost(post);
      await saveMemory(result.chosenTopic.title, result.text!);

      return NextResponse.json({ published: true, post });
    }

    return NextResponse.json({ published: false, reason: "No topic met publishing standards" });
  } catch (err) {
    console.error("Cron post failed:", err);
    return NextResponse.json({ published: false, error: String(err) }, { status: 500 });
  }
}