import React, { useState } from 'react';

// Zone definitions: id, label, SVG path/rect
const ZONES = [
  // Front
  { id: 'bonnet', label: 'Bonnet', type: 'rect', x: 215, y: 40, w: 170, h: 60 },
  { id: 'front_screen', label: 'Front Screen', type: 'rect', x: 200, y: 105, w: 200, h: 55 },
  { id: 'front_bumper', label: 'Front Bumper', type: 'rect', x: 220, y: 10, w: 160, h: 28 },
  // Doors
  { id: 'front_right_door', label: 'Front Right Door', type: 'rect', x: 360, y: 165, w: 80, h: 100 },
  { id: 'rear_right_door', label: 'Rear Right Door', type: 'rect', x: 360, y: 270, w: 80, h: 90 },
  { id: 'front_left_door', label: 'Front Left Door', type: 'rect', x: 160, y: 165, w: 80, h: 100 },
  { id: 'rear_left_door', label: 'Rear Left Door', type: 'rect', x: 160, y: 270, w: 80, h: 90 },
  // Fenders
  { id: 'front_right_fender', label: 'Front Right Fender', type: 'rect', x: 365, y: 100, w: 65, h: 65 },
  { id: 'front_left_fender', label: 'Front Left Fender', type: 'rect', x: 170, y: 100, w: 65, h: 65 },
  { id: 'rear_right_fender', label: 'Rear Right Fender', type: 'rect', x: 365, y: 360, w: 65, h: 65 },
  { id: 'rear_left_fender', label: 'Rear Left Fender', type: 'rect', x: 170, y: 360, w: 65, h: 65 },
  // Roof
  { id: 'roof', label: 'Roof', type: 'rect', x: 215, y: 165, w: 170, h: 195 },
  // Boot
  { id: 'boot_trunk', label: 'Boot / Trunk', type: 'rect', x: 215, y: 365, w: 170, h: 55 },
  { id: 'rear_screen', label: 'Rear Screen', type: 'rect', x: 210, y: 325, w: 180, h: 38 },
  // Pillars
  { id: 'pillars', label: 'Pillars', type: 'rect', x: 245, y: 160, w: 30, h: 205 },
  // Wheels (visual only)
];

const CAR_BODY_PATHS = {
  outline: "M280 5 L380 5 Q415 5 430 30 L445 65 L450 100 L455 170 L460 360 L455 400 Q450 430 420 435 L380 438 L280 440 L220 440 L180 438 Q150 430 145 400 L140 360 L145 170 L150 100 L155 65 L170 30 Q185 5 220 5 Z",
  windshield: "M210 108 L390 108 L385 160 L215 160 Z",
  rearScreen: "M215 325 L385 325 L385 360 L215 360 Z",
  roofPanel: "M218 165 L382 165 L385 325 L215 325 Z",
  bonnet: "M215 45 L385 45 L390 108 L210 108 Z",
  boot: "M215 360 L385 360 L390 420 L210 420 Z",
  wheelFL: "M148 170 Q118 170 118 210 Q118 250 148 250 L165 250 L165 170 Z",
  wheelFR: "M452 170 Q482 170 482 210 Q482 250 452 250 L435 250 L435 170 Z",
  wheelRL: "M148 295 Q118 295 118 335 Q118 375 148 375 L165 375 L165 295 Z",
  wheelRR: "M452 295 Q482 295 482 335 Q482 375 452 375 L435 375 L435 295 Z",
};

export default function CarDiagram({ zones = {}, onZoneClick, readOnly = false }) {
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const getZoneColor = (zoneId) => {
    const status = zones[zoneId];
    if (status === 'ok') return { fill: 'rgba(16,185,129,0.25)', stroke: '#10b981' };
    if (status === 'not_ok') return { fill: 'rgba(239,68,68,0.25)', stroke: '#ef4444' };
    return { fill: 'rgba(232,177,74,0.06)', stroke: 'rgba(232,177,74,0.35)' };
  };

  const handleZoneClick = (zone, e) => {
    if (readOnly) return;
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltip({ zone, x, y });
    if (onZoneClick) onZoneClick(zone);
  };

  const markZone = (zoneId, status) => {
    if (onZoneClick) onZoneClick({ ...ZONES.find(z => z.id === zoneId), newStatus: status });
    setTooltip(null);
  };

  const okCount = Object.values(zones).filter(v => v === 'ok').length;
  const issueCount = Object.values(zones).filter(v => v === 'not_ok').length;

  return (
    <div className="car-diagram-wrap" style={{ position: 'relative' }}>
      <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🚗 Vehicle Body Diagram
        {!readOnly && <span style={{ fontSize: '11px', color: 'var(--text2)', fontWeight: '400' }}>— Click any zone to mark status</span>}
      </div>

      <div style={{ position: 'relative', background: 'var(--bg4)', borderRadius: '10px', padding: '10px', overflow: 'hidden' }}>
        {/* Direction Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text2)', marginBottom: '4px', padding: '0 8px' }}>
          <span>◀ FRONT</span>
          <span>REAR ▶</span>
        </div>

        <svg viewBox="0 0 600 450" className="car-diagram-svg" style={{ maxHeight: '320px' }}>
          <defs>
            <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--bg3)" />
              <stop offset="100%" stopColor="var(--bg4)" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Car body base */}
          <path d={CAR_BODY_PATHS.outline} fill="url(#carBody)" stroke="var(--border2)" strokeWidth="2" filter="url(#shadow)" />

          {/* Wheels */}
          {['wheelFL','wheelFR','wheelRL','wheelRR'].map(k => (
            <path key={k} d={CAR_BODY_PATHS[k]} fill="var(--bg)" stroke="var(--border2)" strokeWidth="1.5" />
          ))}

          {/* Windshields */}
          <path d={CAR_BODY_PATHS.windshield} fill="rgba(59,130,246,0.08)" stroke="var(--border2)" strokeWidth="1" />
          <path d={CAR_BODY_PATHS.rearScreen} fill="rgba(59,130,246,0.08)" stroke="var(--border2)" strokeWidth="1" />

          {/* Roof lines */}
          <path d={CAR_BODY_PATHS.roofPanel} fill="rgba(0,0,0,0.04)" stroke="var(--border)" strokeWidth="1" />

          {/* Bonnet & Boot */}
          <path d={CAR_BODY_PATHS.bonnet} fill="rgba(0,0,0,0.03)" stroke="var(--border)" strokeWidth="1" />
          <path d={CAR_BODY_PATHS.boot} fill="rgba(0,0,0,0.03)" stroke="var(--border)" strokeWidth="1" />

          {/* Door lines */}
          <line x1="240" y1="165" x2="240" y2="360" stroke="var(--border2)" strokeWidth="1" />
          <line x1="360" y1="165" x2="360" y2="360" stroke="var(--border2)" strokeWidth="1" />
          <line x1="165" y1="260" x2="435" y2="260" stroke="var(--border2)" strokeWidth="1" />

          {/* Clickable Zones */}
          {ZONES.map(zone => {
            const { fill, stroke } = getZoneColor(zone.id);
            const isHov = hovered === zone.id;
            return (
              <rect
                key={zone.id}
                x={zone.x} y={zone.y} width={zone.w} height={zone.h}
                rx="4"
                fill={isHov && !readOnly ? 'rgba(232,177,74,0.2)' : fill}
                stroke={isHov && !readOnly ? '#e8b14a' : stroke}
                strokeWidth={isHov ? 2 : 1.5}
                strokeDasharray={zones[zone.id] ? 'none' : '4,3'}
                style={{ cursor: readOnly ? 'default' : 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={() => setHovered(zone.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => handleZoneClick(zone, e)}
              />
            );
          })}

          {/* Zone Labels */}
          {ZONES.slice(0, 12).map(zone => {
            const status = zones[zone.id];
            const cx = zone.x + zone.w / 2;
            const cy = zone.y + zone.h / 2;
            if (zone.w < 50 || zone.h < 30) return null;
            return (
              <g key={`lbl-${zone.id}`}>
                {status && (
                  <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9" fill={status === 'ok' ? '#10b981' : '#ef4444'} fontWeight="700">
                    {status === 'ok' ? '✓' : '✗'}
                  </text>
                )}
                <text x={cx} y={status ? cy + 8 : cy + 3} textAnchor="middle" fontSize="8.5" fill="var(--text2)" fontWeight="500">
                  {zone.label.length > 12 ? zone.label.slice(0, 11) + '…' : zone.label}
                </text>
              </g>
            );
          })}

          {/* Side Labels */}
          <text x="100" y="230" textAnchor="middle" fontSize="11" fill="var(--text2)" fontWeight="600" transform="rotate(-90, 100, 230)">LEFT</text>
          <text x="500" y="230" textAnchor="middle" fontSize="11" fill="var(--text2)" fontWeight="600" transform="rotate(90, 500, 230)">RIGHT</text>
        </svg>

        {/* Tooltip */}
        {tooltip && !readOnly && (
          <div style={{
            position: 'absolute', background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '10px 14px', zIndex: 10,
            left: Math.min(tooltip.x, 300), top: Math.max(tooltip.y - 80, 10),
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)', minWidth: '160px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--accent)' }}>{tooltip.zone.label}</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => markZone(tooltip.zone.id, 'ok')} style={{ flex: 1, padding: '5px 8px', borderRadius: '6px', border: '1px solid #10b981', background: 'rgba(16,185,129,0.15)', color: '#10b981', cursor: 'pointer', fontSize: '11px', fontWeight: '600', fontFamily: 'Outfit,sans-serif' }}>✓ OK</button>
              <button onClick={() => markZone(tooltip.zone.id, 'not_ok')} style={{ flex: 1, padding: '5px 8px', borderRadius: '6px', border: '1px solid #ef4444', background: 'rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: '600', fontFamily: 'Outfit,sans-serif' }}>✗ Issue</button>
              <button onClick={() => { if (onZoneClick) onZoneClick({ ...tooltip.zone, newStatus: 'na' }); setTooltip(null); }} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--text2)', cursor: 'pointer', fontSize: '11px', fontFamily: 'Outfit,sans-serif' }}>—</button>
            </div>
            <button onClick={() => setTooltip(null)} style={{ position: 'absolute', top: '4px', right: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', fontSize: '14px' }}>×</button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="car-zone-legend">
        <div className="legend-item"><div className="legend-dot" style={{ background: '#10b981' }} /> OK / Good</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#ef4444' }} /> Issue Found</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(232,177,74,0.4)', border: '1px dashed #e8b14a', borderRadius: '50%' }} /> Not Checked</div>
        {!readOnly && <div className="legend-item" style={{ marginLeft: 'auto' }}>
          <span style={{ color: '#10b981', fontWeight: '700' }}>✓ {okCount}</span>
          <span style={{ color: 'var(--text2)', margin: '0 4px' }}>|</span>
          <span style={{ color: '#ef4444', fontWeight: '700' }}>✗ {issueCount}</span>
        </div>}
      </div>
    </div>
  );
}
