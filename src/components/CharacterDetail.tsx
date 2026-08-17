import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb, Wrench, TrendingUp, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import type { Character, CategoryKey } from '../types/character';

interface CharacterDetailProps {
  character: Character;
  onBackToShowroom: () => void;
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({
  character,
  onBackToShowroom,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('idea');

  const categoriesConfig: Array<{
    key: CategoryKey;
    icon: React.ReactNode;
    code: string;
    label: string;
  }> = [
    { key: 'idea', icon: <Lightbulb size={17} />, code: 'SEC-01', label: 'IDEA' },
    { key: 'pm', icon: <Wrench size={17} />, code: 'SEC-02', label: 'PM' },
    { key: 'improvement', icon: <TrendingUp size={17} />, code: 'SEC-03', label: 'IMPROVEMENT' },
    { key: 'safety', icon: <ShieldCheck size={17} />, code: 'SEC-04', label: 'SAFETY' },
  ];

  const currentCategoryData = character.categories[activeCategory];

  return (
    <motion.div
      className="detail-view-container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top Detail Navigation Header */}
      <div className="detail-header-bar">
        <button
          type="button"
          className="return-button"
          onClick={onBackToShowroom}
        >
          <ArrowLeft size={14} />
          <span>RETURN TO SHOWROOM</span>
        </button>

        <div className="detail-header-id">
          <span className="detail-code-badge">{character.code}</span>
          <span className="detail-header-title">
            {character.name} <span className="detail-header-sep">//</span> {character.zone}
          </span>
        </div>
      </div>

      {/* Main 2-Column Split / Responsive Flow */}
      <div className="detail-body-layout">
        {/* Left Column: Character Spotlight */}
        <aside className="detail-character-spotlight">
          <div className="spotlight-card">
            <img
              src={character.image}
              alt={character.name}
              className="spotlight-photo"
            />
            <div className="spotlight-overlay" />
            <div className="spotlight-info-wrap">
              <span className="spotlight-division">
                {character.department} • {character.unit}
              </span>
              <h2 className="spotlight-name">{character.name}</h2>
            </div>
          </div>

          {/* Standardized Meta Data Structure */}
          <div className="spotlight-meta-block">
            <div className="meta-row">
              <span className="meta-key">DESIGNATION CODE</span>
              <span className="meta-val">{character.code}</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">TEAM / ASSIGNMENT</span>
              <span className="meta-val">{character.department}</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">SECURITY ZONE</span>
              <span className="meta-val">{character.zone}</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">PROFILE STATUS</span>
              <span className="meta-val meta-status-active">
                {character.status}
              </span>
            </div>
          </div>
        </aside>

        {/* Right Column: 4 Category Tabs & Content Area */}
        <main className="detail-main-content">
          {/* Category Navigation Tabs: IDEA | PM | IMPROVEMENT | SAFETY */}
          <nav className="category-nav-grid" aria-label="Category Sections">
            {categoriesConfig.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  className={`category-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <div className="tab-top-row">
                    <span className="tab-code">{cat.code}</span>
                    <span className="tab-icon-wrap">
                      {cat.icon}
                    </span>
                  </div>
                  <span className="tab-label">{cat.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Category Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCategoryData.id}
              className="category-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="panel-header-card">
                <div className="panel-header-info">
                  <div className="panel-tagline">
                    {currentCategoryData.code} // {currentCategoryData.tagline}
                  </div>
                  <h3 className="panel-title">{currentCategoryData.label}</h3>
                  <p className="panel-desc">{currentCategoryData.description}</p>
                </div>
                <div className="panel-status-badge">
                  <FileText size={12} />
                  <span>{currentCategoryData.status}</span>
                </div>
              </div>

              {/* Data-driven category items grid */}
              <div className="category-content-body">
                {currentCategoryData.placeholderItems.map((item) => (
                  <div key={item.id} className="placeholder-card">
                    <div className="placeholder-card-header">
                      <span className="card-id-tag">{item.id}</span>
                      <span className="card-status-tag">{item.status}</span>
                    </div>
                    <h4 className="card-item-title">{item.title}</h4>
                    <p className="card-item-summary">{item.summary}</p>
                  </div>
                ))}

                {/* Structured Next Phase Ready Notice */}
                <div className="ready-notice-box">
                  <div className="ready-icon-wrap">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="ready-notice-text">
                    <span className="ready-notice-title">
                      {currentCategoryData.label} Architecture Locked &amp; Ready
                    </span>
                    <span className="ready-notice-sub">
                      Detailed records, KPI metrics, logs, and submissions will populate this container in the next project step.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};
