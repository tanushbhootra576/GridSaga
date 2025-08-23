  "use client";

import { useEffect, useRef, useState } from 'react';
import type { Tile as TileType } from '@/types';
import { Tile } from './Tile';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  faces: TileType[][];
  activeFace: number;
  setActiveFace: (face: number) => void;
  gridSize: number;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

// Face transforms for a cube (front, back, right, left, top, bottom)
const faceTransforms = [
  'rotateY(0deg) translateZ(200px)',      // front
  'rotateY(180deg) translateZ(200px)',   // back
  'rotateY(90deg) translateZ(200px)',    // right
  'rotateY(-90deg) translateZ(200px)',   // left
  'rotateX(90deg) translateZ(200px)',    // top
  'rotateX(-90deg) translateZ(200px)',   // bottom
];

export function GameBoard({ faces, activeFace, setActiveFace, gridSize, onMove }: GameBoardProps) {
  // Touch drag handlers for 3D rotation (mobile support)
  const touchDragRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTouchCubeStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchDragRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    lastTouchRotation.current = { ...rotation };
  };

  const handleTouchCubeMove = (e: React.TouchEvent) => {
    if (!touchDragRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchDragRef.current.x;
    const dy = e.touches[0].clientY - touchDragRef.current.y;
    const newX = Math.max(-80, Math.min(80, lastTouchRotation.current.x + dy * 0.5));
    const newY = lastTouchRotation.current.y + dx * 0.5;
    setRotation({ x: newX, y: newY });
  };

  const handleTouchCubeEnd = (e: React.TouchEvent) => {
    lastTouchRotation.current = { ...rotation };
    touchDragRef.current = null;
  };
  const boardRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  // 3D rotation state
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  // Track the last face button rotation for smooth drag
  const lastFaceRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // Mouse/touch drag handlers for 3D rotation (accumulate deltas for smooth rotation)
  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
    lastFaceRotation.current = { ...rotation };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    // Use the initial drag position for delta calculation
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    // Calculate new rotation based on initial drag and last face rotation
    const newX = Math.max(-80, Math.min(80, lastFaceRotation.current.x + dy * 0.5));
    const newY = lastFaceRotation.current.y + dx * 0.5;
    setRotation({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // On drag end, update lastFaceRotation to the new rotation
    lastFaceRotation.current = { ...rotation };
    dragRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
          onMove('up');
          break;
        case 'ArrowDown':
          onMove('down');
          break;
        case 'ArrowLeft':
          onMove('left');
          break;
        case 'ArrowRight':
          onMove('right');
          break;
      }
    };

    const currentBoard = boardRef.current;
    if (currentBoard) {
        currentBoard.focus();
        currentBoard.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (currentBoard) {
        currentBoard.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [onMove]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 50) onMove('right');
      else if (dx < -50) onMove('left');
    } else {
      if (dy > 50) onMove('down');
      else if (dy < -50) onMove('up');
    }

    setTouchStart(null);
  };

  // For 3D cube grid, we don't use CSS grid, but absolute positioning in 3D
  const cubeSize = 400; // px, size of the board cube
  const tileGap = 12; // px, gap between cubes
  const tileSize = (cubeSize - tileGap * (gridSize + 1)) / gridSize;

  return (
    <div
      className="w-full h-full flex items-center justify-center select-none"
      style={{ perspective: 1200, WebkitPerspective: 1200 }}
    >
      <div
        ref={boardRef}
        className="relative touch-none shadow-2xl"
        style={{
          width: cubeSize,
          height: cubeSize,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: dragRef.current ? 'none' : 'transform 0.2s cubic-bezier(.4,2,.6,1)',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchCubeStart}
        onTouchMove={handleTouchCubeMove}
        onTouchEnd={handleTouchCubeEnd}
        tabIndex={-1}
      >
        {faces.map((tiles, faceIdx) => (
          <div
            key={faceIdx}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: faceTransforms[faceIdx],
              background: 'rgba(60,50,80,0.95)',
              borderRadius: 24,
              boxShadow: faceIdx === activeFace ? '0 24px 64px #000a' : '0 8px 24px #0006',
              opacity: faceIdx === activeFace ? 1 : 0.7,
              pointerEvents: faceIdx === activeFace ? 'auto' : 'none',
              overflow: 'hidden',
            }}
          >
            {/* Render empty grid as 3D cubes */}
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
              const row = Math.floor(i / gridSize);
              const col = i % gridSize;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: tileSize,
                    height: tileSize,
                    left: tileGap + col * (tileSize + tileGap),
                    top: tileGap + row * (tileSize + tileGap),
                    zIndex: 1,
                    pointerEvents: 'none',
                    boxShadow: '0 2px 12px #0005',
                    borderRadius: 8,
                    background: 'rgba(80,70,100,0.7)',
                    opacity: 0.7,
                  }}
                />
              );
            })}
          
            {tiles.map((tile) => (
              <Tile key={tile.id} {...tile} gridSize={gridSize} tileSize={tileSize} tileGap={tileGap} />
            ))}
          </div>
        ))}
      </div>
   
      <div className="flex gap-2 mt-4 absolute left-1/2 -translate-x-1/2 bottom-0">
        {['Front', 'Back', 'Right', 'Left', 'Top', 'Bottom'].map((label, idx) => {
          // Define the rotation for each face
          const faceRotations = [
            { x: 0, y: 0 },      // Front
            { x: 0, y: 180 },    // Back
            { x: 0, y: -90 },    // Right 
            { x: 0, y: 90 },     // Left 
            { x: -90, y: 0 },    // Top
            { x: 90, y: 0 },     // Bottom
          ];
          return (
            <button
              key={label}
              className={`px-2 py-1 rounded ${activeFace === idx ? 'bg-primary text-white' : 'bg-muted'}`}
              onClick={() => {
                setActiveFace(idx);
                setRotation(faceRotations[idx]);
                lastFaceRotation.current = faceRotations[idx];
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
