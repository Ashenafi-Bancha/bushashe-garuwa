/**
 * Where Bushaashe Garuwa is. On Google Maps the place is registered as
 * "Bushaashe Garuwa Integrated Agro Processing Project"; the plus code pins it exactly.
 */
export const PLUS_CODE = 'XP44+J6 Gununo';
export const MAPS_LISTING_NAME = 'Bushaashe Garuwa Integrated Agro Processing Project';

const query = encodeURIComponent(PLUS_CODE);

/** Opens the place in Google Maps (app on phones, website on computers) */
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${query}`;
/** Opens Google Maps with a route to the place from where the visitor is */
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
/** Map shown inside the page: satellite view with labels, no API key needed */
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${query}&z=16&t=h&output=embed`;
