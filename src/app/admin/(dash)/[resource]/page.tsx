import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { getResource } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export default async function AdminResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  const config = getResource(resource);
  if (!config || resource === "login") notFound();
  return <ResourceManager config={config} />;
}
