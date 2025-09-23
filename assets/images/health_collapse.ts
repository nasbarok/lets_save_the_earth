// Import de toutes les variantes health_collapse
import healthCollapse01 from './events/health_collapse01.png';
import healthCollapse02 from './events/health_collapse02.png';

const healthCollapseImages = [healthCollapse01, healthCollapse02];

export const getHealthCollapseImage = (): string => {
    const randomIndex = Math.floor(Math.random() * healthCollapseImages.length);
    return healthCollapseImages[randomIndex];
};

export const healthCollapseImage = getHealthCollapseImage();
