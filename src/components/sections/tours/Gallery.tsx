"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { Locale, TourDetail } from "@/lib/supabase/tours";

const CONTENT = {
  en: {
    title: "Picture yourself on this journey",
    open: "Enlarge photo",
    close: "Close gallery",
    previous: "Previous photo",
    next: "Next photo",
    viewer: "Tour photos",
  },
  fr: {
    title: "Imaginez-vous au cœur du voyage",
    open: "Agrandir la photo",
    close: "Fermer la galerie",
    previous: "Photo précédente",
    next: "Photo suivante",
    viewer: "Photos du circuit",
  },
  es: {
    title: "Imagínate en este viaje",
    open: "Ampliar la foto",
    close: "Cerrar la galería",
    previous: "Foto anterior",
    next: "Foto siguiente",
    viewer: "Fotos del circuito",
  },
} satisfies Record<
  Locale,
  {
    title: string;
    open: string;
    close: string;
    previous: string;
    next: string;
    viewer: string;
  }
>;

type GalleryProps = {
  tour: TourDetail;
  locale: Locale;
};

export default function Gallery({ tour, locale }: GalleryProps) {
  const t = CONTENT[locale];
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const images = [
    { src: tour.imageUrl1, alt: tour.imageAlt1 || tour.title },
    { src: tour.imageUrl2, alt: tour.imageAlt2 || tour.title },
    { src: tour.imageUrl3, alt: tour.imageAlt3 || tour.title },
  ].filter((image): image is { src: string; alt: string } =>
    Boolean(image.src?.trim()),
  );

  const activeImage =
    activeIndex === null ? null : (images[activeIndex] ?? null);
  const isOpen = activeImage !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function changeImage(direction: number) {
    if (images.length < 2) return;

    setActiveIndex((current) =>
      current === null
        ? null
        : (current + direction + images.length) % images.length,
    );
  }

  if (!images.length) return null;

  const threeImages = images.length === 3;

  return (
    <section
      className="my-4 w-full px-4 sm:px-6 lg:px-8"
      aria-labelledby={`${id}-heading`}
    >
      <h2
        id={`${id}-heading`}
        className="mb-6 text-3xl font-semibold text-primary/90 sm:text-4xl"
      >
        {t.title}
      </h2>

      <div
        className={`grid gap-3 sm:gap-4 ${
          threeImages
            ? "grid-cols-2 md:h-[440px] md:grid-cols-3 md:grid-rows-2"
            : images.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1"
        }`}
      >
        {images.map((image, index) => (
          <button
            key={`tour-image-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`${t.open} ${index + 1}: ${image.alt}`}
            aria-haspopup="dialog"
            aria-controls={`${id}-dialog`}
            className={`group relative min-h-0 min-w-0 cursor-zoom-in overflow-hidden rounded-xl bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
              threeImages
                ? index === 0
                  ? "col-span-2 aspect-[16/10] md:row-span-2 md:aspect-auto"
                  : "aspect-[4/3] md:aspect-auto"
                : images.length === 1
                  ? "aspect-[16/9] lg:aspect-[21/9]"
                  : "aspect-[4/3]"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={
                images.length === 1
                  ? "100vw"
                  : threeImages
                    ? index === 0
                      ? "(min-width: 768px) 66vw, 100vw"
                      : "(min-width: 768px) 33vw, 50vw"
                    : "(min-width: 640px) 50vw, 100vw"
              }
              className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/50 text-white"
            >
              <Maximize2 className="size-4" />
            </span>
          </button>
        ))}
      </div>

      {/* PHOTO EN PLEIN ÉCRAN */}
      <dialog
        ref={dialogRef}
        id={`${id}-dialog`}
        aria-label={t.viewer}
        onCancel={(event) => {
          event.preventDefault();
          setActiveIndex(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            changeImage(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            changeImage(-1);
          }
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-black/95 p-0 text-white backdrop:bg-black/80"
      >
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="text-sm text-white/75">{t.viewer}</p>

            <button
              type="button"
              aria-label={t.close}
              onClick={() => setActiveIndex(null)}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 px-3 sm:px-16">
            <div className="relative h-full w-full">
              {activeImage && (
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  sizes="100vw"
                  loading="eager"
                  className="object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center gap-5 px-4 py-3">
            {images.length > 1 && (
              <button
                type="button"
                aria-label={t.previous}
                onClick={() => changeImage(-1)}
                className="flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
            )}

            <p
              role="status"
              className="min-w-12 text-center text-sm tabular-nums text-white/80"
            >
              {activeIndex === null ? 0 : activeIndex + 1} / {images.length}
            </p>

            {images.length > 1 && (
              <button
                type="button"
                aria-label={t.next}
                onClick={() => changeImage(1)}
                className="flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            )}
          </div>
        </div>
      </dialog>
    </section>
  );
}
