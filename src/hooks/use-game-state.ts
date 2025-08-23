
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Tile } from '@/types';
import {
  generateInitialTiles,
  addRandomTile,
  moveTiles,
  checkGameOver,
} from '@/lib/game-utils';

let tileIdCounter = 0;
const FACE_COUNT = 6;


export function useGameState() {
  // Initialize all state synchronously for SSR/CSR match
  const [gridSize, setGridSize] = useState(4);
  // Hydration-safe: empty faces, fill after mount
  const [faces, setFaces] = useState<Tile[][]>(() => Array(FACE_COUNT).fill(null).map(() => []));
  const [ready, setReady] = useState(false);
  const [activeFace, setActiveFace] = useState(0); // 0-5
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Only update highScore from localStorage after mount (client only)
  useEffect(() => {
    const savedHighScore = localStorage.getItem('mergeManiaHighScore');
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
    // Only generate initial tiles on client
    startGame(4);
    setReady(true);
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('mergeManiaHighScore', String(score));
    }
    const newLevel = Math.floor(score / 2048) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  }, [score, highScore, level]);

  const startGame = useCallback((size: number) => {
    tileIdCounter = 0;
    setGridSize(size);
    setScore(0);
    setLevel(1);
    setIsGameOver(false);
    // Each face gets its own initial tiles
    setFaces(Array(FACE_COUNT).fill(null).map(() => generateInitialTiles(size, () => tileIdCounter++)));
    setActiveFace(0);
  }, []);

  const handleMove = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (isGameOver) return;
      setFaces((prevFaces) => {
        const faceTiles = prevFaces[activeFace];
        const { newTiles, moved, scoreIncrease } = moveTiles(direction, faceTiles, gridSize, () => tileIdCounter++);
        if (!moved) return prevFaces;
        setScore((prevScore) => prevScore + scoreIncrease);
        setTimeout(() => {
          const tilesWithoutFlags = newTiles.map(t => ({...t, isNew: false, isMerged: false}));
          const finalTiles = addRandomTile(tilesWithoutFlags, gridSize, () => tileIdCounter++);
          setFaces((faces2) => {
            const newFaces = faces2.slice();
            newFaces[activeFace] = finalTiles;
            if (checkGameOver(finalTiles, gridSize)) {
              setIsGameOver(true);
            }
            return newFaces;
          });
        }, 100);
        // Set intermediate state for animation
        const newFaces = prevFaces.slice();
        newFaces[activeFace] = newTiles;
        return newFaces;
      });
    },
    [activeFace, gridSize, isGameOver]
  );

  return {
    gridSize,
    faces,
    activeFace,
    setActiveFace,
    score,
    highScore,
    level,
    isGameOver,
    startGame,
    handleMove,
    ready,
  };
}

export default useGameState;
