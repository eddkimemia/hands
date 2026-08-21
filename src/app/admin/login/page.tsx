import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-50/60 px-4 py-16">
      <Link href="/" className="mb-8 flex flex-col items-center gap-3">
        <Image src="/logo/hopelogo.png" alt="Hands of Hope Foundation" width={112} height={63} className="h-16 w-auto" />
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold-700">
          Content Management
        </span>
      </Link>
      <LoginForm />
    </div>
  );
}
