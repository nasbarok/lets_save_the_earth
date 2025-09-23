// Import de toutes les variantes health_emergency
import healthEmergency01 from './events/health_emergency01.png';
import healthEmergency02 from './events/health_emergency02.png';
import healthEmergency03 from './events/health_emergency03.png';
import healthEmergency04 from './events/health_emergency04.png';

const healthEmergencyImages = [healthEmergency01, healthEmergency02, healthEmergency03, healthEmergency04];

export const getHealthEmergencyImage = (): string => {
    const randomIndex = Math.floor(Math.random() * healthEmergencyImages.length);
    return healthEmergencyImages[randomIndex];
};

export const healthEmergencyImage = getHealthEmergencyImage();
