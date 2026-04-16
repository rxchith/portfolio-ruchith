'use client';

import { useLayoutEffect, useRef, useState, useCallback } from 'react';

interface TimelineEntry {
  year: string;
  title: string;
  subtitle?: string;
  side: 'left' | 'right';
}

const TIMELINE_DATA: TimelineEntry[] = [
  {
    year: '2020 — 2024',
    title: 'National Institute of Engineering',
    subtitle: 'B.E. in Computer Science',
    side: 'right',
  },
  {
    year: '2024',
    title: 'Google UX Design',
    subtitle: 'Professional Specialization',
    side: 'left',
  },
  {
    year: '2024 — 2025',
    title: 'The Bear House',
    subtitle: 'UI and Graphic Designer',
    side: 'right',
  },
  {
    year: '2025 — Present',
    title: 'Pluto',
    subtitle: 'Product Designer',
    side: 'left',
  },
];

const SVG_WIDTH = 600;
const SVG_HEIGHT = 1600;
const CENTER_X = SVG_WIDTH / 2;
const NODE_SPACING = 380;
const CURVE_OFFSET = 100; // horizontal offset for the S-curve

// Build a smooth SVG path that snakes L–R between timeline nodes
function buildJourneyPath(entries: TimelineEntry[]): string {
  const points = entries.map((entry, i) => ({
    x: entry.side === 'left' ? CENTER_X - CURVE_OFFSET : CENTER_X + CURVE_OFFSET,
    y: 60 + i * NODE_SPACING,
  }));

  if (points.length === 0) return '';

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    // Cubic bezier: keep x steady through the midpoint, then swing to current x
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }

  return d;
}

interface JourneyTimelineProps {
  scrollTop: number;
  viewportHeight: number;
}

const JourneyTimeline = ({ scrollTop, viewportHeight }: JourneyTimelineProps) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const journeyPath = buildJourneyPath(TIMELINE_DATA);

  // Measure SVG path length once
  useLayoutEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [journeyPath]);

  // Node positions for cards
  const nodePositions = TIMELINE_DATA.map((entry, i) => ({
    x: entry.side === 'left' ? CENTER_X - CURVE_OFFSET : CENTER_X + CURVE_OFFSET,
    y: 60 + i * NODE_SPACING,
  }));

  // Calculate reveal based on viewport center
  // The SVG is offset by 35vh (top spacer)
  const viewportCenter = scrollTop + (viewportHeight * 0.7); // reveal slightly before middle for better flow
  const topSpacer = viewportHeight * 0.35;

  const getNodeOpacity = useCallback(
    (index: number) => {
      const nodeY = topSpacer + nodePositions[index].y;
      const distance = viewportCenter - nodeY;
      if (distance < -100) return 0;
      return Math.min(1, (distance + 100) / 200);
    },
    [viewportCenter, topSpacer, nodePositions],
  );

  // Line drawing also follows the viewport center
  const rawProgress = (viewportCenter - topSpacer) / SVG_HEIGHT;
  const drawProgress = Math.min(Math.max(rawProgress, 0), 1);
  const drawLength = pathLength * drawProgress;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        width="100%"
        height="100%"
        style={{ maxWidth: 600, overflow: 'visible' }}
      >
        {/* Dashed background path (full) */}
        <path
          d={journeyPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={2}
          strokeDasharray="8 8"
        />

        {/* Glowing drawn path */}
        {pathLength > 0 && (
          <>
            {/* Glow layer */}
            <path
              d={journeyPath}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength - drawLength}
              style={{ filter: 'blur(4px)' }}
            />
            {/* Main line */}
            <path
              ref={pathRef}
              d={journeyPath}
              fill="none"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength - drawLength}
            />
          </>
        )}
        {pathLength === 0 && (
          <path
            ref={pathRef}
            d={journeyPath}
            fill="none"
            stroke="none"
            strokeWidth={2}
          />
        )}

        {/* Node dots + cards */}
        {TIMELINE_DATA.map((entry, i) => {
          const pos = nodePositions[i];
          const opacity = getNodeOpacity(i);
          const cardX = entry.side === 'left' ? pos.x - 180 : pos.x + 24;

          return (
            <g key={i} style={{ opacity, transition: 'opacity 0.4s ease' }}>
              {/* Pulsing ring */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={12}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
              >
                <animate
                  attributeName="r"
                  values="8;14;8"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0;0.4"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Center dot */}
              <circle cx={pos.x} cy={pos.y} r={5} fill="white" />

              {/* Connector line to card */}
              <line
                x1={pos.x}
                y1={pos.y}
                x2={entry.side === 'left' ? pos.x - 20 : pos.x + 20}
                y2={pos.y}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1}
                strokeDasharray="4 3"
              />

              {/* Card */}
              <foreignObject
                x={cardX}
                y={pos.y - 40}
                width={160}
                height={90}
              >
                <div
                  style={{
                    fontFamily:
                      "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    color: 'white',
                    padding: '8px 0',
                    textAlign: entry.side === 'left' ? 'right' : 'left',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.15em',
                      color: 'rgba(255,255,255,0.4)',
                      marginBottom: 4,
                      fontWeight: 500,
                    }}
                  >
                    {entry.year}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      marginBottom: 2,
                    }}
                  >
                    {entry.title}
                  </div>
                  {entry.subtitle && (
                    <div
                      style={{
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.5)',
                        fontWeight: 400,
                      }}
                    >
                      {entry.subtitle}
                    </div>
                  )}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default JourneyTimeline;
