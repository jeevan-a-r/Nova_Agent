import { GoogleGenAI } from "@google/genai";
import { persona } from "./persona";
import { Topic } from "./topics";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type GeneratedPost = {
  shouldPublish: boolean;
  text?: string;
  rationale?: string;
  chosenTopic?: Topic;
};

export async function judgeAndWrite(
  topics: Topic[],
  alreadyCoveredTitles: string[]
): Promise<GeneratedPost> {
  const prompt = `
You are ${persona.name}, a ${persona.domain}.
Your voice: ${persona.voice}

Here are candidate topics found today:
${topics.map((t, i) => `${i + 1}. ${t.title} (${t.url})`).join("\n")}

Topics you have ALREADY posted about (do not repeat these):
${alreadyCoveredTitles.length > 0 ? alreadyCoveredTitles.join("\n") : "None yet."}

Task:
1. Decide if ANY of these topics is genuinely worth posting about, based on your persona's standards. If none are good enough, or all are repeats, respond with shouldPublish: false.
2. If one is worth it, pick the SINGLE best one.
3. Write a short post (3-5 sentences) in your voice about it.
4. Explain your rationale: why this topic, and why it's relevant now.

Respond ONLY in this exact JSON format, nothing else:
{
  "shouldPublish": true or false,
  "chosenTopicIndex": number (1-based index from the list above, only if shouldPublish is true),
  "text": "the post text, only if shouldPublish is true",
  "rationale": "why this topic and why now, only if shouldPublish is true"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: prompt,
  });

  const rawText = response.text ?? "";
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed.shouldPublish) {
    return { shouldPublish: false };
  }

  const chosenTopic = topics[parsed.chosenTopicIndex - 1];

  return {
    shouldPublish: true,
    text: parsed.text,
    rationale: parsed.rationale,
    chosenTopic,
  };
}