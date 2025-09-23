// Import corrects
import economic01 from './events/economic01.png';
import economic02 from './events/economic02.png';
import economic03 from './events/economic03.png';

const economicImages: string[] = [economic01, economic02, economic03];

export function getEconomicImage(): string {
    const i = Math.floor(Math.random() * economicImages.length);
    return economicImages[i];
}

// Optionnel : compat
export const economicImage: string = getEconomicImage();
export default getEconomicImage;
