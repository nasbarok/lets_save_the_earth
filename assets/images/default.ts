// Import de toutes les variantes default
import default01 from './events/default01.png';
import default02 from './events/default02.png';

const defaultImages = [default01, default02];

export const getDefaultImage = (): string => {
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
};

export const defaultImage = getDefaultImage();