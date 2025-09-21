
import React from 'react';
import type { Tech } from '../types';
import { CO2TechIcon, DeforestationTechIcon, WasteTechIcon } from '../components/icons/StatIcons';

export const TECH_COST_REDUCTION_FACTOR = 0.05;
export const TECH_EFFECT_BONUS_FACTOR = 0.10;

interface TechLevel {
    level: number;
    cost: number;
    description: string;
}

interface TechTree {
    id: keyof Tech;
    name: string;
    description: string;
    icon: React.ReactNode;
    levels: TechLevel[];
}

export const TECH_TREES: TechTree[] = [
    {
        id: 'co2',
        name: 'tech.co2.name',
        description: 'tech.co2.description',
        icon: React.createElement(CO2TechIcon),
        levels: [
            { level: 1, cost: 500, description: 'tech.co2.level1' },
            { level: 2, cost: 1500, description: 'tech.co2.level2' },
            { level: 3, cost: 3000, description: 'tech.co2.level3' },
            { level: 4, cost: 5000, description: 'tech.co2.level4' },
        ]
    },
    {
        id: 'deforestation',
        name: 'tech.deforestation.name',
        description: 'tech.deforestation.description',
        icon: React.createElement(DeforestationTechIcon),
        levels: [
            { level: 1, cost: 400, description: 'tech.deforestation.level1' },
            { level: 2, cost: 1200, description: 'tech.deforestation.level2' },
            { level: 3, cost: 2500, description: 'tech.deforestation.level3' },
            { level: 4, cost: 4000, description: 'tech.deforestation.level4' },
        ]
    },
    {
        id: 'waste',
        name: 'tech.waste.name',
        description: 'tech.waste.description',
        icon: React.createElement(WasteTechIcon),
        levels: [
            { level: 1, cost: 300, description: 'tech.waste.level1' },
            { level: 2, cost: 1000, description: 'tech.waste.level2' },
            { level: 3, cost: 2000, description: 'tech.waste.level3' },
            { level: 4, cost: 3500, description: 'tech.waste.level4' },
        ]
    }
];
