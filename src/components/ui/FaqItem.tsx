import { Minus, Plus } from "lucide-react";

type FaqItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

export default function FaqItem({
  question,
  answer,
  isOpen,
  onClick,
}: FaqItemProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card ">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 px-6 py-4 text-left transition hover:bg-muted/60"
      >
        <span
          className={`
            flex size-9 shrink-0 items-center justify-center rounded-full
            border transition-all duration-300
            ${
              isOpen
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary bg-transparent text-primary"
            }
          `}
          aria-hidden="true"
        >
          {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </span>
        <span className="text-base font-semibold leading-6 text-heading sm:text-lg">
          {question}
        </span>
      </button>

      {/* ANSWER */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-6 pb-6 pl-[52px]">
            <p className="text-sm leading-7 text-text-secondary sm:text-base">
              {answer}
            </p>
          </div>
        </div>
      </div>

      {/* SEO FALLBACK */}
      <noscript>
        <div className="px-6 py-0 text-sm text-text-secondary">{answer}</div>
      </noscript>
    </div>
  );
}
