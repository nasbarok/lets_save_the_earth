import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { MenuIcon } from './icons/StatIcons';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { t } = useLocalization();
  return (
    <header className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg ring-1 ring-slate-700 sticky top-1 z-10 backdrop-blur-sm">
      <h1 className="text-xl font-bold text-green-400 truncate pr-4">
        {t('header.title')}
      </h1>
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label={t('dashboard.menu')}
      >
        <MenuIcon className="w-6 h-6 text-slate-300" />
      </button>
    </header>
  );
};

export default Header;