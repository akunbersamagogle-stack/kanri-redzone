import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import type { Character } from '../types/character';
import { HoverPreviewCard } from './HoverPreviewCard';

interface CharacterCarouselProps {
  characters: Character[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelectCharacter: (character: Character) => void;
}

export const CharacterCarousel: React.FC<CharacterCarouselProps> = ({
  characters,
  activeIndex,
  onActiveIndexChange,
  onSelectCharacter,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const total = characters.length;

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Realtime drag motion value: representing index offset
  const dragOffset = useMotionValue(0);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);

  // Preload images
  useEffect(() => {
    characters.forEach((char) => {
      const img = new Image();
      img.src = char.image;
    });
  }, [characters]);

  const goToNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % total;
    onActiveIndexChange(nextIdx);
  }, [activeIndex, total, onActiveIndexChange]);

  const goToPrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + total) % total;
    onActiveIndexChange(prevIdx);
  }, [activeIndex, total, onActiveIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Enter') {
        onSelectCharacter(characters[activeIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, total, characters, onSelectCharacter, goToNext, goToPrev]);

  // Native touch swipe detection optimized for mobile devices
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isSwipingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwipingRef.current) return;
    isSwipingRef.current = false;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Prioritize horizontal swipe over vertical scroll
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Mouse drag handler for desktop
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return; // Handled natively by touch events for maximum 120fps smoothness
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch' || !isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    dragOffset.set(deltaX / 350);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch' || !isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    const currentOffset = dragOffset.get();
    if (currentOffset > 0.2) {
      goToPrev();
    } else if (currentOffset < -0.2) {
      goToNext();
    }

    animate(dragOffset, 0, {
      type: 'spring',
      stiffness: 450,
      damping: 35,
    });
  };

  // Helper to calculate circular shortest offset between card index and active index (-2, -1, 0, 1, 2)
  const getCardOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const isMobile = viewportWidth < 768;

  return (
    <div
      ref={containerRef}
      className="carousel-stage"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="carousel-track">
        {characters.map((character, index) => {
          const logicalOffset = getCardOffset(index);
          const isMain = logicalOffset === 0;
          const isHovered = hoveredIndex === index;

          // Render only within 5-position spatial window (-2 to +2)
          if (Math.abs(logicalOffset) > (isMobile ? 1 : 2)) return null;

          // Compute target 3D spatial values with responsive scaling
          const step1 = isMobile ? Math.min(viewportWidth * 0.72, 260) : Math.min(Math.max(viewportWidth * 0.22, 210), 320);
          const step2 = Math.min(Math.max(viewportWidth * 0.40, 380), 580);

          let x = 0;
          let scale = 1.0;
          let rotateY = 0;
          let opacity = 1.0;
          let zIndex = 30;

          if (logicalOffset === 0) {
            x = 0;
            scale = isHovered ? 1.03 : 1.0;
            opacity = 1.0;
            rotateY = 0;
            zIndex = 30;
          } else if (Math.abs(logicalOffset) === 1) {
            x = logicalOffset * step1;
            scale = isMobile ? 0.78 : (isHovered ? 0.88 : 0.82);
            rotateY = isMobile ? 0 : logicalOffset * -8;
            opacity = isMobile ? 0.45 : (isHovered ? 0.92 : 0.72);
            zIndex = 20;
          } else if (Math.abs(logicalOffset) === 2) {
            x = logicalOffset * step2;
            scale = isHovered ? 0.74 : 0.64;
            rotateY = logicalOffset * -14;
            opacity = isHovered ? 0.62 : 0.35;
            zIndex = 10;
          }

          return (
            <motion.div
              key={character.id}
              className={`character-slot ${isMain ? 'main-focus' : 'side-character'}`}
              animate={{
                x,
                scale,
                rotateY,
                opacity,
                zIndex,
              }}
              transition={{
                type: 'spring',
                stiffness: isMobile ? 420 : 320,
                damping: isMobile ? 36 : 32,
                mass: isMobile ? 0.6 : 0.9,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                if (Math.abs(dragOffset.get()) > 0.08) return;
                e.stopPropagation();
                if (isMain) {
                  onSelectCharacter(character);
                } else {
                  onActiveIndexChange(index);
                }
              }}
            >
              {/* Subtle Floating Hover Preview Thumbnail Card */}
              <AnimatePresence>
                {isHovered && (
                  <HoverPreviewCard character={character} isMainFocus={isMain} />
                )}
              </AnimatePresence>

              {/* Physical Character Figure Framing */}
              <div className="character-figure-wrap">
                <div className="character-image-container">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="character-photo"
                    draggable={false}
                    loading={Math.abs(logicalOffset) <= 1 ? 'eager' : 'lazy'}
                  />
                  <div className="character-image-overlay" />

                  {/* Top Minimal Designation Badge */}
                  <div className="character-card-badge">
                    <span className="character-card-code">{character.code}</span>
                    <span className="character-card-zone">// {character.zone}</span>
                  </div>

                  {/* Bottom Minimal Character Name Plate */}
                  <div className="character-card-info">
                    <span className="character-card-name">{character.name}</span>
                    <span className="character-card-meta">
                      {character.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* Realistic Ground Ambient Occlusion Shadow */}
              <div className="character-floor-shadow" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
