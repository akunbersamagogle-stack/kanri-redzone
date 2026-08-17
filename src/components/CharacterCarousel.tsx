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

  // Mouse & Touch Drag Handlers for direct continuous tracking
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const offset = deltaX / 350;
    dragOffset.set(offset);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    const currentOffset = dragOffset.get();
    const threshold = 0.22;

    if (currentOffset > threshold) {
      goToPrev();
    } else if (currentOffset < -threshold) {
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

  return (
    <div
      ref={containerRef}
      className="carousel-stage"
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
          if (Math.abs(logicalOffset) > 2) return null;

          // Compute target 3D spatial values with responsive scaling
          const step1 = Math.min(Math.max(viewportWidth * 0.22, 210), 320);
          const step2 = Math.min(Math.max(viewportWidth * 0.40, 380), 580);

          let x = 0;
          let scale = 1.0;
          let rotateY = 0;
          let opacity = 1.0;
          let blur = 0;
          let zIndex = 30;

          if (logicalOffset === 0) {
            x = 0;
            scale = isHovered ? 1.03 : 1.0;
            opacity = 1.0;
            rotateY = 0;
            blur = 0;
            zIndex = 30;
          } else if (Math.abs(logicalOffset) === 1) {
            x = logicalOffset * step1;
            scale = isHovered ? 0.88 : 0.82;
            rotateY = logicalOffset * -8;
            opacity = isHovered ? 0.92 : 0.72;
            blur = isHovered ? 0 : 1;
            zIndex = 20;
          } else if (Math.abs(logicalOffset) === 2) {
            x = logicalOffset * step2;
            scale = isHovered ? 0.74 : 0.64;
            rotateY = logicalOffset * -14;
            opacity = isHovered ? 0.62 : 0.35;
            blur = isHovered ? 1 : 2.5;
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
                filter: `blur(${blur}px)`,
                zIndex,
              }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 32,
                mass: 0.9,
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
