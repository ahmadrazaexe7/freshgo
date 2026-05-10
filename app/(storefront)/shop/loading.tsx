const SkeletonCard = () => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{
      background: "linear-gradient(160deg,#1A3B23 0%,#122A18 100%)",
      border: "1px solid rgba(255,255,255,0.07)",
      minHeight: 220
    }}
  >
    {/* Image placeholder */}
    <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
      <div className="animate-pulse w-full h-full bg-gradient-to-tr from-[#122A18] to-[#1A3B23]" />
    </div>

    {/* Content placeholder */}
    <div className="px-3 pb-3 pt-2.5 space-y-2">
      <div className="animate-pulse h-3 bg-white/10 rounded w-16" />
      <div className="animate-pulse h-4 bg-white/10 rounded w-3/4" />
      <div className="flex items-center justify-between pt-2">
        <div className="animate-pulse h-4 bg-white/10 rounded w-12" />
        <div className="animate-pulse h-3 bg-white/10 rounded w-8" />
      </div>
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: "#0B1F12" }}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-8">
        {/* Category sections skeleton */}
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <section key={sectionIndex} className="mb-8">
            <div className="animate-pulse h-6 bg-white/10 rounded w-48 mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: sectionIndex === 0 ? 8 : 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
