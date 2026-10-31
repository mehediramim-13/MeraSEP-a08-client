"use client";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80",
    caption: "Winter blanket drive",
    location: "Kurigram",
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80",
    caption: "Riverbank cleanup",
    location: "Buriganga, Dhaka",
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80",
    caption: "Food pack distribution",
    location: "Zindabazar, Sylhet",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
    caption: "School supplies",
    location: "Bandarban",
  },
  {
    src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=600&q=80",
    caption: "Tree plantation",
    location: "Chandrima Udyan",
  },
  {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    caption: "Health camp",
    location: "Uttara, Dhaka",
  },
  {
    src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80",
    caption: "Flood relief training",
    location: "Kurigram",
  },
  {
    src: "https://images.unsplash.com/photo-1618477462146-050d2767eac4?auto=format&fit=crop&w=600&q=80",
    caption: "Beach cleanup",
    location: "Cox's Bazar",
  },
] as const;

export function Gallery() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="From the field"
          title="Moments that made a difference."
          subtitle="Real photos from real events across Bangladesh."
        />

        <Reveal className="mt-10">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {PHOTOS.map((photo) => (
              <figure
                key={photo.src}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border/70"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={`${photo.caption} in ${photo.location}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = "/logo/merasep-logo.svg";
                  }}
                />
                <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-sm font-semibold text-white">{photo.caption}</span>
                  <span className="text-xs text-white/75">{photo.location}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
