import { shopCategories } from "@/components/data/shop-catalog";
import ProductCardServer from "./product-card-server";

type Props = { products: any[]; initialQuery?: string; initialCategory?: string };

export default function ShopCatalogServer({ products, initialQuery = "", initialCategory }: Props) {
  const query = (initialQuery || "").trim().toLowerCase();

  const sections = shopCategories.map((c) => ({ ...c, products: products.filter((p) => p.category === c.id) }));

  const filteredSections = query
    ? sections
        .map((s) => ({
          ...s,
          products: s.products.filter(
            (p) => p.name.toLowerCase().includes(query) || p.shortDescription.toLowerCase().includes(query)
          )
        }))
        .filter((s) => s.products.length > 0)
    : sections;

  const visibleSections = filteredSections.filter((section) => section.products.length > 0);
  let priorityCount = 0;

  return (
    <div className="min-h-screen" style={{ background: "#0B1F12" }}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-6">
        <div className="mb-6 rounded-full border border-white/10 bg-[#0B1F12]/95 px-3 py-3 shadow-sm backdrop-blur-sm sticky top-4 z-30">
          <div className="flex gap-2 overflow-x-auto pb-1 text-sm sm:text-base">
            {visibleSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex min-w-[9rem] items-center justify-center whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        {visibleSections.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-white/80">
            No products match your search. Try a different keyword or category.
          </div>
        ) : (
          visibleSections.map((section) => (
            <section key={section.id} id={section.id} className="mb-10 scroll-mt-28">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-serif font-semibold text-white">{section.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{section.products.length} items available</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {section.products.map((p: any) => {
                  const isPriority = priorityCount < 6;
                  priorityCount++;
                  return <ProductCardServer key={p.id} product={p} priority={isPriority} />;
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
