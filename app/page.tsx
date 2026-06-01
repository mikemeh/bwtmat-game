import { GameProvider } from '@/lib/game-context';
import GameApp from '@/components/GameApp';

export default function Page() {
  return (
    <GameProvider>
      <main className="max-w-lg mx-auto min-h-screen">
        <GameApp />
      </main>
    </GameProvider>
  );
}
