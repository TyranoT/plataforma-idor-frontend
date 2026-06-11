import { severityStyle } from "@/lib/config";
import type { Severity } from "@/lib/types";

export function SeverityBadge({
  severity,
  className = "",
}: {
  severity: Severity | null;
  className?: string;
}) {
  const style = severityStyle(severity);
  const label = severity ? style.label : "Sem achados";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.badge} ${className}`}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: style.dot }}
        aria-hidden
      />
      {label}
    </span>
  );
}
