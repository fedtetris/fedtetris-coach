import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Default to FLock API, fallback to OpenAI if needed (or mock)
// Default to FLock API (OpenRouter under the hood)
const FLOCK_API_ENDPOINT =
  process.env.FLOCK_API_ENDPOINT || "https://api.flock.io/v1";
const FLOCK_API_KEY = process.env.FLOCK_API_KEY;

if (!FLOCK_API_KEY || FLOCK_API_KEY.startsWith("dummy")) {
  console.warn(
    "Warning: FLOCK_API_KEY is missing or dummy. AI features will be mocked.",
  );
} else {
  console.log(`FLock API Key loaded: ${FLOCK_API_KEY.substring(0, 10)}...`);
}

const client = new OpenAI({
  baseURL: FLOCK_API_ENDPOINT,
  apiKey: FLOCK_API_KEY || "dummy-key",
});

export interface StrategyAdvice {
  recommendedAction: "LEFT" | "RIGHT" | "ROTATE" | "DROP";
  explanation: string;
}

export async function getFlockAdvice(
  stateSummary: any,
  playerProfile: any,
): Promise<StrategyAdvice> {
  const systemPrompt = `
You are an expert Tetris Strategy Coach.
Your goal is to help the player survive and score points by clearing lines.

ANALYSIS RULES:
1. Analyze the 'board' (10x20 grid). **Column 0 is the FAR LEFT. Column 9 is the FAR RIGHT.**
2. Identify the 'currentPiece' position (x, y). **x=0 is Left, x=9 is Right.**
3. Determine the BEST PLACEMENT (Target X, Target Rotation).

ACTION RULES:
1. **Rotation**: If current rotation != target rotation, output "ROTATE".
2. **Lateral Movement**:
   - If Target X < Current X (Target is to the left), output "LEFT".
   - If Target X > Current X (Target is to the right), output "RIGHT".
3. **Drop**: If Target X == Current X AND Rotation is correct, output "DROP".
- Do not suggest "LEFT" or "RIGHT" if the piece is already at the target column.
- Do not suggest "DROP" unless rotation and position are perfect.

RESPONSE FORMAT (JSON ONLY, NO MARKDOWN, NO BACKTICKS):
{
  "recommendedAction": "LEFT" | "RIGHT" | "ROTATE" | "DROP",
  "explanation": "Very brief reasoning (max 10 words)"
}
`;

  const userPrompt = `
Current Game State:
${JSON.stringify(stateSummary)}

Player Profile: ${playerProfile.level || "intermediate"}
`;

  try {
    // If using dummy key, throw immediately to skip timeout
    if (!FLOCK_API_KEY || FLOCK_API_KEY.startsWith("dummy")) {
      throw new Error("Using dummy key, skipping API call");
    }

    const completion = await client.chat.completions.create({
      model: "anthropic/claude-opus-4.5", // User's choice
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    let content = completion.choices[0].message.content;
    if (!content) throw new Error("Empty response from FLock");

    // Sanitize: Remove markdown code blocks if present
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(content) as StrategyAdvice;
  } catch (error) {
    console.error(
      "FLock API Error (or Mocking):",
      error instanceof Error ? error.message : error,
    );
    // Fallback/Mock for demo if API fails
    const actions = ["LEFT", "RIGHT", "ROTATE", "DROP"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    return {
      recommendedAction: randomAction as any,
      explanation: "AI is currently offline (Mock). Keep board flat!",
    };
  }
}
