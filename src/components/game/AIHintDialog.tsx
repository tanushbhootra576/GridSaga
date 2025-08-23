"use client"

import { useState, useEffect } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAdaptedPuzzle, getHintsLeft } from '@/actions/puzzle';
import type { Tile } from '@/types';
import type { AdaptPuzzleOutput } from '@/ai/flows/puzzle-adaptation';
import { useToast } from '@/hooks/use-toast';

interface AIHintDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tiles: Tile[];
  gridSize: number;
  score: number;
}

export function AIHintDialog({ isOpen, setIsOpen, tiles, gridSize, score }: AIHintDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AdaptPuzzleOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hintsLeft, setHintsLeft] = useState<number | null>(null);
  const { toast } = useToast();

  const handleFetchHint = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const response = await getAdaptedPuzzle(tiles, gridSize, score);
    
    if (response.success && response.data) {
      setResult(response.data);
      setHintsLeft(response.hintsLeft);
    } else {
      setError(response.error || 'An unknown error occurred.');
      setHintsLeft(response.hintsLeft);
      if (response.error?.includes('limit')) {
        toast({
          title: "AI Hint Limit Reached",
          description: "The daily global hint limit has been reached. Please try again tomorrow.",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  };
  
  const handleFetchHintsLeft = async () => {
    const hints = await getHintsLeft();
    setHintsLeft(hints);
  }

  useEffect(() => {
    if (isOpen) {
      handleFetchHint();
    } else {
      // Fetch the count when dialog is closed to show on next open
      handleFetchHintsLeft();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="text-primary" />
            AI-Powered Hint
          </DialogTitle>
          <DialogDescription>
            {hintsLeft !== null ? (
                `There are ${hintsLeft} hints left for everyone today.`
            ) : (
                `Here's a little help from our AI to guide your next move.`
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div className="space-y-4">
              <Alert>
                <AlertTitle className="font-bold">Hint</AlertTitle>
                <AlertDescription>{result.hint}</AlertDescription>
              </Alert>
              <Alert>
                <AlertTitle className="font-bold">Suggested Variation</AlertTitle>
                <AlertDescription>{result.suggestedVariation}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
