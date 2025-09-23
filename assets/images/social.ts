// Import de toutes les variantes social
import social01 from './events/social01.png';
import social02 from './events/social02.png';
import social03 from './events/social03.png';

const socialImages = [social01, social02, social03];

export const getSocialImage = (): string => {
    const randomIndex = Math.floor(Math.random() * socialImages.length);
    return socialImages[randomIndex];
};

export const socialImage = getSocialImage();