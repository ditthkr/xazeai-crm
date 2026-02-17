import { redirect } from "next/navigation";

/**
 * Root Page component.
 * Middleware should handle redirection, but as a fallback:
 */
export default function Home() {
  // This might not be reached if middleware is working correctly.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
