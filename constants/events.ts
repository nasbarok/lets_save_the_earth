
import type { EventChoice, GameEventEffects } from '../types';

export const EVENT_TIMER_SECONDS = 60;

export const createHealthCrisisAlert = (countryName: string, crisisLevel: number, t: (key: string, replacements?: { [key: string]: string | number }) => string) => {
    let title = '';
    let description = '';
    let baseEffects: GameEventEffects = { population_change: 0, health_index_change: 0, public_support_change: 0, gdp_change_percent: 0, co2_change: 0, plastic_change: 0, deforestation_change: 0, eco_points_change_percent: 0 };
    const choices: EventChoice[] = [];
    const replacements = { countryName };

    switch (crisisLevel) {
        case 1: // Warning
            title = t('healthCrisis.warningTitle', replacements);
            description = t('healthCrisis.warningDesc', replacements);
            baseEffects = { population_change: 0, health_index_change: -2, public_support_change: -3, gdp_change_percent: -0.5, co2_change: 0, plastic_change: 0, deforestation_change: 0, eco_points_change_percent: 0 };
            choices.push(
                { text: t('healthCrisis.warningChoice1'), cost: 300, effects: { health_index_change: 3, public_support_change: 5 } },
                { text: t('healthCrisis.warningChoice2'), cost: 0, effects: {} }
            );
            break;
        case 2: // Crisis
            title = t('healthCrisis.crisisTitle', replacements);
            description = t('healthCrisis.crisisDesc', replacements);
            baseEffects = { population_change: -500000, health_index_change: -5, public_support_change: -8, gdp_change_percent: -1, co2_change: 0, plastic_change: 0, deforestation_change: 0, eco_points_change_percent: 0 };
            choices.push(
                { text: t('healthCrisis.crisisChoice1'), cost: 800, effects: { population_change: 100000, health_index_change: 8, public_support_change: 5 } },
                { text: t('healthCrisis.crisisChoice2'), cost: 600, effects: { health_index_change: 4, public_support_change: -3, co2_change: -1 } },
                { text: t('healthCrisis.warningChoice2'), cost: 0, effects: {} }
            );
            break;
        case 3: // Emergency
            title = t('healthCrisis.emergencyTitle', replacements);
            description = t('healthCrisis.emergencyDesc', replacements);
            baseEffects = { population_change: -2000000, health_index_change: -10, public_support_change: -15, gdp_change_percent: -2, co2_change: 0, plastic_change: 0, deforestation_change: 0, eco_points_change_percent: 0 };
            choices.push(
                { text: t('healthCrisis.emergencyChoice1'), cost: 1500, effects: { population_change: 500000, health_index_change: 10 } },
                { text: t('healthCrisis.emergencyChoice2'), cost: 1200, effects: { health_index_change: 12, public_support_change: 8 } },
                { text: t('healthCrisis.warningChoice2'), cost: 0, effects: {} }
            );
            break;
        case 4: // Collapse
            title = t('healthCrisis.collapseTitle', replacements);
            description = t('healthCrisis.collapseDesc', replacements);
            baseEffects = { population_change: -5000000, health_index_change: -15, public_support_change: -20, gdp_change_percent: -5, co2_change: 0, plastic_change: 0, deforestation_change: 0, eco_points_change_percent: 0 };
            break;
    }

    return { title, description, baseEffects, choices: choices.length > 0 ? choices : undefined };
};
