import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from './icons/StatIcons';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-slate-800/50 rounded-lg ring-1 ring-slate-700">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-3 bg-slate-800 rounded-t-lg hover:bg-slate-700 transition-colors focus:outline-none"
      >
        <h3 className="font-bold text-md text-green-400">{title}</h3>
        {isOpen ? <ChevronDownIcon className="w-5 h-5 text-slate-400" /> : <ChevronRightIcon className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-slate-700">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;