"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

// O evento 'storage' dispara quando outra aba altera o localStorage —
// logout em uma aba derruba a sessão nas demais.
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// Defesa em profundidade no cliente. O proxy.ts já barra no servidor via cookie;
// aqui garantimos o redirect mesmo em navegações puramente client-side e quando
// o token expira durante a sessão.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // No servidor (snapshot SSR) sempre false; o cliente reavalia na hidratação.
  const authed = useSyncExternalStore(
    subscribe,
    () => isAuthenticated(),
    () => false,
  );

  useEffect(() => {
    if (authed) return;
    const search = typeof window !== "undefined" ? window.location.search : "";
    const next = encodeURIComponent(pathname + search);
    router.replace(`/login?next=${next}`);
  }, [authed, pathname, router]);

  if (!authed) {
    return (
      <div className="grid flex-1 place-items-center p-12 text-sm text-zinc-500">
        Verificando sessão…
      </div>
    );
  }
  return <>{children}</>;
}
