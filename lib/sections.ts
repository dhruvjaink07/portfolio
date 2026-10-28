// Page sections, in order. Nav, keyboard shortcuts and the command palette all read from here.
export const SECTIONS = [
  { id: 'home', label: 'Home', key: 'h' },
  { id: 'about', label: 'About', key: 'a' },
  { id: 'projects', label: 'Work', key: 'p' },
  { id: 'skills', label: 'Skills', key: 's' },
  { id: 'contact', label: 'Contact', key: 'c' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

// Editorial "01", "02"… for section eyebrows; Home is the cover, so numbering starts after it.
export const sectionNumber = (id: SectionId) =>
  String(SECTIONS.findIndex(s => s.id === id)).padStart(2, '0');

// Fired before a programmatic jump so the nav can hold the target active
// instead of flicking through every section the scroll passes.
export const SECTION_NAVIGATE_EVENT = 'section:navigate';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The single way to jump to a section: nav links, hero buttons, shortcuts and the palette.
export function scrollToSection(id: SectionId) {
  window.dispatchEvent(new CustomEvent<SectionId>(SECTION_NAVIGATE_EVENT, { detail: id }));
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  history.replaceState(null, '', `#${id}`);
}
