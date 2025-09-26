

import type { Language as lang } from './locales';

export enum PollutantType {
  CO2 = 'co2',
  Plastic = 'plastic',
  Deforestation = 'deforestation'
}

export type Language = lang;

export interface Pollutants {
  [PollutantType.CO2]: number; // 0-100
  [PollutantType.Plastic]: number; // 0-100
  [PollutantType.Deforestation]: number; // 0-100
}

export interface EnergyProduction {
    renewable: number; // TWh
    nuclear: number;   // TWh
    thermal: number;   // TWh
}

export interface Energy {
    consumption: number; // TWh
    production: EnergyProduction;
}

export interface Tech {
    co2: number;
    deforestation: number;
    waste: number;
}

export interface Country {
    id: string;
    name: string;
    continent?: string;
    pollutants: Pollutants;
    coords: { x: number; y: number };
    population: number;
    populationGrowthRate: number; // Annual growth rate as a decimal (e.g., 0.01 for 1%)
    gdp: number; // Gross Domestic Product, in Trillions USD
    gdpGrowthRate: number; // Annual GDP growth rate
    healthIndex: number; // 0-100, represents public health
    healthCrisisLevel: number; // 0: None, 1: Warning, 2: Crisis, 3: Emergency, 4: Collapse
    energy: Energy;
    tech: Tech; // Technology levels
    instability: number; // 0-100, risk of conflict
    healthCrisisLastTick?: number;        // Dernier tick où une crise a eu lieu
    ticksInCurrentHealthLevel?: number;   // Nombre de ticks dans le niveau actuel
    previousHealthIndex?: number;         // HealthIndex du tick précédent
}

export interface ActiveAction {
    id: string; // Unique ID for this specific action instance
    actionId: string;
    countryId: string;
    name: string;
    completionDate: Date;
}

export interface Conflict {
    id: string;
    name: string;
    involvedCountryIds: string[];
    intensity: number; // 1 to 5
    startDate: Date;
    description: string;
}

export interface GameState {
  date: Date;
  ecoPoints: number;
  publicSupport: number; // 0-100, remains global
  countries: Country[];
  activeActions: ActiveAction[];
  selectedCountryId: string | null;
  totalPollution: number;
  isGameOver: boolean;
  gameWon: boolean;
  ticksUntilNextEvent: number;
  ticksUntilConflictCheck: number;
  ticksUntilExtinctionCheck: number;
  activeEvent: ActiveGameEvent | null;
  activeConflicts: Conflict[];
  gameSpeed: number; // 1, 2, or 3
  eventTimer: number | null; // Countdown for the active event
  playtimeSeconds: number; // Total seconds the game has been unpaused
  globalWarming: number; // Temperature anomaly in °C
  initialPopulation: number; // Starting population to check for game over
  biodiversityIndex: number; 
  nuclearThreatLevel: number; // 0-100, risk of nuclear war
  language: Language;
  hasPaidToRemoveAds: boolean;
  ticksUntilNextInterstitial: number;
}

export interface ActionEffect {
  type: PollutantType | 'publicSupport' | 'energyRenewable' | 'energyNuclear' | 'energyThermal' | 'co2FromThermal';
  value: number; // can be negative
}

export interface Action {
  id: string;
  name: string;
  description: string;
  cost: number;
  effects: ActionEffect[];
  duration: { min: number, max: number }; // Duration in months
  unlockThreshold?: {
    tech: keyof Tech;
    level: number;
  };
  continents?: string[];
}

export interface GeminiGameEvent {
    title: string;
    description: string;
    category: string;
    effects: GameEventEffects;
    choices?: EventChoice[];
}

export interface GeminiConflict {
    name: string;
    description: string;
    intensity: number; // 1-5
    title: string;
}

export interface GeminiExtinctSpecies {
    speciesName: string;
}

export interface GeminiNuclearEvent {
    description: string;
    targets: string[]; // Array of country IDs
    strikes: number;
}

export interface GeminiIntroNarration {
    description: string;
}

export interface GameEventEffects {
    co2_change: number;
    plastic_change: number;
    deforestation_change: number;
    eco_points_change_percent: number;
    public_support_change: number;
    population_change: number; // Absolute change in global population
    gdp_change_percent: number; // Percentage change to global GDP
    health_index_change: number; // Absolute point change to global health
    nuclear_threat_change?: number; // Absolute point change to nuclear threat
}

export interface EventChoice {
    text: string;
    cost: number;
    effects: Partial<GameEventEffects>;
}

export interface ActiveGameEvent {
    id:string;
    title: string;
    description: string;
    imageUrl: string;
    choices?: EventChoice[];
    baseEffects: Partial<GameEventEffects>;
    isConflictDeclaration?: boolean;
    conflictDetails?: Conflict;
    isNuclearStrike?: boolean;
    nuclearStrikeDetails?: GeminiNuclearEvent;
}

export interface SaveSlotInfo {
    slotId: number;
    exists: boolean;
    date?: string;
    totalPollution?: number;
    language?: Language;
}