"use client";

import Link from "next/link";

import { useStore } from "@/lib/store/store-provider";
import { formatPrice } from "@/lib/storefront";
import { cn } from "@/lib/utils";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Packing: "bg-blue-100 text-blue-800",
  "Out for delivery": "bg-violet-100 text-violet-800",
  Delivered: "bg-brand-100 text-brand-800",
  Cancelled: "bg-rose-100 text-rose-800"
};

export function OrdersPageClient() {
  const { orders, user, reorderOrder, isAdmin } = useStore();
  const visibleOrders = isAdmin
    ? orders
    : user
      ? orders.filter((order) => order.email.toLowerCase() === user.email.toLowerCase())
      : [];

  if (!user) {
    return (
      <div className="py-6">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft text-center">
          <h1 className="font-display text-4xl text-ink">Log in to view your orders.</h1>
          <p className="mt-4 text-base leading-7 text-ink/68">
            Use the demo customer account to see order history or the admin account to manage all store orders.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 py-2">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
          {isAdmin ? "Admin orders" : "My orders"}
        </p>
        <h1 className="font-display text-4xl text-ink">
          {isAdmin ? "Manage the live order queue" : "Track your recent deliveries"}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-ink/66">
          {isAdmin
            ? "Review status changes, customer details, and the current delivery pipeline."
            : "See order progress, saved delivery details, and reorder your usual household basket."}
        </p>
      </div>

      <div className="space-y-5 pt-2">
        {visibleOrders.map((order) => (
          <article key={order.id} className="rounded-[2rem] bg-white p-5 shadow-soft sm:p-6">
            <div className="flex flex-col gap-4 border-b border-brand-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-lg font-semibold text-ink">{order.id}</p>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusStyles[order.status])}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink/64">
                  {new Date(order.createdAt).toLocaleString()} | {order.area}, {order.city}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-ink/58">Total</p>
                <p className="text-2xl font-bold text-ink">{formatPrice(order.total)}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.productId}`}
                      className="flex items-center justify-between rounded-[1.3rem] bg-cream px-4 py-3 text-sm"
                    >
                      <span className="font-medium text-ink">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-ink/68">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.6rem] bg-brand-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">Delivery details</p>
                <div className="mt-3 space-y-2 text-sm text-ink/68">
                  <p>{order.fullName}</p>
                  <p>{order.phone}</p>
                  <p>{order.addressLine}</p>
                  {order.notes ? <p>Note: {order.notes}</p> : null}
                </div>

                {!isAdmin ? (
                  <button
                    type="button"
                    onClick={() => reorderOrder(order.id)}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Reorder these items
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
