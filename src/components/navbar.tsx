import { SearchTrigger } from "@/components/search/search-trigger";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/heroes", label: "Heroes" },
  { href: "/tierlist", label: "Tierlist" },
  { href: "/matches", label: "Matches" },
  { href: "/leaderboards", label: "Leaderboards" },
];

export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-4 sticky top-0 left-0 z-50 gap-8 bg-blk-800 min-2xl:grid min-2xl:grid-cols-3 min-2xl:justify-center">
      <div className="md:basis-1/3 flex items-center">
        <Link href="/" className="inline-flex gap-2 py-2 h-10">
          <Image src="/logo.png" alt="logo" width={50} height={50} />
          <h1 className="font-bold text-white ">DEADLOCK TRACKER</h1>
        </Link>
      </div>
      <div className="w-full my-2 rounded md:basis-1/3">
        <SearchTrigger />
      </div>
      <div className="hidden min-md:flex justify-end basis-1/3">
        <div className="flex gap-1">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="py-1.5 px-3.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-end md:hidden">
        <Menu color="white" />
      </div>
    </div>
  );
}
