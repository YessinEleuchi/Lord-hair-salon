import { ServiceListItem } from "@/components/services/service-list-item";
import type {
  ServiceCategoryItem,
  ServiceItem,
} from "@/features/services/queries";

type ServicesCatalogProps = {
  services: ServiceItem[];
  categories: ServiceCategoryItem[];
};

export function ServicesCatalog({
  services,
  categories,
}: ServicesCatalogProps) {
  return (
    <div className="space-y-20">
      {categories.map((category) => {
        const categoryServices =
          services.filter(
            (service) =>
              service.category?.id === category.id,
          );

        if (categoryServices.length === 0) {
          return null;
        }

        return (
          <section
            key={category.id}
            id={category.slug}
            className="scroll-mt-32"
          >
            {/* CATEGORY HEADER */}
            <div
              className="
                mb-8
                flex
                items-end
                justify-between
                gap-5
              "
            >
              <div>
                <p
                  className="
                    font-mono
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-brand
                  "
                >
                  Catégorie
                </p>

                <h2
                  className="
                    mt-3
                    text-3xl
                    font-semibold
                    uppercase
                    tracking-[-0.04em]
                    text-white

                    sm:text-4xl
                    lg:text-5xl
                  "
                >
                  {category.name}
                </h2>
              </div>

              <span
                className="
                  hidden
                  font-mono
                  text-xs
                  uppercase
                  tracking-[0.15em]
                  text-white/25

                  sm:block
                "
              >
                {categoryServices.length}{" "}
                {categoryServices.length > 1
                  ? "prestations"
                  : "prestation"}
              </span>
            </div>

            {/* SERVICES */}
            <div className="border-b border-white/10">
              {categoryServices.map(
                (service, index) => (
                  <ServiceListItem
                    key={service.id}
                    service={service}
                    index={index}
                  />
                ),
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}