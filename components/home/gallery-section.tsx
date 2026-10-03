import { ArrowUpRight  } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Image from "next/image";

const gallery = [
  {
    src: "/images/gallery/gallery-01.jpg",
    alt: "Coupe réalisée chez THE LORD Hair Salon",
  },
  {
    src: "/images/gallery/gallery-02.jpg",
    alt: "Coiffure réalisée chez THE LORD Hair Salon",
  },
  {
    src: "/images/gallery/gallery-03.jpg",
    alt: "Travail de précision chez THE LORD Hair Salon",
  },
  {
    src: "/images/gallery/gallery-04.jpg",
    alt: "Style réalisé chez THE LORD Hair Salon",
  },
  {
    src: "/images/gallery/gallery-05.jpg",
    alt: "Réalisation THE LORD Hair Salon",
  },
];

function GalleryImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        bg-surface
        ${className}
      `}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="
          object-cover
          transition-transform
          duration-700
          ease-out
          group-hover:scale-[1.04]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-black/45
          via-transparent
          to-transparent
          opacity-70
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

      <div
        className="
          absolute
          bottom-4
          right-4

          flex
          size-10
          translate-y-2
          items-center
          justify-center

          rounded-full
          bg-brand
          text-black

          opacity-0
          transition-all
          duration-300

          group-hover:translate-y-0
          group-hover:opacity-100
        "
      >
        <ArrowUpRight className="size-4" />
      </div>
    </div>
  );
}

export function GallerySection() {
  return (
    <section
      id="gallery"
      className="
        overflow-hidden
        border-t
        border-white/5
        bg-background-soft
        py-20
        sm:py-24
        lg:py-32
      "
    >
      <div
        className="
          mx-auto
          max-w-[var(--page-max-width)]
          px-5
          sm:px-8
          lg:px-10
        "
      >
        {/* Header */}
        <div
          className="
            mb-10
            flex
            flex-col
            gap-7

            sm:mb-12

            lg:mb-16
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-brand" />

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.35em]
                  text-brand
                "
              >
                Notre travail
              </p>
            </div>

            <h2
              className="
                mt-5
                font-serif
                text-4xl
                font-semibold
                uppercase
                leading-[0.92]
                tracking-[-0.04em]
                text-white

                sm:text-5xl
                lg:text-6xl
                xl:text-7xl
              "
            >
              Le style parle
              <span className="block text-brand">
                de lui-même.
              </span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-base leading-7 text-white/50">
              Découvrez quelques réalisations et trouvez
              l&apos;inspiration pour votre prochaine coupe.
            </p>

            <a
              href="#"
              className="
                group
                mt-5
                inline-flex
                items-center
                gap-2

                text-xs
                font-semibold
                uppercase
                tracking-[0.15em]
                text-white

                transition-colors
                hover:text-brand
              "
            >
              <FaInstagram className="size-4 text-brand" />

              Suivre sur Instagram

              <ArrowUpRight
                className="
                  size-4
                  transition-transform
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </a>
          </div>
        </div>

        {/* MOBILE */}
        <div className="grid gap-3 md:hidden">
          {gallery.map((image, index) => (
            <GalleryImage
              key={image.src}
              {...image}
              className={
                index === 0
                  ? "aspect-[4/5]"
                  : "aspect-[4/3]"
              }
            />
          ))}
        </div>

        {/* TABLET / DESKTOP */}
        <div
          className="
            hidden
            grid-cols-12
            grid-rows-2
            gap-3
            md:grid
            md:h-[720px]
            lg:h-[800px]
          "
        >
          <GalleryImage
            {...gallery[0]}
            className="col-span-7 row-span-2"
          />

          <GalleryImage
            {...gallery[1]}
            className="col-span-5"
          />

          <GalleryImage
            {...gallery[2]}
            className="col-span-5"
          />
        </div>

        {/* Secondary row */}
        <div
          className="
            mt-3
            hidden
            grid-cols-2
            gap-3
            md:grid
          "
        >
          <GalleryImage
            {...gallery[3]}
            className="aspect-[16/8]"
          />

          <GalleryImage
            {...gallery[4]}
            className="aspect-[16/8]"
          />
        </div>
      </div>
    </section>
  );
}