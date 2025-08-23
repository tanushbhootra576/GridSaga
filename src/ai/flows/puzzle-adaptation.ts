'use server';


import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptPuzzleInputSchema = z.object({
  playerSkillLevel: z
    .number()
    .describe('The skill level of the player (e.g., 1-10).'),
  currentPuzzleState: z
    .string()
    .describe('The current state of the puzzle as a string.'),
  gameMode: z
    .string()
    .describe('The current game mode (e.g., time-limited, move-limited).'),
  movesRemaining: z
    .number()
    .optional()
    .describe('Number of moves remaining in move-limited game modes'),
  timeRemaining: z
    .number()
    .optional()
    .describe('Time remaining in time-limited game modes'),
});
export type AdaptPuzzleInput = z.infer<typeof AdaptPuzzleInputSchema>;

const AdaptPuzzleOutputSchema = z.object({
  hint: z.string().describe('A helpful hint for the player.'),
  suggestedVariation: z
    .string()
    .describe('A suggestion for a variation to the current puzzle.'),
});
export type AdaptPuzzleOutput = z.infer<typeof AdaptPuzzleOutputSchema>;

export async function adaptPuzzle(input: AdaptPuzzleInput): Promise<AdaptPuzzleOutput> {
  return adaptPuzzleFlow(input);
}

const adaptPuzzlePrompt = ai.definePrompt({
  name: 'adaptPuzzlePrompt',
  input: {schema: AdaptPuzzleInputSchema},
  output: {schema: AdaptPuzzleOutputSchema},
  prompt: `You are an expert puzzle game assistant. Given the player's skill level, the current puzzle state, and the game mode, provide a helpful hint and suggest a puzzle variation to keep the player challenged and engaged. If the game is time-limited or move-limited, take into account the moves or time remaining when generating the hint.

Player Skill Level: {{{playerSkillLevel}}}
Current Puzzle State: {{{currentPuzzleState}}}
Game Mode: {{{gameMode}}}
Moves Remaining: {{{movesRemaining}}}
Time Remaining: {{{timeRemaining}}}

Hint: A helpful hint for the player.
Suggested Variation: A suggestion for a variation to the current puzzle. Be creative, but keep it reasonably similar to the current puzzle to maintain flow. This should be one sentence long.

Ensure the hint and suggested variation are appropriate for the player's skill level and the current game mode.
`, 
});

const adaptPuzzleFlow = ai.defineFlow(
  {
    name: 'adaptPuzzleFlow',
    inputSchema: AdaptPuzzleInputSchema,
    outputSchema: AdaptPuzzleOutputSchema,
  },
  async input => {
    const {output} = await adaptPuzzlePrompt(input);
    return output!;
  }
);
