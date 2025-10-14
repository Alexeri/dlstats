import { cn } from "@/lib/utils";
import Image from "next/image";

interface BorderedImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  letter?: string | number;
  letterClassName?: string;
  sizes?: string;
}

export default function BorderedImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  letter,
  letterClassName = "",
  sizes = "(max-width: 768px) 64px, 96px",
}: BorderedImageProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 border border-blk-400 rounded bg-blk-800",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
      />
      {letter && (
        <div
          className={cn(
            "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-blk-600 text-sm flex items-center justify-center size-4 rounded-sm font-bold",
            letterClassName
          )}
        >
          {letter}
        </div>
      )}
    </div>
  );
}
