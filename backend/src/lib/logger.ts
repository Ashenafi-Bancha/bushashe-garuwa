/** Small structured logger: one JSON line per event in production, readable lines while developing. */
type Level = 'info' | 'warn' | 'error';

function write(level: Level, message: string, details?: Record<string, unknown>): void {
  const mode = process.env.NODE_ENV;
  if (mode === 'test') return;
  const pretty = mode !== 'production';
  const line = pretty
    ? `[${level}] ${message}${details ? ' ' + JSON.stringify(details) : ''}`
    : JSON.stringify({ time: new Date().toISOString(), level, message, ...details });
  (level === 'error' ? console.error : console.log)(line);
}

export const logger = {
  info: (message: string, details?: Record<string, unknown>) => write('info', message, details),
  warn: (message: string, details?: Record<string, unknown>) => write('warn', message, details),
  error: (message: string, details?: Record<string, unknown>) => write('error', message, details),
};
