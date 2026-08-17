import React from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../types/character';

interface HoverPreviewCardProps {
  character: Character;
  isMainFocus: boolean;
}

export const HoverPreviewCard: React.FC<HoverPreviewCardProps> = ({ character, isMainFocus }) => {
  return (
    <motion.div
      className="hover-preview-wrapper"
      initial={{ opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="hover-preview-card">
        <div className="hover-preview-thumb">
          <img src={character.portrait} alt={character.name} />
        </div>
        <div className="hover-preview-meta">
          <span className="hover-preview-code">{character.code} // {character.zone}</span>
          <span className="hover-preview-name">{character.name}</span>
          <span className="hover-preview-hint">
            {isMainFocus ? 'CLICK TO ENTER PROFILE' : 'CLICK OR DRAG TO FOCUS'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
