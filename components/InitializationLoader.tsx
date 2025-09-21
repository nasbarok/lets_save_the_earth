
import React from 'react';

interface InitializationLoaderProps {
  progress: number;
  message: string;
}

const InitializationLoader: React.FC<InitializationLoaderProps> = ({ progress, message }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-95 flex flex-col items-center justify-center z-50 animate-fade-in">
      <div className="text-center max-w-md w-full px-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-400 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-green-400 mb-2">Initializing Live Simulation</h2>
        <p className="text-slate-400 transition-opacity duration-500 h-5">
          {message}
        </p>
        
        <div className="w-full bg-slate-700 rounded-full h-2.5 mt-6 shadow-inner">
          <div 
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-linear" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm font-mono text-green-400 mt-2">{progress}%</p>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InitializationLoader;
