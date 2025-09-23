// Import de toutes les variantes climate
import climate01 from './events/climate01.png';
import climate02 from './events/climate02.png';
import climate03 from './events/climate03.png';
import climate04 from './events/climate04.png';
import climate05 from './events/climate05.png';
import climate06 from './events/climate06.png';
import climate07 from './events/climate07.png';
import climate08 from './events/climate08.png';
import climate09 from './events/climate09.png';
import climate10 from './events/climate10.png';

const climateImages = [climate01, climate02, climate03, climate04, climate05, climate06, climate07, climate08, climate09, climate10];

export const getClimateImage = (): string => {
    const randomIndex = Math.floor(Math.random() * climateImages.length);
    return climateImages[randomIndex];
};

export const climateImage = getClimateImage();
