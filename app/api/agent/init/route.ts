import { NextRequest, NextResponse } from "next/server";
import { discoverTopics } from "../../../topics";
import { judgeAndWrite } from "../../../generatePost";
import { getPastTopics, saveMemory } from "../../../memory";
import { addPost } from "../../../storage";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const agentId = crypto.randomUUID();

  // Do the first "cycle" immediately: find topics, judge, write, save
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
    }
  } catch (err) {
    console.error("Init cycle failed:", err);
    // We don't fail the whole request if this first cycle has an issue -
    // the agent is still "initialized," future cycles can still work
  }

  return NextResponse.json({ agentId });
}