import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
        FreshGo
      </span>
      <h1 className="mt-6 font-display text-4xl text-ink sm:text-5xl">Page not found.</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-ink/68">
        The page you were looking for is not available right now. You can return to the storefront
        and continue shopping from the main catalog.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
      >
        Back to shop
      </Link>
    </div>
  );
}
