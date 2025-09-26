import React, {useEffect} from 'react';
import type {GameState, Country} from '../types';
import {
    CO2Icon,
    PlasticIcon,
    ForestIcon,
    HealthIcon,
    GDPIcon,
    PopulationIcon,
    EnergyIcon,
    RenewableIcon,
    NuclearIcon,
    ThermalIcon,
    ThermometerIcon,
    InstabilityIcon,
    BiodiversityIcon,
    NuclearThreatIcon,
    InfoIcon
} from './icons/StatIcons';
import {POLLUTANT_CONVERSION_FACTORS} from '../constants/state';
import {useLocalization} from '../hooks/useLocalization';
import CollapsibleSection from './CollapsibleSection';
import {formatLargeNumber, Tooltip, StatCard} from './utils';

const PollutantStatBar: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number;          // 0..100 (% pour la largeur de barre)
    displayValue: string;   // texte affiché (ex: "7.1 Gt")
    displayUnit: string;    // peut être "" (sera masqué)
    tooltipText?: string;
    dense?: boolean;        // <-- NOUVEAU
}> = ({icon, label, value, displayValue, displayUnit, tooltipText, dense}) => {
    const getBarColor = () => {
        if (value > 80) return 'bg-red-500';
        if (value > 60) return 'bg-orange-400';
        if (value > 40) return 'bg-yellow-400';
        return 'bg-green-500';
    };

    return (
        <div className={`flex items-center ${dense ? 'space-x-2' : 'space-x-3'}`}>
            <div className="text-slate-400">
                {React.cloneElement(icon as React.ReactElement, {className: dense ? "w-4 h-4" : "w-5 h-5"})}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <div className="flex items-center space-x-1 min-w-0">
                            <span
                                className={`${dense ? 'text-[11px]' : 'text-xs'} font-medium text-slate-300 truncate`}>
                              {label}
                            </span>
                        {tooltipText && (
                            <Tooltip text={tooltipText}>
                                <InfoIcon className="w-3 h-3 text-slate-500 hover:text-slate-300 transition-colors"/>
                            </Tooltip>
                        )}
                    </div>
                    <span className={`${dense ? 'text-sm' : 'text-md'} font-bold text-white shrink-0`}>
            {displayValue}
                        {displayUnit
                            ? <span
                                className={`${dense ? 'text-[11px]' : 'text-xs'} font-normal text-slate-400 ml-1`}>{displayUnit}</span>
                            : null}
          </span>
                </div>
                <div className={`w-full bg-slate-700 rounded-full ${dense ? 'h-1' : 'h-1.5'} overflow-hidden`}>
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
                        style={{width: `${Math.max(0, Math.min(100, value))}%`}}
                    />
                </div>
            </div>
        </div>
    );
};

interface InfoPanelsProps {
    gameState: GameState;
    selectedCountry: Country | null;
    selectedRegion?: string | null;
}

const InfoPanels: React.FC<InfoPanelsProps> = ({gameState, selectedCountry, selectedRegion}) => {
    const {t} = useLocalization();
    const {globalWarming, biodiversityIndex, nuclearThreatLevel} = gameState;
    const avgHealth = gameState.countries.reduce((acc, c) => acc + c.healthIndex, 0) / gameState.countries.length;
    const totalGdp = gameState.countries.reduce((acc, c) => acc + c.gdp, 0);
    const totalPopulation = gameState.countries.reduce((acc, c) => acc + c.population, 0);
    const avgInstability = gameState.countries.reduce((acc, c) => acc + c.instability, 0) / gameState.countries.length;
    const POPULATION_CAP = 10_000_000_000; // cap lisible pour la jauge (10 Md)
    const populationPercent = Math.min((totalPopulation / POPULATION_CAP) * 100, 100);
    const scopeLabel = selectedRegion ? (t(selectedRegion) || selectedRegion) : t('dashboard.world') || 'Mondial';
    const labelScope = (genericKey: string, worldKey?: string) =>
        selectedRegion ? `${t(genericKey)} — ${scopeLabel}` : (worldKey ? t(worldKey) : t(genericKey));
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
    const REGION_ALIASES: Record<string, string> = {
        'africa': 'africa', 'afrique': 'africa', 'countries.af': 'africa',
        'europe': 'europe', 'countries.eu': 'europe',
        'asia': 'asia', 'asie': 'asia', 'countries.as': 'asia',
        'north america': 'north_america', 'amerique du nord': 'north_america', 'amérique du nord': 'north_america', 'countries.na': 'north_america',
        'south america': 'south_america', 'amerique du sud': 'south_america', 'amérique du sud': 'south_america', 'countries.sa': 'south_america',
        'oceania': 'oceania', 'oceanie': 'oceania', 'océanie': 'oceania', 'countries.oc': 'oceania',
        'antarctica': 'antarctica', 'antarctique': 'antarctica', 'countries.an': 'antarctica',
    };
    function norm(s: string) {
        return s
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[\s\-]+/g, '_')   // <-- espaces & tirets -> _
            .trim();
    }
    function regionKey(s?: string | null): string {
        if (!s) return '';
        const n = norm(s);
        return REGION_ALIASES[n] ?? n; // renvoie une clé canonique
    }

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

    // === SCOPE (Monde par défaut, ou Continent si selectedRegion est défini) ===
    const selectedRegionKey = regionKey(selectedRegion);

    const countryRegionKey = (c: any) =>
        regionKey(c.region ?? c.continent ?? '');

    let scopeCountries = selectedRegionKey
        ? gameState.countries.filter((c) => countryRegionKey(c) === selectedRegionKey)
        : gameState.countries;

// fallback si rien ne matche (ex: mauvaise clé passée)
    if (selectedRegionKey && scopeCountries.length === 0) {
        console.warn('[InfoPanels] Aucune correspondance pour selectedRegion=', selectedRegion);
        scopeCountries = gameState.countries;
    }
    /* >>> ICI : log temporaire <<< */
// eslint-disable-next-line no-console
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.debug('[InfoPanels scope]', { selectedRegion, selectedRegionKey, matched: scopeCountries.length });
    }, [selectedRegion, selectedRegionKey, scopeCountries.length]);
    const scopeAvg = (getter: (c: Country) => number) =>
        scopeCountries.length ? scopeCountries.reduce((a, c) => a + getter(c), 0) / scopeCountries.length : 0;
    const scopeSum = (getter: (c: Country) => number) =>
        scopeCountries.reduce((a, c) => a + getter(c), 0);

    const scopeCO2 = scopeAvg(c => c.pollutants.co2);
    const scopePlastic = scopeAvg(c => c.pollutants.plastic);
    const scopeDeforest = scopeAvg(c => c.pollutants.deforestation);

    const scopeCO2Tonnes = scopeSum(c => c.pollutants.co2 * POLLUTANT_CONVERSION_FACTORS.co2);
    const scopePlasticTonnes = scopeSum(c => c.pollutants.plastic * POLLUTANT_CONVERSION_FACTORS.plastic);
    const scopeDeforestHa = scopeSum(c => c.pollutants.deforestation * POLLUTANT_CONVERSION_FACTORS.deforestation);

    const scopePopulation = scopeSum(c => c.population);
    const scopeAvgInstability = scopeAvg(c => c.instability);
    const scopePopulationPct = Math.min((scopePopulation / POPULATION_CAP) * 100, 100);

    return (
        <div className="flex flex-col gap-4">
            <CollapsibleSection title={selectedRegion ? `${t('dashboard.regionalStats')}: ${t(selectedRegion)}` : t('dashboard.globalStats')}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-1">
                    <PollutantStatBar
                        dense
                        icon={<CO2Icon/>}
                        label={labelScope('dashboard.co2', 'dashboard.globalCO2')}
                        value={scopeCO2}
                        displayValue={formatLargeNumber(scopeCO2Tonnes)}
                        displayUnit="t"
                        tooltipText={tooltips.co2}
                    />
                    <PollutantStatBar
                        dense
                        icon={<PlasticIcon/>}
                        label={labelScope('dashboard.plasticWaste')}
                        value={scopePlastic}
                        displayValue={formatLargeNumber(scopePlasticTonnes)}
                        displayUnit="t"
                        tooltipText={tooltips.plastic}
                    />
                    <PollutantStatBar
                        dense
                        icon={<ForestIcon/>}
                        label={labelScope('dashboard.deforestation')}
                        value={scopeDeforest}
                        displayValue={formatLargeNumber(scopeDeforestHa)}
                        displayUnit="ha"
                        tooltipText={tooltips.deforestation}
                    />
                    {/* NOUVEAU : Population globale */}
                    <PollutantStatBar
                        dense
                        icon={<PopulationIcon/>}
                        label={labelScope('dashboard.totalPopulation')}
                        value={scopePopulationPct}
                        displayValue={formatLargeNumber(scopePopulation, 2)}
                        displayUnit="" /* unité masquée automatiquement */
                        tooltipText={t('tooltips.totalPopulation')}
                    />
                    {/* NOUVEAU : Conflit/Instabilité (moyenne) */}
                    <PollutantStatBar
                        dense
                        icon={<InstabilityIcon/>}
                        label={labelScope('dashboard.instability')}
                        value={scopeAvgInstability}
                        displayValue={scopeAvgInstability.toFixed(1)}
                        displayUnit="pt"
                        tooltipText={tooltips.instability}
                    />
                </div>
            </CollapsibleSection>

            <CollapsibleSection
                title={selectedCountry ? `${t('dashboard.regionalData')}: ${t(selectedCountry.name)}` : t('dashboard.globalOverview')}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-2">
                    <StatCard dense
                              icon={<HealthIcon/>}
                              label={selectedCountry ? t('dashboard.healthIndex') : t('dashboard.avgHealth')}
                              value={`${(selectedCountry ? selectedCountry.healthIndex : avgHealth).toFixed(1)}`}
                              colorClass="bg-red-500/20 text-red-400"
                              tooltipText={tooltips.health}
                    />
                    <StatCard dense
                              icon={<GDPIcon/>}
                              label={selectedCountry ? t('dashboard.regionalGDP') : t('dashboard.globalGDP')}
                              value={`$${(selectedCountry ? selectedCountry.gdp : totalGdp).toFixed(1)} T`}
                              colorClass="bg-yellow-500/20 text-yellow-400"
                              tooltipText={tooltips.gdp}
                    />
                    <StatCard dense
                              icon={<PopulationIcon/>}
                              label={selectedCountry ? t('dashboard.population') : t('dashboard.totalPopulation')}
                              value={formatLargeNumber(selectedCountry ? selectedCountry.population : totalPopulation, 2)}
                              colorClass="bg-purple-500/20 text-purple-400"
                              tooltipText={selectedCountry ? t('tooltips.population', {countryName: t(selectedCountry.name)}) : t('tooltips.totalPopulation')}
                    />
                    {selectedCountry ? (
                        <>
                            <StatCard dense
                                      icon={<InstabilityIcon/>}
                                      label={t('dashboard.instability')}
                                      value={`${selectedCountry.instability.toFixed(1)}`}
                                      colorClass="bg-red-500/20 text-red-300"
                                      tooltipText={tooltips.instability}
                            />
                            <div className="col-span-2 md:col-span-4 my-2 border-t border-slate-700/50"></div>
                            <StatCard dense
                                      icon={<CO2Icon/>}
                                      label={t('dashboard.regionalCO2')}
                                      value={`${formatLargeNumber(selectedCountry.pollutants.co2 * POLLUTANT_CONVERSION_FACTORS.co2, 2)} t`}
                                      colorClass="bg-gray-500/20 text-gray-300"
                                      tooltipText={t('tooltips.regionalCO2', {countryName: t(selectedCountry.name)})}
                            />
                            <StatCard dense
                                      icon={<PlasticIcon/>}
                                      label={t('dashboard.regionalPlastic')}
                                      value={`${formatLargeNumber(selectedCountry.pollutants.plastic * POLLUTANT_CONVERSION_FACTORS.plastic, 2)} t`}
                                      colorClass="bg-blue-500/20 text-blue-300"
                                      tooltipText={t('tooltips.regionalPlastic', {countryName: t(selectedCountry.name)})}
                            />
                            <StatCard dense
                                      icon={<ForestIcon/>}
                                      label={t('dashboard.deforestation')}
                                      value={`${formatLargeNumber(selectedCountry.pollutants.deforestation * POLLUTANT_CONVERSION_FACTORS.deforestation, 2)} ha`}
                                      colorClass="bg-orange-500/20 text-orange-400"
                                      tooltipText={t('tooltips.regionalDeforestation', {countryName: t(selectedCountry.name)})}
                            />
                            <div
                                className="col-span-2 md:col-span-3 lg:col-span-4 my-2 border-t border-slate-700/50"></div>
                            <StatCard dense
                                      icon={<EnergyIcon/>}
                                      label={t('dashboard.energyConsumption')}
                                      value={`${formatLargeNumber(selectedCountry.energy.consumption, 2)} TWh`}
                                      colorClass="bg-yellow-500/20 text-yellow-300"
                                      tooltipText={tooltips.energyConsumption}
                            />
                            <StatCard dense
                                      icon={<RenewableIcon/>}
                                      label={t('dashboard.renewableGen')}
                                      value={`${formatLargeNumber(selectedCountry.energy.production.renewable, 2)} TWh`}
                                      colorClass="bg-green-500/20 text-green-400"
                                      tooltipText={tooltips.energyRenewable}
                            />
                            <StatCard dense
                                      icon={<NuclearIcon/>}
                                      label={t('dashboard.nuclearGen')}
                                      value={`${formatLargeNumber(selectedCountry.energy.production.nuclear, 2)} TWh`}
                                      colorClass="bg-sky-500/20 text-sky-400"
                                      tooltipText={tooltips.energyNuclear}
                            />
                            <StatCard dense
                                      icon={<ThermalIcon/>}
                                      label={t('dashboard.thermalGen')}
                                      value={`${formatLargeNumber(selectedCountry.energy.production.thermal, 2)} TWh`}
                                      colorClass="bg-red-500/20 text-red-400"
                                      tooltipText={tooltips.energyThermal}
                            />
                        </>
                    ) : (
                        <>
                            <StatCard dense
                                      icon={<ThermometerIcon/>}
                                      label={t('dashboard.globalWarming')}
                                      value={`+${globalWarming.toFixed(2)}°C`}
                                      colorClass="bg-orange-500/20 text-orange-400"
                                      tooltipText={tooltips.globalWarming}
                            />
                            <StatCard dense
                                      icon={<NuclearThreatIcon/>}
                                      label={t('dashboard.nuclearThreat')}
                                      value={`${nuclearThreatLevel.toFixed(1)}`}
                                      colorClass="bg-red-500/20 text-red-300"
                                      tooltipText={tooltips.nuclearThreat}
                            />
                            <div
                                className="col-span-2 md:col-span-3 lg:col-span-4 my-2 border-t border-slate-700/50"></div>
                            <StatCard dense
                                      icon={<BiodiversityIcon/>}
                                      label={t('dashboard.biodiversityIndex')}
                                      value={`${biodiversityIndex.toFixed(1)}%`}
                                      colorClass="bg-teal-500/20 text-teal-300"
                                      tooltipText={tooltips.biodiversity}
                            />
                            <StatCard dense
                                      icon={<EnergyIcon/>}
                                      label={t('dashboard.globalConsumption')}
                                      value={`${formatLargeNumber(totalEnergyConsumption, 2)} TWh`}
                                      colorClass="bg-yellow-500/20 text-yellow-300"
                                      tooltipText={tooltips.energyConsumption}
                            />
                            <StatCard dense
                                      icon={<RenewableIcon/>}
                                      label={t('dashboard.globalRenewable')}
                                      value={`${formatLargeNumber(totalRenewableProduction, 2)} TWh`}
                                      colorClass="bg-green-500/20 text-green-400"
                                      tooltipText={tooltips.energyRenewable}
                            />
                            <StatCard dense
                                      icon={<NuclearIcon/>}
                                      label={t('dashboard.globalNuclear')}
                                      value={`${formatLargeNumber(totalNuclearProduction, 2)} TWh`}
                                      colorClass="bg-sky-500/20 text-sky-400"
                                      tooltipText={tooltips.energyNuclear}
                            />
                            <StatCard dense
                                      icon={<ThermalIcon/>}
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