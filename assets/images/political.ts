// Import de toutes les variantes political
import political01 from './events/political01.png';
import political02 from './events/political02.png';

const politicalImages = [political01, political02];

export const getPoliticalImage = (): string => {
    const randomIndex = Math.floor(Math.random() * politicalImages.length);
    return politicalImages[randomIndex];
};

export const politicalImage = getPoliticalImage();
