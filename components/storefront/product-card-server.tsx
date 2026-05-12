import Image from "next/image";

const T = {
  forest: "#0B1F12",
  forestMid: "#122A18",
  forestLight: "#1A3B23",
  cream: "#F4EFE4",
  creamDim: "#BDB7AC",
  gold: "#C9A84C",
  fonts: { serif: "'Cormorant Garamond', serif", sans: "'Inter', sans-serif" }
};

export default function ProductCardServer({ product, priority = false }: { product: any; priority?: boolean }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl" style={{ background: `linear-gradient(160deg, ${T.forestLight} 0%, ${T.forestMid} 100%)`, border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#122A18] to-[#1A3B23]" />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${T.forest}CC 0%, transparent 50%)` }} />
      </div>

      <div className="px-3 pb-3 pt-2.5">
        <p className="mb-0.5 text-[0.46rem] font-black uppercase tracking-[0.2em]" style={{ color: T.creamDim, fontFamily: T.fonts.sans }}>{product.unit}</p>
        <h3 className="line-clamp-1 leading-tight" style={{ fontFamily: T.fonts.serif, fontWeight: 400, fontSize: "0.88rem", color: T.cream }}>{product.name}</h3>
        <div className="mt-2 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "0.4rem" }}>
          <span style={{ color: T.gold, fontFamily: T.fonts.sans, fontSize: "0.78rem", fontWeight: 600 }}>Rs {Number(product.price).toLocaleString()}</span>
          {product.compareAtPrice && (
            <span style={{ color: T.creamDim, fontFamily: T.fonts.sans, fontSize: "0.65rem", textDecoration: "line-through" }}>Rs {Number(product.compareAtPrice).toLocaleString()}</span>
          )}
        </div>
      </div>
    </article>
  );
}
