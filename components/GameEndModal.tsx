
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface GameEndModalProps {
  won: boolean;
  onRestart: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({ won, onRestart }) => {
  const { t } = useLocalization();
  const title = won ? t('gameEnd.victoryTitle') : t('gameEnd.gameOverTitle');
  const message = won ? t('gameEnd.victoryMessage') : t('gameEnd.gameOverMessage');
  const buttonText = won ? t('gameEnd.playAgainButton') : t('gameEnd.tryAgainButton');
  
  const titleColor = won ? "text-green-400" : "text-red-500";
  const buttonColor = won ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 shadow-2xl text-center max-w-sm mx-auto ring-1 ring-slate-600">
        <h2 className={`text-4xl font-bold mb-4 ${titleColor}`}>{title}</h2>
        <p className="text-slate-300 mb-8">{message}</p>
        <button
          onClick={onRestart}
          className={`px-6 py-3 text-white font-bold rounded-lg transition-colors ${buttonColor}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default GameEndModal;
