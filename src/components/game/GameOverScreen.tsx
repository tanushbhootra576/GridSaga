"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export function GameOverScreen({ score, onRestart }: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-4/5 max-w-sm text-center animate-tile-spawn">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-primary">Game Over</CardTitle>
          <CardDescription>You did a great job!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Your Score:</p>
          <p className="text-5xl font-extrabold text-foreground">{score}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onRestart}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
