import { LaudoView } from "@/components/LaudoView";

// Next.js 16: params é uma Promise e precisa ser aguardada.
export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LaudoView id={Number(id)} />;
}
