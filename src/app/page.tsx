import Link from "next/link";
import { Button } from "@/features/shared/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold text-center mb-8">
          devcontextai-v2
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          New Next.js Project with Feature-Based Architecture
        </p>
        <Button>Get Started</Button>
      </main>
    </div>
  );
}
