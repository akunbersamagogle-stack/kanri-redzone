import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Character } from '../types/character';

interface ActiveCharacterHUDProps {
  character: Character;
  onSelectCharacter: (character: Character) => void;
}

export const ActiveCharacterHUD: React.FC<ActiveCharacterHUDProps> = ({
  character,
  onSelectCharacter
}) => {
  return (
    <div className="active-character-hud">
      <motion.div
        key={character.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hud-details-pill"
      >
        <span className="hud-code">{character.code}</span>
        <span className="hud-divider" />
        <span className="hud-name">{character.name}</span>
        <span className="hud-divider" />
        <span className="hud-team">{character.department}</span>
      </motion.div>

      <button
        type="button"
        className="select-hero-button"
        onClick={() => onSelectCharacter(character)}
      >
        <span>ENTER CHARACTER DETAIL</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};
