import { workExperience } from '@/data/portfolioData';

const words = (s: string) => s.toLowerCase().split(/[\s/]+/).filter(Boolean);

// Whole-word match, so "Analytics" matches "Google Analytics" and "REST" matches
// "REST APIs", but "Go" does not match "Google".
export function matchesSkill(technology: string, skill: string) {
  const a = words(technology);
  const b = words(skill);
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
  return shorter.every(w => longer.includes(w));
}

const uses = (technologies: string[] | undefined, skill: string) =>
  technologies?.some(tech => matchesSkill(tech, skill)) ?? false;

// Companies where the skill was used in a work role (company work isn't listed as projects).
export const employersUsing = (skill: string) => [
  ...new Set(workExperience.filter(w => uses(w.technologies, skill)).map(w => w.organization)),
];
