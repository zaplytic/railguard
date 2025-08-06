import NavBar, { clsx } from "@/components/NavBar";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div
        className={clsx(
          "flex flex-col flex-1 items-center justify-center space-y-2",
        )}
      >
        <main className="flex justify-center">
          <h1 className="text-4xl">@railguard/web app</h1>
        </main>
        <p>
          Start from <code>src/App.tsx</code> to get started!
        </p>
      </div>
    </div>
  );
}
