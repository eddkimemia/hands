import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/ItemForm";
import { getResource } from "@/lib/admin-config";
import { getItem } from "@/lib/db";
import type { DatabaseShape } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource, id } = await params;
  const config = getResource(resource);
  if (!config || config.singleton) notFound();

  const item = await getItem<Record<string, unknown>>(
    resource as Exclude<keyof DatabaseShape, "settings" | "homepage">,
    id,
  );
  if (!item) notFound();

  return <ItemForm config={config} item={item} />;
}
