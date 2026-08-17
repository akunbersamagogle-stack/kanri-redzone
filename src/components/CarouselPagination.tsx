import React from 'react';

interface CarouselPaginationProps {
  total: number;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

export const CarouselPagination: React.FC<CarouselPaginationProps> = ({
  total,
  activeIndex,
  onSelectIndex
}) => {
  return (
    <footer className="site-footer-bar">
      {/* Navigation Hint */}
      <div className="footer-nav-hint">
        <span>NAVIGATE:</span>
        <span className="key-badge">←</span>
        <span className="key-badge">→</span>
        <span>OR SWIPE SHOWROOM</span>
      </div>

      {/* Minimal Dots Pagination: ● ○ ○ ○ ○ */}
      <div className="carousel-indicators" role="tablist" aria-label="Character Slides">
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`indicator-dot ${idx === activeIndex ? 'active' : ''}`}
            onClick={() => onSelectIndex(idx)}
            aria-label={`Jump to Character ${idx + 1}`}
            aria-selected={idx === activeIndex}
          />
        ))}
      </div>

      {/* Facility Reference */}
      <div className="footer-credits">
        <span>MAINT. BODY 2 RED ZONE</span>
      </div>
    </footer>
  );
};
