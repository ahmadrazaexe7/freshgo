// Local category type to avoid circular runtime import with shop-catalog
export type ProductRate = {
  id: string;
  name: string;
  displayName: string; // include Urdu name
  category: "vegetables" | "fruits" | "groceries";
  unit: string;
  price: number; // PKR
};

function round(v: number) {
  return Math.round(v);
}

export const productRates: ProductRate[] = [
  // Vegetables (assume per 1 kg unless noted)
  { id: "veg-potato", name: "Potato", displayName: "آلو", category: "vegetables", unit: "1 kg", price: round(38 * 1.15) },
  { id: "veg-onion", name: "Onion", displayName: "پیاز", category: "vegetables", unit: "1 kg", price: round(89 * 1.15) },
  { id: "veg-tomato", name: "Tomato", displayName: "ٹماٹر", category: "vegetables", unit: "1 kg", price: round(79 * 1.15) },
  { id: "veg-ginger-china", name: "Ginger (China)", displayName: "ادرک (چین)", category: "vegetables", unit: "1 kg", price: round(450 * 1.15) },
  { id: "veg-garlic-china", name: "Garlic (China)", displayName: "لہسن (چین)", category: "vegetables", unit: "1 kg", price: round(389 * 1.15) },
  { id: "veg-ladyfinger", name: "Lady Finger", displayName: "بھنڈی", category: "vegetables", unit: "1 kg", price: round(121 * 1.15) },
  { id: "veg-pumpkin", name: "Pumpkin", displayName: "کدو", category: "vegetables", unit: "1 kg", price: round(85 * 1.15) },
  { id: "veg-brinjal", name: "Brinjal", displayName: "بینگن", category: "vegetables", unit: "1 kg", price: round(68 * 1.15) },
  { id: "veg-peas", name: "Peas", displayName: "مٹر", category: "vegetables", unit: "1 kg", price: round(157 * 1.15) },
  { id: "veg-fresh-bean", name: "Fresh Bean", displayName: "فریش بین", category: "vegetables", unit: "1 kg", price: round(109 * 1.15) },
  { id: "veg-tenda", name: "Tenda", displayName: "تینڈا", category: "vegetables", unit: "1 kg", price: round(96 * 1.15) },
  { id: "veg-cucumber", name: "Cucumber", displayName: "کھیرا", category: "vegetables", unit: "1 kg", price: round(79 * 1.15) },
  { id: "veg-capsicum", name: "Capsicum", displayName: "شملہ مرچ", category: "vegetables", unit: "1 kg", price: round(68 * 1.15) },
  { id: "veg-green-chilli", name: "Green Chilli", displayName: "ہری مرچ", category: "vegetables", unit: "1 kg", price: round(200 * 1.15) },
  { id: "veg-cauliflower", name: "Cauliflower", displayName: "گوبھی", category: "vegetables", unit: "1 kg", price: round(99 * 1.15) },
  { id: "veg-cabbage", name: "Cabbage", displayName: "پتہ گوبھی", category: "vegetables", unit: "1 kg", price: round(67 * 1.15) },
  { id: "veg-bitter-gourd", name: "Bitter Gourd", displayName: "کڑوا کھیرا (کریلا)", category: "vegetables", unit: "1 kg", price: round(121 * 1.15) },
  { id: "veg-green-zucchini", name: "Green Zucchini", displayName: "زکینی", category: "vegetables", unit: "1 kg", price: round(109 * 1.15) },
  { id: "veg-spinach", name: "Spinach", displayName: "پالک", category: "vegetables", unit: "1 kg", price: round(60 * 1.15) },
  { id: "veg-turnip", name: "Turnip", displayName: "شلجم", category: "vegetables", unit: "1 kg", price: round(55 * 1.15) },
  { id: "veg-maroo", name: "Maroo", displayName: "مارو", category: "vegetables", unit: "1 kg", price: round(80 * 1.15) },
  { id: "veg-yam", name: "Yam", displayName: "جمبو (یام)", category: "vegetables", unit: "1 kg", price: round(161 * 1.15) },
  { id: "veg-carrot", name: "Carrot", displayName: "گاجر", category: "vegetables", unit: "1 kg", price: round(109 * 1.15) },
  { id: "veg-bottle-gourd", name: "Bottle Gourd", displayName: "لوکی", category: "vegetables", unit: "1 kg", price: round(87 * 1.15) },
  { id: "veg-lemon", name: "Lemon", displayName: "لیموں", category: "vegetables", unit: "1 kg", price: round(200 * 1.15) },
  { id: "veg-lettuce", name: "Lettuce", displayName: "سلاد پتہ", category: "vegetables", unit: "1 kg", price: round(20 * 1.15) },
  { id: "veg-green-onion", name: "Green Onion", displayName: "ہرا پیاز", category: "vegetables", unit: "1 kg", price: round(80 * 1.15) },
  { id: "veg-iceberg", name: "Iceberg", displayName: "آئیس برگ لیٹوس", category: "vegetables", unit: "1 kg", price: round(149 * 1.15) },
  { id: "veg-beetroot", name: "Beetroot", displayName: "چقندر", category: "vegetables", unit: "1 kg", price: round(145 * 1.15) },

  // Fruits
  { id: "fruit-apple-kala-kulu", name: "Apple Kala Kulu", displayName: "سیب کالا کلو", category: "fruits", unit: "1 kg", price: round(380 * 1.15) },
  { id: "fruit-apple-golden", name: "Apple Golden", displayName: "سیب گولڈن", category: "fruits", unit: "1 kg", price: round(340 * 1.15) },
  { id: "fruit-apple-white", name: "Apple White", displayName: "سیب سفید", category: "fruits", unit: "1 kg", price: round(287 * 1.15) },
  { id: "fruit-banana", name: "Banana", displayName: "کیلا", category: "fruits", unit: "dozen", price: round(180 * 1.15) },
  { id: "fruit-guava", name: "Guava", displayName: "امرود", category: "fruits", unit: "1 kg", price: round(250 * 1.15) },
  { id: "fruit-peach", name: "Peach", displayName: "آڑو", category: "fruits", unit: "1 kg", price: round(267 * 1.15) },
  { id: "fruit-cantaloupe", name: "Cantaloupe", displayName: "خربوزہ", category: "fruits", unit: "1 kg", price: round(169 * 1.15) },
  { id: "fruit-strawberry", name: "Strawberry", displayName: "اسٹرابیری", category: "fruits", unit: "500 g", price: round(300 * 1.15) },
  { id: "fruit-yellow-melon", name: "Yellow Melon", displayName: "پیلا تربوز", category: "fruits", unit: "1 kg", price: round(160 * 1.15) },
  { id: "fruit-sharbooza", name: "Sharbooza", displayName: "شرابوزہ", category: "fruits", unit: "1 kg", price: round(150 * 1.15) },

  // Grains / Pulses (assume 1 kg)
  { id: "grain-sabut-mong", name: "Sabut Mong", displayName: "سبُت مونگ", category: "groceries", unit: "1 kg", price: round(480 * 1.15) },
  { id: "grain-mong", name: "Mong", displayName: "مونگ", category: "groceries", unit: "1 kg", price: round(440 * 1.15) },
  { id: "grain-sabut-mash", name: "Sabut Mash", displayName: "سبُت ماش", category: "groceries", unit: "1 kg", price: round(580 * 1.15) },
  { id: "grain-mash", name: "Mash", displayName: "ماش", category: "groceries", unit: "1 kg", price: round(630 * 1.15) },
  { id: "grain-sabut-masar", name: "Sabut Masar", displayName: "سبُت مسور", category: "groceries", unit: "1 kg", price: round(500 * 1.15) },
  { id: "grain-masar", name: "Masar", displayName: "مسور", category: "groceries", unit: "1 kg", price: round(520 * 1.15) },
  { id: "grain-dal-channa", name: "Dal Channa", displayName: "دال چنا", category: "groceries", unit: "1 kg", price: round(440 * 1.15) },
  { id: "grain-lal-lobia", name: "Lal Lobia", displayName: "لال لوبیا", category: "groceries", unit: "1 kg", price: round(580 * 1.15) },
  { id: "grain-white-lobia", name: "White Lobia", displayName: "سفید لوبیا", category: "groceries", unit: "1 kg", price: round(540 * 1.15) },
  { id: "grain-white-channa", name: "White Channa", displayName: "سفید چنا", category: "groceries", unit: "1 kg", price: round(480 * 1.15) },
  { id: "grain-black-channa", name: "Black Channa", displayName: "کالا چنا", category: "groceries", unit: "1 kg", price: round(480 * 1.15) },
  { id: "grain-kainat-steem", name: "Kainat Steem", displayName: "کائنات سٹیم", category: "groceries", unit: "1 kg", price: round(380 * 1.15) },
  { id: "grain-sella-steem", name: "Sella Steem", displayName: "سیلا سٹیم", category: "groceries", unit: "1 kg", price: round(380 * 1.15) }
];

export default productRates;
