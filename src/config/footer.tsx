import type { ReactElement, SVGProps } from "react";
import { PrimeDiscord } from "@/components/icons/discord";
import { PrimeFacebook } from "@/components/icons/facebook";
import { PrimeInstagram } from "@/components/icons/instagram";
import { PrimeTwitter } from "@/components/icons/x";
import { PrimeYoutube } from "@/components/icons/youtube";

export type FooterLink = {
  label: string;
  href: string;
  icon?: ReactElement<SVGProps<SVGSVGElement>>;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export const footerLinks: FooterSection[] = [
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Patch Notes", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "Discord", href: "#", icon: <PrimeDiscord /> },
      { label: "X", href: "#", icon: <PrimeTwitter /> },
      { label: "Youtube", href: "#", icon: <PrimeYoutube /> },
      { label: "Instagram", href: "#", icon: <PrimeInstagram /> },
      { label: "Facebook", href: "#", icon: <PrimeFacebook /> },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
    ],
  },
];