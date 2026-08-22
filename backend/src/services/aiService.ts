import { ChallengeResponse, EvaluateResponse, challengeResponseSchema, evaluateResponseSchema } from '../lib/validator';
import { promptService } from './promptService';
import { fallbackService } from './fallbackService';
import { parseAndCleanJson } from '../lib/jsonParser';
import { logger } from '../lib/logger';

export class AIService {
  private apiKey: string | undefined;
  private provider: string;
  private model: string;
  private timeoutMs: number;

  constructor() {
    this.apiKey = process.env.AI_API_KEY;
    this.provider = process.env.AI_PROVIDER || 'gemini';
    this.model = process.env.AI_MODEL || (this.provider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash');
    this.timeoutMs = 12000; // 12 seconds max before triggering fallback
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Generates a practical challenge using AI with guaranteed fallback
   */
  async generateChallenge(skill: string, level: string): Promise<ChallengeResponse> {
    if (!this.isConfigured()) {
      logger.info('No AI_API_KEY provided; using deterministic fallback challenge generator.');
      return fallbackService.getFallbackChallenge(skill, level);
    }

    try {
      const { systemPrompt, userPrompt } = promptService.buildChallengePrompt(skill, level);
      const rawResponse = await this.callAI(systemPrompt, userPrompt);
      const parsed = parseAndCleanJson<any>(rawResponse);
      const validated = challengeResponseSchema.parse(parsed);

      logger.info(`Successfully generated AI challenge for skill: ${skill}`);
      return validated;
    } catch (error) {
      logger.warn(`AI challenge generation encountered an issue, falling back: ${(error as Error).message}`);
      return fallbackService.getFallbackChallenge(skill, level);
    }
  }

  /**
   * Evaluates submission evidence using AI with guaranteed fallback
   */
  async evaluateSubmission(challenge: string, submission: string): Promise<EvaluateResponse> {
    if (!this.isConfigured()) {
      logger.info('No AI_API_KEY provided; using deterministic fallback evaluation engine.');
      return fallbackService.getFallbackEvaluation(challenge, submission);
    }

    try {
      const { systemPrompt, userPrompt } = promptService.buildEvaluationPrompt(challenge, submission);
      const rawResponse = await this.callAI(systemPrompt, userPrompt);
      const parsed = parseAndCleanJson<any>(rawResponse);
      const validated = evaluateResponseSchema.parse(parsed);

      logger.info(`Successfully evaluated submission. Score: ${validated.score}, Confidence: ${validated.confidence}`);
      return validated;
    } catch (error) {
      logger.warn(`AI evaluation encountered an issue, falling back: ${(error as Error).message}`);
      return fallbackService.getFallbackEvaluation(challenge, submission);
    }
  }

  /**
   * Internal API dispatcher supporting Gemini and OpenAI-compatible REST endpoints
   */
  private async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      if (this.provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' }
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenAI API error (${response.status}): ${errText}`);
        }

        const data: any = await response.json();
        return data.choices?.[0]?.message?.content || '';
      } else {
        // Default to Google Gemini REST API
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API error (${response.status}): ${errText}`);
        }

        const data: any = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new Error('Gemini returned an empty candidate payload');
        }
        return candidateText;
      }
    } finally {
      clearTimeout(timer);
    }
  }
}

export const aiService = new AIService();
