import React from 'react';

interface ContinentProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const Europe: React.FC<ContinentProps> = ({ color, isSelected, onClick }) => (
  <path
    d="M455.3 120.7c-2.3 0.2-4.6 0.7-6.8 1.5-4.5 1.6-8.6 4.1-12.2 7.3-3.1 2.8-5.6 6.2-7.4 9.9-2 4-3.1 8.3-3.4 12.7-0.3 4.3 0.3 8.6 1.7 12.7 1.2 3.4 3.1 6.6 5.5 9.4 1.9 2.2 4.1 4.1 6.6 5.6 3.1 1.9 6.4 3.2 9.9 3.9 4.8 1 9.7 1.1 14.5 0.4 5.1-0.8 10-2.6 14.4-5.2 4.2-2.5 7.9-5.9 10.8-9.9 2.3-3.2 3.8-6.8 4.6-10.6 0.8-4.1 0.8-8.4-0.1-12.5-0.7-3.3-2.1-6.5-4.1-9.3-2.1-3-4.8-5.6-7.9-7.5-3.3-2-6.9-3.3-10.6-3.8-3.7-0.5-7.4-0.2-11.1 0.5-2.2 0.4-4.4 1-6.5 1.8z"
    fill={color}
    stroke={isSelected ? '#34d399' : '#1e293b'}
    strokeWidth={isSelected ? 4 : 2}
    onClick={onClick}
    className="cursor-pointer transition-all duration-300 hover:opacity-80"
    style={{ vectorEffect: 'non-scaling-stroke' }}
    aria-label="Europe"
  />
);

export default Europe;