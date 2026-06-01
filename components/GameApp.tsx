'use client';

import { useGame } from '@/lib/game-context';
import HomeScreen from './HomeScreen';
import SetupScreen from './SetupScreen';
import DrawScreen from './DrawScreen';
import RevealScreen from './RevealScreen';
import RoundResultsScreen from './RoundResultsScreen';
import FinalScreen from './FinalScreen';

export default function GameApp() {
  const { state } = useGame();

  switch (state.phase) {
    case 'home':         return <HomeScreen />;
    case 'setup':        return <SetupScreen />;
    case 'draw':         return <DrawScreen />;
    case 'reveal':       return <RevealScreen />;
    case 'round-results': return <RoundResultsScreen />;
    case 'final':        return <FinalScreen />;
    default:             return <HomeScreen />;
  }
}
