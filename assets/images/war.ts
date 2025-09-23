// Import de toutes les variantes war
import war01 from './events/war01.png';
import war02 from './events/war02.png';

const warImages = [war01, war02];

export const getWarImage = (): string => {
    const randomIndex = Math.floor(Math.random() * warImages.length);
    return warImages[randomIndex];
};

export const warImage = getWarImage();
