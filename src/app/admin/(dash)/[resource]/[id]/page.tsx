import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/ItemForm";
import { OrderDetail } from "@/components/admin/OrderDetail";
import { getResource } from "@/lib/admin-config";
import { getItem } from "@/lib/db";

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
    resource as Exclude<keyof import("@/types").DatabaseShape, "settings" | "homepage">,
    id,
  );
  if (!item) notFound();

  // Bespoke professional view for shop orders.
  if (config.customView === "order") {
    return <OrderDetail order={item as unknown as import("@/types").ShopOrder} />;
  }

  return <ItemForm config={config} item={item} />;
}
