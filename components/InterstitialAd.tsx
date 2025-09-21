
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface InterstitialAdProps {
  onClose: () => void;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose }) => {
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { t } = useLocalization();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanClose(true);
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-slate-800 rounded-lg max-w-md w-full m-4 p-6 text-center shadow-2xl ring-1 ring-slate-600">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">{t('ads.interstitialTitle')}</h2>
        <p className="text-slate-300 mb-6">{t('ads.interstitialBody')}</p>
        <button
          onClick={onClose}
          disabled={!canClose}
          className={`px-6 py-2 rounded-lg font-bold text-white transition-all duration-300 ${
            canClose
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-slate-600 cursor-not-allowed'
          }`}
        >
          {canClose ? t('ads.closeNow') : t('ads.closeIn', { seconds: countdown })}
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InterstitialAd;
