
import React, { useState } from 'react';
import type { Action, Country, ActiveAction, Tech } from '../types';
import { EcoPointsIcon } from './icons/StatIcons';
import TechPanel from './TechPanel';
import { useLocalization } from '../hooks/useLocalization';

interface ActionsPanelProps {
  ecoPoints: number;
  actions: Action[];
  onAction: (action: Action, countryId: string) => void;
  onTechUpgrade: (techId: keyof Tech, countryId: string) => void;
  disabled: boolean;
  selectedCountry: Country | null;
  activeActions: ActiveAction[];
  currentDate: Date;
}

type PanelView = 'actions' | 'tech';

const ActionsPanel: React.FC<ActionsPanelProps> = ({ ecoPoints, actions, onAction, onTechUpgrade, disabled, selectedCountry, activeActions, currentDate }) => {
  const [view, setView] = useState<PanelView>('actions');
  const { t, language } = useLocalization();

  const ViewButton: React.FC<{ current: PanelView, target: PanelView, onClick: () => void, children: React.ReactNode }> = ({ current, target, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-bold rounded-md transition-colors w-full ${
        current === target
          ? 'bg-green-500 text-white'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {children}
    </button>
  );
  
  const availableActions = actions.filter(action => {
    if (!selectedCountry) return false;

    if (action.continents && !action.continents.includes(selectedCountry.id)) {
        return false;
    }

    if (action.unlockThreshold) {
        const { tech, level } = action.unlockThreshold;
        if (selectedCountry.tech[tech] < level) {
            return false;
        }
    }

    return true;
  });


  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg shadow-lg ring-1 ring-slate-700 lg:h-full flex flex-col">
      <div className="grid grid-cols-2 gap-2 mb-4">
        <ViewButton current={view} target="actions" onClick={() => setView('actions')}>{t('actionsPanel.actions')}</ViewButton>
        <ViewButton current={view} target="tech" onClick={() => setView('tech')}>{t('actionsPanel.technologies')}</ViewButton>
      </div>
      
      {view === 'actions' && (
        <>
          <div>
            <h2 className="text-lg font-bold text-green-400 mb-2">
                {selectedCountry ? t('actionsPanel.actionsIn', { regionName: t(selectedCountry.name) }) : t('actionsPanel.selectRegion')}
            </h2>
            {!selectedCountry && (
              <p className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded-md mb-4">{t('actionsPanel.selectRegionHint')}</p>
            )}
          </div>
          <div className="space-y-3 lg:overflow-y-auto pr-2 flex-grow">
            {availableActions.map(action => {
              const canAfford = ecoPoints >= action.cost;
              return (
                <button
                  key={action.id}
                  onClick={() => selectedCountry && onAction(action, selectedCountry.id)}
                  disabled={!canAfford || disabled || !selectedCountry}
                  className="w-full text-left p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-white">{t(action.name)}</p>
                    <div className="flex items-center space-x-1 text-green-400">
                      <span className="font-semibold">{action.cost}</span>
                      <EcoPointsIcon />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{t(action.description)}</p>
                </button>
              );
            })}
          </div>
          {selectedCountry && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <h3 className="text-md font-bold text-green-400 mb-2">
                {t('actionsPanel.activeProjects', { regionName: t(selectedCountry.name) })}
              </h3>
              <div className="space-y-2 text-sm lg:max-h-[15vh] overflow-y-auto pr-2">
                {activeActions.length > 0 ? (
                  activeActions.map(proj => (
                    <div key={proj.id} className="bg-slate-800 p-2 rounded-md">
                      <p className="font-semibold text-slate-300">{t(proj.name)}</p>
                      <p className="text-xs text-slate-400">
                        {t('actionsPanel.completeBy')}: {new Date(proj.completionDate).toLocaleDateString(language, { year: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs italic">{t('actionsPanel.noActiveProjects')}</p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {view === 'tech' && (
        <TechPanel
            selectedCountry={selectedCountry}
            ecoPoints={ecoPoints}
            onUpgrade={onTechUpgrade}
            disabled={disabled}
        />
      )}

    </div>
  );
};

export default ActionsPanel;