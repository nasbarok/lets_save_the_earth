import React from 'react';
import type {ActiveGameEvent, EventChoice} from '../types';
import {ImageIcon, EcoPointsIcon} from './icons/StatIcons';
import {EVENT_TIMER_SECONDS} from '../constants/events';
import {useLocalization} from '../hooks/useLocalization';

interface EventModalProps {
    event: ActiveGameEvent;
    timer: number | null;
    ecoPoints: number;
    onChoice: (choice: EventChoice) => void;
    onAcknowledge: () => void;
}

const EventModal: React.FC<EventModalProps> = ({event, timer, ecoPoints, onChoice, onAcknowledge}) => {
    const {t} = useLocalization();
    const timerPercentage = timer !== null ? (timer / EVENT_TIMER_SECONDS) * 100 : 0;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-start justify-center z-50 p-2 pt-4">
            <div
                className="bg-slate-800 rounded-lg w-full max-w-sm mx-auto shadow-2xl ring-1 ring-slate-600 animate-fade-in-up relative max-h-[calc(100vh-2rem)] overflow-y-auto">
                <div
                    className="aspect-[16/9] w-full bg-slate-700/50 rounded-t-lg flex items-center justify-center relative">
                    {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title}
                             className="w-full h-full object-cover rounded-t-lg"/>
                    ) : (
                        <div className="text-slate-500 flex flex-col items-center justify-center h-full p-4">
                            <ImageIcon className="w-16 h-16 text-slate-600 mb-2"/>
                            <p className="text-sm text-center">{t('eventModal.imageError')}</p>
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-700 rounded-bl-lg">
                        <div
                            className="h-full bg-yellow-400 transition-all duration-1000 linear"
                            style={{width: `${timerPercentage}%`}}
                        ></div>
                    </div>
                </div>
                <div className="p-3">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-3 text-green-400">{event.title}</h2>
                    <p className="text-base sm:text-lg text-slate-200 mb-6 leading-relaxed">{event.description}</p>

                    {event.choices && event.choices.length > 0 ? (
                        <>
                            <h3 className="text-lg font-semibold text-slate-300 mb-3">{t('eventModal.yourChoices')}</h3>
                            <div className="space-y-3">
                                {event.choices.map((choice, index) => {
                                    const canAfford = ecoPoints >= choice.cost;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => onChoice(choice)}
                                            disabled={!canAfford}
                                            className="w-full text-left p-4 sm:p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[60px] sm:min-h-auto"
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-white">{choice.text}</p>
                                                <div className="flex items-center space-x-1 text-green-400">
                                                    <span className="font-bold">{choice.cost}</span>
                                                    <EcoPointsIcon/>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={onAcknowledge}
                            className="w-full px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-lg transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500"
                        >
                            {t('eventModal.okButton')}
                        </button>
                    )}
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

export default EventModal;
