import React from 'react';
import type { GameState, Country } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';
import { POLLUTANT_CONVERSION_FACTORS } from '../../constants/state';
import { CO2Icon, PlasticIcon, ForestIcon, HealthIcon, GDPIcon, PopulationIcon, EnergyIcon, RenewableIcon, NuclearIcon, ThermalIcon, ThermometerIcon, InstabilityIcon, BiodiversityIcon, NuclearThreatIcon } from '../icons/StatIcons';
import { formatLargeNumber, StatCard } from '../utils';

interface GlobalOverviewProps {
  gameState: GameState;
  selectedCountry: Country | null;
}

const GlobalOverview: React.FC<GlobalOverviewProps> = ({ gameState, selectedCountry }) => {
  const { t } = useLocalization();
  const { globalWarming, biodiversityIndex, nuclearThreatLevel } = gameState;
  const avgHealth = gameState.countries.reduce((acc, c) => acc + c.healthIndex, 0) / gameState.countries.length;
  const totalGdp = gameState.countries.reduce((acc, c) => acc + c.gdp, 0);
  const totalPopulation = gameState.countries.reduce((acc, c) => acc + c.population, 0);

  const totalEnergyConsumption = gameState.countries.reduce((acc, c) => acc + c.energy.consumption, 0);
  const totalRenewableProduction = gameState.countries.reduce((acc, c) => acc + c.energy.production.renewable, 0);
  const totalNuclearProduction = gameState.countries.reduce((acc, c) => acc + c.energy.production.nuclear, 0);
  const totalThermalProduction = gameState.countries.reduce((acc, c) => acc + c.energy.production.thermal, 0);

  const tooltips = {
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

  return (
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
  );
};

export default GlobalOverview;