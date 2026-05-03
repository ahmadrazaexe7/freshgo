"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { shopProducts, type ShopCategoryId, type ShopProduct } from "@/data/shop-catalog";
import { getDeliveryFee } from "@/lib/storefront";

type UserRole = "ADMIN" | "CUSTOMER";
type OrderStatus = "Pending" | "Confirmed" | "Packing" | "Out for delivery" | "Delivered" | "Cancelled";

export type SessionUser = {
  name: string;
  email: string;
  role: UserRole;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type StoreOrderItem = {
  productId: string;
  slug: string;
  name: string;
  unit: string;
  image: string;
  price: number;
  quantity: number;
};

export type StoreOrder = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  addressLine: string;
  notes: string;
  paymentMethod: "COD";
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: StoreOrderItem[];
};

type CheckoutInput = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  addressLine: string;
  notes: string;
};

type ProductInput = {
  id?: string;
  category: ShopCategoryId;
  name: string;
  slug: string;
  unit: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  shortDescription: string;
  description: string;
  origin: string;
  inventory: number;
  popularity: number;
  bestSellerScore: number;
  badges: ShopProduct["badges"];
};

type StoreContextValue = {
  products: ShopProduct[];
  cart: CartItem[];
  wishlist: string[];
  orders: StoreOrder[];
  user: SessionUser | null;
  lastAction: string | null;
  cartCount: number;
  wishlistCount: number;
  isAdmin: boolean;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (input: CheckoutInput) => StoreOrder | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  reorderOrder: (orderId: string) => void;
  upsertProduct: (input: ProductInput) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
};

type PersistedState = {
  products: ShopProduct[];
  cart: CartItem[];
  wishlist: string[];
  orders: StoreOrder[];
  user: SessionUser | null;
  lastAction?: string | null;
};

const demoUsers = [
  {
    email: "admin@freshhomemart.pk",
    password: "Admin@12345",
    name: "FreshGo Admin",
    role: "ADMIN" as const
  },
  // Additional demo admin credential (numeric id login)
  {
    email: "54471",
    password: "Rajput@9981",
    name: "Admin 54471",
    role: "ADMIN" as const
  },
  {
    email: "customer@freshhomemart.pk",
    password: "Customer@12345",
    name: "Sana Ahmed",
    role: "CUSTOMER" as const
  }
];

const storageKey = "fresh-home-mart-demo-store-v1";

function buildDemoOrders(): StoreOrder[] {
  const [spinach, rice, kinnow, eggs] = shopProducts;

  return [
    {
      id: "FHM-24028",
      createdAt: "2026-04-27T10:25:00.000Z",
      status: "Out for delivery",
      fullName: "Sana Ahmed",
      email: "customer@freshhomemart.pk",
      phone: "+92 333 8822111",
      city: "Islamabad",
      area: "F-11",
      addressLine: "Street 12, House 44",
      notes: "Please call at the gate.",
      paymentMethod: "COD",
      subtotal: spinach.price * 2 + rice.price,
      deliveryFee: 220,
      total: spinach.price * 2 + rice.price + 220,
      items: [
        {
          productId: spinach.id,
          slug: spinach.slug,
          name: spinach.name,
          unit: spinach.unit,
          image: spinach.image,
          price: spinach.price,
          quantity: 2
        },
        {
          productId: rice.id,
          slug: rice.slug,
          name: rice.name,
          unit: rice.unit,
          image: rice.image,
          price: rice.price,
          quantity: 1
        }
      ]
    },
    {
      id: "FHM-24019",
      createdAt: "2026-04-22T16:10:00.000Z",
      status: "Delivered",
      fullName: "Sana Ahmed",
      email: "customer@freshhomemart.pk",
      phone: "+92 333 8822111",
      city: "Rawalpindi",
      area: "Bahria Town Phase 7",
      addressLine: "Civic Center block C",
      notes: "",
      paymentMethod: "COD",
      subtotal: kinnow.price + eggs.price,
      deliveryFee: 170,
      total: kinnow.price + eggs.price + 170,
      items: [
        {
          productId: kinnow.id,
          slug: kinnow.slug,
          name: kinnow.name,
          unit: kinnow.unit,
          image: kinnow.image,
          price: kinnow.price,
          quantity: 1
        },
        {
          productId: eggs.id,
          slug: eggs.slug,
          name: eggs.name,
          unit: eggs.unit,
          image: eggs.image,
          price: eggs.price,
          quantity: 1
        }
      ]
    }
  ];
}

const baseState: PersistedState = {
  products: shopProducts,
  cart: [],
  wishlist: [],
  orders: buildDemoOrders(),
  user: null
};

const StoreContext = createContext<StoreContextValue | null>(null);

function safeParseState(value: string | null): PersistedState | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as PersistedState;

    if (
      !Array.isArray(parsed.products) ||
      !Array.isArray(parsed.cart) ||
      !Array.isArray(parsed.wishlist) ||
      !Array.isArray(parsed.orders)
    ) {
      return null;
    }

    // If products array is empty, treat as invalid state so we use default shopProducts
    if (parsed.products.length === 0) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Start with server-identical baseState to avoid hydration mismatches.
  const [state, setState] = useState<PersistedState>(baseState);
  // On the client, hydrate from localStorage after mount to pick up persisted demo changes.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const parsed = safeParseState(window.localStorage.getItem(storageKey));
    if (parsed) {
      setState(parsed);
    } else {
      // Clear potentially corrupted localStorage data
      window.localStorage.removeItem(storageKey);
    }
  }, []);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!state.lastAction) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setState((current) => ({
        ...current,
        lastAction: null
      }));
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [state.lastAction]);

  function addToCart(productId: string, quantity = 1) {
    setState((current) => {
      const existing = current.cart.find((item) => item.productId === productId);
      const product = current.products.find((item) => item.id === productId);

      return {
        ...current,
        lastAction: product ? `${product.name} added to cart` : "Item added to cart",
        cart: existing
          ? current.cart.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
                : item
            )
          : [...current.cart, { productId, quantity }]
      };
    });
  }

  function updateCartQuantity(productId: string, quantity: number) {
    setState((current) => ({
      ...current,
      cart:
        quantity <= 0
          ? current.cart.filter((item) => item.productId !== productId)
          : current.cart.map((item) =>
              item.productId === productId ? { ...item, quantity: Math.min(quantity, 99) } : item
            )
    }));
  }

  function removeFromCart(productId: string) {
    const product = stateRef.current.products.find((item) => item.id === productId);

    setState((current) => ({
      ...current,
      lastAction: product ? `${product.name} removed from cart` : "Item removed from cart",
      cart: current.cart.filter((item) => item.productId !== productId)
    }));
  }

  function clearCart() {
    setState((current) => ({
      ...current,
      cart: []
    }));
  }

  function toggleWishlist(productId: string) {
    setState((current) => ({
      ...current,
      lastAction: current.wishlist.includes(productId)
        ? "Removed from wishlist"
        : "Saved to wishlist",
      wishlist: current.wishlist.includes(productId)
        ? current.wishlist.filter((item) => item !== productId)
        : [productId, ...current.wishlist]
    }));
  }

  function login(email: string, password: string) {
    const matchedUser = demoUsers.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (!matchedUser) {
      return {
        ok: false,
        error: "Use one of the demo accounts shown below to access the store."
      };
    }

    setState((current) => ({
      ...current,
      lastAction: `Signed in as ${matchedUser.name}`,
      user: {
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role
      }
    }));

    return { ok: true };
  }

  function logout() {
    setState((current) => ({
      ...current,
      lastAction: "Logged out successfully",
      user: null
    }));
  }

  function placeOrder(input: CheckoutInput) {
    const current = stateRef.current;
    const items = current.cart
      .map((item) => {
        const product = current.products.find((entry) => entry.id === item.productId);

        if (!product) return null;

        return {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          unit: product.unit,
          image: product.image,
          price: product.price,
          quantity: item.quantity
        } as StoreOrderItem;
      })
      .filter((item): item is StoreOrderItem => Boolean(item));

    if (items.length === 0) return null;

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = getDeliveryFee(input.city, subtotal);
    const total = subtotal + deliveryFee;

    const order: StoreOrder = {
      id: `FHM-${Math.floor(10000 + Math.random() * 89999)}`,
      createdAt: new Date().toISOString(),
      status: "Confirmed",
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      city: input.city,
      area: input.area,
      addressLine: input.addressLine,
      notes: input.notes,
      paymentMethod: "COD",
      subtotal,
      deliveryFee,
      total,
      items
    };

    // compute streak update and message
    let streakMessage = "";
    try {
      if (typeof window !== "undefined") {
        const streakKey = "freshgo-streak-v1";

        function isoDate(d: Date) {
          const x = new Date(d);
          x.setHours(0, 0, 0, 0);
          return x.toISOString();
        }

        const raw = window.localStorage.getItem(streakKey);
        let currentStreak = 0;
        let lastOrderDate: string | null = null;

        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (typeof parsed.currentStreak === "number") currentStreak = parsed.currentStreak;
            if (typeof parsed.lastOrderDate === "string") lastOrderDate = parsed.lastOrderDate;
          } catch {
            /* ignore */
          }
        }

        const today = isoDate(new Date());
        const yesterday = isoDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

        let nextStreak = 1;

        if (lastOrderDate === today) {
          nextStreak = currentStreak;
          streakMessage = `Streak unchanged: ${nextStreak} day${nextStreak === 1 ? "" : "s"}`;
        } else if (lastOrderDate === yesterday) {
          nextStreak = currentStreak + 1;
          streakMessage = `Streak increased to ${nextStreak} day${nextStreak === 1 ? "" : "s"}`;
        } else {
          nextStreak = 1;
          streakMessage = `Streak started: 1 day`;
        }

        const next = { currentStreak: nextStreak, lastOrderDate: today };
        window.localStorage.setItem(streakKey, JSON.stringify(next));

        try {
          void fetch("/api/streak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: input.email ?? null, streak: next })
          });
        } catch (err) {
          console.warn("failed to report streak to /api/streak", err);
        }
      }
    } catch (err) {
      console.warn("Failed to update streak data", err);
    }

    setState((existing) => ({
      ...existing,
      cart: [],
      lastAction: `Order ${order.id} placed successfully — ${streakMessage}`,
      orders: [order, ...existing.orders],
      user:
        existing.user ??
        (input.email
          ? {
              email: input.email,
              name: input.fullName,
              role: "CUSTOMER"
            }
          : null)
    }));

    return order;
  }

  function reorderOrder(orderId: string) {
    const order = stateRef.current.orders.find((entry) => entry.id === orderId);

    if (!order) {
      return;
    }

    setState((current) => {
      const nextCart = [...current.cart];

      for (const item of order.items) {
        const existing = nextCart.find((entry) => entry.productId === item.productId);

        if (existing) {
          existing.quantity = Math.min(existing.quantity + item.quantity, 99);
        } else {
          nextCart.push({ productId: item.productId, quantity: item.quantity });
        }
      }

      return {
        ...current,
        lastAction: `Reordered ${order.items.length} item${order.items.length === 1 ? "" : "s"}`,
        cart: nextCart
      };
    });
  }

  function upsertProduct(input: ProductInput) {
    const nextProduct: ShopProduct = {
      id: input.id ?? `custom-${input.slug}`,
      slug: input.slug,
      sku: input.id ? `FHM-EDIT-${input.id.slice(-4).toUpperCase()}` : `FHM-CUST-${Date.now()}`,
      category: input.category,
      name: input.name,
      unit: input.unit,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      popularity: input.popularity,
      bestSellerScore: input.bestSellerScore,
      createdAt: new Date().toISOString().slice(0, 10),
      image: input.image,
      badges: input.badges,
      shortDescription: input.shortDescription,
      description: input.description,
      origin: input.origin,
      inventory: input.inventory,
      highlights: [input.origin, `${input.inventory} in stock`, "Admin managed"]
    };

    setState((current) => ({
      ...current,
      lastAction: current.products.some((product) => product.id === nextProduct.id)
        ? `${nextProduct.name} updated`
        : `${nextProduct.name} created`,
      products: current.products.some((product) => product.id === nextProduct.id)
        ? current.products.map((product) => (product.id === nextProduct.id ? nextProduct : product))
        : [nextProduct, ...current.products]
    }));
  }

  function deleteProduct(productId: string) {
    const product = stateRef.current.products.find((item) => item.id === productId);

    setState((current) => ({
      ...current,
      lastAction: product ? `${product.name} deleted` : "Product deleted",
      products: current.products.filter((product) => product.id !== productId),
      wishlist: current.wishlist.filter((item) => item !== productId),
      cart: current.cart.filter((item) => item.productId !== productId)
    }));
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setState((current) => ({
      ...current,
      lastAction: `Order ${orderId} marked ${status}`,
      orders: current.orders.map((order) => (order.id === orderId ? { ...order, status } : order))
    }));
  }

  const value = useMemo<StoreContextValue>(
    () => ({
      products: state.products,
      cart: state.cart,
      wishlist: state.wishlist,
      orders: state.orders,
      user: state.user,
      lastAction: state.lastAction ?? null,
      cartCount: state.cart.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: state.wishlist.length,
      isAdmin: state.user?.role === "ADMIN",
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      placeOrder,
      login,
      logout,
      reorderOrder,
      upsertProduct,
      deleteProduct,
      updateOrderStatus
    }),
    [state]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }

  return context;
}
