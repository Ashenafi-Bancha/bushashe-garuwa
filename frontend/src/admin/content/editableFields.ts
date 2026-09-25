/**
 * The parts of the website staff can edit from the admin area.
 *
 * Each field points at a line in the website's text files by its path
 * (`home.hero.title`). Values with `shared: true` are the same in every
 * language: a phone number, an email address, a link.
 *
 * To let staff edit something new, add its path here. Nothing else is needed:
 * the editor reads the built-in words from the dictionaries and the API stores
 * whatever is changed.
 */
export type EditableField = { path: string; label: string; multiline?: boolean; shared?: boolean };
export type EditableGroup = { id: string; title: string; note?: string; fields: EditableField[] };

export const EDITABLE_GROUPS: EditableGroup[] = [
  {
    id: 'home',
    title: 'Home page',
    fields: [
      { path: 'home.hero.title', label: 'Big title' },
      { path: 'home.hero.subtitle', label: 'Line under the title' },
      { path: 'common.slogan', label: 'Slogan', multiline: true },
      { path: 'home.intro.title', label: 'Welcome heading' },
      { path: 'home.intro.p1', label: 'Welcome paragraph', multiline: true },
      { path: 'home.culturalFood.title', label: 'Cultural food: heading' },
      { path: 'home.culturalFood.desc', label: 'Cultural food: description', multiline: true },
      { path: 'home.culturalFood.soon', label: 'Cultural food: text when no dates are set', multiline: true },
    ],
  },
  {
    id: 'about',
    title: 'About page',
    fields: [
      { path: 'about.who.title', label: 'Who we are: heading' },
      { path: 'about.who.p1', label: 'Who we are: first paragraph', multiline: true },
      { path: 'about.who.name', label: 'The name Bushaashe', multiline: true },
      { path: 'about.who.p2', label: 'Who we are: second paragraph', multiline: true },
      { path: 'about.who.p3', label: 'Who we are: third paragraph', multiline: true },
      { path: 'about.who.festival', label: 'Celebrations paragraph', multiline: true },
      { path: 'common.goal.text', label: 'Our ultimate goal', multiline: true },
    ],
  },
  {
    id: 'visit',
    title: 'Visit page',
    fields: [
      { path: 'visit.hero.title', label: 'Page title' },
      { path: 'visit.gettingHere.title', label: 'Getting here: heading' },
      { path: 'visit.gettingHere.routes.0.dir', label: 'Directions', multiline: true },
      { path: 'common.map.desc', label: 'Map: description', multiline: true },
    ],
  },
  {
    id: 'contact',
    title: 'Contact page',
    fields: [
      { path: 'contact.hero.title', label: 'Page title' },
      { path: 'contact.intro', label: 'Introduction', multiline: true },
      { path: 'contact.emailNote', label: 'Note under the email' },
    ],
  },
  {
    id: 'settings',
    title: 'Details and opening hours',
    note: 'These are the same in every language.',
    fields: [
      { path: 'common.hoursDaily', label: 'Opening hours', shared: true },
      { path: 'common.eveningEvents', label: 'Evening events note' },
      { path: 'common.addressLine1', label: 'Address, first line' },
      { path: 'common.addressLine2', label: 'Address, second line' },
      { path: 'common.locationLine', label: 'Location line' },
      { path: 'footer.address', label: 'Address in the footer' },
      { path: 'footer.tagline', label: 'Footer tagline', multiline: true },
    ],
  },
  {
    id: 'events',
    title: 'Events page',
    note: 'The events themselves are managed under Events.',
    fields: [
      { path: 'events.hero.titleA', label: 'Page title, first line' },
      { path: 'events.hero.titleB', label: 'Page title, second line' },
      { path: 'events.featured', label: 'Featured heading' },
      { path: 'events.upcoming', label: 'Upcoming heading' },
      { path: 'events.booking.title', label: 'Booking form: heading' },
      { path: 'events.booking.thanksText', label: 'Booking form: thank-you text', multiline: true },
    ],
  },
];

/** Reads the built-in value at a path, for example `home.hero.title` */
export function valueAtPath(source: unknown, path: string): string {
  let node: unknown = source;
  for (const step of path.split('.')) {
    if (node === null || typeof node !== 'object') return '';
    node = (node as Record<string, unknown>)[step];
  }
  return typeof node === 'string' ? node : '';
}
