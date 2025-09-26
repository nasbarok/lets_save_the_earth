import type { GameState, Country, Conflict } from '../types';
import { PollutantType } from '../types';
import { COUNTRIES } from './countries';
import { INITIAL_CONFLICTS } from './conflicts';

export const MIN_EVENT_TICKS = 60;
export const MAX_EVENT_TICKS = 90;
export const CONFLICT_CHECK_TICKS = 36;
export const EXTINCTION_CHECK_TICKS = 48;
export const INTERSTITIAL_AD_TICKS = 180; // Approx 15 years (180 months/ticks)

export const WARMING_RATE_FACTOR = 0.00025;
export const CO2_STABILITY_INDEX = 40;
export const POPULATION_GAMEOVER_THRESHOLD = 0.05; // 5%

export const POLLUTANT_CONVERSION_FACTORS = {
  [PollutantType.CO2]: 100_000_000,
  [PollutantType.Plastic]: 1_000_000,
  [PollutantType.Deforestation]: 20_000,
} as const;

export const createInitialState = (
    isRealistic = false,
    overrideCountries?: Country[]
): GameState => {
  let countries: Country[];
  let date: Date;
  let activeConflicts: Conflict[] = [];

  const defaultTech = { tech: { co2: 0, deforestation: 0, waste: 0 } };

  if (overrideCountries) {
    countries = overrideCountries.map(c => ({ ...c, ...defaultTech, instability: 0 }));
    date = new Date();
  } else if (isRealistic) {
    date = new Date();
    countries = [
      { id: 'NA', name: 'countries.NA', pollutants: { co2: 70, plastic: 65, deforestation: 35 }, coords: { x: 230, y: 150 }, population: 605_000_000, populationGrowthRate: 0.006, gdp: 28, gdpGrowthRate: 0.012, healthIndex: 72, healthCrisisLevel: 0, energy: { consumption: 5100, production: { renewable: 950, nuclear: 800, thermal: 3350 } }, ...defaultTech, instability: 0 },
      { id: 'SA', name: 'countries.SA', pollutants: { co2: 50, plastic: 55, deforestation: 80 }, coords: { x: 300, y: 330 }, population: 441_000_000, populationGrowthRate: 0.007, gdp: 4, gdpGrowthRate: 0.025, healthIndex: 69, healthCrisisLevel: 0, energy: { consumption: 1350, production: { renewable: 850, nuclear: 50, thermal: 450 } }, ...defaultTech, instability: 0 },
      { id: 'EU', name: 'countries.EU', pollutants: { co2: 65, plastic: 60, deforestation: 20 }, coords: { x: 480, y: 140 }, population: 740_000_000, populationGrowthRate: -0.001, gdp: 24, gdpGrowthRate: 0.01, healthIndex: 76, healthCrisisLevel: 0, energy: { consumption: 4000, production: { renewable: 1300, nuclear: 1000, thermal: 1700 } }, ...defaultTech, instability: 0 },
      { id: 'AF', name: 'countries.AF', pollutants: { co2: 45, plastic: 50, deforestation: 75 }, coords: { x: 500, y: 280 }, population: 1_460_000_000, populationGrowthRate: 0.024, gdp: 3, gdpGrowthRate: 0.035, healthIndex: 72, healthCrisisLevel: 0, energy: { consumption: 950, production: { renewable: 220, nuclear: 20, thermal: 710 } }, ...defaultTech, instability: 0 },
      { id: 'AS', name: 'countries.AS', pollutants: { co2: 85, plastic: 80, deforestation: 65 }, coords: { x: 700, y: 180 }, population: 4_750_000_000, populationGrowthRate: 0.008, gdp: 40, gdpGrowthRate: 0.045, healthIndex: 62, healthCrisisLevel: 0, energy: { consumption: 15500, production: { renewable: 4800, nuclear: 900, thermal: 9800 } }, ...defaultTech, instability: 0 },
      { id: 'OC', name: 'countries.OC', pollutants: { co2: 40, plastic: 45, deforestation: 30 }, coords: { x: 850, y: 380 }, population: 45_000_000, populationGrowthRate: 0.011, gdp: 2, gdpGrowthRate: 0.015, healthIndex: 81, healthCrisisLevel: 0, energy: { consumption: 620, production: { renewable: 180, nuclear: 0, thermal: 440 } }, ...defaultTech, instability: 0 },
    ];
    activeConflicts = INITIAL_CONFLICTS.map(c => ({ ...c, startDate: new Date(), name: c.name, description: c.description }));
  } else {
    date = new Date(2024, 0, 1);
    countries = typeof structuredClone === 'function'
        ? structuredClone(COUNTRIES)
        : JSON.parse(JSON.stringify(COUNTRIES));
  }

  // ✅ Calcul de l’instabilité + initialisation des champs de suivi santé
  countries = countries.map(c => {
    const avgPollution = (c.pollutants.co2 + c.pollutants.plastic + c.pollutants.deforestation) / 3;
    const totalProduction = c.energy.production.renewable + c.energy.production.nuclear + c.energy.production.thermal;
    const energyDeficit = c.energy.consumption > 0 ? Math.max(0, (c.energy.consumption - totalProduction) / c.energy.consumption) : 0;
    const instability = Math.min(100, Math.round(avgPollution / 2 + energyDeficit * 50));

    return {
      ...c,
      continent: c.name, // Self-reference for filtering
      instability,
      // Champs santé — valeurs par défaut si absents
      healthCrisisLevel: c.healthCrisisLevel ?? 0,
      healthCrisisLastTick: c.healthCrisisLastTick ?? 0,
      ticksInCurrentHealthLevel: c.ticksInCurrentHealthLevel ?? 0,
      previousHealthIndex: c.previousHealthIndex ?? c.healthIndex,
    };
  });

  const totalPollution =
      countries.reduce((sum, c) => sum + c.pollutants.co2 + c.pollutants.plastic + c.pollutants.deforestation, 0)
      / (countries.length * 3);

  const initialPopulation = countries.reduce((sum, c) => sum + c.population, 0);

  return {
    date,
    ecoPoints: 5000,
    publicSupport: 50,
    countries,
    activeActions: [],
    activeConflicts,
    selectedCountryId: null,
    totalPollution,
    isGameOver: false,
    gameWon: false,
    ticksUntilNextEvent: Math.floor(Math.random() * (MAX_EVENT_TICKS - MIN_EVENT_TICKS + 1)) + MIN_EVENT_TICKS,
    ticksUntilConflictCheck: CONFLICT_CHECK_TICKS,
    ticksUntilExtinctionCheck: EXTINCTION_CHECK_TICKS,
    activeEvent: null,
    gameSpeed: 1,
    eventTimer: null,
    playtimeSeconds: 0,
    globalWarming: 1.5,
    initialPopulation,
    biodiversityIndex: 85,
    nuclearThreatLevel: 0,
    language: 'en',
    hasPaidToRemoveAds: false,
    ticksUntilNextInterstitial: INTERSTITIAL_AD_TICKS,
  };
};

// ✅ VITESSES DE JEU OPTIMISÉES POUR PLUS D'IMPACT
export const GAME_SPEED_MS = 2000; // Vitesse de base (x1)

// Multiplicateurs de vitesse plus agressifs
export const GAME_SPEED_MULTIPLIERS = {
  1: 1,    // x1 = 2000ms (vitesse normale)
  2: 4,    // x2 = 500ms (4x plus rapide)
  3: 8     // x3 = 250ms (8x plus rapide)
} as const;
