import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { INITIAL_CHARACTERS } from './data/characters';
import type { Character } from './types/character';
import { ShowroomBackground } from './components/ShowroomBackground';
import { Header } from './components/Header';
import { CharacterCarousel } from './components/CharacterCarousel';
import { ActiveCharacterHUD } from './components/ActiveCharacterHUD';
import { CarouselPagination } from './components/CarouselPagination';
import { CharacterDetail } from './components/CharacterDetail';

export const App: React.FC = () => {
  const [characters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const currentCharacter = characters[activeIndex];

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleBackToShowroom = () => {
    setSelectedCharacter(null);
  };

  return (
    <div className="app-viewport">
      {/* 1. Showroom Background & Lighting Layer */}
      <ShowroomBackground />

      {/* 2. Top Minimal Identity Header */}
      <Header />

      {/* 3. Main Showroom Interactive Stage */}
      <main className="showroom-main-stage">
        <CharacterCarousel
          characters={characters}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          onSelectCharacter={handleSelectCharacter}
        />

        {/* 4. Active Hero HUD & CTA */}
        <ActiveCharacterHUD
          character={currentCharacter}
          onSelectCharacter={handleSelectCharacter}
        />

        {/* 5. Bottom Pagination & Hint */}
        <CarouselPagination
          total={characters.length}
          activeIndex={activeIndex}
          onSelectIndex={setActiveIndex}
        />
      </main>

      {/* 6. Detail View Overlay (Unlocked upon character selection) */}
      <AnimatePresence>
        {selectedCharacter && (
          <CharacterDetail
            character={selectedCharacter}
            onBackToShowroom={handleBackToShowroom}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
