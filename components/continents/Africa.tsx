import React from 'react';

interface ContinentProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const Africa: React.FC<ContinentProps> = ({ color, isSelected, onClick }) => (
  <path
    d="M486.2 195.9c-2.3 2.8-4.2 5.9-5.6 9.2-1.9 4.4-2.9 9-3.2 13.7-0.3 5.4 0.4 10.8 1.9 16 1.2 4.1 3 8 5.4 11.7 3 4.6 6.8 8.8 11.2 12.3 4.7 3.7 10 6.6 15.6 8.6 5.8 2.1 11.8 3.2 17.9 3.4 6.2 0.2 12.4-0.6 18.3-2.4 5.6-1.7 10.9-4.3 15.5-7.8 4.2-3.1 7.7-6.9 10.4-11.2 2.5-4 4-8.5 4.6-13.1 0.6-5-0.2-10.1-2-14.8-1.5-3.7-3.7-7.2-6.5-10.2-3-3.2-6.6-5.9-10.6-7.8-4.5-2.2-9.3-3.6-14.2-4-4.8-0.4-9.7 0.2-14.3 1.6-5 1.6-9.7 4-13.8 7.1-3.6 2.8-6.7 6.1-9.1 9.8-1.7 2.6-3.1 5.3-4.2 8.2z"
    fill={color}
    stroke={isSelected ? '#34d399' : '#1e293b'}
    strokeWidth={isSelected ? 4 : 2}
    onClick={onClick}
    className="cursor-pointer transition-all duration-300 hover:opacity-80"
    style={{ vectorEffect: 'non-scaling-stroke' }}
    aria-label="Africa"
  />
);

export default Africa;