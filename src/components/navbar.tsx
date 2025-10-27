"use client";
import { SearchTrigger } from "@/components/search/search-trigger";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/heroes", label: "Heroes" },
  { href: "/tierlist", label: "Tierlist" },
  { href: "/matches", label: "Matches" },
  { href: "/leaderboards", label: "Leaderboards" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeLink = links.find((link) => pathname.startsWith(link.href));

  return (
    <div className="flex items-center justify-between px-4 sticky top-0 left-0 z-50 gap-8 bg-blk-800 min-2xl:grid min-2xl:grid-cols-3 min-2xl:justify-center h-[50px]">
      <div className="md:basis-1/3 flex items-center">
        <Link href="/" className="inline-flex items-center gap-2 py-2 h-10">
          <Image src="/logo.png" alt="logo" width={50} height={50} />
          <h1 className="font-bold text-white">DEADLOCK TRACKER</h1>
        </Link>
      </div>
      <div className="hidden lg:block w-full my-2 rounded md:basis-1/3">
        {!isHome && <SearchTrigger />}
      </div>
      <div className="hidden lg:flex justify-end basis-1/3">
        <div className="flex gap-1">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className={cn("py-1.5 px-3.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors",
                activeLink?.href === link.href && "bg-brand/15 rounded text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-end lg:hidden">
        <Menu color="white" />
      </div>
    </div>
  );
}
