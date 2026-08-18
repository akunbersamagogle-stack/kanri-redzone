import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { INITIAL_CHARACTERS } from './data/characters';
import type { Character } from './types/character';
import { CharacterDetail } from './components/CharacterDetail';

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h7M3 3v7M21 3h-7M21 3v7M3 21h7M3 21v-7M21 21h-7M21 21v-7" />
    </svg>
  );
}


export default function App() {
  const characters = INITIAL_CHARACTERS;
  const total = characters.length;

  const [active, setActive] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Drag handling
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive(i => (i + 1) % total), [total]);

  // Preload character images
  useEffect(() => {
    characters.forEach(char => {
      const img = new Image();
      img.src = char.image;
    });
  }, [characters]);

  // Keyboard navigation
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedCharacter) {
      if (e.key === 'Escape') setSelectedCharacter(null);
      return;
    }
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Enter') setSelectedCharacter(characters[active]);
  }, [prev, next, selectedCharacter, characters, active]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const getOffset = (idx: number) => {
    let d = idx - active;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  const toggleLike = () => {
    setLiked(s => {
      const n = new Set(s);
      n.has(active) ? n.delete(active) : n.add(active);
      return n;
    });
  };

  const toggleBookmark = () => {
    setBookmarked(s => {
      const n = new Set(s);
      n.has(active) ? n.delete(active) : n.add(active);
      return n;
    });
  };

  const current = characters[active];

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#070911',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* 1. Dynamic Background Video with 83% Opacity as requested */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: videoLoaded ? 0.83 : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <source src="/assets/videos/background.mp4" type="video/mp4" />
      </video>

      {/* 2. Frosted/Vignette Tint Overlay to guarantee high contrast & readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 85% 65% at 50% 50%, rgba(7,9,17,0.3) 0%, rgba(7,9,17,0.72) 75%, rgba(4,6,12,0.92) 100%), linear-gradient(to top, rgba(7,9,17,0.85) 0%, transparent 35%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* 3. Subtle center soft glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '65vw',
          height: '45vh',
          background: 'radial-gradient(circle, rgba(255,85,0,0.14) 0%, rgba(255,85,0,0.03) 45%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* 4. Top Header & Identity Tag */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(12, 17, 29, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: 999,
          padding: '8px 22px',
          zIndex: 20,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#ff5500',
            boxShadow: '0 0 10px #ff5500',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          PW GARAGE RED ZONE BODY#2
        </span>
        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.18)', margin: '0 4px' }} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            color: '#ff6a1a',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          SHIFT RED TEAM
        </span>
      </div>

      {/* 5. Left Sidebar Quick Actions */}
      <div
        style={{
          position: 'absolute',
          left: 28,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          zIndex: 20,
        }}
      >
        {[
          {
            icon: <BookmarkIcon filled={bookmarked.has(active)} />,
            action: toggleBookmark,
            active: bookmarked.has(active),
            title: 'Bookmark member',
          },
          {
            icon: <HeartIcon filled={liked.has(active)} />,
            action: toggleLike,
            active: liked.has(active),
            title: 'Like member',
          },
          {
            icon: <UserIcon />,
            action: () => setSelectedCharacter(current),
            active: false,
            title: 'Open full profile',
          },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            title={item.title}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: item.active ? 'rgba(255,85,0,0.25)' : 'rgba(15,22,36,0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `1px solid ${item.active ? 'rgba(255,85,0,0.6)' : 'rgba(255,255,255,0.12)'}`,
              color: item.active ? '#ff6a1a' : 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: item.active ? '0 0 20px rgba(255,85,0,0.35)' : '0 4px 14px rgba(0,0,0,0.3)',
              transition: 'all 0.25s ease',
            }}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* 6. Main 3D Card Carousel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(390px, 62vh, 540px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1400px',
          cursor: dragging ? 'grabbing' : 'grab',
          zIndex: 10,
        }}
        onPointerDown={e => {
          if (e.pointerType === 'touch') return;
          setDragging(true);
          setDragStart(e.clientX);
        }}
        onPointerUp={e => {
          if (e.pointerType === 'touch' || !dragging) return;
          setDragging(false);
          const delta = e.clientX - dragStart;
          if (delta < -45) next();
          else if (delta > 45) prev();
        }}
        onPointerLeave={() => setDragging(false)}
        onTouchStart={e => {
          touchStartXRef.current = e.touches[0].clientX;
          touchStartYRef.current = e.touches[0].clientY;
        }}
        onTouchEnd={e => {
          const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
          const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
          if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) next();
            else prev();
          }
        }}
      >
        {characters.map((char, idx) => {
          const offset = getOffset(idx);
          const abs = Math.abs(offset);
          if (abs > 2) return null;

          const isCenter = offset === 0;
          const xPct = offset * 54;
          const scale = isCenter ? 1 : 0.73 - abs * 0.04;
          const zIdx = isCenter ? 10 : 5 - abs;
          const rotY = offset * -14;
          const opacity = isCenter ? 1 : 0.58 - abs * 0.12;
          const blur = isCenter ? 0 : abs * 2;

          const cardW = 'clamp(230px, 27vw, 330px)';
          const cardH = '100%';

          return (
            <div
              key={char.id}
              onClick={() => {
                if (!dragging && abs > 0) setActive(idx);
              }}
              style={{
                position: 'absolute',
                width: cardW,
                height: cardH,
                borderRadius: 24,
                overflow: 'hidden',
                transform: `translateX(${xPct}%) scale(${scale}) rotateY(${rotY}deg)`,
                transformOrigin: 'center center',
                transformStyle: 'preserve-3d',
                zIndex: zIdx,
                opacity,
                filter: blur > 0 ? `blur(${blur}px)` : 'none',
                transition: dragging ? 'none' : 'all 0.55s cubic-bezier(0.34,1.1,0.64,1)',
                cursor: isCenter ? 'default' : 'pointer',
                boxShadow: isCenter
                  ? '0 35px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,85,0,0.35), 0 0 35px rgba(255,85,0,0.2)'
                  : '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
                background: '#0e1422',
              }}
            >
              {/* Character Photo */}
              <img
                src={char.image}
                alt={char.name}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />

              {/* Contrast Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(10,14,23,0.15) 0%, transparent 35%, rgba(6,9,16,0.92) 85%, rgba(6,9,16,0.98) 100%)',
                }}
              />

              {/* Active Center Card Detailed Content */}
              {isCenter && (
                <>
                  {/* Top Bar: Expand CTA & Status Tag */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      right: 16,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedCharacter(char);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'rgba(10,14,23,0.65)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,85,0,0.4)',
                        borderRadius: 999,
                        padding: '6px 14px',
                        color: '#ffffff',
                        fontSize: 11.5,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <ExpandIcon />
                      <span>EXPAND</span>
                    </button>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        background: 'rgba(16,185,129,0.18)',
                        border: '1px solid rgba(16,185,129,0.4)',
                        borderRadius: 999,
                        padding: '4px 10px',
                        fontSize: 10,
                        fontFamily: 'var(--font-mono)',
                        color: '#10b981',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: '#10b981',
                          boxShadow: '0 0 6px #10b981',
                        }}
                      />
                      <span>ACTIVE</span>
                    </div>
                  </div>

                  {/* Character Code Badge & Counter */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 56,
                      left: 16,
                      background: 'rgba(255,85,0,0.18)',
                      border: '1px solid rgba(255,85,0,0.45)',
                      borderRadius: 999,
                      padding: '3px 10px',
                      fontSize: 10.5,
                      fontFamily: 'var(--font-mono)',
                      color: '#ff6a1a',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    CODE: {char.code}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      top: 58,
                      right: 16,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {active + 1} / {total}
                  </div>

                  {/* Bottom Character Info */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '0 20px 22px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#ff6a1a',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      }}
                    >
                      {char.department} • {char.unit}
                    </div>

                    <h2
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(20px, 3.2vw, 26px)',
                        fontWeight: 900,
                        margin: '0 0 8px',
                        color: '#ffffff',
                        lineHeight: 1.15,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {char.name}
                    </h2>

                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        lineHeight: 1.55,
                        color: 'rgba(255,255,255,0.72)',
                        margin: '0 0 12px',
                      }}
                    >
                      {char.summary}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#ffd080',
                        fontSize: 10.5,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                      }}
                    >
                      <PinIcon />
                      <span>{char.zone}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Side Cards Preview Label */}
              {!isCenter && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 14,
                    right: 14,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: '#ff6a1a',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {char.code}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      fontWeight: 800,
                      color: 'rgba(255,255,255,0.95)',
                      textTransform: 'uppercase',
                      marginBottom: 2,
                      lineHeight: 1.2,
                    }}
                  >
                    {char.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.5)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {char.zone}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 7. Bottom Navigation Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(12, 17, 29, 0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: 999,
          padding: '10px 12px 10px 16px',
          zIndex: 20,
          minWidth: 'clamp(290px, 42vw, 420px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}
      >
        <button
          onClick={prev}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
        >
          <ChevronLeft />
        </button>

        {/* Character circular thumbnail */}
        <div
          onClick={() => setSelectedCharacter(current)}
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            border: '1.5px solid #ff5500',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(255,85,0,0.3)',
          }}
        >
          <img
            src={current.image}
            alt={current.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Member Info */}
        <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setSelectedCharacter(current)}>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13.5,
              fontWeight: 800,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            {current.name}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {current.department} // {current.zone}
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={toggleLike}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: liked.has(active) ? 'rgba(255,85,0,0.25)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${liked.has(active) ? '#ff5500' : 'rgba(255,255,255,0.12)'}`,
            color: liked.has(active) ? '#ff6a1a' : 'rgba(255,255,255,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          <HeartIcon filled={liked.has(active)} />
        </button>

        {/* Next Button */}
        <button
          onClick={next}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
        >
          <ChevronRight />
        </button>
      </div>

      {/* 8. 5-Dot Pagination Indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 6,
          zIndex: 20,
        }}
      >
        {characters.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 22 : 6,
              height: 6,
              borderRadius: 999,
              background: i === active ? '#ff5500' : 'rgba(255,255,255,0.25)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: i === active ? '0 0 10px rgba(255,85,0,0.6)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.34,1.2,0.64,1)',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* 9. Full Character Detail View Modal / Overlay */}
      <AnimatePresence>
        {selectedCharacter && (
          <CharacterDetail
            character={selectedCharacter}
            onBackToShowroom={() => setSelectedCharacter(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

