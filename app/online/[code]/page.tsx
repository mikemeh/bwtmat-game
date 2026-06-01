import { OnlineProvider } from '@/lib/online-context';
import OnlineGameApp from '@/components/online/OnlineGameApp';

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <OnlineProvider code={code.toUpperCase()}>
      <main className="max-w-lg mx-auto min-h-screen">
        <OnlineGameApp />
      </main>
    </OnlineProvider>
  );
}
