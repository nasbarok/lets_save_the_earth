
import type { Action } from '../types';
import { PollutantType } from '../types';

export const ACTIONS: Action[] = [
  {
    id: 'renewable_investment',
    name: 'actions.renewable_investment.name',
    description: 'actions.renewable_investment.description',
    cost: 1000,
    effects: [
      { type: 'energyRenewable', value: 150 },
      { type: 'energyThermal', value: -100 },
      { type: 'publicSupport', value: 5 },
    ],
    duration: { min: 12, max: 24 }
  },
  {
    id: 'reforestation_drive',
    name: 'actions.reforestation_drive.name',
    description: 'actions.reforestation_drive.description',
    cost: 400,
    effects: [
      { type: PollutantType.CO2, value: -4 },
      { type: PollutantType.Deforestation, value: -8 },
    ],
    duration: { min: 12, max: 24 }
  },
  {
    id: 'ocean_cleanup',
    name: 'actions.ocean_cleanup.name',
    description: 'actions.ocean_cleanup.description',
    cost: 750,
    effects: [
      { type: PollutantType.Plastic, value: -10 },
      { type: 'publicSupport', value: 3 },
    ],
    duration: { min: 9, max: 18 }
  },
  {
    id: 'awareness_campaign',
    name: 'actions.awareness_campaign.name',
    description: 'actions.awareness_campaign.description',
    cost: 250,
    effects: [
      { type: 'publicSupport', value: 15 },
    ],
    duration: { min: 3, max: 6 }
  },
  {
    id: 'nuclear_power_initiative',
    name: 'actions.nuclear_power_initiative.name',
    description: 'actions.nuclear_power_initiative.description',
    cost: 2500,
    effects: [
      { type: 'energyNuclear', value: 200 },
      { type: 'energyThermal', value: -150 },
      { type: 'publicSupport', value: -5 },
    ],
    duration: { min: 36, max: 60 },
    unlockThreshold: { tech: 'co2', level: 3 },
    continents: ['NA', 'EU', 'AS'],
  },
  {
    id: 'recycling_tech',
    name: 'actions.recycling_tech.name',
    description: 'actions.recycling_tech.description',
    cost: 600,
    effects: [
      { type: PollutantType.Plastic, value: -7 },
      { type: 'publicSupport', value: 2 },
    ],
    duration: { min: 8, max: 14 },
    unlockThreshold: { tech: 'waste', level: 1 },
  },
  {
    id: 'modernize_thermal_plants',
    name: 'actions.modernize_thermal_plants.name',
    description: 'actions.modernize_thermal_plants.description',
    cost: 650,
    effects: [
        { type: PollutantType.CO2, value: -3 },
        { type: 'publicSupport', value: -2 },
    ],
    duration: { min: 6, max: 12 },
    unlockThreshold: { tech: 'co2', level: 2 },
    continents: ['NA', 'EU', 'AS'],
  },
  {
    id: 'policy_summit',
    name: 'actions.policy_summit.name',
    description: 'actions.policy_summit.description',
    cost: 1500,
    effects: [
      { type: PollutantType.CO2, value: -6 },
      { type: PollutantType.Deforestation, value: -4 },
      { type: 'publicSupport', value: 8 },
    ],
    duration: { min: 6, max: 10 },
    unlockThreshold: { tech: 'co2', level: 1 },
  },
  {
    id: 'sustainable_agriculture',
    name: 'actions.sustainable_agriculture.name',
    description: 'actions.sustainable_agriculture.description',
    cost: 800,
    effects: [
      { type: PollutantType.Deforestation, value: -9 },
      { type: PollutantType.CO2, value: -2 },
      { type: 'publicSupport', value: 2 },
    ],
    duration: { min: 10, max: 20 },
    unlockThreshold: { tech: 'deforestation', level: 2 },
    continents: ['SA', 'AF', 'AS'],
  }
];
