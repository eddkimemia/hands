import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { SingletonForm } from "@/components/admin/SingletonForm";
import { getResource } from "@/lib/admin-config";
import { getSingleton } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  const config = getResource(resource);
  if (!config || resource === "login") notFound();

  if (config.singleton) {
    const data = await getSingleton<Record<string, unknown>>(
      resource as "settings" | "homepage",
    );
    return <SingletonForm config={config} item={data ?? {}} />;
  }

  return <ResourceManager config={config} />;
}
