import { getDisasterImage } from './disaster.ts';
import { getBreakthroughImage } from './breakthrough.ts';
import { getPoliticalImage } from './political.ts';
import { getSocialImage } from './social.ts';
import { getEconomicImage } from './economic.ts';
import { getDefaultImage } from './default.ts';
import { getHealthWarningImage } from './health_warning.ts';
import { getHealthCrisisImage } from './health_crisis.ts';
import { getHealthEmergencyImage } from './health_emergency.ts';
import { getHealthCollapseImage } from './health_collapse.ts';
import { getWarImage } from './war.ts';
import { getClimateImage } from './climate.ts';

export const IMAGES = {
  DISASTER: getDisasterImage,
  BREAKTHROUGH: getBreakthroughImage,
  POLITICAL: getPoliticalImage,
  SOCIAL: getSocialImage,
  ECONOMIC: getEconomicImage,
  DEFAULT: getDefaultImage,
  HEALTH_WARNING: getHealthWarningImage,
  HEALTH_CRISIS: getHealthCrisisImage,
  HEALTH_EMERGENCY: getHealthEmergencyImage,
  HEALTH_COLLAPSE: getHealthCollapseImage,
  WAR: getWarImage,
  CLIMATE: getClimateImage,
};
