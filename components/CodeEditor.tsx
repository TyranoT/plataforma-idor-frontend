"use client";

import dynamic from "next/dynamic";
import { monacoLanguage } from "@/lib/config";
import type { Language } from "@/lib/types";

// Monaco é client-only: carregado via dynamic com ssr:false (permitido só em
// Client Component no Next.js 16).
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm text-zinc-500">
      Carregando editor…
    </div>
  ),
});

export function CodeEditor({
  value,
  language,
  onChange,
}: {
  value: string;
  language: Language;
  onChange: (value: string) => void;
}) {
  return (
    <div className="h-[420px] overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700">
      <MonacoEditor
        height="100%"
        language={monacoLanguage(language)}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          lineNumbers: "on",
          automaticLayout: true,
        }}
      />
    </div>
  );
}
