"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Sparkles, Users } from "lucide-react";

import { shopCategories, type ShopCategoryId, type ShopProduct } from "@/data/shop-catalog";
import { useStore } from "@/lib/store/store-provider";
import { formatPrice, slugToLabel } from "@/lib/storefront";
import { cn } from "@/lib/utils";

type EditableProduct = {
  id?: string;
  category: ShopCategoryId;
  name: string;
  slug: string;
  unit: string;
  price: string;
  compareAtPrice: string;
  image?: string;
  shortDescription: string;
  description: string;
  origin: string;
  inventory: string;
  popularity: string;
  bestSellerScore: string;
  badges: ShopProduct["badges"];
};

const initialForm: EditableProduct = {
  category: "vegetables",
  name: "",
  slug: "",
  unit: "",
  price: "",
  compareAtPrice: "",
  image: "",
  shortDescription: "",
  description: "",
  origin: "",
  inventory: "0",
  popularity: "80",
  bestSellerScore: "80",
  badges: ["Fresh"]
};

export function AdminDashboard() {
  const { isAdmin, products, orders, upsertProduct, deleteProduct, updateOrderStatus } = useStore();
  const [streakEvents, setStreakEvents] = useState<Array<any>>([]);
  const [form, setForm] = useState<EditableProduct>(initialForm);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const metrics = useMemo(
    () => [
      {
        label: "Products",
        value: products.length,
        icon: Package
      },
      {
        label: "Orders",
        value: orders.length,
        icon: ShoppingBag
      },
      {
        label: "Revenue",
        value: formatPrice(orders.reduce((sum, order) => sum + order.total, 0)),
        icon: Sparkles
      },
      {
        label: "Customers",
        value: new Set(orders.map((order) => order.email)).size,
        icon: Users
      }
    ],
    [orders, products.length]
  );

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft">
          <h1 className="font-display text-4xl text-ink">Admin access is required.</h1>
          <p className="mt-4 text-base leading-7 text-ink/68">
            Use the demo admin login to manage catalog products, review orders, and operate the storefront dashboard.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft"
          >
            Open admin login
          </Link>
        </div>
      </section>
    );
  }

  useEffect(() => {
    if (!isAdmin) return;

    let mounted = true;

    (async function fetchStreaks() {
      try {
        const res = await fetch("/api/streak");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setStreakEvents(Array.isArray(data) ? data.reverse() : []);
      } catch (err) {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  function submitProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    upsertProduct({
      id: form.id,
      category: form.category,
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      unit: form.unit,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      image: form.image,
      shortDescription: form.shortDescription,
      description: form.description,
      origin: form.origin,
      inventory: Number(form.inventory),
      popularity: Number(form.popularity),
      bestSellerScore: Number(form.bestSellerScore),
      badges: form.badges
    });

    setForm(initialForm);
    setEditingName(null);
  }

  function loadProduct(product: ShopProduct) {
    try {
      setForm({
      id: product.id,
      category: product.category,
      name: product.name,
      slug: product.slug,
      unit: product.unit,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      image: product.image,
      shortDescription: product.shortDescription,
      description: product.description,
      origin: product.origin,
      inventory: String(product.inventory),
      popularity: String(product.popularity),
      bestSellerScore: String(product.bestSellerScore),
      badges: product.badges
      });

      setEditingName(product.name);
      setEditingId(product.id);
      // developer console hint
      // eslint-disable-next-line no-console
      console.log("Admin: loadProduct called for", product.id, product.name);

      // scroll form into view for clarity
      try {
        const el = document.getElementById("admin-product-form");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      // defensive: log to console for debugging in case setForm throws
      // eslint-disable-next-line no-console
      console.error("Failed to load product for editing", err);
    }
  }

  function toggleBadge(badge: ShopProduct["badges"][number]) {
    setForm((current) => ({
      ...current,
      badges: current.badges.includes(badge)
        ? current.badges.filter((item) => item !== badge)
        : [...current.badges, badge]
    }));
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Admin</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Store operations dashboard</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-ink/66">
        Manage the demo catalog, adjust order status, and keep the storefront looking live and professionally merchandised.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-[1.8rem] bg-white p-6 shadow-soft">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">{label}</p>
            <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
          </article>
        ))}
      </div>

        {editingName ? (
          <div className="fixed right-6 bottom-24 z-50 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            Editing: {editingName}
          </div>
        ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
        <form id="admin-product-form" onSubmit={submitProduct} className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">Product CRUD</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">{form.id ? "Edit product" : "Add product"}</h2>
              {editingName ? (
                <p className="mt-1 text-sm text-ink/60">Editing: <span className="font-semibold">{editingName}</span></p>
              ) : null}
            </div>
            {form.id ? (
              <button
                type="button"
                onClick={() => setForm(initialForm)}
                className="text-sm font-semibold text-ink/58 hover:text-brand-700"
              >
                Reset
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4">
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                  slug: current.id ? current.slug : event.target.value.toLowerCase().replace(/\s+/g, "-")
                }))
              }
              placeholder="Product name"
              className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as ShopCategoryId }))}
                className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
              >
                {shopCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
              <input
                value={form.unit}
                onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}
                placeholder="Unit"
                className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                placeholder="Price"
                className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
                required
              />
              <input
                value={form.compareAtPrice}
                onChange={(event) => setForm((current) => ({ ...current, compareAtPrice: event.target.value }))}
                placeholder="Compare at price"
                className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
              />
            </div>
            <input
              value={form.image}
              onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
              placeholder="Image URL"
              className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
              required
            />
            <input
              value={form.origin}
              onChange={(event) => setForm((current) => ({ ...current, origin: event.target.value }))}
              placeholder="Origin"
              className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
              required
            />
            <input
              value={form.shortDescription}
              onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))}
              placeholder="Short description"
              className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
              required
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Full description"
              className="min-h-28 rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
              required
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                value={form.inventory}
                onChange={(event) => setForm((current) => ({ ...current, inventory: event.target.value }))}
                placeholder="Inventory"
                className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
                required
              />
              <input
                value={form.popularity}
                onChange={(event) => setForm((current) => ({ ...current, popularity: event.target.value }))}
                placeholder="Popularity"
                className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
                required
              />
              <input
                value={form.bestSellerScore}
                onChange={(event) => setForm((current) => ({ ...current, bestSellerScore: event.target.value }))}
                placeholder="Best seller score"
                className="rounded-[1.2rem] border border-brand-100 bg-cream px-4 py-3 text-sm outline-none"
                required
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(["Fresh", "Best Seller", "Discount"] as const).map((badge) => (
                <button
                  key={badge}
                  type="button"
                  onClick={() => toggleBadge(badge)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    form.badges.includes(badge) ? "bg-brand-600 text-white" : "bg-brand-50 text-ink"
                  )}
                >
                  {badge}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft"
            >
              {form.id ? "Update product" : "Create product"}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">Catalog</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Live products</h2>
              </div>
              <p className="text-sm text-ink/58">{products.length} total items</p>
            </div>
            <div className="mt-6 space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  data-product-id={product.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-[1.5rem] bg-cream p-4 sm:flex-row sm:items-center sm:justify-between",
                    editingId === product.id ? "ring-2 ring-brand-600" : ""
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{product.name}</p>
                    <p className="mt-1 text-sm text-ink/62">
                      {slugToLabel(product.category)} | {product.unit} | {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => loadProduct(product)}
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">Orders</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Status management</h2>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-[1.5rem] bg-cream p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">{order.id}</p>
                      <p className="mt-1 text-sm text-ink/62">
                        {order.fullName} | {order.area}, {order.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-ink">{formatPrice(order.total)}</p>
                      <select
                        value={order.status}
                        onChange={(event) => updateOrderStatus(order.id, event.target.value as typeof order.status)}
                        className="rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-semibold text-ink outline-none"
                      >
                        {["Pending", "Confirmed", "Packing", "Out for delivery", "Delivered", "Cancelled"].map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">Streak analytics</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Recent streak events</h2>
              </div>
              <p className="text-sm text-ink/58">{streakEvents.length} events</p>
            </div>

            <div className="mt-6 space-y-3">
              {streakEvents.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-brand-200 bg-brand-50 p-4">
                  <p className="text-sm text-ink/66">No streak events recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {streakEvents.slice(0, 10).map((evt, idx) => (
                    <div key={evt.id ?? idx} className="flex items-center justify-between rounded-[1rem] bg-cream p-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">{evt.payload?.email ?? "n/a"}</p>
                        <p className="mt-1 text-xs text-ink/62">{new Date(evt.receivedAt).toLocaleString()} • streak {evt.payload?.streak?.currentStreak ?? "-"}</p>
                      </div>
                      <div className="text-sm text-ink/58">ID: {String(evt.id).slice(-6)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
