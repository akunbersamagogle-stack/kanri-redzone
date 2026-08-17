import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="site-header">
      {/* Brand Identity */}
      <div className="header-brand">
        <div className="brand-badge">
          <span className="brand-dot" />
          <span className="brand-badge-text">RED ZONE</span>
        </div>
        <div className="brand-title-wrap">
          <h1 className="brand-title">MAINT. BODY 2 RED ZONE</h1>
          <span className="brand-subtitle">PERSONNEL SHOWROOM &amp; TECHNICAL REPOSITORY</span>
        </div>
      </div>

      {/* Telemetry & System Status */}
      <div className="header-telemetry">
        <div className="telemetry-item">
          <span className="telemetry-label">FACILITY</span>
          <span className="telemetry-val">BODY #2 // PLANT 1</span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">SYSTEM STATUS</span>
          <div className="telemetry-val telemetry-live">
            <span className="telemetry-pulse" />
            <span>OPERATIONAL</span>
          </div>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">PROTOCOL</span>
          <span className="telemetry-val">ZERO INCIDENT</span>
        </div>
      </div>
    </header>
  );
};
