

import React from 'react';
import type { SaveSlotInfo, Language } from '../types';
import { PlusCircleIcon, FolderOpenIcon, SaveIcon, XCircleIcon } from './icons/StatIcons';
import { useLocalization } from '../hooks/useLocalization';

interface GameMenuModalProps {
  onClose: () => void;
  onNewGame: () => void;
  onSaveGame: (slotId: number) => void;
  onLoadGame: (slotId: number) => void;
  saveSlots: SaveSlotInfo[];
  gameInProgress: boolean;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  hasPaidToRemoveAds: boolean;
  onRemoveAds: () => void;
}

const GameMenuModal: React.FC<GameMenuModalProps> = ({ onClose, onNewGame, onSaveGame, onLoadGame, saveSlots, gameInProgress, currentLanguage, onLanguageChange, hasPaidToRemoveAds, onRemoveAds }) => {
  const { t, language } = useLocalization();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-slate-800 rounded-lg max-w-md w-full mx-4 shadow-2xl ring-1 ring-slate-600 animate-fade-in-up relative p-6">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors" aria-label={t('menu.closeAria')}>
          <XCircleIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-green-400">{t('menu.title')}</h2>

        <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">{t('menu.newGame')}</h3>
            <div className="space-y-3">
                 <button onClick={onNewGame} className="w-full flex items-center space-x-3 text-left p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                    <PlusCircleIcon className="w-5 h-5 text-green-400" />
                    <div>
                        <p className="font-bold">{t('menu.newGameButton')}</p>
                        <p className="text-xs text-slate-400">{t('menu.newGameDescription')}</p>
                    </div>
                </button>
            </div>
        </div>

        {!hasPaidToRemoveAds && (
           <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">{t('menu.premium')}</h3>
              <button onClick={onRemoveAds} className="w-full text-left p-3 bg-yellow-600/20 rounded-lg hover:bg-yellow-500/20 transition-colors ring-1 ring-yellow-500/50">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-yellow-300">{t('menu.removeAds')}</p>
                  <span className="text-sm font-semibold text-white bg-yellow-600/50 px-2 py-1 rounded">{t('menu.removeAdsPrice')}</span>
                </div>
              </button>
            </div>
        )}
        
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">{t('menu.language')}</h3>
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => onLanguageChange('en')}
                    className={`p-2 rounded-md font-semibold transition-colors text-sm ${currentLanguage === 'en' ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                    English
                </button>
                <button 
                    onClick={() => onLanguageChange('fr')}
                    className={`p-2 rounded-md font-semibold transition-colors text-sm ${currentLanguage === 'fr' ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                    Français
                </button>
                <button 
                    onClick={() => onLanguageChange('es')}
                    className={`p-2 rounded-md font-semibold transition-colors text-sm ${currentLanguage === 'es' ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                    Español
                </button>
                <button 
                    onClick={() => onLanguageChange('de')}
                    className={`p-2 rounded-md font-semibold transition-colors text-sm ${currentLanguage === 'de' ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                    Deutsch
                </button>
            </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">{t('menu.saveSlots')}</h3>
          <div className="space-y-2">
            {saveSlots.map(slot => (
              <div key={slot.slotId} className="bg-slate-900/50 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{t('menu.slot')} {slot.slotId}</p>
                  {slot.exists ? (
                    <p className="text-xs text-slate-400">
                      {new Date(slot.date!).toLocaleDateString(language, { year: 'numeric', month: 'short' })} - {t('menu.pollution')}: {slot.totalPollution?.toFixed(1)}%
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 italic">{t('menu.empty')}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onSaveGame(slot.slotId)}
                    disabled={!gameInProgress}
                    className="p-2 bg-blue-600/50 hover:bg-blue-500/50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`${t('menu.saveAria')} ${slot.slotId}`}
                  >
                    <SaveIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onLoadGame(slot.slotId)}
                    disabled={!slot.exists}
                    className="p-2 bg-green-600/50 hover:bg-green-500/50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`${t('menu.loadAria')} ${slot.slotId}`}
                  >
                    <FolderOpenIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameMenuModal;