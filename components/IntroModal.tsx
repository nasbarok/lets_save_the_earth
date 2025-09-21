
import React from 'react';
import type { GeminiIntroNarration } from '../types';
import { IMAGES } from '../assets/images';
import { useLocalization } from '../hooks/useLocalization';

interface IntroModalProps {
  narration: GeminiIntroNarration;
  onClose: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ narration, onClose }) => {
  const { t } = useLocalization();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-slate-800 rounded-lg max-w-lg w-full mx-4 shadow-2xl ring-1 ring-slate-600 animate-fade-in-up relative">
        <div className="aspect-video w-full bg-slate-700/50 rounded-t-lg flex items-center justify-center relative">
            <img src={IMAGES.POLITICAL} alt="World Situation Briefing" className="w-full h-full object-cover rounded-t-lg"/>
        </div>
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-3 text-green-400">{t('introModal.title')}</h2>
            <p className="text-slate-300 mb-6">{narration.description}</p>
            
            <div className="bg-slate-900/50 p-4 rounded-md mb-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">{t('introModal.objectiveTitle')}</h3>
                <p className="text-slate-400 text-sm">{t('introModal.objectiveText')}</p>
            </div>
            
            <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500"
            >
                {t('introModal.startButton')}
            </button>
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

export default IntroModal;