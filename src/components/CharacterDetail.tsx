import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Lightbulb,
  Wrench,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ChevronDown,
  ZoomIn,
  X,
  ExternalLink,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import type { Character, CategoryKey, PmDocument } from '../types/character';

interface CharacterDetailProps {
  character: Character;
  onBackToShowroom: () => void;
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/** Derive available years from a list of PM documents */
function getYears(docs: PmDocument[]): number[] {
  return [...new Set(docs.map(d => d.year))].sort((a, b) => b - a);
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({
  character,
  onBackToShowroom,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('idea');

  // PM document filter state — default to latest doc's year/month
  const pmDocs = character.categories.pm.pmDocuments ?? [];
  const defaultYear = pmDocs.length > 0 ? pmDocs[pmDocs.length - 1].year : new Date().getFullYear();
  const defaultMonth = pmDocs.length > 0 ? pmDocs[pmDocs.length - 1].month : new Date().getMonth() + 1;
  const [pmYear, setPmYear] = useState<number>(defaultYear);
  const [pmMonth, setPmMonth] = useState<number>(defaultMonth);

  // Lightbox state for PM document
  const [lightboxDoc, setLightboxDoc] = useState<PmDocument | null>(null);
  const [viewMode, setViewMode] = useState<'pdf' | 'image'>('pdf');

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

  // Filtered PM documents based on selected year + month
  const filteredPmDocs = pmDocs.filter(d => d.year === pmYear && d.month === pmMonth);
  const availableYears = getYears(pmDocs);

  return (
    <>
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

                {/* ── PM special view: year/month filter + document viewer ── */}
                {activeCategory === 'pm' && pmDocs.length > 0 ? (
                  <div className="category-content-body">
                    {/* Filter row */}
                    <div className="pm-filter-row">
                      {/* Year selector */}
                      <div className="pm-select-wrap">
                        <label className="pm-select-label">TAHUN</label>
                        <div className="pm-select-box">
                          <select
                            className="pm-select"
                            value={pmYear}
                            onChange={e => setPmYear(Number(e.target.value))}
                          >
                            {availableYears.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                          <ChevronDown size={13} className="pm-select-chevron" />
                        </div>
                      </div>

                      {/* Month selector */}
                      <div className="pm-select-wrap">
                        <label className="pm-select-label">BULAN</label>
                        <div className="pm-select-box">
                          <select
                            className="pm-select"
                            value={pmMonth}
                            onChange={e => setPmMonth(Number(e.target.value))}
                          >
                            {MONTHS.map((name, idx) => (
                              <option key={idx + 1} value={idx + 1}>{name}</option>
                            ))}
                          </select>
                          <ChevronDown size={13} className="pm-select-chevron" />
                        </div>
                      </div>

                      <div className="pm-filter-info">
                        {filteredPmDocs.length > 0
                          ? `${filteredPmDocs.length} dokumen ditemukan`
                          : 'Tidak ada dokumen untuk periode ini'}
                      </div>
                    </div>

                    {/* Document cards */}
                    {filteredPmDocs.length > 0 ? (
                      filteredPmDocs.map(doc => (
                        <div key={doc.id} className="pm-doc-card">
                          <div className="pm-doc-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span className="card-id-tag">{doc.id}</span>
                              <span className="card-status-tag">
                                {doc.status}
                              </span>
                              {doc.pdfUrl && (
                                <span className="pm-doc-badge-pdf">
                                  <FileSpreadsheet size={11} />
                                  <span>PDF ASLI / VEKTOR</span>
                                </span>
                              )}
                            </div>
                            <span className="pm-doc-period">
                              {MONTHS[doc.month - 1]} {doc.year}
                            </span>
                          </div>

                          <h4 className="card-item-title">{doc.title}</h4>
                          {doc.notes && (
                            <p className="card-item-summary">{doc.notes}</p>
                          )}

                          {/* Action Buttons Bar */}
                          <div className="pm-doc-actions-bar">
                            <button
                              type="button"
                              className="pm-action-btn primary"
                              onClick={() => {
                                setViewMode('pdf');
                                setLightboxDoc(doc);
                              }}
                            >
                              <ZoomIn size={14} />
                              <span>Buka Dokumen PDF (HD / Zoomable)</span>
                            </button>

                            {doc.pdfUrl && (
                              <a
                                href={doc.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pm-action-btn secondary"
                              >
                                <ExternalLink size={13} />
                                <span>Buka Tab Baru</span>
                              </a>
                            )}
                          </div>

                          {/* Document thumbnail — click to open lightbox */}
                          <button
                            type="button"
                            className="pm-doc-thumb-btn"
                            onClick={() => {
                              setViewMode('pdf');
                              setLightboxDoc(doc);
                            }}
                          >
                            <img
                              src={doc.imageUrl}
                              alt={doc.title}
                              className="pm-doc-thumb"
                            />
                            <div className="pm-doc-thumb-overlay">
                              <ZoomIn size={24} />
                              <span style={{ fontWeight: 800 }}>PREVIEW INTERAKTIF (PDF ASLI HD)</span>
                              <span style={{ fontSize: 10, opacity: 0.8 }}>Klik untuk zoom & baca tanpa blur</span>
                            </div>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="ready-notice-box">
                        <div className="ready-icon-wrap">
                          <CheckCircle2 size={18} />
                        </div>
                        <div className="ready-notice-text">
                          <span className="ready-notice-title">
                            Belum ada dokumen PM untuk {MONTHS[pmMonth - 1]} {pmYear}
                          </span>
                          <span className="ready-notice-sub">
                            Dokumen akan muncul di sini setelah ditambahkan ke sistem.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Default view for non-PM categories or PM with no docs yet */
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
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </motion.div>

      {/* ── PM Document Full-Screen Interactive Lightbox ── */}
      <AnimatePresence>
        {lightboxDoc && (
          <motion.div
            className="pm-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxDoc(null)}
          >
            <motion.div
              className="pm-lightbox-inner"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <div className="pm-lightbox-header">
                <div>
                  <span className="pm-lightbox-title">{lightboxDoc.title}</span>
                  <span className="pm-lightbox-period">
                    {MONTHS[lightboxDoc.month - 1]} {lightboxDoc.year} • {lightboxDoc.notes}
                  </span>
                </div>

                <div className="pm-lightbox-controls">
                  {lightboxDoc.pdfUrl && (
                    <div className="pm-view-toggle">
                      <button
                        type="button"
                        className={`pm-toggle-btn ${viewMode === 'pdf' ? 'active' : ''}`}
                        onClick={() => setViewMode('pdf')}
                      >
                        PDF HD (Vektor)
                      </button>
                      <button
                        type="button"
                        className={`pm-toggle-btn ${viewMode === 'image' ? 'active' : ''}`}
                        onClick={() => setViewMode('image')}
                      >
                        Gambar
                      </button>
                    </div>
                  )}

                  {lightboxDoc.pdfUrl && (
                    <a
                      href={lightboxDoc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pm-header-action-btn"
                      title="Buka di tab baru"
                    >
                      <ExternalLink size={14} />
                      <span>Buka Tab Baru</span>
                    </a>
                  )}

                  {lightboxDoc.pdfUrl && (
                    <a
                      href={lightboxDoc.pdfUrl}
                      download={`PM_Schedule_${character.name}_${lightboxDoc.year}_${lightboxDoc.month}.pdf`}
                      className="pm-header-action-btn"
                      title="Download PDF"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </a>
                  )}

                  <button
                    type="button"
                    className="pm-lightbox-close"
                    onClick={() => setLightboxDoc(null)}
                    title="Tutup (ESC)"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Viewer body */}
              <div className="pm-lightbox-content-wrap">
                {viewMode === 'pdf' && lightboxDoc.pdfUrl ? (
                  <iframe
                    src={`${lightboxDoc.pdfUrl}#toolbar=1&view=FitH`}
                    title={lightboxDoc.title}
                    className="pm-lightbox-iframe"
                  />
                ) : (
                  <div className="pm-lightbox-img-scroll">
                    <img
                      src={lightboxDoc.imageUrl}
                      alt={lightboxDoc.title}
                      className="pm-lightbox-img"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
