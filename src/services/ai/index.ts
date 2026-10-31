/**
 * ai/index.ts — AI provider abstraction.
 *
 * This is the ONLY file that feature code should import from for AI operations.
 * It exposes two functions: generate() and transcribe().
 *
 * Swapping the AI provider (e.g. Gemini → OpenAI) requires changing only
 * gemini.ts and the two import lines at the bottom of this file — no feature
 * code changes needed.
 *
 * Used by:
 *   - src/app/api/ai/generate/route.ts
 *   - src/app/api/ai/transcribe/route.ts
 *   - Any server action that calls AI directly
 */

// ---------- Shared Types ----------

/**
 * A single turn in a multi-turn conversation with the AI.
 */
export interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

/**
 * Options passed to generate().
 */
export interface GenerateOptions {
  /** Optional system instruction that shapes the model's behavior. */
  system?: string
  /** The conversation history, ending with the latest user message. */
  messages: ChatMessage[]
  /**
   * Optional JSON Schema for structured output.
   * When provided, the model is instructed to return valid JSON
   * conforming to this schema; the parsed result is in GenerateResult.parsed.
   */
  schema?: object
  /**
   * Sampling temperature (0–1). Lower = more deterministic.
   * Defaults to 0.7 if omitted.
   */
  temperature?: number
}

/**
 * The result returned by generate().
 */
export interface GenerateResult {
  /** The raw text response from the model. */
  text: string
  /**
   * If a schema was provided and parsing succeeded, the typed parsed value.
   * Undefined when no schema was given or parsing failed (in which case
   * the caller should surface an error to the user).
   */
  parsed?: unknown
}

// ---------- AI Provider Interface ----------

/**
 * Generates a text (or structured JSON) response from the AI.
 *
 * Delegates to the active provider implementation (currently Gemini).
 * Retries automatically on rate-limit errors; throws a user-friendly
 * AIError on unrecoverable failure.
 *
 * @param options - Generation parameters including messages and optional schema.
 * @returns A promise resolving to the model's text output and optional parsed value.
 * @throws {AIError} on provider error or exhausted retries.
 */
export async function generate(options: GenerateOptions): Promise<GenerateResult> {
  const { generateWithGemini } = await import('./gemini')
  return generateWithGemini(options)
}

/**
 * Transcribes an audio recording to text.
 *
 * Sends the audio blob to the AI provider's audio-understanding endpoint.
 * Falls back gracefully — if the file is empty or unsupported, returns an
 * empty string rather than throwing so the UI can show a "no speech detected" state.
 *
 * @param audioBlob - A Blob of recorded audio (typically webm/opus from MediaRecorder).
 * @returns A promise resolving to the transcribed text string.
 * @throws {AIError} on provider error or exhausted retries.
 */
export async function transcribe(audioBlob: Blob): Promise<string> {
  const { transcribeWithGemini } = await import('./gemini')
  return transcribeWithGemini(audioBlob)
}
