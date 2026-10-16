/**
 * Every email Bushaashe Garuwa sends, in one place for the notifier:
 * the guest emails (customerConfirmation.ts), the team alerts (adminAlert.ts),
 * built from the pieces in layout.ts with the brand settings in brand.ts.
 */
export * from './shared.js';
export { bookingConfirmed, bookingReceived, contactReceived, customerConfirmation, visitReceived } from './customerConfirmation.js';
export { adminAlert, staffNewBooking, staffNewMessage, staffNewVisit } from './adminAlert.js';
