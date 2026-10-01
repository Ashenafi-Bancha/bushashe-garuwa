/**
 * Small pieces of SQL shared by the repositories.
 *
 * "Today" is the day in Ethiopia, wherever the server happens to run: an event
 * on the 5th stays "upcoming" until the 5th is over in Addis Ababa.
 */
const ZONE = 'Africa/Addis_Ababa';

/** Today's date in Ethiopia, as SQL */
export const TODAY = `(now() AT TIME ZONE '${ZONE}')::date`;

/** The Ethiopian calendar day a timestamp column falls on, as SQL */
export const dayOf = (column: string) => `(${column} AT TIME ZONE '${ZONE}')::date`;

/** Today's date in Ethiopia as 'YYYY-MM-DD', for comparisons in code */
export const todayInEthiopia = () => new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(new Date());

/** PostgreSQL's error for a value that must be unique and is already taken */
export const isUniqueViolation = (error: unknown) => (error as { code?: string } | null)?.code === '23505';
