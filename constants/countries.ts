
import type { Country } from '../types';

export const COUNTRIES: Country[] = [
    // FIX: Added missing gdpGrowthRate property to satisfy the Country type.
    { id: 'NA', name: 'countries.NA', pollutants: { co2: 65, plastic: 60, deforestation: 40 }, coords: { x: 230, y: 150 }, population: 605_000_000, populationGrowthRate: 0.006, gdp: 28, gdpGrowthRate: 0.012, healthIndex: 73, healthCrisisLevel: 0, energy: { consumption: 5000, production: { renewable: 900, nuclear: 800, thermal: 3300 } }, tech: { co2: 0, deforestation: 0, waste: 0 }, instability: 0 },
    // FIX: Added missing gdpGrowthRate property to satisfy the Country type.
    { id: 'SA', name: 'countries.SA', pollutants: { co2: 45, plastic: 50, deforestation: 70 }, coords: { x: 300, y: 330 }, population: 441_000_000, populationGrowthRate: 0.007, gdp: 4, gdpGrowthRate: 0.025, healthIndex: 73, healthCrisisLevel: 0, energy: { consumption: 1300, production: { renewable: 800, nuclear: 50, thermal: 450 } }, tech: { co2: 0, deforestation: 0, waste: 0 }, instability: 0 },
    // FIX: Added missing gdpGrowthRate property to satisfy the Country type.
    { id: 'EU', name: 'countries.EU', pollutants: { co2: 60, plastic: 55, deforestation: 30 }, coords: { x: 480, y: 140 }, population: 740_000_000, populationGrowthRate: -0.001, gdp: 24, gdpGrowthRate: 0.01, healthIndex: 76, healthCrisisLevel: 0, energy: { consumption: 4000, production: { renewable: 1200, nuclear: 1000, thermal: 1800 } }, tech: { co2: 0, deforestation: 0, waste: 0 }, instability: 0 },
    // FIX: Added missing gdpGrowthRate property to satisfy the Country type.
    { id: 'AF', name: 'countries.AF', pollutants: { co2: 40, plastic: 45, deforestation: 65 }, coords: { x: 500, y: 280 }, population: 1_460_000_000, populationGrowthRate: 0.024, gdp: 3, gdpGrowthRate: 0.035, healthIndex: 75, healthCrisisLevel: 0, energy: { consumption: 900, production: { renewable: 200, nuclear: 20, thermal: 680 } }, tech: { co2: 0, deforestation: 0, waste: 0 }, instability: 0 },
    // FIX: Added missing gdpGrowthRate property to satisfy the Country type.
    { id: 'AS', name: 'countries.AS', pollutants: { co2: 75, plastic: 70, deforestation: 55 }, coords: { x: 700, y: 180 }, population: 4_750_000_000, populationGrowthRate: 0.008, gdp: 40, gdpGrowthRate: 0.045, healthIndex: 67, healthCrisisLevel: 0, energy: { consumption: 15000, production: { renewable: 4500, nuclear: 900, thermal: 9600 } }, tech: { co2: 0, deforestation: 0, waste: 0 }, instability: 0 },
    // FIX: Added missing gdpGrowthRate property to satisfy the Country type.
    { id: 'OC', name: 'countries.OC', pollutants: { co2: 35, plastic: 40, deforestation: 35 }, coords: { x: 850, y: 380 }, population: 45_000_000, populationGrowthRate: 0.011, gdp: 2, gdpGrowthRate: 0.015, healthIndex: 82, healthCrisisLevel: 0, energy: { consumption: 600, production: { renewable: 150, nuclear: 0, thermal: 450 } }, tech: { co2: 0, deforestation: 0, waste: 0 }, instability: 0 },
];