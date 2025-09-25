import React from 'react';
import type {GameState} from '../types';
import {
    EcoPointsIcon,
    SupportIcon,
    CalendarIcon,
    MenuIcon,
    PlayIcon,
    PauseIcon,
    ClockIcon,
    InstabilityIcon
} from './icons/StatIcons';
import {useLocalization} from '../hooks/useLocalization';
import {Tooltip, StatCard} from './utils';

interface MainControlsProps {
    gameState: GameState;
    onMenuToggle: () => void;
    isPaused: boolean;
    onPauseToggle: () => void;
    onSpeedChange: (speed: 1 | 2 | 3) => void;
}

const MainControls: React.FC<MainControlsProps> = ({
                                                       gameState,
                                                       onMenuToggle,
                                                       isPaused,
                                                       onPauseToggle,
                                                       onSpeedChange
                                                   }) => {
    const {t, language} = useLocalization();
    const {date, ecoPoints, publicSupport, gameSpeed, playtimeSeconds, activeConflicts} = gameState;

    const formatPlaytime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.round(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    const tooltips = {
        publicSupport: t('tooltips.publicSupport'),
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg shadow-lg ring-1 ring-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div
                    className="col-span-2 md:col-span-4 lg:col-span-2 bg-slate-800 p-3 rounded-lg flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-slate-700 text-slate-300"><CalendarIcon/></div>
                        <div>
                            <p className="text-sm text-slate-400">{t('dashboard.date')}</p>
                            <p className="text-lg font-bold text-white">{new Date(date).toLocaleDateString(language, {
                                year: 'numeric',
                                month: 'long'
                            })}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {activeConflicts.length > 0 && (
                            <Tooltip text={activeConflicts.map(c => c.name).join(', ')}>
                                <div className="flex items-center space-x-1 text-red-400 animate-pulse">
                                    <InstabilityIcon className="w-5 h-5"/>
                                    <span className="font-bold text-lg">{activeConflicts.length}</span>
                                </div>
                            </Tooltip>
                        )}
                        <button onClick={onPauseToggle}
                                className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors text-white"
                                aria-label={isPaused ? t('dashboard.playAria') : t('dashboard.pauseAria')}>
                            {isPaused ? <PlayIcon/> : <PauseIcon/>}
                        </button>
                        <div className="flex items-center bg-slate-700 rounded-full p-1">
                            {[1, 2, 3].map(speed => (
                                <button key={speed} onClick={() => onSpeedChange(speed as 1 | 2 | 3)}
                                        className={`px-2 py-0.5 text-sm rounded-full transition-colors ${gameSpeed === speed ? 'bg-green-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-600'}`}>
                                    {speed}x
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-span-2 md:col-span-4 lg:col-span-4 grid grid-cols-2 gap-2">
                    <StatCard
                        dense
                        icon={<EcoPointsIcon/>}
                        label={t('dashboard.ecoPoints')}
                        value={ecoPoints.toLocaleString(language)}
                        colorClass="bg-green-500/20 text-green-400"
                    />
                    <StatCard
                        dense
                        icon={<SupportIcon/>}
                        label={t('dashboard.publicSupport')}
                        value={`${publicSupport.toFixed(1)}%`}
                        colorClass="bg-sky-500/20 text-sky-400"
                        tooltipText={tooltips.publicSupport}
                    />
                    <StatCard
                        dense
                        icon={<ClockIcon/>}
                        label={t('dashboard.playtime')}
                        value={formatPlaytime(playtimeSeconds)}
                        colorClass="bg-indigo-500/20 text-indigo-400"
                    />
                </div>

                <button onClick={onMenuToggle}
                        className="bg-slate-800 p-3 rounded-lg flex items-center justify-center space-x-3 shadow-md hover:bg-slate-700 transition-colors">
                    <div className="p-2 rounded-full bg-slate-700 text-slate-300"><MenuIcon/></div>
                    <span className="font-bold text-white">{t('dashboard.menu')}</span>
                </button>
            </div>
        </div>
    );
};

export default MainControls;