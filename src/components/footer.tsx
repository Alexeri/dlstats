import { footerLinks } from "@/config/footer";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-blk-900 pt-20 pb-20">
      <div className="max-w-7xl mx-auto  px-4 xl:px-0">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          <div className="flex flex-col ">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 py-2 h-10"
              >
                <Image src="/logo.png" alt="logo" width={50} height={50} />
                <h3 className="font-bold text-lg">DEADLOCK TRACKER</h3>
              </Link>
            </div>
            <span className="text-sm text-gray-400">
              Your source for Deadlock stats, builds, and meta insights.
            </span>
          </div>
          <div className="flex flex-1 justify-end w-full">
            <div className="grid grid-cols-3 gap-12 text-sm text-gray-300">
              {footerLinks.map((section) => (
                <div key={section.title} className="space-y-2 min-w-[120px]">
                  <h4 className="font-semibold text-white mb-2">
                    {section.title}
                  </h4>
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {link.icon && (
                        <span className="transition-colors group-hover:text-white">
                          {React.cloneElement(link.icon, {
                            className: "size-4",
                          })}
                        </span>
                      )}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-blk-600 mt-12 pt-4">
          <span className="text-sm text-gray-400">
            © Deadlock Tracker. 2025. Not affiliated with Valve Corp.
          </span>
        </div>
      </div>
    </footer>
  );
}
