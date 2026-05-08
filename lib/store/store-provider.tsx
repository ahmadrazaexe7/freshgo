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
  image?: string;
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
  image?: string;
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
  orderError: string | null;
  cartCount: number;
  wishlistCount: number;
  isAdmin: boolean;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (input: CheckoutInput) => Promise<StoreOrder | null>;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (email: string, password: string, name: string, role?: UserRole) => { ok: boolean; error?: string };
  logout: () => void;
  reorderOrder: (orderId: string) => void;
  upsertProduct: (input: ProductInput) => void;
  deleteProduct: (productId: string) => void;
  refreshProducts: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
};

type PersistedState = {
  products: ShopProduct[];
  cart: CartItem[];
  wishlist: string[];
  orders: StoreOrder[];
  user: SessionUser | null;
  lastAction?: string | null;
  orderError?: string | null;
  accounts?: Array<{ email: string; password: string; name: string; role: UserRole }>;
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
  products: [],
  cart: [],
  wishlist: [],
  orders: [],
  user: null,
  lastAction: null,
  orderError: null,
  accounts: demoUsers
};

const StoreContext = createContext<StoreContextValue | null>(null);

function safeParseState(value: string | null): PersistedState | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as PersistedState;

    if (
      (parsed.products !== undefined && !Array.isArray(parsed.products)) ||
      !Array.isArray(parsed.cart) ||
      !Array.isArray(parsed.wishlist) ||
      (parsed.orders !== undefined && !Array.isArray(parsed.orders)) ||
      (parsed.accounts !== undefined && !Array.isArray(parsed.accounts))
    ) {
      return null;
    }

    return {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      cart: parsed.cart,
      wishlist: parsed.wishlist,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      user: parsed.user ?? null,
      lastAction: parsed.lastAction ?? null,
      orderError: parsed.orderError ?? null,
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : demoUsers
    };
  } catch {
    return null;
  }
}

const dbStatusToUi: Record<string, OrderStatus> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PACKING: "Packing",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled"
};

const uiStatusToDb: Record<OrderStatus, string> = {
  Pending: "PENDING",
  Confirmed: "CONFIRMED",
  Packing: "PACKING",
  "Out for delivery": "OUT_FOR_DELIVERY",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED"
};

function normalizeDbOrder(order: any): StoreOrder {
  return {
    id: order.id,
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
    status: dbStatusToUi[order.status] ?? "Pending",
    fullName: order.fullName,
    email: order.email ?? "",
    phone: order.phone,
    city: order.city,
    area: order.area,
    addressLine: order.addressLine,
    notes: order.notes ?? "",
    paymentMethod: order.paymentMethod ?? "COD",
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    total: Number(order.total),
    items: Array.isArray(order.items)
      ? order.items.map((item: any) => ({
          productId: item.productId,
          slug: item.product?.slug ?? item.productId,
          name: item.productName ?? item.product?.name ?? "Product",
          unit: item.product?.unit ?? "",
          image: item.product?.image ?? undefined,
          price: Number(item.unitPrice),
          quantity: item.quantity
        }))
      : []
  };
}

function normalizeDbProduct(dbProduct: any): ShopProduct {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    sku: `FHM-${dbProduct.id.slice(-6).toUpperCase()}`,
    category: dbProduct.category?.slug || "vegetables",
    name: dbProduct.name,
    unit: dbProduct.unit,
    price: Number(dbProduct.price),
    compareAtPrice: dbProduct.salePrice ? Number(dbProduct.salePrice) : undefined,
    popularity: 80,
    bestSellerScore: 80,
    createdAt: dbProduct.createdAt ? new Date(dbProduct.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    image: dbProduct.image,
    badges: dbProduct.featured ? ["Fresh"] : [],
    shortDescription: dbProduct.description?.slice(0, 100) || "",
    description: dbProduct.description || "",
    origin: "Local",
    inventory: dbProduct.inventory,
    highlights: [dbProduct.category?.name || "Fresh", `${dbProduct.inventory} in stock`]
  };
}

const REMOTE_CATALOG_URL = "https://www.freshgo.online/api/products";

async function fetchProductsFromApi(): Promise<ShopProduct[]> {
  const endpoints = ["/api/products", REMOTE_CATALOG_URL];

  for (const url of endpoints) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to fetch products from ${url}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      if (!Array.isArray(data.products)) {
        console.warn(`Invalid product payload from ${url}`);
        continue;
      }

      const products = data.products.map(normalizeDbProduct);
      if (products.length > 0) {
        return products;
      }
    } catch (error) {
      console.warn(`Could not fetch products from ${url}:`, error);
    }
  }

  return [];
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Start with server-identical baseState to avoid hydration mismatches.
  const [state, setState] = useState<PersistedState>(baseState);
  // On the client, hydrate from localStorage after mount to pick up persisted demo changes.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const parsed = safeParseState(window.localStorage.getItem(storageKey));
    if (parsed) {
      setState((current) => ({
        ...current,
        cart: parsed.cart,
        wishlist: parsed.wishlist,
        user: parsed.user,
        lastAction: parsed.lastAction ?? current.lastAction,
        orderError: parsed.orderError ?? current.orderError,
        accounts: parsed.accounts ?? current.accounts
      }));
    }
  }, []);

  // Fetch products from database API to ensure prices are up-to-date
  async function refreshProducts() {
    try {
      const dbProducts = await fetchProductsFromApi();
      if (dbProducts.length === 0) return;

      setState((current) => ({
        ...current,
        products: dbProducts,
        orders: current.orders.map((order) => ({
          ...order,
          items: order.items.map((item) => {
            const updated = dbProducts.find((p: ShopProduct) => p.id === item.productId);
            return updated ? { ...item, image: updated.image, price: updated.price } : item;
          })
        }))
      }));
    } catch (err) {
      console.warn("Failed to refresh products from API:", err);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    (async function syncProducts() {
      try {
        const dbProducts = await fetchProductsFromApi();
        if (!mounted || dbProducts.length === 0) return;

        setState((current) => ({
          ...current,
          products: dbProducts,
          orders: current.orders.map((order) => ({
            ...order,
            items: order.items.map((item) => {
              const updated = dbProducts.find((p: ShopProduct) => p.id === item.productId);
              return updated ? { ...item, image: updated.image, price: updated.price } : item;
            })
          }))
        }));
      } catch (err) {
        console.warn("Failed to sync products from API:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    (async function syncOrders() {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) return;

        const data = await response.json();
        if (!mounted || !data.ok || !Array.isArray(data.orders)) return;

        const normalizedOrders = data.orders.map(normalizeDbOrder);

        setState((current) => ({
          ...current,
          orders: normalizedOrders
        }));
      } catch (err) {
        console.warn("Failed to sync orders from API:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const persisted: PersistedState = {
      products: [],
      cart: state.cart,
      wishlist: state.wishlist,
      orders: [],
      user: state.user,
      lastAction: state.lastAction,
      orderError: state.orderError,
      accounts: state.accounts
    };

    window.localStorage.setItem(storageKey, JSON.stringify(persisted));
  }, [state.cart, state.wishlist, state.user, state.lastAction, state.orderError, state.accounts]);

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
        orderError: null,
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
      orderError: null,
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
      orderError: null,
      cart: current.cart.filter((item) => item.productId !== productId)
    }));
  }

  function clearCart() {
    setState((current) => ({
      ...current,
      orderError: null,
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
    const matchedUser = stateRef.current.accounts?.find(
      (user) => String(user.email).toLowerCase() === String(email).toLowerCase() && user.password === password
    );

    if (!matchedUser) {
      return {
        ok: false,
        error: "Invalid credentials. Use a demo account or sign up."
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

  function register(email: string, password: string, name: string, role: UserRole = "CUSTOMER") {
    // basic validation
    if (!email || !password || !name) return { ok: false, error: "Missing required fields" };

    const exists = stateRef.current.accounts?.some((a) => String(a.email).toLowerCase() === String(email).toLowerCase());

    if (exists) return { ok: false, error: "An account with this email already exists" };

    const newAccount = { email, password, name, role };

    setState((current) => ({
      ...current,
      lastAction: `Created account for ${name}`,
      accounts: current.accounts ? [newAccount, ...current.accounts] : [newAccount]
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

  async function placeOrder(input: CheckoutInput) {
    const current = stateRef.current;

    // Validate inventory for all items
    const inventoryErrors: string[] = [];
    for (const cartItem of current.cart) {
      const product = current.products.find((entry) => entry.id === cartItem.productId);
      if (!product) {
        inventoryErrors.push(`Product no longer available`);
      } else if (cartItem.quantity > product.inventory) {
        inventoryErrors.push(`Only ${product.inventory} ${product.unit} of "${product.name}" available`);
      }
    }

    if (inventoryErrors.length > 0) {
      const errorMessage = inventoryErrors.join(" • ");
      setState((current) => ({
        ...current,
        lastAction: errorMessage,
        orderError: errorMessage
      }));
      return null;
    }

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

    let orderFromApi: StoreOrder | null = null;

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          items: items.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            name: item.name,
            unit: item.unit,
            image: item.image,
            price: item.price,
            quantity: item.quantity
          }))
        })
      });

      const result = await response.json();
      if (!response.ok || !result.ok || !result.order) {
        const errorMessage = result?.message || "Failed to submit order. Please try again.";
        setState((current) => ({
          ...current,
          lastAction: errorMessage,
          orderError: errorMessage
        }));
        return null;
      }

      orderFromApi = normalizeDbOrder(result.order);
    } catch (err) {
      const errorMessage = "Order submission failed. Please try again.";
      setState((current) => ({
        ...current,
        lastAction: errorMessage,
        orderError: errorMessage
      }));
      return null;
    }

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
      lastAction: `Order ${orderFromApi?.id ?? "#"} placed successfully — ${streakMessage}`,
      orderError: null,
      orders: orderFromApi ? [orderFromApi, ...existing.orders] : existing.orders,
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

    return orderFromApi;
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

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    const apiStatus = uiStatusToDb[status] ?? status;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: apiStatus })
      });

      const result = await response.json();
      if (!response.ok || !result.ok || !result.order) {
        console.warn("Failed to update order status", result);
        return false;
      }

      const updatedOrder = normalizeDbOrder(result.order);
      setState((current) => ({
        ...current,
        lastAction: `Order ${orderId} marked ${status}`,
        orders: current.orders.map((order) => (order.id === orderId ? updatedOrder : order))
      }));
      return true;
    } catch (err) {
      console.warn("Failed to update order status", err);
      return false;
    }
  }

  const value = useMemo<StoreContextValue>(
    () => ({
      products: state.products,
      cart: state.cart,
      wishlist: state.wishlist,
      orders: state.orders,
      user: state.user,
      lastAction: state.lastAction ?? null,
      orderError: state.orderError ?? null,
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
      register,
      logout,
      reorderOrder,
      upsertProduct,
      deleteProduct,
refreshProducts,
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
