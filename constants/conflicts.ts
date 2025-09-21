import type { Conflict } from '../types.ts';

export const INITIAL_CONFLICTS: Omit<Conflict, 'startDate'>[] = [
    {
        id: 'conflict-sahel-1',
        name: 'Sahel Insurgency',
        involvedCountryIds: ['AF'],
        intensity: 2,
        description: 'Resource scarcity and climate change fuel ongoing instability in the Sahel region.'
    }
];

export const CONFLICT_INSTABILITY_THRESHOLD = 75;
export const CONFLICT_INTENSITY_EFFECTS = {
    population: 50000,
    gdp: 0.001, // 0.1% of GDP
    health: 0.1,
    pollution: 0.05
};
