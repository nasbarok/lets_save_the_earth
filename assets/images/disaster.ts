// Import de toutes les variantes
import disaster01 from './events/disaster01.png';
import disaster02 from './events/disaster02.png';
import disaster03 from './events/disaster02.png';

const disasterImages = [disaster01, disaster02, disaster03];

// Fonction pour sélectionner aléatoirement
export const getDisasterImage = (): string => {
    const randomIndex = Math.floor(Math.random() * disasterImages.length);
    return disasterImages[randomIndex];
};

// Export pour compatibilité (retourne une image aléatoire)
export const disasterImage = getDisasterImage();