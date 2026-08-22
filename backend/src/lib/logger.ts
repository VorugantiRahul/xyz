/**
 * SkillPulse Backend Logger
 */

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error instanceof Error ? error.message : error || '');
  },
  fallback: (context: string, reason: string) => {
    console.warn(`[FALLBACK MODE] [${new Date().toISOString()}] Activated for: ${context} | Reason: ${reason}`);
  }
};
