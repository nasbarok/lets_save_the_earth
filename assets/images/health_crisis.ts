// Import de toutes les variantes health_crisis
import healthCrisis01 from './events/health_crisis01.png';
import healthCrisis02 from './events/health_crisis02.png';
import healthCrisis03 from './events/health_crisis03.png';
import healthCrisis04 from './events/health_crisis04.png';

const healthCrisisImages = [healthCrisis01, healthCrisis02, healthCrisis03, healthCrisis04];

export const getHealthCrisisImage = (): string => {
    const randomIndex = Math.floor(Math.random() * healthCrisisImages.length);
    return healthCrisisImages[randomIndex];
};

export const healthCrisisImage = getHealthCrisisImage();