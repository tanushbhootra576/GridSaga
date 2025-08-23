"use client";

import { useState } from "react";
import { Lightbulb, RefreshCw, Trophy } from "lucide-react";
import { useGameState } from "@/hooks/use-game-state";
import { GameBoard } from "@/components/game/GameBoard";
import { GameOverScreen } from "@/components/game/GameOverScreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIHintDialog } from "@/components/game/AIHintDialog";

export default function Home() {
  const {
    level,
    score,
    highScore,
    gridSize,
    faces,
    activeFace,
    setActiveFace,
    isGameOver,
    startGame,
    handleMove,
    ready,
  } = useGameState();

  const [isAIHintOpen, setAIHintOpen] = useState(false);

  const handleGridSizeChange = (value: string) => {
    startGame(Number(value));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 font-headline">
      <main className="w-full max-w-xl mx-auto flex flex-col">
        <header className="flex items-center justify-between mb-4 flex-wrap">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4 sm:mb-0">
           Grid Saga
          </h1>
          <div className="flex items-center space-x-2">
            <Card className="text-center p-2">
              <CardHeader className="p-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">Level</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                <p className="text-2xl font-bold">{level}</p>
              </CardContent>
            </Card>
            <Card className="text-center p-2">
              <CardHeader className="p-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">Score</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                <p className="text-2xl font-bold">{score}</p>
              </CardContent>
            </Card>
            <Card className="text-center p-2">
              <CardHeader className="p-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">Best</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                <p className="text-2xl font-bold">{highScore}</p>
              </CardContent>
            </Card>
          </div>
        </header>

        <section className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button onClick={() => startGame(gridSize)}>
              <RefreshCw />
              New Game
            </Button>
            <Button variant="outline" onClick={() => setAIHintOpen(true)}>
              <Lightbulb />
              AI Hint
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Grid:</span>
            <Select
              value={String(gridSize)}
              onValueChange={handleGridSizeChange}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4x4</SelectItem>
                <SelectItem value="5">5x5</SelectItem>
                <SelectItem value="6">6x6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="relative w-full aspect-square">
          {!ready ? (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-lg text-muted-foreground">Loading…</span>
            </div>
          ) : (
            <>
              {isGameOver && <GameOverScreen score={score} onRestart={() => startGame(gridSize)} />}
              <GameBoard
                faces={faces}
                activeFace={activeFace}
                setActiveFace={setActiveFace}
                gridSize={gridSize}
                onMove={handleMove}
              />
            </>
          )}
        </section>
        
        <footer className="text-center mt-8 text-muted-foreground text-sm">
          <p>
            Join tiles to get to the <strong>2048 tile!</strong>
          </p>
          <p>Use your arrow keys or swipe to play. Try merging tiles of the same number!</p>
        </footer>
      </main>
      <AIHintDialog
        isOpen={isAIHintOpen}
        setIsOpen={setAIHintOpen}
        tiles={faces[activeFace]}
        gridSize={gridSize}
        score={score}
      />
    </div>
  );
}
