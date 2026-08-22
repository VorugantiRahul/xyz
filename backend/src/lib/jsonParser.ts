/**
 * Safe JSON extraction and repair for LLM responses
 */

export function parseAndCleanJson<T>(rawText: string): T {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Raw LLM response is empty or not a string');
  }

  let cleaned = rawText.trim();

  // 1. Remove markdown code blocks if present
  cleaned = cleaned.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, '$1').trim();

  // 2. Find the first '{' and the last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('No valid JSON object structure found in response');
  }

  const jsonSubstring = cleaned.substring(firstBrace, lastBrace + 1);

  // 3. Attempt standard parse
  try {
    return JSON.parse(jsonSubstring) as T;
  } catch (error) {
    // 4. Attempt basic repair for common LLM JSON syntax issues (trailing commas, unescaped newlines)
    const sanitized = jsonSubstring
      .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, (match) => {
        if (match === '\n' || match === '\r' || match === '\t') return match;
        return '';
      });

    try {
      return JSON.parse(sanitized) as T;
    } catch (secondError) {
      throw new Error(`Failed to parse repaired JSON: ${(error as Error).message}`);
    }
  }
}
