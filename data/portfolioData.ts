// Single source of truth for all portfolio content.
// Components import from here; no copy should be hardcoded in markup.

// ===================================
// TYPES
// ===================================
export type SocialPlatform = 'github' | 'linkedin' | 'twitter' | 'instagram';

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type ProjectCategory = 'mobile' | 'backend' | 'web' | 'design';

export interface SiteMeta {
  title: string;
  description: string;
  keywords: string[];
  url: string;
  ogImage: string;
}

export interface Profile {
  name: string;
  title: string;
  headline: string;
  // A word or phrase from `headline` set in italic for emphasis; must appear in it verbatim.
  headlineEmphasis?: string;
  bio: string;
  image: string;
  cv: string;
  stats: {
    experience: string;
    rating: string;
    jobSuccess: string;
    projects: number;
  };
  social: Record<SocialPlatform, string>;
}

export interface TimelineEntry {
  id: number;
  heading: string;
  organization: string;
  period: string;
  points: string[];
  technologies?: string[];
}

export interface Endorsement {
  id: number;
  name: string;
  title: string;
  verified: boolean;
  testimonial: string;
  linkedinRecommendations?: number;
}

export interface Skill {
  name: string;
  level: SkillLevel;
  description: string;
}

// `tools` renders on the right; the tech groups stack on the left.
export interface SkillGroup {
  id: 'frontend' | 'backend' | 'tools';
  label: string;
  skills: Skill[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  category: ProjectCategory;
  // Screenshot or mockup under /public, shown on the card when present (owner to supply).
  image?: string;
  ongoing?: boolean;
  // "Label: detail" lines, shown only when the card is expanded.
  highlights?: string[];
  codeUrl?: string;
  liveUrl?: string;
}

// Community and leadership roles, grouped by organization. `roles` is newest
// first; a period ending in PRESENT marks the role as current.
export interface CommunityRole {
  title: string;
  period: string;
}

export interface Community {
  id: number;
  organization: string;
  roles: CommunityRole[];
}

export interface Award {
  id: number;
  title: string;
  issuer: string;
  period: string;
}

export interface Contact {
  email: string;
  location: string;
  availability: string;
}

export interface Settings {
  showEndorsements: boolean;
}

// ===================================
// CONTENT
// ===================================
export const settings: Settings = {
  showEndorsements: false,
};

export const siteMeta: SiteMeta = {
  title: 'Dhruv Jain - Mobile App Developer',
  description:
    'Dhruv Jain - Results-driven Mobile Engineer specializing in high-performance, cross-platform applications using Flutter and Dart.',
  keywords: ['Mobile App Developer', 'Flutter', 'Dart', 'iOS', 'Android', 'Software Engineer', 'Portfolio'],
  url: 'https://dhruvjaink07.github.io/',
  // TODO: replace the Unsplash stock photo with a real preview image of the site.
  ogImage: '/og.png',
};

export const profile: Profile = {
  name: 'Dhruv Jain',
  title: 'Software Engineer | Mobile & Cloud Architecture',
  headline: 'Cross-platform mobile apps, and the cloud systems behind them.',
  headlineEmphasis: 'cloud',
  bio: 'Software Engineer specializing in cross-platform mobile development and scalable cloud infrastructure. I architect end-to-end systems for startups, from GCP and Firebase backends to App Store releases, and have shipped enterprise apps used by nationwide workforces (e.g., Sun Pharma). I take full ownership of complex problems and deliver production-ready software.',
  image: '/assets/dhruvjain.jpg',
  cv: '/assets/resume.pdf',
  stats: {
    experience: '1.5+',
    rating: '95.58%',
    jobSuccess: 'Diploma',
    projects: 7,
  },
  social: {
    twitter: 'https://x.com/djain007',
    linkedin: 'https://www.linkedin.com/in/dhruv-jain-0ab564251/',
    github: 'https://github.com/dhruvjaink07',
    instagram: 'https://instagram.com/dhruvjaink',
  },
};

export const workExperience: TimelineEntry[] = [
  {
    id: 3,
    heading: 'Founding Engineer',
    organization: 'Phodeco Ind Pvt Ltd',
    period: 'MAY 2026 - PRESENT',
    points: [
      'Cloud Architecture: Own the GCP & Firebase backend (Firestore, Cloud Functions, Storage) and Cloudflare R2 media storage for India’s first celebration-services platform.',
      'Product Engineering: Lead development of 4 live Flutter apps (iOS & Android), Go services, and a web admin dashboard.',
      'DevOps & Delivery: Run CI/CD, App Store / Play Store releases, and production monitoring.',
    ],
    technologies: ['Flutter', 'Go', 'GCP', 'Firebase', 'Cloudflare R2'],
  },
  {
    id: 2,
    heading: 'Freelance Mobile & Cloud Engineer',
    organization: 'Phodeco Ind Pvt Ltd',
    period: 'JULY 2025 - APRIL 2026',
    points: [
      'Built the initial Flutter apps and GCP & Firebase backend that became the production platform, before moving into the founding engineer role.',
    ],
    technologies: ['Flutter', 'GCP', 'Firebase'],
  },
  {
    id: 1,
    heading: 'Mobile App Developer Intern',
    organization: 'Digilateral Solutions',
    period: 'JANUARY 2024 - JULY 2024',
    points: [
      'Enterprise Development: Engineered an iPad-focused application deployed pan-India for Sun Pharma’s Medical Representatives, ensuring flawless compatibility with legacy hardware (iOS 12.5.7).',
      'Client Delivery: Successfully shipped 5 production applications across multiple client engagements, implementing complex REST API integrations for client-facing releases.',
      'Release Management: Handled end-to-end app distribution and compliance through Apple App Store Connect and Google Play Console.',
      'Team Leadership: Led the mobile development team, supervising 2 interns.',
    ],
    technologies: ['Flutter', 'XCode', 'REST APIs'],
  },
];

export const education: TimelineEntry[] = [
  {
    id: 1,
    heading: 'Bachelor of Engineering in Computer Engineering',
    organization: 'Vidyavardhini College of Engineering & Technology',
    period: '2024 - 2027',
    points: [
      'Advancing expertise in software engineering principles, algorithms, and modern system architecture. Actively applying rigorous academic theory to specialized mobile application development and full-stack performance optimization.',
    ],
  },
  {
    id: 2,
    heading: 'Diploma in Computer Engineering',
    organization: 'Government Polytechnic Mumbai',
    period: '2021 - 2024',
    points: [
      'Graduated with High Honors (95.58% aggregate). Specialized in core software programming, algorithmic fundamentals, and acquired the advanced technical groundwork for cross-platform scalable mobile development.',
    ],
  },
];

export const endorsements: Endorsement[] = [
  {
    id: 1,
    name: 'Digilateral Solutions Team',
    title: 'Development Team Lead',
    verified: true,
    testimonial:
      'Dhruv is a dedicated and quick learner who consistently delivered quality work during his internship. His Flutter development skills and ability to collaborate with the design team made him a valuable asset to our projects.',
    linkedinRecommendations: 5,
  },
  {
    id: 2,
    name: 'Project Mentor',
    title: 'Senior Mobile Developer',
    verified: true,
    testimonial:
      'Working with Dhruv on the Neuro iPad app was excellent. He demonstrated strong technical skills in Flutter and showed great attention to detail in implementing features and integrating analytics.',
  },
  {
    id: 3,
    name: 'Academic Supervisor',
    title: 'Professor, Computer Engineering',
    verified: true,
    testimonial:
      'Dhruv is an exceptional student with outstanding academic performance (95.58%). His passion for mobile development and commitment to learning new technologies sets him apart.',
  },
];

export const topSkills: string[] = ['Flutter', 'Dart', 'Go', 'GCP', 'Firebase', 'Docker', 'XCode', 'SQL'];

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Mobile & Frontend',
    skills: [
      { name: 'Flutter', level: 'EXPERT', description: 'Primary framework for building cross-platform mobile applications with beautiful user interfaces.' },
      { name: 'Dart', level: 'EXPERT', description: 'Programming language for Flutter development, enabling fast and efficient mobile app creation.' },
      { name: 'Kotlin', level: 'EXPERT', description: 'Modern language for native Android architecture, coroutines, and Jetpack Compose.' },
      { name: 'Jetpack Compose', level: 'ADVANCED', description: 'Modern declarative UI toolkit for native Android engineering.' },
      { name: 'Java', level: 'ADVANCED', description: 'Object-oriented language used for Android development and backend services.' },
      { name: 'JavaScript', level: 'ADVANCED', description: 'Language for web development.' },
      { name: 'XML', level: 'INTERMEDIATE', description: 'Markup language for Android UI layouts and configuration files.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & Data',
    skills: [
      { name: 'Go', level: 'ADVANCED', description: 'Systems programming language used for scalable backends.' },
      { name: 'SQL', level: 'ADVANCED', description: 'Database query language for managing and manipulating relational databases.' },
      { name: 'REST APIs', level: 'ADVANCED', description: 'Integration with RESTful services for data fetching and backend communication.' },
      { name: 'Node.js', level: 'INTERMEDIATE', description: 'JavaScript runtime for building scalable server-side applications and APIs.' },
      { name: 'Python', level: 'INTERMEDIATE', description: 'Versatile programming language for scripting, automation, and backend development.' },
      { name: 'Protobuf & gRPC', level: 'INTERMEDIATE', description: 'High-performance binary IPC protocol between native Android and embedded Go daemons.' },
      { name: 'Flask', level: 'BEGINNER', description: 'Micro web framework for Python.' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Platforms',
    skills: [
      { name: 'Android Studio', level: 'EXPERT', description: 'Official IDE for Android development with powerful debugging and testing tools.' },
      { name: 'XCode', level: 'ADVANCED', description: "Apple's IDE for iOS development, app distribution, and AppStore deployment." },
      { name: 'Firebase', level: 'ADVANCED', description: "Google's mobile platform for app development with backend services." },
      { name: 'Git / GitHub', level: 'ADVANCED', description: 'Version control system for code management and collaboration.' },
      { name: 'MapLibre & PMTiles', level: 'ADVANCED', description: 'Offline vector map rendering and byte-range archive extraction for off-grid navigation.' },
      { name: 'GCP', level: 'INTERMEDIATE', description: 'Google Cloud Platform for hosting and backend services.' },
      { name: 'Cloudflare R2', level: 'INTERMEDIATE', description: 'Object storage for media delivery, set up and managed for production apps.' },
      { name: 'Docker', level: 'INTERMEDIATE', description: 'Containerization platform for application deployment.' },
      { name: 'Sentry.io', level: 'INTERMEDIATE', description: 'Error tracking and monitoring platform for app stability and performance.' },
      { name: 'Google Analytics', level: 'INTERMEDIATE', description: 'Analytics platform for tracking user behavior and app performance metrics.' },
      { name: 'Appwrite', level: 'INTERMEDIATE', description: 'Open-source backend server.' },
      { name: 'Prometheus', level: 'BEGINNER', description: 'Monitoring and alerting toolkit.' },
    ],
  },
];

// codeUrl / liveUrl are omitted when there is nothing to link to, so the UI
// can hide the button instead of opening a blank tab.
export const projects: Project[] = [
  {
    id: 7,
    title: 'Roam',
    description: 'Infrastructureless, off-grid mobile navigation and peer-to-peer mesh network engineered for wilderness expeditions. Pairs native Jetpack Compose and MapLibre offline PMTiles rendering with an embedded Go routing daemon (libroam_agent.so), enabling autonomous BLE discovery, zero-footprint Wi-Fi Direct star mesh relays, resumable P2P vector tile streaming, GPS breadcrumb retracing, and decentralized emergency SOS broadcasting.',
    technologies: ['Kotlin', 'Go', 'Jetpack Compose', 'MapLibre', 'BLE', 'Wi-Fi Direct', 'gRPC'],
    category: 'mobile',
    ongoing: true,
    highlights: [
      'Dual-tier architecture: a native Android app (Jetpack Compose, MapLibre Native) paired with an embedded Go routing daemon (libroam_agent.so) over local gRPC/IPC.',
      'Dual-plane mesh: BLE beacons for presence discovery and Group Owner election, with a Wi-Fi Direct star mesh as the data plane; DNS-SD pre-connection probing handles Android 11+ MAC randomization.',
      'P2P map distribution: PMTiles archives streamed in 128 KB chunks through zero-footprint relays, with resumable transfers and SHA-256 verification.',
      'Safety: offline SOS mesh broadcasts with delivery acknowledgements, peer proximity tracking, and foreground-service survival tested on Samsung, POCO and Realme devices.',
    ],
    // Repo is private (github.com/dhruvjaink07/roam returns 404), so no codeUrl.
  },
  {
    id: 4,
    title: 'FailSafe',
    description: 'Resilience testing platform that injects controlled faults across microservices, web frontends, and Android APKs using an adaptive binary-search algorithm to identify breaking thresholds and compute metrics like blast radius, cascade depth, and recovery time.',
    technologies: ['Go', 'Docker', 'Prometheus', 'REST'],
    category: 'backend',
    codeUrl: 'https://github.com/dhruvjaink07/FailSafe',
  },
  {
    id: 5,
    title: 'BoardBuddy',
    description: 'AI-powered Kanban platform that converts natural-language prompts into structured task boards via Gemini LLM, with Deerflow a built-in analytics engine for productivity insights.',
    technologies: ['Flutter', 'Gemini LLM', 'Firebase'],
    category: 'mobile',
  },
  {
    id: 1,
    title: 'Neuro - iPad VA',
    description: 'Architected an interactive medical data visualization suite specifically optimized for iPad environments. Integrated robust local data persistence, real-time Sentry.io crash reporting, and Google Analytics to track user engagement.',
    technologies: ['Flutter', 'Dart', 'XCode', 'Sentry.io', 'Analytics'],
    category: 'mobile',
  },
  {
    id: 6,
    title: 'Sompraz',
    description: 'First professional client delivery iPad medical app with data persistence, crash monitoring via Sentry.io, distributed through App Store Connect.',
    technologies: ['Flutter', 'Sentry.io', 'Google Analytics'],
    category: 'mobile',
  },
];

export const community: Community[] = [
  {
    id: 1,
    organization: 'GDG on Campus, VCET',
    roles: [
      { title: 'Organizer', period: 'AUGUST 2026 - PRESENT' },
      { title: 'AI/ML Associate', period: 'SEPTEMBER 2025 - AUGUST 2026' },
    ],
  },
  {
    id: 2,
    organization: 'Microsoft Learn Students Club, VCET',
    // Start month from the earlier data; confirm the end month.
    roles: [{ title: 'App Dev Associate', period: 'AUGUST 2025 - 2026' }],
  },
  {
    id: 3,
    organization: 'Vidyavardhini College of Engineering & Technology',
    roles: [{ title: 'Projects Team Lead', period: '5 SEMESTERS' }],
  },
];

export const awards: Award[] = [
  { id: 1, title: 'Legend Tier', issuer: 'Google Arcade Facilitator Program', period: '2025' },
];

export const contact: Contact = {
  email: 'dhruvkishorjain2508@gmail.com',
  location: 'Mumbai, Maharashtra',
  availability: 'Open to opportunities',
};

// ===================================
// DERIVED
// ===================================
// Filter buttons come from the data, so a category can never exist
// without a button or a button without projects. Largest category first.
const categoryCount = (c: ProjectCategory) => projects.filter(p => p.category === c).length;
export const projectCategories: ProjectCategory[] = [...new Set(projects.map(p => p.category))].sort(
  (a, b) => categoryCount(b) - categoryCount(a),
);

export const isCurrent = (period: string) => period.endsWith('PRESENT');
