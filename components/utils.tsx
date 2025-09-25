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

const TooltipComponent: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-white bg-slate-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        {text}
      </div>
    </div>
  );
};
export { TooltipComponent as Tooltip };


export const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    colorClass: string;
    tooltipText?: string;
    dense?: boolean; // <-- NOUVEAU
}> = ({ icon, label, value, colorClass, tooltipText, dense }) => (
    <div
        className={
            // conteneur plus serré en mode dense
            `bg-slate-800 rounded-lg flex items-center shadow-sm ` +
            (dense ? `h-10 px-2` : `p-2`)
        }
    >
        <div className={`mr-2 rounded-full ${colorClass} ${dense ? 'p-1' : 'p-1.5'}`}>
            {React.cloneElement(icon as React.ReactElement, {
                className: dense ? 'w-4 h-4' : 'w-5 h-5', // icône 16px en dense
            })}
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
                <p className={`${dense ? 'text-[11px]' : 'text-xs'} text-slate-400 truncate`}>
                    {label}
                </p>
                {tooltipText && (
                    <TooltipComponent text={tooltipText}>
                        <InfoIcon className="w-3 h-3 text-slate-500 hover:text-slate-300 transition-colors" />
                    </TooltipComponent>
                )}
            </div>

            <p className={`${dense ? 'text-sm tabular-nums' : 'text-md'} font-bold text-white truncate`}>
                {value}
            </p>
        </div>
    </div>
);
