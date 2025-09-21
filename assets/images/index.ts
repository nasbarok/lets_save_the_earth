import { disasterImage } from './disaster.ts';
import { breakthroughImage } from './breakthrough.ts';
import { politicalImage } from './political.ts';
import { socialImage } from './social.ts';
import { economicImage } from './economic.ts';
import { defaultImage } from './default.ts';
import { healthWarningImage } from './health_warning.ts';
import { healthCrisisImage } from './health_crisis.ts';
import { healthEmergencyImage } from './health_emergency.ts';
import { healthCollapseImage } from './health_collapse.ts';

export const IMAGES = {
  DISASTER: disasterImage,
  BREAKTHROUGH: breakthroughImage,
  POLITICAL: politicalImage,
  SOCIAL: socialImage,
  ECONOMIC: economicImage,
  DEFAULT: defaultImage,
  HEALTH_WARNING: healthWarningImage,
  HEALTH_CRISIS: healthCrisisImage,
  HEALTH_EMERGENCY: healthEmergencyImage,
  HEALTH_COLLAPSE: healthCollapseImage,
  WAR: disasterImage, // Map new categories to existing images
  CLIMATE: disasterImage,
};
