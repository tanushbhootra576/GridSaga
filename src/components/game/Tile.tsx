"use client";

import type { Tile as TileType } from '@/types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

type TileProps = TileType & {
  gridSize: number;
  tileSize: number;
  tileGap: number;
};

const tileColorStyles: { [key: number]: string } = {
    2: "bg-[--tile-2-bg] text-[--tile-dark-text]",
    4: "bg-[--tile-4-bg] text-[--tile-dark-text]",
    8: "bg-[--tile-8-bg] text-[--tile-light-text]",
    16: "bg-[--tile-16-bg] text-[--tile-light-text]",
    32: "bg-[--tile-32-bg] text-[--tile-light-text]",
    64: "bg-[--tile-64-bg] text-[--tile-light-text]",
    128: "bg-[--tile-128-bg] text-[--tile-light-text]",
    256: "bg-[--tile-256-bg] text-[--tile-light-text]",
    512: "bg-[--tile-512-bg] text-[--tile-light-text]",
    1024: "bg-[--tile-1024-bg] text-[--tile-light-text]",
    2048: "bg-[--tile-2048-bg] text-[--tile-light-text]",
    4096: "bg-[--tile-4096-bg] text-[--tile-light-text]",
    8192: "bg-[--tile-8192-bg] text-[--tile-light-text]",
};



export function Tile({ value, row, col, isNew, isMerged, gridSize, tileSize, tileGap }: TileProps) {
    // Position each tile as a cube in 3D space inside the board
    const positionStyles = useMemo(() => {
      return {
        position: 'absolute' as const,
        width: tileSize,
        height: tileSize,
        left: tileGap + col * (tileSize + tileGap),
        top: tileGap + row * (tileSize + tileGap),
        zIndex: 2,
        transition: 'left 0.2s, top 0.2s',
      };
    }, [row, col, tileSize, tileGap]);

  const colorClass = tileColorStyles[value] || "bg-muted text-foreground";
  
  const fontSizeClass = 
    value > 9999 ? 'text-xl sm:text-2xl md:text-3xl' :
    value > 999 ? 'text-2xl sm:text-3xl md:text-4xl' :
    value > 99 ? 'text-3xl sm:text-4xl md:text-5xl' :
    'text-4xl sm:text-5xl md:text-6xl';

  // Cube size is the tile size, depth is 60% of width
  const cubeDepth = '60%';
  return (
    <div
      className="absolute"
      style={positionStyles}
    >
      <div
        className="cube-3d"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.2s cubic-bezier(.4,2,.6,1)',
          boxShadow: '0 12px 32px #0006, 0 2px 0 #fff2 inset',
        }}
      >
        {/* Front */}
        <div className={cn('cube-face', colorClass, fontSizeClass)} style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          borderRadius: 8,
          boxShadow: '0 4px 16px #0003',
          backfaceVisibility: 'hidden',
          transform: `rotateY(0deg) translateZ(calc(${cubeDepth} / 2))`,
        }}>{value}</div>
        {/* Back */}
        <div className={cn('cube-face', colorClass, fontSizeClass)} style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          borderRadius: 8,
          boxShadow: '0 4px 16px #0003',
          backfaceVisibility: 'hidden',
          transform: `rotateY(180deg) translateZ(calc(${cubeDepth} / 2))`,
        }}>{value}</div>
        {/* Right */}
        <div className={cn('cube-face', colorClass, fontSizeClass)} style={{
          position: 'absolute',
          width: cubeDepth,
          height: '100%',
          left: 'calc(50% - 0.5 * ' + cubeDepth + ')',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          borderRadius: 8,
          boxShadow: '0 4px 16px #0003',
          backfaceVisibility: 'hidden',
          transform: `rotateY(90deg) translateZ(50%)`,
        }}>{value}</div>
        {/* Left */}
        <div className={cn('cube-face', colorClass, fontSizeClass)} style={{
          position: 'absolute',
          width: cubeDepth,
          height: '100%',
          left: 'calc(50% - 0.5 * ' + cubeDepth + ')',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          borderRadius: 8,
          boxShadow: '0 4px 16px #0003',
          backfaceVisibility: 'hidden',
          transform: `rotateY(-90deg) translateZ(50%)`,
        }}>{value}</div>
        {/* Top */}
        <div className={cn('cube-face', colorClass, fontSizeClass)} style={{
          position: 'absolute',
          width: '100%',
          height: cubeDepth,
          top: 'calc(50% - 0.5 * ' + cubeDepth + ')',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          borderRadius: 8,
          boxShadow: '0 4px 16px #0003',
          backfaceVisibility: 'hidden',
          transform: `rotateX(90deg) translateZ(50%)`,
        }}>{value}</div>
        {/* Bottom */}
        <div className={cn('cube-face', colorClass, fontSizeClass)} style={{
          position: 'absolute',
          width: '100%',
          height: cubeDepth,
          top: 'calc(50% - 0.5 * ' + cubeDepth + ')',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          borderRadius: 8,
          boxShadow: '0 8px 32px #0005',
          backfaceVisibility: 'hidden',
          transform: `rotateX(-90deg) translateZ(50%)`,
        }}>{value}</div>
      </div>
      {/* Shadow under cube */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '90%',
        width: '100%',
        height: '20%',
        filter: 'blur(4px)',
        background: 'radial-gradient(ellipse at center, #0005 0%, #0000 80%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
