import React from 'react';

interface StadiumMapProps {
  stadiumState: Record<string, any>;
  onZoneClick: (zoneId: string) => void;
}

const StadiumMap: React.FC<StadiumMapProps> = ({ stadiumState, onZoneClick }) => {
  // Helper to get fill class based on status
  const getFillClass = (zoneId: string) => {
    const status = stadiumState[zoneId]?.status || 'clear';
    return `fill-${status}`;
  };

  return (
    <svg viewBox="0 0 800 600" className="stadium-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Stadium Outer Ring */}
      <ellipse cx="400" cy="300" rx="380" ry="280" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
      {/* Field */}
      <rect x="250" y="200" width="300" height="200" rx="20" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
      
      {/* Section 100 - Top */}
      <path 
        className={`zone-path ${getFillClass('section100')}`}
        d="M 250 180 Q 400 80 550 180 L 650 100 Q 400 -20 150 100 Z"
        onClick={() => onZoneClick('section100')}
      />
      <text x="400" y="120" fill="white" textAnchor="middle" fontSize="20" fontWeight="bold" pointerEvents="none">Section 100</text>

      {/* Section 200 - Bottom */}
      <path 
        className={`zone-path ${getFillClass('section200')}`}
        d="M 250 420 Q 400 520 550 420 L 650 500 Q 400 620 150 500 Z"
        onClick={() => onZoneClick('section200')}
      />
      <text x="400" y="500" fill="white" textAnchor="middle" fontSize="20" fontWeight="bold" pointerEvents="none">Section 200</text>

      {/* Concourse North - Left */}
      <path 
        className={`zone-path ${getFillClass('concourseNorth')}`}
        d="M 230 200 Q 130 300 230 400 L 130 480 Q -10 300 130 120 Z"
        onClick={() => onZoneClick('concourseNorth')}
      />
      <text x="120" y="300" fill="white" textAnchor="middle" fontSize="16" fontWeight="bold" transform="rotate(-90 120,300)" pointerEvents="none">Concourse North</text>

      {/* Concourse South - Right */}
      <path 
        className={`zone-path ${getFillClass('concourseSouth')}`}
        d="M 570 200 Q 670 300 570 400 L 670 480 Q 810 300 670 120 Z"
        onClick={() => onZoneClick('concourseSouth')}
      />
      <text x="680" y="300" fill="white" textAnchor="middle" fontSize="16" fontWeight="bold" transform="rotate(90 680,300)" pointerEvents="none">Concourse South</text>

      {/* Gate A - Top Left */}
      <circle 
        cx="150" cy="100" r="40" 
        className={`zone-path ${getFillClass('gateA')}`}
        onClick={() => onZoneClick('gateA')}
      />
      <text x="150" y="105" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold" pointerEvents="none">Gate A</text>

      {/* Gate B - Bottom Right */}
      <circle 
        cx="650" cy="500" r="40" 
        className={`zone-path ${getFillClass('gateB')}`}
        onClick={() => onZoneClick('gateB')}
      />
      <text x="650" y="505" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold" pointerEvents="none">Gate B</text>

    </svg>
  );
};

export default StadiumMap;
