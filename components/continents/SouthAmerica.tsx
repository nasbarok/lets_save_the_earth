import React from 'react';

interface ContinentProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const SouthAmerica: React.FC<ContinentProps> = ({ color, isSelected, onClick }) => (
  <path
    d="M300.1 278.4c-1.2 3.5-1.9 7.2-2 11-0.2 6.3 0.7 12.6 2.5 18.6 1.7 5.5 4.3 10.8 7.5 15.6 2.3 3.4 4.9 6.6 7.9 9.5 4.9 4.7 10.6 8.5 16.9 11.4 5.2 2.4 10.7 4 16.3 4.8 6.5 0.9 13.1 1 19.6 0.2 6.1-0.7 12.1-2.4 17.7-4.9 4.7-2.1 9-4.9 12.9-8.2 3.6-3 6.7-6.5 9.2-10.2 2.3-3.4 4.1-7.2 5.2-11.2 1.3-4.5 1.8-9.2 1.5-13.8-0.3-4.3-1.4-8.5-3.2-12.4-1.2-2.7-2.7-5.3-4.5-7.7-2.2-3-4.8-5.7-7.8-7.9-2.9-2.1-6-3.8-9.3-5-4.2-1.5-8.5-2.4-12.9-2.6-4.5-0.2-9 0.4-13.4 1.6-4.9 1.4-9.6 3.5-13.8 6.3-4 2.6-7.5 5.8-10.4 9.4-1.8 2.2-3.4 4.6-4.8 7.1-0.9 1.7-1.7 3.4-2.4 5.2z"
    fill={color}
    stroke={isSelected ? '#34d399' : '#1e293b'}
    strokeWidth={isSelected ? 4 : 2}
    onClick={onClick}
    className="cursor-pointer transition-all duration-300 hover:opacity-80"
    style={{ vectorEffect: 'non-scaling-stroke' }}
    aria-label="South America"
  />
);

export default SouthAmerica;