import React, { useState } from 'react';

export const ShowroomBackground: React.FC = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="showroom-backdrop" aria-hidden="true">
      {/* Dynamic Background Video Layer (Optional / Auto-activated when background.mp4 is provided) */}
      <video
        className={`showroom-video-bg ${videoLoaded ? 'loaded' : ''}`}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
      >
        <source src="/assets/videos/background.mp4" type="video/mp4" />
        <source src="/assets/videos/background.webm" type="video/webm" />
      </video>

      {/* Video Frosted/Tint Overlay to protect contrast & readability */}
      <div className="showroom-video-overlay" />

      {/* Soft Daylight Overhead Lighting Cones */}
      <div className="showroom-light-overhead" />
      <div className="showroom-accent-beam-left" />
      <div className="showroom-accent-beam-right" />

      {/* Futuristic Center Glow Ambience */}
      <div className="showroom-center-glow" />

      {/* Prominent Glowing Blinking Signboard: PW GARAGE RED ZONE BODY#2 */}
      <div className="showroom-glowing-sign-container">
        <div className="glowing-sign-badge">
          <span className="sign-indicator-dot" />
          <span className="sign-category-tag">WELDING MAINTENANCE DEFENCE</span>
          <span className="sign-indicator-dot" />
        </div>
        <h1 className="glowing-neon-title">
          PW GARAGE RED ZONE BODY#2
        </h1>
        <div className="glowing-sign-sub">
          <span>HIGH VOLTAGE OPERATIONAL DECK</span>
          <span className="glowing-sign-bullet">•</span>
          <span>SHIFT RED TEAM MEMBERS</span>
        </div>
      </div>

      {/* Polished Concrete Floor & Subtle Perspective Grid */}
      <div className="showroom-floor">
        <div className="showroom-grid" />
        <div className="showroom-pedestal-glow" />
      </div>

      {/* Minimal Wall Identity */}
      <div className="showroom-wall-accents">
        <span className="showroom-wall-code">BODY #2 // RED ZONE FACILITY</span>
        <span className="showroom-wall-code">DIGITAL SHOWROOM</span>
      </div>
    </div>
  );
};


