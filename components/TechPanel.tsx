
import React from 'react';
import type { Country, Tech } from '../types';
import { TECH_TREES } from '../constants/tech';
import { EcoPointsIcon } from './icons/StatIcons';
import { useLocalization } from '../hooks/useLocalization';

interface TechPanelProps {
    selectedCountry: Country | null;
    ecoPoints: number;
    onUpgrade: (techId: keyof Tech, countryId: string) => void;
    disabled: boolean;
}

const TechPanel: React.FC<TechPanelProps> = ({ selectedCountry, ecoPoints, onUpgrade, disabled }) => {
    const { t } = useLocalization();

    if (!selectedCountry) {
        return (
            <div>
                <h2 className="text-lg font-bold text-green-400 mb-2">{t('techPanel.title')}</h2>
                <p className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded-md mb-4">
                    {t('techPanel.selectRegion')}
                </p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-lg font-bold text-green-400 mb-2">
                {t('techPanel.titleIn', { regionName: t(selectedCountry.name) })}
            </h2>
            <div className="space-y-4 overflow-y-auto pr-2 flex-grow max-h-[60vh]">
                {TECH_TREES.map(tree => {
                    const currentLevel = selectedCountry.tech[tree.id];
                    const maxLevel = tree.levels.length;
                    const isMaxed = currentLevel >= maxLevel;
                    const nextLevelInfo = !isMaxed ? tree.levels[currentLevel] : null;
                    const canAfford = nextLevelInfo ? ecoPoints >= nextLevelInfo.cost : false;

                    return (
                        <div key={tree.id} className="bg-slate-800 p-3 rounded-lg">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="text-green-400">{tree.icon}</div>
                                <div>
                                    <h3 className="font-bold text-white">{t(tree.name)}</h3>
                                    <p className="text-xs text-slate-400">{t(tree.description)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 my-2">
                                {Array.from({ length: maxLevel }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-2 flex-1 rounded-full ${i < currentLevel ? 'bg-green-500' : 'bg-slate-700'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-slate-300 mb-3">
                                <span className="font-bold">{t('techPanel.level')} {currentLevel}: </span>
                                {currentLevel > 0 ? t(tree.levels[currentLevel - 1].description) : t('techPanel.baseEffectiveness')}
                            </p>
                            
                            {!isMaxed && nextLevelInfo && (
                                <button
                                    onClick={() => onUpgrade(tree.id, selectedCountry.id)}
                                    disabled={!canAfford || disabled}
                                    className="w-full text-left p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex justify-between items-center text-sm">
                                        <p className="font-semibold text-white">{t('techPanel.upgradeTo')} {currentLevel + 1}</p>
                                        <div className="flex items-center space-x-1 text-green-400">
                                            <span className="font-bold">{nextLevelInfo.cost}</span>
                                            <EcoPointsIcon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{t(nextLevelInfo.description)}</p>
                                </button>
                            )}
                             {isMaxed && (
                                <div className="text-center p-2 bg-slate-900/50 rounded-md">
                                    <p className="text-sm font-bold text-green-400">{t('techPanel.maxLevel')}</p>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TechPanel;
