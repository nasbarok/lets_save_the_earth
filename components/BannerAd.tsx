
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const BannerAd: React.FC = () => {
  const { t } = useLocalization();
  return (
    <div className="w-full h-12 bg-gray-200 text-gray-800 flex items-center justify-center text-sm font-semibold z-40 border-y-2 border-gray-300 my-4 rounded-md">
      {t('ads.banner')}
    </div>
  );
};

export default BannerAd;