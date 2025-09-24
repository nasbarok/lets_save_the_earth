import React from 'react';
import { InfoIcon } from './icons/StatIcons';

export const formatLargeNumber = (num: number, digits = 1) => {
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

export const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-white bg-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        {text}
      </div>
    </div>
  );
};

export const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; colorClass: string, tooltipText?: string }> = ({ icon, label, value, colorClass, tooltipText }) => (
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