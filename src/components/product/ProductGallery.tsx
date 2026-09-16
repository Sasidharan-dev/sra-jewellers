"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square bg-cream-300 overflow-hidden">
        <Image
          src={images[active]}
          alt={`${name} — view ${active + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover"
        />
      </div>
      <div className="flex gap-2.5">
        {images.map((img, i) => (
          <button
            key={img + i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1} of ${images.length}`}
            aria-current={active === i}
            className={cn(
              "relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden border",
              active === i ? "border-gold-500" : "border-ink-300/30"
            )}
          >
            <Image src={img} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
