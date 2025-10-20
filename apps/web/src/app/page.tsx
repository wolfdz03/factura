import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/simple-auth";

export default async function Home() {
  const session = await getServerSession();
  
  if (session.isAuthenticated) {
    redirect("/invoices");
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/official/logoentry.svg"
          alt="Facturation - Suzali Logo"
          width={200}
          height={80}
          priority
          className="mb-4"
        />
        <h1 className="instrument-serif text-emerald-700 text-4xl font-normal tracking-tight text-foreground sm:text-6xl">
          Facturation - Suzali
        </h1>
        <Button 
          size="lg" 
          className="px-8 py-3 bg-[#003f3a] hover:bg-[#003d33] text-white border-0"
          asChild
        >
          <Link href="/login">
            Commencer
          </Link>
        </Button>
      </div>
    </main>
  );
}
