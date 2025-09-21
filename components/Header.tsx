
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const Header: React.FC = () => {
  const { t } = useLocalization();
  return (
    <header className="text-center p-4 bg-slate-900/50 rounded-lg ring-1 ring-slate-700">
      <h1 className="text-3xl sm:text-4xl font-bold text-green-400 tracking-wider">
        {t('header.title')}
      </h1>
      <p className="text-slate-400 mt-2">{t('header.subtitle')}</p>
    </header>
  );
};

export default Header;
