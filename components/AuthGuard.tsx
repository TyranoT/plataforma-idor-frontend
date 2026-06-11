"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

// Defesa em profundidade no cliente. O proxy.ts já barra no servidor via cookie;
// aqui garantimos o redirect mesmo em navegações puramente client-side e quando
// o token expira durante a sessão.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setOk(true);
    } else {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const next = encodeURIComponent(pathname + search);
      router.replace(`/login?next=${next}`);
    }
  }, [pathname, router]);

  if (!ok) {
    return (
      <div className="grid flex-1 place-items-center p-12 text-sm text-zinc-500">
        Verificando sessão…
      </div>
    );
  }
  return <>{children}</>;
}
