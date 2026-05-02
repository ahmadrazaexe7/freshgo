export type ShopCategoryId = "vegetables" | "fruits" | "groceries";

export type ProductBadge = "Fresh" | "Best Seller" | "Discount";

export type ShopCategory = {
  id: ShopCategoryId;
  title: string;
  subtitle: string;
  blurb: string;
};

export type ShopProduct = {
  id: string;
  slug: string;
  sku: string;
  category: ShopCategoryId;
  name: string;
  unit: string;
  price: number;
  compareAtPrice?: number;
  popularity: number;
  bestSellerScore: number;
  createdAt: string;
  image: string;
  badges: ProductBadge[];
  shortDescription: string;
  description: string;
  origin: string;
  inventory: number;
  highlights: string[];
};

export const shopCategories: ShopCategory[] = [
  {
    id: "vegetables",
    title: "Vegetables",
    subtitle: "Fresh-picked essentials for everyday cooking",
    blurb: "Leafy greens, roots, herbs, and kitchen staples prepared for reliable weekly ordering."
  },
  {
    id: "fruits",
    title: "Fruits",
    subtitle: "Seasonal sweetness with premium handling",
    blurb: "Family-friendly fruit boxes, gifting picks, and carefully selected seasonal produce."
  },
  {
    id: "groceries",
    title: "Groceries",
    subtitle: "Pantry staples from breakfast to dinner",
    blurb: "Rice, oils, breakfast basics, and everyday household grocery essentials in one clean catalog."
  }
];

export const shopProducts: ShopProduct[] = [
  {
    id: "veg-spinach",
    slug: "organic-spinach",
    sku: "FHM-VEG-001",
    category: "vegetables",
    name: "Organic Spinach",
    unit: "bundle",
    price: 180,
    compareAtPrice: 220,
    popularity: 98,
    bestSellerScore: 94,
    createdAt: "2026-04-21",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80",
    badges: ["Fresh", "Discount"],
    shortDescription: "Tender spinach bundles — great for saag and smoothies.",
    description: "Tender, washed spinach packed for convenient weekday cooking.",
    origin: "Taxila farms",
    inventory: 60,
    highlights: ["Same-day prep", "Leafy and tender", "Great for saag"]
  },
  {
    id: "veg-tomatoes",
    slug: "vine-tomatoes",
    sku: "FHM-VEG-002",
    category: "vegetables",
    name: "Vine Tomatoes",
    unit: "1 kg",
    price: 260,
    popularity: 95,
    bestSellerScore: 90,
    createdAt: "2026-04-18",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80",
    badges: ["Fresh", "Best Seller"],
    shortDescription: "Bright vine tomatoes — perfect for salads and cooking.",
    description: "Firm, flavorful tomatoes ideal for slicing, cooking, and salads.",
    origin: "Potohar belt",
    inventory: 84,
    highlights: ["Best for daily cooking", "Balanced sweetness", "Firm slicing texture"]
  },
  {
    id: "veg-potatoes",
    slug: "premium-potatoes",
    sku: "FHM-VEG-003",
    category: "vegetables",
    name: "Premium Potatoes",
    unit: "2 kg",
    price: 230,
    popularity: 89,
    bestSellerScore: 85,
    createdAt: "2026-04-14",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
    badges: ["Best Seller"],
    shortDescription: "All-purpose potatoes for frying, baking, and curries.",
    description: "Versatile potatoes that hold shape in curries and roast well.",
    origin: "Punjab growers",
    inventory: 120,
    highlights: ["All-purpose kitchen staple", "Good holding texture", "Family pack"]
  },
  {
    id: "veg-coriander",
    slug: "coriander-leaves",
    sku: "FHM-VEG-004",
    category: "vegetables",
    name: "Coriander Leaves",
    unit: "bunch",
    price: 90,
    compareAtPrice: 110,
    popularity: 78,
    bestSellerScore: 70,
    createdAt: "2026-04-26",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80",
    badges: ["Fresh", "Discount"],
    shortDescription: "Aromatic coriander bunch for garnishing and chutneys.",
    description: "Fresh coriander with a bright aroma, packed to stay crisp.",
    origin: "Rawalpindi peri-urban farms",
    inventory: 42,
    highlights: ["Strong aroma", "Fresh garnish", "Popular with desi meals"]
  },
  {
    id: "fruit-kinnow",
    slug: "kinnow-citrus-box",
    sku: "FHM-FRT-001",
    category: "fruits",
    name: "Kinnow Citrus Box",
    unit: "5 kg",
    price: 950,
    compareAtPrice: 1100,
    popularity: 97,
    bestSellerScore: 92,
    createdAt: "2026-04-19",
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=900&q=80",
    badges: ["Best Seller", "Discount"],
    shortDescription: "Juicy kinnows — great for juice and snacking.",
    description: "Seasonal kinnows selected for flavor and juicing.",
    origin: "Sargodha orchards",
    inventory: 24,
    highlights: ["Juice-friendly", "Family box", "Seasonal favorite"]
  },
  {
    id: "fruit-mango",
    slug: "chausa-mango-crate",
    sku: "FHM-FRT-002",
    category: "fruits",
    name: "Chaunsa Mango Crate",
    unit: "4 kg",
    price: 1850,
    popularity: 96,
    bestSellerScore: 96,
    createdAt: "2026-04-27",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80",
    badges: ["Fresh", "Best Seller"],
    shortDescription: "Fragrant Chaunsa mangoes — premium seasonal crate.",
    description: "Sweet, aromatic Chaunsa mangoes selected for peak season quality.",
    origin: "Multan orchards",
    inventory: 18,
    highlights: ["Seasonal premium pick", "Great for gifting", "High sweetness"]
  },
  {
    id: "fruit-bananas",
    slug: "farm-bananas",
    sku: "FHM-FRT-003",
    category: "fruits",
    name: "Farm Bananas",
    unit: "dozen",
    price: 320,
    popularity: 87,
    bestSellerScore: 84,
    createdAt: "2026-04-17",
    image:
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=80",
    badges: ["Fresh"],
    shortDescription: "Everyday bananas — breakfast and smoothies.",
    description: "Reliable, ripe bananas for breakfast, baking, and snacks.",
    origin: "Sindh fruit market supply",
    inventory: 75,
    highlights: ["Breakfast essential", "Smoothie-ready", "Kid-friendly"]
  },
  {
    id: "fruit-strawberries",
    slug: "strawberries-punnet",
    sku: "FHM-FRT-004",
    category: "fruits",
    name: "Strawberries Punnet",
    unit: "400 g",
    price: 540,
    compareAtPrice: 620,
    popularity: 82,
    bestSellerScore: 79,
    createdAt: "2026-04-24",
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80",
    badges: ["Fresh", "Discount"],
    shortDescription: "Sweet strawberries — great for desserts and bowls.",
    description: "Bright, carefully handled strawberries for desserts and breakfast.",
    origin: "Swat valley partners",
    inventory: 26,
    highlights: ["Dessert favorite", "Premium presentation", "Delicate seasonal fruit"]
  },
  {
    id: "gro-rice",
    slug: "premium-basmati-rice",
    sku: "FHM-GRO-001",
    category: "groceries",
    name: "Premium Basmati Rice",
    unit: "2 kg",
    price: 780,
    popularity: 93,
    bestSellerScore: 91,
    createdAt: "2026-04-16",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
    badges: ["Best Seller"],
    shortDescription: "Long-grain basmati for biryani and daily meals.",
    description: "Fragrant basmati rice with dependable grain length and aroma.",
    origin: "Punjab rice mills",
    inventory: 34,
    highlights: ["Long grain", "Reliable aroma", "Ideal for biryani"]
  },
  {
    id: "gro-ghee",
    slug: "desi-ghee-jar",
    sku: "FHM-GRO-002",
    category: "groceries",
    name: "Desi Ghee Jar",
    unit: "1 kg",
    price: 2280,
    compareAtPrice: 2490,
    popularity: 85,
    bestSellerScore: 80,
    createdAt: "2026-04-23",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
    badges: ["Discount"],
    shortDescription: "Rich desi ghee — ideal for parathas and festive cooking.",
    description: "Full-flavored desi ghee for traditional cooking and baking.",
    origin: "Local dairy network",
    inventory: 20,
    highlights: ["Rich taste", "Festive cooking staple", "Large family pack"]
  },
  {
    id: "gro-eggs",
    slug: "brown-eggs-tray",
    sku: "FHM-GRO-003",
    category: "groceries",
    name: "Brown Eggs Tray",
    unit: "30 pcs",
    price: 690,
    popularity: 90,
    bestSellerScore: 89,
    createdAt: "2026-04-25",
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=80",
    badges: ["Fresh", "Best Seller"],
    shortDescription: "Fresh eggs — baking and breakfast staple.",
    description: "Carefully packed eggs for everyday breakfasts and baking.",
    origin: "Islamabad farm partners",
    inventory: 50,
    highlights: ["Breakfast staple", "Baking ready", "High repeat demand"]
  },
  {
    id: "gro-olive-oil",
    slug: "olive-oil-classic",
    sku: "FHM-GRO-004",
    category: "groceries",
    name: "Classic Olive Oil",
    unit: "750 ml",
    price: 1680,
    popularity: 76,
    bestSellerScore: 74,
    createdAt: "2026-04-22",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
    badges: ["Discount"],
    shortDescription: "Classic olive oil — cooking and dressings.",
    description: "Versatile olive oil for cooking, dressings, and marinades.",
    origin: "Imported pantry selection",
    inventory: 14,
    highlights: ["Kitchen versatile", "Smooth finish", "Everyday premium pantry item"]
  }
];

export function getCategoryById(categoryId: ShopCategoryId) {
  return shopCategories.find((category) => category.id === categoryId);
}

export function getProductBySlug(slug: string) {
  return shopProducts.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return shopProducts.find((product) => product.id === id);
}
