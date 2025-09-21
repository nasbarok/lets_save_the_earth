
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface EventLogProps {
  events: string[];
}

const EventLog: React.FC<EventLogProps> = ({ events }) => {
  const { t } = useLocalization();
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg shadow-lg ring-1 ring-slate-700">
      <h2 className="text-lg font-bold text-green-400 mb-4">{t('eventLog.title')}</h2>
      <ul className="space-y-2 text-sm lg:h-48 overflow-y-auto flex flex-col-reverse">
        {events.map((event, index) => (
          <li
            key={index}
            className={`p-2 rounded-md bg-slate-800 ${index === 0 ? 'text-white animate-fade-in' : 'text-slate-400'}`}
          >
            {event}
          </li>
        ))}
      </ul>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EventLog;