import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { UploadCloud, PenTool } from "lucide-react";

export function CustomDesignCTA() {
  return (
    <section className="py-14 bg-cream-200">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 items-center gap-10 bg-maroon-950 text-cream-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            <span className="divider-ornament eyebrow text-gold-400">
              Made For You
            </span>
            <h2 className="font-display text-3xl sm:text-4xl mt-3 leading-tight">
              Have Your Own Design?
            </h2>
            <p className="mt-4 text-cream-300/80 max-w-md">
              Sketch it, describe it, or upload a reference image — our
              artisans will turn your idea into a handcrafted piece of gold
              jewellery, with a transparent quotation before we begin.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton
                href="/custom-design"
                variant="secondary"
                icon={<UploadCloud size={16} />}
              >
                Upload Your Design
              </LinkButton>
              <LinkButton
                href="/custom-design"
                variant="outline"
                icon={<PenTool size={16} />}
                className="!border-cream-100/40 !text-cream-100 hover:!bg-cream-100 hover:!text-maroon-900"
              >
                Start From Scratch
              </LinkButton>
            </div>
          </div>
          <div className="relative h-64 lg:h-full min-h-[280px]">
            <Image
              src="https://images.unsplash.com/photo-1777107508716-60847cc18803?auto=format&fit=crop&w=1000&q=80"
              alt="Goldsmith crafting a custom jewellery design"
              fill
              sizes="500px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
