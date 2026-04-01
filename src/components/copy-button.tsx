"use client";

export function CopyToolButton({ cmd }: { cmd: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(cmd);
      }}
      className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer whitespace-nowrap shrink-0"
    >
      Copy
    </button>
  );
}
