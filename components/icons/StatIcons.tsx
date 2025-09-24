

import React from 'react';

// Common props for all icons to ensure consistency
const iconProps: React.SVGProps<SVGSVGElement> = {
  className: "w-6 h-6",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: "1.5",
  stroke: "currentColor",
};

// Eco Points: A leaf inside a circle, symbolizing nature's value
export const EcoPointsIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.472 9.472a4.5 4.5 0 0 1-6.364 6.364" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.528 9.472a4.5 4.5 0 0 1 6.364 0" />
  </svg>
);

// Public Support: A group of people, representing community
export const SupportIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.289 2.72a3 3 0 0 1-4.682-2.72 9.094 9.094 0 0 1 3.741-.479m-4.5 3.466a9.094 9.094 0 0 1-3.741.479m11.25 0a9.094 9.094 0 0 0 3.741.479m-11.25 0a3 3 0 0 1 4.682 2.72" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  </svg>
);

// CO2 Emissions: A cloud, representing atmosphere
export const CO2Icon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-5.056-2.257 4.5 4.5 0 0 0-8.522 2.257" />
  </svg>
);

// Plastic Waste: A simplified bottle shape
export const PlasticIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21V10.5m0 0h9V21m-9-10.5h.008v.008H7.5V10.5Zm.75-5.25h7.5V3h-7.5v2.25Z" />
  </svg>
);

// Deforestation: A tree, representing forests
export const ForestIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25v-3.75" />
  </svg>
);

// Calendar
export const CalendarIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
  </svg>
);

// Pause
export const PauseIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />
  </svg>
);

// Play
export const PlayIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z" />
  </svg>
);

// Menu (Cog)
export const MenuIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.008 1.11-1.212l2.39-.816a.75.75 0 0 1 .917.11l1.52 1.52a.75.75 0 0 1 .11.917l-.816 2.39a1.5 1.5 0 0 1-1.212 1.11l-2.39.816a.75.75 0 0 1-.917-.11l-1.52-1.52a.75.75 0 0 1-.11-.917l.816-2.39Zm5.404 14.12c.09-.542.56-1.008 1.11-1.212l2.39-.816a.75.75 0 0 1 .917.11l1.52 1.52a.75.75 0 0 1 .11.917l-.816 2.39a1.5 1.5 0 0 1-1.212 1.11l-2.39.816a.75.75 0 0 1-.917-.11l-1.52-1.52a.75.75 0 0 1-.11-.917l.816-2.39Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.94 10.343c-.542-.09-1.008-.56-1.212-1.11L1.912 6.84a.75.75 0 0 1 .11-.917l1.52-1.52a.75.75 0 0 1 .917-.11l2.39.816c.542.09 1.008.56 1.212 1.11l.816 2.39a.75.75 0 0 1-.11.917l-1.52 1.52a.75.75 0 0 1-.917.11l-2.39-.816Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  </svg>
);

// Save
export const SaveIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

// Folder Open (Load)
export const FolderOpenIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

// Plus Circle (New Game)
export const PlusCircleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

// X Circle (Close)
export const XCircleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

// Image Icon (for placeholders)
export const ImageIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

// Health Icon
export const HealthIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

// GDP Icon
export const GDPIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.786 11 12 11h-1.25m-2.5 0h-1.25M12 6V5.25a.75.75 0 0 0-.75-.75H10.5a.75.75 0 0 0-.75.75v.75m3.75 0V5.25a.75.75 0 0 0-.75-.75H13.5a.75.75 0 0 0-.75.75v.75m-3.75 0V5.25a.75.75 0 0 0-.75-.75H7.5a.75.75 0 0 0-.75.75v.75M12 6h-1.25m-2.5 0H7.5" />
  </svg>
);

// Clock Icon
export const ClockIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

// Info Icon
export const InfoIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || "w-4 h-4"} strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

// Population Icon
export const PopulationIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// Energy Consumption Icon
export const EnergyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

// Renewable Energy Icon (Wind Turbine)
export const RenewableIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V3m0 9.75l-3.375-1.937M12 12.75l3.375-1.937m-3.375 1.937L6.75 21m5.25-8.25L17.25 21" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
    </svg>
);

// Nuclear Energy Icon
export const NuclearIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-3.142 0-6.044-1.6-7.5-4.018M19.5 8.732c-1.456 2.418-4.358 4.018-7.5 4.018m-7.5 0a7.458 7.458 0 00-2.018 5.018 7.458 7.458 0 002.018 5.018m11.036-10.036a7.458 7.458 0 012.018 5.018 7.458 7.458 0 01-2.018 5.018" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
    </svg>
);

// Thermal Energy Icon (Factory)
export const ThermalIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);

// Thermometer Icon
export const ThermometerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 0 0 -4 0v8.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9h4" />
    </svg>
);

// Instability / Conflict Icon (Explosion/Fire)
export const InstabilityIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

// Biodiversity Icon (Paw print)
export const BiodiversityIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 1.063a1.125 1.125 0 01-1.026.625H17.25a1.125 1.125 0 01-1.026-.625L15.5 7.5m-3.5 12.5l.625-1.063a1.125 1.125 0 00-1.026-.625H8.25a1.125 1.125 0 00-1.026.625L6.5 20m7.5-12.5l-1.063.625a1.125 1.125 0 01-1.25 0L11.5 7.5m-1-5.5l.625 1.063a1.125 1.125 0 01-.5 1.563l-3.438 2.063a1.125 1.125 0 01-1.5-.5L3 7.5m1.5 12.5l1.063-.625a1.125 1.125 0 000-1.25L4.5 17.5" />
    </svg>
);

// Nuclear Threat Icon (Radioactivity symbol)
// FIX: Renamed from NuclearIcon to NuclearThreatIcon to avoid redeclaration error.
export const NuclearThreatIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-3.142 0-6.044-1.6-7.5-4.018M19.5 8.732c-1.456 2.418-4.358 4.018-7.5 4.018m-7.5 0a7.458 7.458 0 00-2.018 5.018 7.458 7.458 0 002.018 5.018m11.036-10.036a7.458 7.458 0 012.018 5.018 7.458 7.458 0 01-2.018 5.018" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
    </svg>
);


// --- Tech Tree Icons ---

// CO2 Tech Icon (Atom/Molecule + Gear)
export const CO2TechIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 12.75c-1.34 0-2.438-.94-2.75-2.188a2.62 2.62 0 010-2.124c.313-1.248 1.41-2.188 2.75-2.188 1.34 0 2.438.94 2.75 2.188a2.62 2.62 0 010 2.124c-.313 1.248-1.41 2.188-2.75 2.188m-5.625 1.875a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75m11.25 0a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12.75l-3.375 1.875M13.75 12.75l3.375 1.875" />
  </svg>
);

// Deforestation Tech Icon (Leaf + Plus sign)
export const DeforestationTechIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.828 15.828a3.75 3.75 0 01-5.304-5.304 3.75 3.75 0 015.304 5.304zM12 12v3.75m0-11.25v3.75m3.75 0H12m-3.75 0H12m9 3.75a3.75 3.75 0 11-5.303-5.303A3.75 3.75 0 0121 12z" />
  </svg>
);

// Waste/Plastic Tech Icon (Recycle symbol)
export const WasteTechIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0 0v4.992m0 0h-4.992m-4.993 0l-3.181-3.182a8.25 8.25 0 0111.667 0l-3.182 3.182" />
  </svg>
);

// Chevron Down
export const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

// Chevron Right
export const ChevronRightIcon: React.FC<{className?: string}> = ({className}) => (
  <svg {...iconProps} className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);