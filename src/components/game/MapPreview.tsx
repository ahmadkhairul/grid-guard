import { useMemo } from 'react';
import { Position } from '@/types/game';
import { GRID_WIDTH, GRID_HEIGHT } from '@/config/gameConfig';
import { cn } from '@/lib/utils';

interface MapPreviewProps {
    path: Position[];
    className?: string;
}

export const MapPreview = ({ path, className }: MapPreviewProps) => {
    const cellSize = 10;
    const padding = 5;
    const width = GRID_WIDTH * cellSize + padding * 2;
    const height = GRID_HEIGHT * cellSize + padding * 2;

    // Generate path string for SVG
    const pathD = useMemo(() => {
        if (path.length === 0) return '';

        // Convert grid coordinates to SVG coordinates (center of cells)
        const points = path.map(p => {
            const x = p.x * cellSize + cellSize / 2 + padding;
            const y = p.y * cellSize + cellSize / 2 + padding;
            return `${x},${y}`;
        });

        return `M ${points.join(' L ')}`;
    }, [path]);

    // Start and End markers
    const startPos = path[0];
    const endPos = path[path.length - 1];

    return (
        <div className={cn("relative bg-zinc-900/50 rounded-lg p-2 border border-border/50", className)}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full text-primary"
            >
                {/* Grid Background (Optional) */}
                <defs>
                    <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
                        <rect width={cellSize} height={cellSize} fill="none" stroke="currentColor" strokeOpacity="0.1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Path Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-50"
                />

                {/* Start Point */}
                <circle
                    cx={startPos.x * cellSize + cellSize / 2 + padding}
                    cy={startPos.y * cellSize + cellSize / 2 + padding}
                    r="3"
                    className="fill-red-500 animate-pulse"
                />

                {/* End Point */}
                <circle
                    cx={endPos.x * cellSize + cellSize / 2 + padding}
                    cy={endPos.y * cellSize + cellSize / 2 + padding}
                    r="3"
                    className="fill-blue-500"
                />
            </svg>

            {/* Label Overlay */}
            <div className="absolute bottom-1 right-2 text-[10px] text-muted-foreground font-mono">
                {GRID_WIDTH}x{GRID_HEIGHT}
            </div>
        </div>
    );
};
