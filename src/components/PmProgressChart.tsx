import React from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, HelpCircle } from 'lucide-react';
import type { PmDocument } from '../types/character';

interface PmProgressChartProps {
  pmDocuments: PmDocument[];
  year: number;
  selectedMonth?: number;
  onSelectMonth?: (month: number) => void;
}

const MONTHS_LABEL = [
  { short: 'JAN', full: 'Januari', num: '01' },
  { short: 'FEB', full: 'Februari', num: '02' },
  { short: 'MAR', full: 'Maret', num: '03' },
  { short: 'APR', full: 'April', num: '04' },
  { short: 'MEI', full: 'Mei', num: '05' },
  { short: 'JUN', full: 'Juni', num: '06' },
  { short: 'JUL', full: 'Juli', num: '07' },
  { short: 'AGU', full: 'Agustus', num: '08' },
  { short: 'SEP', full: 'September', num: '09' },
  { short: 'OKT', full: 'Oktober', num: '10' },
  { short: 'NOV', full: 'November', num: '11' },
  { short: 'DES', full: 'Desember', num: '12' },
];

export const PmProgressChart: React.FC<PmProgressChartProps> = ({
  pmDocuments,
  year,
  selectedMonth,
  onSelectMonth,
}) => {
  // Map documents by month for the active year
  const yearDocs = pmDocuments.filter((doc) => doc.year === year);
  
  const monthDataMap = new Map<number, PmDocument>();
  yearDocs.forEach((doc) => {
    monthDataMap.set(doc.month, doc);
  });

  const completedCount = yearDocs.filter((d) => d.status === 'COMPLETED').length;
  const inProgressCount = yearDocs.filter((d) => d.status === 'IN_PROGRESS').length;
  const plannedCount = yearDocs.filter((d) => d.status === 'PLANNED').length;
  const totalRecorded = yearDocs.length;
  
  const achievementRate = totalRecorded > 0 ? Math.round((completedCount / totalRecorded) * 100) : 0;

  return (
    <div className="pm-progress-chart-card">
      {/* Top Telemetry Header */}
      <div className="pm-chart-header">
        <div className="pm-chart-title-group">
          <div className="pm-chart-icon-badge">
            <Calendar size={14} />
          </div>
          <div>
            <div className="pm-chart-subheading">ANNUAL TRACKER // {year}</div>
            <h4 className="pm-chart-title">PM EXECUTION &amp; ACHIEVEMENT GRID</h4>
          </div>
        </div>

        <div className="pm-chart-stats-group">
          <div className="pm-chart-stat-chip">
            <span className="stat-label">RECORDED</span>
            <span className="stat-val">{totalRecorded} / 12</span>
          </div>
          <div className="pm-chart-stat-chip highlight">
            <span className="stat-label">ACHIEVEMENT</span>
            <span className="stat-val">{achievementRate}%</span>
          </div>
        </div>
      </div>

      {/* Mini Progress Bar */}
      <div className="pm-chart-bar-track">
        <div 
          className="pm-chart-bar-fill"
          style={{ width: `${achievementRate}%` }}
        />
      </div>

      {/* 12-Month Tactical Grid */}
      <div className="pm-chart-grid">
        {MONTHS_LABEL.map((m, idx) => {
          const monthNum = idx + 1;
          const doc = monthDataMap.get(monthNum);
          const status = doc ? doc.status : 'NO_DATA';
          const isSelected = selectedMonth === monthNum;

          return (
            <button
              key={monthNum}
              type="button"
              className={`pm-month-cell status-${status.toLowerCase().replace('_', '-')} ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelectMonth?.(monthNum)}
              title={`${m.full} ${year}: ${status.replace('_', ' ')}`}
            >
              <div className="cell-top-bar">
                <span className="cell-num">{m.num}</span>
                <span className="cell-status-dot" />
              </div>
              <div className="cell-name">{m.short}</div>
              <div className="cell-status-label">
                {status === 'COMPLETED' && 'DONE'}
                {status === 'IN_PROGRESS' && 'PROG'}
                {status === 'PLANNED' && 'PLAN'}
                {status === 'NO_DATA' && '—'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Status Legend */}
      <div className="pm-chart-legend">
        <div className="legend-item legend-completed">
          <span className="legend-dot" />
          <CheckCircle2 size={11} className="legend-icon" />
          <span>COMPLETED ({completedCount})</span>
        </div>
        <div className="legend-item legend-in-progress">
          <span className="legend-dot" />
          <Clock size={11} className="legend-icon" />
          <span>IN PROGRESS ({inProgressCount})</span>
        </div>
        <div className="legend-item legend-planned">
          <span className="legend-dot" />
          <AlertCircle size={11} className="legend-icon" />
          <span>PLANNED ({plannedCount})</span>
        </div>
        <div className="legend-item legend-no-data">
          <span className="legend-dot" />
          <HelpCircle size={11} className="legend-icon" />
          <span>NO RECORD ({12 - totalRecorded})</span>
        </div>
      </div>
    </div>
  );
};

