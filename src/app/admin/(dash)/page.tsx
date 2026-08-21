import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { listItems } from "@/lib/db";
import { formatKes } from "@/lib/utils";
import type {
  DonationIntent,
  Enquiry,
  ShopOrder,
  Stat,
  Story,
  Subscriber,
  VolunteerApp,
} from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [enquiries, volunteers, donations, subscribers, orders, stories] = await Promise.all([
    listItems<Enquiry>("enquiries"),
    listItems<VolunteerApp>("volunteers"),
    listItems<DonationIntent>("donations"),
    listItems<Subscriber>("subscribers"),
    listItems<ShopOrder>("orders"),
    listItems<Story>("stories"),
  ]);
  const stats = await listItems<Stat>("stats");

  const pendingDonations = donations.filter((d) => d.status === "pending");
  const confirmedTotal = donations
    .filter((d) => d.status === "confirmed")
    .reduce((sum, d) => sum + d.amountKes, 0);

  const cards: {
    label: string;
    value: string;
    sub: string;
    icon: IconName;
    href: string;
    accent: string;
  }[] = [
    {
      label: "New enquiries",
      value: String(enquiries.filter((e) => !e.handled).length),
      sub: `${enquiries.length} total received`,
      icon: "inbox",
      href: "/admin/enquiries",
      accent: "bg-gold-100 text-gold-800",
    },
    {
      label: "Volunteer applications",
      value: String(volunteers.filter((v) => v.status === "new").length),
      sub: `${volunteers.length} total`,
      icon: "users",
      href: "/admin/volunteers",
      accent: "bg-leaf-100 text-leaf-800",
    },
    {
      label: "Pending donations",
      value: String(pendingDonations.length),
      sub: `${formatKes(confirmedTotal)} confirmed to date`,
      icon: "gift",
      href: "/admin/donations",
      accent: "bg-royal-50 text-royal-700",
    },
    {
      label: "Newsletter subscribers",
      value: String(subscribers.length),
      sub: `${subscribers.filter((s) => s.confirmed).length} confirmed`,
      icon: "mail",
      href: "/admin/subscribers",
      accent: "bg-navy-100 text-navy-700",
    },
    {
      label: "Shop orders",
      value: String(orders.filter((o) => o.status === "new").length),
      sub: `${orders.length} total orders`,
      icon: "package",
      href: "/admin/orders",
      accent: "bg-gold-100 text-gold-800",
    },
    {
      label: "Published stories",
      value: String(stories.filter((s) => s.published).length),
      sub: `${stories.filter((s) => s.sample).length} still illustrative · ${stats.length} stats tracked`,
      icon: "quote",
      href: "/admin/stories",
      accent: "bg-leaf-100 text-leaf-800",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
        Karibu! Here&apos;s today at a glance.
      </h1>
      <p className="mt-1.5 text-sm text-navy-600">
        Manage everything the public sees — content, community and commerce — backed by PostgreSQL.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card card-hover group p-6">
            <div className="flex items-center justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.accent}`}>
                <Icon name={c.icon} size={20} />
              </span>
              <Icon
                name="arrow-right"
                size={16}
                className="text-navy-300 transition-all group-hover:translate-x-1 group-hover:text-gold-600"
              />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold tabular-nums text-navy-900">
              {c.value}
            </p>
            <p className="mt-1 text-sm font-bold text-navy-800">{c.label}</p>
            <p className="text-xs text-navy-500">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy-900">
            <Icon name="spark" size={18} className="text-gold-600" />
            Getting started checklist
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-navy-700">
            {[
              "Change the admin password in .env",
              "Replace placeholder contact emails in Site Settings",
              "Add real leadership profiles under Team Members",
              "Replace illustrative stories with verified ones",
              "Connect a payment provider when ready (M-Pesa ready)",
            ].map((label) => (
              <li key={label} className="flex items-start gap-2.5">
                <Icon name="check-circle" size={16} className="mt-0.5 shrink-0 text-leaf-600" />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="card bg-navy-950 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold !text-white">
            <Icon name="shield-check" size={18} className="text-gold-300" />
            Integrity reminders
          </h2>
          <ul className="mt-4 space-y-3 text-sm !text-navy-200/85">
            <li>Only publish statistics you can verify.</li>
            <li>Only display partner logos with written permission.</li>
            <li>Only publish beneficiary stories with informed consent.</li>
            <li>Mark donations confirmed only after payment verification.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
