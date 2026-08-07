"use client";

export default function ErrorPage({
  reset,
}: {
  reset: () => void;
}): React.JSX.Element {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-heading">
          Something went wrong
        </h1>

        <p className="mt-4 text-text-secondary">
          An unexpected error occurred. Please try again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
