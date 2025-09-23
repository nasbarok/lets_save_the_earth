// Import de toutes les variantes health_warning
import healthWarning01 from './events/health_warning01.png';
import healthWarning02 from './events/health_warning02.png';

const healthWarningImages = [healthWarning01, healthWarning02];

export const getHealthWarningImage = (): string => {
    const randomIndex = Math.floor(Math.random() * healthWarningImages.length);
    return healthWarningImages[randomIndex];
};

export const healthWarningImage = getHealthWarningImage();