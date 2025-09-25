import React from 'react';
import type { GameState, Country } from '../types';
import { CO2Icon, PlasticIcon, ForestIcon, HealthIcon, GDPIcon, PopulationIcon, EnergyIcon, RenewableIcon, NuclearIcon, ThermalIcon, ThermometerIcon, InstabilityIcon, BiodiversityIcon, NuclearThreatIcon, InfoIcon } from './icons/StatIcons';
import { POLLUTANT_CONVERSION_FACTORS } from '../constants/state';
import { useLocalization } from '../hooks/useLocalization';
import CollapsibleSection from './CollapsibleSection';
import { formatLargeNumber, Tooltip, StatCard } from './utils';

const PollutantStatBar: React.FC<{ icon: React.ReactNode; label: string; value: number; displayValue: string; displayUnit: string; tooltipText?: string; }> = ({ icon, label, value, displayValue, displayUnit, tooltipText }) => {
  const getBarColor = () => {
    if (value > 80) return 'bg-red-500';
    if (value > 60) return 'bg-orange-400';
    if (value > 40) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="text-slate-400">{React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}</div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-0.5">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium text-slate-300">{label}</span>
             {tooltipText && (
              <Tooltip text={tooltipText}>
                <InfoIcon className="w-3 h-3 text-slate-500 hover:text-slate-300 transition-colors" />
              </Tooltip>
            )}
          </div>
          <span className="text-md font-bold text-white">{displayValue} <span className="text-xs font-normal text-slate-400">{displayUnit}</span></span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
};

interface InfoPanelsProps {
  gameState: GameState;
  selectedCountry: Country | null;
}

const InfoPanels: React.FC<InfoPanelsProps> = ({ gameState, selectedCountry }) => {
  const { t } = useLocalization();
  const { globalWarming, biodiversityIndex, nuclearThreatLevel } = gameState;
  const avgHealth = gameState.countries.reduce((acc, c) => acc + c.healthIndex, 0) / gameState.countries.length;
  const totalGdp = gameState.countries.reduce((acc, c) => acc + c.gdp, 0);
  const totalPopulation = gameState.countries.reduce((acc, c) => acc + c.population, 0);

  const tooltips = {
    co2: t('tooltips.co2'),
    plastic: t('tooltips.plastic'),
    deforestation: t('tooltips.deforestation'),
    gdp: t('tooltips.gdp'),
    health: t('tooltips.health'),
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
    <div className="flex flex-col gap-4">
      <CollapsibleSection title={t('dashboard.globalStats')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
            <PollutantStatBar icon={<CO2Icon />} label={t('dashboard.globalCO2')} value={globalCO2} displayValue={formatLargeNumber(totalCO2Tonnes)} displayUnit="t" tooltipText={tooltips.co2} />
            <PollutantStatBar icon={<PlasticIcon />} label={t('dashboard.plasticWaste')} value={globalPlastic} displayValue={formatLargeNumber(totalPlasticTonnes)} displayUnit="t" tooltipText={tooltips.plastic} />
            <PollutantStatBar icon={<ForestIcon />} label={t('dashboard.deforestation')} value={globalDeforestation} displayValue={formatLargeNumber(totalDeforestationHectares)} displayUnit="ha" tooltipText={tooltips.deforestation} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={selectedCountry ? `${t('dashboard.regionalData')}: ${t(selectedCountry.name)}` : t('dashboard.globalOverview')}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm pt-2">
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
      </CollapsibleSection>
    </div>
  );
};

export default InfoPanels;