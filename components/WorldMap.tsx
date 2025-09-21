
import React from 'react';
import type { Country, Conflict } from '../types';
import { useLocalization } from '../hooks/useLocalization';

import NorthAmerica from './continents/NorthAmerica';
import SouthAmerica from './continents/SouthAmerica';
import Europe from './continents/Europe';
import Africa from './continents/Africa';
import Asia from './continents/Asia';
import Oceania from './continents/Oceania';

interface WorldMapProps {
    countries: Country[];
    activeConflicts: Conflict[];
    selectedCountryId: string | null;
    onSelectCountry: (countryId: string | null) => void;
}

interface ContinentComponentProps {
    color: string;
    isSelected: boolean;
    onClick: () => void;
    'aria-label': string;
}

const getPollutionColor = (avgPollution: number): string => {
    if (avgPollution > 80) return 'rgba(239, 68, 68, 0.7)'; // red-500
    if (avgPollution > 60) return 'rgba(249, 115, 22, 0.7)'; // orange-500
    if (avgPollution > 40) return 'rgba(234, 179, 8, 0.7)'; // yellow-500
    return 'rgba(34, 197, 94, 0.7)'; // green-500
};

const ContinentComponents: Record<string, React.FC<ContinentComponentProps>> = {
    NA: NorthAmerica,
    SA: SouthAmerica,
    EU: Europe,
    AF: Africa,
    AS: Asia,
    OC: Oceania,
};

const ConflictLine: React.FC<{ coords1: {x: number, y: number}, coords2: {x: number, y: number} }> = ({ coords1, coords2 }) => (
    <line
        x1={coords1.x + 50}
        y1={coords1.y}
        x2={coords2.x + 50}
        y2={coords2.y}
        stroke="url(#conflictGradient)"
        strokeWidth="3"
        strokeDasharray="5, 5"
        className="conflict-line"
    />
);


export const WorldMap: React.FC<WorldMapProps> = ({ countries, activeConflicts, selectedCountryId, onSelectCountry }) => {
    const { t } = useLocalization();
    return (
        <svg viewBox="0 0 1000 500" className="w-full h-auto" aria-label={t('worldMap.ariaLabel')}>
            <defs>
                <radialGradient id="oceanGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{ stopColor: '#0f172a', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#020617', stopOpacity: 1 }} />
                </radialGradient>
                 <linearGradient id="conflictGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <style>{`
                    .conflict-line {
                        animation: dash 1s linear infinite;
                    }
                    @keyframes dash {
                        to {
                            stroke-dashoffset: -10;
                        }
                    }
                `}</style>
            </defs>
            <rect 
                width="100%" 
                height="100%" 
                fill="url(#oceanGradient)" 
                onClick={() => onSelectCountry(null)}
                className="cursor-pointer"
            />
            <g>
                {countries.map(country => {
                    const avgPollution = (country.pollutants.co2 + country.pollutants.plastic + country.pollutants.deforestation) / 3;
                    const color = getPollutionColor(avgPollution);
                    const isSelected = selectedCountryId === country.id;
                    
                    const ContinentComponent = ContinentComponents[country.id];

                    if (!ContinentComponent) {
                        console.warn(`No map component found for country ID: ${country.id}`);
                        return null;
                    }

                    return (
                        <ContinentComponent
                            key={country.id}
                            color={color}
                            isSelected={isSelected}
                            onClick={() => onSelectCountry(country.id)}
                            aria-label={t(country.name)}
                        />
                    );
                })}
            </g>
            <g>
                {activeConflicts.map(conflict => {
                    if (conflict.involvedCountryIds.length >= 2) {
                        const country1 = countries.find(c => c.id === conflict.involvedCountryIds[0]);
                        const country2 = countries.find(c => c.id === conflict.involvedCountryIds[1]);
                        if (country1 && country2) {
                           return <ConflictLine key={conflict.id} coords1={country1.coords} coords2={country2.coords} />;
                        }
                    }
                    return null;
                })}
            </g>
        </svg>
    );
};
