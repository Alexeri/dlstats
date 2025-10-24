import { redirect } from "next/navigation";

interface HeroPageProps {
  params: { name: string };
}

export default function HeroPage({ params }: HeroPageProps) {
  redirect(`/heroes/${params.name}/build`);
}
