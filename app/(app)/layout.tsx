import { Nav } from "@/components/Nav";
import { AuthGuard } from "@/components/AuthGuard";

// Layout das rotas protegidas: navegação + guarda de sessão no cliente.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <AuthGuard>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
      </AuthGuard>
    </>
  );
}
