import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'https://strategy-asset-studio.com', // Optional: for OpenRouter rankings
        'X-Title': 'Strategy Asset Studio', // Optional: for OpenRouter rankings
    },
});

// System prompt for the Tetris Coach
const SYSTEM_PROMPT = `You are a world-class Tetris coach. 
Your goal is to analyze the current board state and provide the best immediate move.
Output MUST be a JSON object with:
- "action": string (e.g., "move_left", "rotate_cw", "drop")
- "explanation": string (concise reason, max 1 sentence)
- "risk_level": string ("low", "medium", "high")

Keep explanations extremely short and tactical.`;

export async function getAiAdvice(boardState: any) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'qwen/qwen-2.5-72b-instruct', // Using Qwen 2.5 via OpenRouter
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: JSON.stringify(boardState) }
            ],
            response_format: { type: 'json_object' }
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error('No content from AI');

        return JSON.parse(content);
    } catch (error) {
        console.error('AI Coach Error:', error);
        // Fallback advice if AI fails
        return {
            action: 'hold',
            explanation: 'AI connection unstable, play safely.',
            risk_level: 'low'
        };
    }
}
