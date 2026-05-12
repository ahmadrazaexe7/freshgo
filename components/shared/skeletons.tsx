export function ProductGridSkeleton() {
  return (
    <div className="container mx-auto px-4 pt-6">
      {/* Skeleton Title & Description */}
      <div className="mb-8 space-y-3">
        <div className="h-9 w-48 animate-pulse rounded-md bg-slate-200" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-slate-100" />
      </div>

      {/* 2-Column Mobile Grid / 4-Column Desktop */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-slate-100 p-3">
            {/* Image Placeholder */}
            <div className="aspect-square w-full animate-pulse rounded-xl bg-slate-200" />
            {/* Title Placeholder */}
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            {/* Price Placeholder */}
            <div className="h-4 w-1/4 animate-pulse rounded bg-slate-100" />
            {/* Button Placeholder */}
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}