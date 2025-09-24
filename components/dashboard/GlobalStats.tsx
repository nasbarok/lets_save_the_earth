import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import type { GameState } from '../../types';
import { POLLUTANT_CONVERSION_FACTORS } from '../../constants/state';
import { CO2Icon, PlasticIcon, ForestIcon, InfoIcon } from '../icons/StatIcons';
import { formatLargeNumber, Tooltip } from '../utils';

const PollutantStatBar: React.FC<{ icon: React.ReactNode; label: string; value: number; displayValue: string; displayUnit: string; tooltipText?: string; }> = ({ icon, label, value, displayValue, displayUnit, tooltipText }) => {
  const getBarColor = () => {
    if (value > 80) return 'bg-red-500';
    if (value > 60) return 'bg-orange-400';
    if (value > 40) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="text-slate-400">{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-medium text-slate-300">{label}</span>
             {tooltipText && (
              <Tooltip text={tooltipText}>
                <InfoIcon className="w-4 h-4 text-slate-500 hover:text-slate-300 transition-colors" />
              </Tooltip>
            )}
          </div>
          <span className="text-xl font-bold text-white">{displayValue} <span className="text-sm font-normal text-slate-400">{displayUnit}</span></span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
};

interface GlobalStatsProps {
  gameState: GameState;
}

const GlobalStats: React.FC<GlobalStatsProps> = ({ gameState }) => {
  const { t } = useLocalization();

  const globalCO2 = gameState.countries.reduce((acc, c) => acc + c.pollutants.co2, 0) / gameState.countries.length;
  const globalPlastic = gameState.countries.reduce((acc, c) => acc + c.pollutants.plastic, 0) / gameState.countries.length;
  const globalDeforestation = gameState.countries.reduce((acc, c) => acc + c.pollutants.deforestation, 0) / gameState.countries.length;

  const totalCO2Tonnes = gameState.countries.reduce((acc, c) => acc + (c.pollutants.co2 * POLLUTANT_CONVERSION_FACTORS.co2), 0);
  const totalPlasticTonnes = gameState.countries.reduce((acc, c) => acc + (c.pollutants.plastic * POLLUTANT_CONVERSION_FACTORS.plastic), 0);
  const totalDeforestationHectares = gameState.countries.reduce((acc, c) => acc + (c.pollutants.deforestation * POLLUTANT_CONVERSION_FACTORS.deforestation), 0);

  const tooltips = {
    co2: t('tooltips.co2'),
    plastic: t('tooltips.plastic'),
    deforestation: t('tooltips.deforestation'),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <PollutantStatBar icon={<CO2Icon />} label={t('dashboard.globalCO2')} value={globalCO2} displayValue={formatLargeNumber(totalCO2Tonnes)} displayUnit="t" tooltipText={tooltips.co2} />
      <PollutantStatBar icon={<PlasticIcon />} label={t('dashboard.plasticWaste')} value={globalPlastic} displayValue={formatLargeNumber(totalPlasticTonnes)} displayUnit="t" tooltipText={tooltips.plastic} />
      <PollutantStatBar icon={<ForestIcon />} label={t('dashboard.deforestation')} value={globalDeforestation} displayValue={formatLargeNumber(totalDeforestationHectares)} displayUnit="ha" tooltipText={tooltips.deforestation} />
    </div>
  );
};

export default GlobalStats;