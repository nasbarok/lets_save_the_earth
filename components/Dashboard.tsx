

import React from 'react';
import type { GameState, Country } from '../types';
// FIX: Changed aliased import `NuclearIcon as NuclearThreatIcon` to a direct import of `NuclearThreatIcon` to match the corrected export in `StatIcons.tsx`.
import { EcoPointsIcon, SupportIcon, CO2Icon, PlasticIcon, ForestIcon, CalendarIcon, MenuIcon, PlayIcon, PauseIcon, HealthIcon, GDPIcon, ClockIcon, InfoIcon, PopulationIcon, EnergyIcon, RenewableIcon, NuclearIcon, ThermalIcon, ThermometerIcon, InstabilityIcon, BiodiversityIcon, NuclearThreatIcon } from './icons/StatIcons';
import { POLLUTANT_CONVERSION_FACTORS } from '../constants/state';
import { useLocalization } from '../hooks/useLocalization';

interface DashboardProps {
  gameState: GameState;
  onMenuToggle: () => void;
  selectedCountry: Country | null;
  isPaused: boolean;
  onPauseToggle: () => void;
  onSpeedChange: (speed: 1 | 2 | 3) => void;
}

const formatLargeNumber = (num: number, digits = 1) => {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
      { value: 1e12, symbol: "T" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
};


const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-white bg-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        {text}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; colorClass: string, tooltipText?: string }> = ({ icon, label, value, colorClass, tooltipText }) => (
  <div className="bg-slate-800 p-3 rounded-lg flex items-center space-x-3 shadow-md">
    <div className={`p-2 rounded-full ${colorClass}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center space-x-1">
        <p className="text-sm text-slate-400">{label}</p>
        {tooltipText && (
          <Tooltip text={tooltipText}>
            <InfoIcon className="w-4 h-4 text-slate-500 hover:text-slate-300 transition-colors" />
          </Tooltip>
        )}
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  </div>
);

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


const Dashboard: React.FC<DashboardProps> = ({ gameState, onMenuToggle, selectedCountry, isPaused, onPauseToggle, onSpeedChange }) => {
  const { t, language } = useLocalization();
  const { date, ecoPoints, publicSupport, gameSpeed, playtimeSeconds, globalWarming, activeConflicts, biodiversityIndex, nuclearThreatLevel } = gameState;
  const avgHealth = gameState.countries.reduce((acc, c) => acc + c.healthIndex, 0) / gameState.countries.length;
  const totalGdp = gameState.countries.reduce((acc, c) => acc + c.gdp, 0);
  const totalPopulation = gameState.countries.reduce((acc, c) => acc + c.population, 0);

  const formatPlaytime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.round(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  const tooltips = {
    co2: t('tooltips.co2'),
    plastic: t('tooltips.plastic'),
    deforestation: t('tooltips.deforestation'),
    gdp: t('tooltips.gdp'),
    health: t('tooltips.health'),
    publicSupport: t('tooltips.publicSupport'),
    energyConsumption: t('tooltips.energyConsumption'),
    energyRenewable: t('tooltips.energyRenewable'),
    energyNuclear: t('tooltips.energyNuclear'),
    energyThermal: t('tooltips.energyThermal'),
    globalWarming: t('tooltips.globalWarming'),
    instability: t('tooltips.instability'),
    biodiversity: t('tooltips.biodiversity'),
    nuclearThreat: t('tooltips.nuclearThreat'),
  };

  const globalCO2 = gameState.countries.reduce((acc, c) => acc + c.pollutants.co2, 0) / gameState.countries.length;
  const globalPlastic = gameState.countries.reduce((acc, c) => acc + c.pollutants.plastic, 0) / gameState.countries.length;
  const globalDeforestation = gameState.countries.reduce((acc, c) => acc + c.pollutants.deforestation, 0) / gameState.countries.length;
  
  const totalCO2Tonnes = gameState.countries.reduce((acc, c) => acc + (c.pollutants.co2 * POLLUTANT_CONVERSION_FACTORS.co2), 0);
  const totalPlasticTonnes = gameState.countries.reduce((acc, c) => acc + (c.pollutants.plastic * POLLUTANT_CONVERSION_FACTORS.plastic), 0);
  const totalDeforestationHectares = gameState.countries.reduce((acc, c) => acc + (c.pollutants.deforestation * POLLUTANT_CONVERSION_FACTORS.deforestation), 0);

  const totalEnergyConsumption = gameState.countries.reduce((acc, c) => acc + c.energy.consumption, 0);
  const totalRenewableProduction = gameState.countries.reduce((acc, c) => acc + c.energy.production.renewable, 0);
  const totalNuclearProduction = gameState.countries.reduce((acc, c) => acc + c.energy.production.nuclear, 0);
  const totalThermalProduction = gameState.countries.reduce((acc, c) => acc + c.energy.production.thermal, 0);


  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg shadow-lg ring-1 ring-slate-700">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
        <div className="col-span-2 md:col-span-4 lg:col-span-2 bg-slate-800 p-3 rounded-lg flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
                 <div className="p-2 rounded-full bg-slate-700 text-slate-300"><CalendarIcon /></div>
                 <div>
                    <p className="text-sm text-slate-400">{t('dashboard.date')}</p>
                    <p className="text-lg font-bold text-white">{new Date(date).toLocaleDateString(language, { year: 'numeric', month: 'long' })}</p>
                 </div>
            </div>
             <div className="flex items-center space-x-3">
                {activeConflicts.length > 0 && (
                    <Tooltip text={activeConflicts.map(c => c.name).join(', ')}>
                        <div className="flex items-center space-x-1 text-red-400 animate-pulse">
                            <InstabilityIcon className="w-5 h-5" />
                            <span className="font-bold text-lg">{activeConflicts.length}</span>
                        </div>
                    </Tooltip>
                )}
                 <button onClick={onPauseToggle} className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors text-white" aria-label={isPaused ? t('dashboard.playAria') : t('dashboard.pauseAria')}>
                    {isPaused ? <PlayIcon /> : <PauseIcon />}
                 </button>
                 <div className="flex items-center bg-slate-700 rounded-full p-1">
                     {[1, 2, 3].map(speed => (
                        <button key={speed} onClick={() => onSpeedChange(speed as 1 | 2 | 3)} className={`px-2 py-0.5 text-sm rounded-full transition-colors ${gameSpeed === speed ? 'bg-green-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-600'}`}>
                            {speed}x
                        </button>
                     ))}
                 </div>
            </div>
        </div>
        <StatCard icon={<EcoPointsIcon className="w-6 h-6"/>} label={t('dashboard.ecoPoints')} value={ecoPoints.toLocaleString(language)} colorClass="bg-green-500/20 text-green-400" />
        <StatCard icon={<SupportIcon className="w-6 h-6"/>} label={t('dashboard.publicSupport')} value={`${publicSupport.toFixed(1)}%`} colorClass="bg-sky-500/20 text-sky-400" tooltipText={tooltips.publicSupport}/>
        <StatCard icon={<ClockIcon className="w-6 h-6"/>} label={t('dashboard.playtime')} value={formatPlaytime(playtimeSeconds)} colorClass="bg-indigo-500/20 text-indigo-400" />

        <button onClick={onMenuToggle} className="bg-slate-800 p-3 rounded-lg flex items-center justify-center space-x-3 shadow-md hover:bg-slate-700 transition-colors">
            <div className="p-2 rounded-full bg-slate-700 text-slate-300"><MenuIcon /></div>
            <span className="font-bold text-white">{t('dashboard.menu')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <PollutantStatBar icon={<CO2Icon />} label={t('dashboard.globalCO2')} value={globalCO2} displayValue={formatLargeNumber(totalCO2Tonnes)} displayUnit="t" tooltipText={tooltips.co2} />
        <PollutantStatBar icon={<PlasticIcon />} label={t('dashboard.plasticWaste')} value={globalPlastic} displayValue={formatLargeNumber(totalPlasticTonnes)} displayUnit="t" tooltipText={tooltips.plastic} />
        <PollutantStatBar icon={<ForestIcon />} label={t('dashboard.deforestation')} value={globalDeforestation} displayValue={formatLargeNumber(totalDeforestationHectares)} displayUnit="ha" tooltipText={tooltips.deforestation} />
      </div>

      <div className="bg-slate-900/50 p-4 rounded-lg">
          <h3 className="text-md font-bold text-green-400 mb-3">{selectedCountry ? `${t('dashboard.regionalData')}: ${t(selectedCountry.name)}` : t('dashboard.globalOverview')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
            <StatCard 
              icon={<HealthIcon />} 
              label={selectedCountry ? t('dashboard.healthIndex') : t('dashboard.avgHealth')} 
              value={`${(selectedCountry ? selectedCountry.healthIndex : avgHealth).toFixed(1)}`} 
              colorClass="bg-red-500/20 text-red-400"
              tooltipText={tooltips.health}
            />
            <StatCard 
              icon={<GDPIcon />} 
              label={selectedCountry ? t('dashboard.regionalGDP') : t('dashboard.globalGDP')} 
              value={`$${(selectedCountry ? selectedCountry.gdp : totalGdp).toFixed(1)} T`} 
              colorClass="bg-yellow-500/20 text-yellow-400"
              tooltipText={tooltips.gdp}
            />
             <StatCard
                icon={<PopulationIcon />}
                label={selectedCountry ? t('dashboard.population') : t('dashboard.totalPopulation')}
                value={formatLargeNumber(selectedCountry ? selectedCountry.population : totalPopulation, 2)}
                colorClass="bg-purple-500/20 text-purple-400"
                tooltipText={selectedCountry ? t('tooltips.population', { countryName: t(selectedCountry.name) }) : t('tooltips.totalPopulation')}
             />
            {selectedCountry ? (
              <>
                 <StatCard 
                    icon={<InstabilityIcon />} 
                    label={t('dashboard.instability')} 
                    value={`${selectedCountry.instability.toFixed(1)}`} 
                    colorClass="bg-red-500/20 text-red-300"
                    tooltipText={tooltips.instability}
                  />
                  <div className="col-span-2 md:col-span-4 my-2 border-t border-slate-700/50"></div>
                 <StatCard 
                    icon={<CO2Icon />} 
                    label={t('dashboard.regionalCO2')} 
                    value={`${formatLargeNumber(selectedCountry.pollutants.co2 * POLLUTANT_CONVERSION_FACTORS.co2, 2)} t`} 
                    colorClass="bg-gray-500/20 text-gray-300"
                    tooltipText={t('tooltips.regionalCO2', { countryName: t(selectedCountry.name) })}
                  />
                  <StatCard 
                    icon={<PlasticIcon />} 
                    label={t('dashboard.regionalPlastic')} 
                    value={`${formatLargeNumber(selectedCountry.pollutants.plastic * POLLUTANT_CONVERSION_FACTORS.plastic, 2)} t`} 
                    colorClass="bg-blue-500/20 text-blue-300"
                    tooltipText={t('tooltips.regionalPlastic', { countryName: t(selectedCountry.name) })}
                  />
                  <StatCard
                    icon={<ForestIcon />}
                    label={t('dashboard.deforestation')}
                    value={`${formatLargeNumber(selectedCountry.pollutants.deforestation * POLLUTANT_CONVERSION_FACTORS.deforestation, 2)} ha`}
                    colorClass="bg-orange-500/20 text-orange-400"
                    tooltipText={t('tooltips.regionalDeforestation', { countryName: t(selectedCountry.name) })}
                  />
                   <div className="col-span-2 md:col-span-3 lg:col-span-4 my-2 border-t border-slate-700/50"></div>
                   <StatCard
                        icon={<EnergyIcon />}
                        label={t('dashboard.energyConsumption')}
                        value={`${formatLargeNumber(selectedCountry.energy.consumption, 2)} TWh`}
                        colorClass="bg-yellow-500/20 text-yellow-300"
                        tooltipText={tooltips.energyConsumption}
                    />
                     <StatCard
                        icon={<RenewableIcon />}
                        label={t('dashboard.renewableGen')}
                        value={`${formatLargeNumber(selectedCountry.energy.production.renewable, 2)} TWh`}
                        colorClass="bg-green-500/20 text-green-400"
                        tooltipText={tooltips.energyRenewable}
                    />
                     <StatCard
                        icon={<NuclearIcon />}
                        label={t('dashboard.nuclearGen')}
                        value={`${formatLargeNumber(selectedCountry.energy.production.nuclear, 2)} TWh`}
                        colorClass="bg-sky-500/20 text-sky-400"
                        tooltipText={tooltips.energyNuclear}
                    />
                     <StatCard
                        icon={<ThermalIcon />}
                        label={t('dashboard.thermalGen')}
                        value={`${formatLargeNumber(selectedCountry.energy.production.thermal, 2)} TWh`}
                        colorClass="bg-red-500/20 text-red-400"
                        tooltipText={tooltips.energyThermal}
                    />
              </>
            ) : (
                <>
                  <StatCard
                    icon={<ThermometerIcon />}
                    label={t('dashboard.globalWarming')}
                    value={`+${globalWarming.toFixed(2)}°C`}
                    colorClass="bg-orange-500/20 text-orange-400"
                    tooltipText={tooltips.globalWarming}
                  />
                   <StatCard
                        icon={<NuclearThreatIcon />}
                        label={t('dashboard.nuclearThreat')}
                        value={`${nuclearThreatLevel.toFixed(1)}`}
                        colorClass="bg-red-500/20 text-red-300"
                        tooltipText={tooltips.nuclearThreat}
                    />
                  <div className="col-span-2 md:col-span-3 lg:col-span-4 my-2 border-t border-slate-700/50"></div>
                   <StatCard
                        icon={<BiodiversityIcon />}
                        label={t('dashboard.biodiversityIndex')}
                        value={`${biodiversityIndex.toFixed(1)}%`}
                        colorClass="bg-teal-500/20 text-teal-300"
                        tooltipText={tooltips.biodiversity}
                    />
                     <StatCard
                        icon={<EnergyIcon />}
                        label={t('dashboard.globalConsumption')}
                        value={`${formatLargeNumber(totalEnergyConsumption, 2)} TWh`}
                        colorClass="bg-yellow-500/20 text-yellow-300"
                        tooltipText={tooltips.energyConsumption}
                    />
                     <StatCard
                        icon={<RenewableIcon />}
                        label={t('dashboard.globalRenewable')}
                        value={`${formatLargeNumber(totalRenewableProduction, 2)} TWh`}
                        colorClass="bg-green-500/20 text-green-400"
                        tooltipText={tooltips.energyRenewable}
                    />
                     <StatCard
                        icon={<NuclearIcon />}
                        label={t('dashboard.globalNuclear')}
                        value={`${formatLargeNumber(totalNuclearProduction, 2)} TWh`}
                        colorClass="bg-sky-500/20 text-sky-400"
                        tooltipText={tooltips.energyNuclear}
                    />
                     <StatCard
                        icon={<ThermalIcon />}
                        label={t('dashboard.globalThermal')}
                        value={`${formatLargeNumber(totalThermalProduction, 2)} TWh`}
                        colorClass="bg-red-500/20 text-red-400"
                        tooltipText={tooltips.energyThermal}
                    />
              </>
            )}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;