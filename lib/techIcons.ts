import {
  siAndroid,
  siAndroidstudio,
  siAppwrite,
  siBluetooth,
  siCloudflare,
  siDart,
  siDocker,
  siFirebase,
  siFlask,
  siFlutter,
  siGithub,
  siGo,
  siGoogleanalytics,
  siGooglecloud,
  siGooglegemini,
  siJavascript,
  siJetpackcompose,
  siKotlin,
  siMaplibre,
  siNodedotjs,
  siOpenjdk,
  siPrometheus,
  siPython,
  siSentry,
  siXcode,
  siXml,
  type SimpleIcon,
} from 'simple-icons';
import { matchesSkill } from './skills';

// Monochrome brand marks from simple-icons (CC0), keyed by the names used in
// the data. Java uses OpenJDK: simple-icons removed the Java logo for trademark reasons.
const ICONS: Record<string, SimpleIcon> = {
  Flutter: siFlutter,
  Dart: siDart,
  Kotlin: siKotlin,
  'Jetpack Compose': siJetpackcompose,
  Java: siOpenjdk,
  JavaScript: siJavascript,
  XML: siXml,
  Go: siGo,
  'Node.js': siNodedotjs,
  Python: siPython,
  Flask: siFlask,
  Android: siAndroid,
  'Android Studio': siAndroidstudio,
  XCode: siXcode,
  Firebase: siFirebase,
  'Git / GitHub': siGithub,
  'MapLibre & PMTiles': siMaplibre,
  MapLibre: siMaplibre,
  GCP: siGooglecloud,
  'Cloudflare R2': siCloudflare,
  Docker: siDocker,
  'Sentry.io': siSentry,
  'Google Analytics': siGoogleanalytics,
  Appwrite: siAppwrite,
  Prometheus: siPrometheus,
  'Gemini LLM': siGooglegemini,
  BLE: siBluetooth,
};

// Exact name first (so "Android" doesn't resolve to Android Studio), then whole-word match
// (so "Analytics" finds Google Analytics).
export function iconFor(name: string): SimpleIcon | undefined {
  if (ICONS[name]) return ICONS[name];
  const key = Object.keys(ICONS).find(k => matchesSkill(name, k));
  return key ? ICONS[key] : undefined;
}

// Fallback for names without a brand mark: "SQL", "REST APIs" → "RA", "Wi-Fi Direct" → "WF".
export function monogram(name: string) {
  const words = name.split(/[^A-Za-z0-9]+/).filter(Boolean);
  return words.length === 1 ? words[0].slice(0, 3).toUpperCase() : words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
}
