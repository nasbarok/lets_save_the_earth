//Import de toutes les variantes breakthrough
import breakthrough01 from './events/breakthrough01.png';
import breakthrough02 from './events/breakthrough02.png';
import breakthrough03 from './events/breakthrough03.png';

const breakthroughImages = [breakthrough01, breakthrough02, breakthrough03];

// Fonction pour sélectionner aléatoirement
export const getBreakthroughImage = (): string => {
    const randomIndex = Math.floor(Math.random() * breakthroughImages.length);
    return breakthroughImages[randomIndex];
};

// Export pour compatibilité (retourne une image aléatoire)
export const breakthroughImage = getBreakthroughImage();