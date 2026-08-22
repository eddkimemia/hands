import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/ItemForm";
import { getResource } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export default async function NewResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  const config = getResource(resource);
  if (!config || config.singleton || config.hideCreate) notFound();
  return <ItemForm config={config} item={null} />;
}
