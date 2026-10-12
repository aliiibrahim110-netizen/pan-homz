export type Product = {
  id: string;
  sku: string;
  title: string;
  short: string;
  parent: string;
  collection: string;
  material: string;
  color?: string;
  fabric?: string;
  finish?: string;
  width: number;
  depth: number;
  height: number;
  chaise?: number;
  price: number;
  compare: number;
  image: string;
  localImage: string;
  variants?: { label: string; sku: string }[];
};
const cdn = "https://cdn.shopify.com/s/files/1/0691/7436/2270/files/";
export const products: Product[] = [
  {
    id: "sofa-459",
    sku: "Sofa-459",
    title: "كنبة خشب زان - أوف وايت - 240 × 80 × 70 سم",
    short: "كنبة خشب زان — أوف وايت",
    parent: "living",
    collection: "sofas",
    material: "خشب زان",
    fabric: "كتان ناعم",
    color: "أوف وايت",
    width: 240,
    depth: 80,
    height: 70,
    price: 23333,
    compare: 34999.5,
    image: cdn + "s69_f33994df-4750-4c7b-9153-99bb2c6ba081.webp?v=1787512836",
    localImage: "/images/sofa-459.webp",
  },
  {
    id: "sofa-665",
    sku: "Sofa-665",
    title: "كنبة خشب زان - بيج - 200 × 80 × 75 سم",
    short: "كنبة خشب زان — بيج",
    parent: "living",
    collection: "sofas",
    material: "خشب زان",
    color: "بيج",
    width: 200,
    depth: 80,
    height: 75,
    price: 15000,
    compare: 22500,
    image: cdn + "2_5_2_1.jpg?v=1787512996",
    localImage: "/images/sofa-665.jpg",
  },
  {
    id: "sofa-639",
    sku: "Sofa-639",
    title: "كنبة خشب زان - بيج - 220 × 90 × 85 سم",
    short: "كنبة خشب زان — بيج",
    parent: "living",
    collection: "sofas",
    material: "خشب زان",
    color: "بيج",
    width: 220,
    depth: 90,
    height: 85,
    price: 22500,
    compare: 33750,
    image: cdn + "A62_48923ad1-5cda-4511-a549-68d0e76fe81f.png?v=1787512977",
    localImage: "/images/sofa-639.png",
  },
  {
    id: "corner-419",
    sku: "Sofa L-Shape-419",
    title: "ركنة خشب زان - متعدد الألوان - 250 × 170 × 85 سم",
    short: "ركنة خشب زان — متعدد الألوان",
    parent: "living",
    collection: "corners",
    material: "خشب زان",
    fabric: "كتان",
    color: "متعدد الألوان",
    width: 250,
    chaise: 170,
    depth: 85,
    height: 75,
    price: 21563,
    compare: 31266.35,
    image: cdn + "B12.jpg?v=1787511497",
    localImage: "/images/corner-419.jpg",
    variants: [
      { label: "يمين", sku: "Sofa L-Shape-419" },
      { label: "شمال", sku: "Sofa L-Shape-419-L" },
    ],
  },
  {
    id: "wardrobe-203",
    sku: "wardrobe-203",
    title:
      "دولاب خشب إم دي إف بطبقة ميلامين - عرض 120 × ارتفاع 200 × عمق 50 سم",
    short: "دولاب خشب إم دي إف بطبقة ميلامين",
    parent: "bedroom",
    collection: "wardrobes",
    material: "خشب إم دي إف بطبقة ميلامين",
    width: 120,
    height: 200,
    depth: 50,
    price: 16664,
    compare: 21663,
    image: cdn + "AK121.jpg?v=1787509368",
    localImage: "/images/wardrobe-203.jpg",
  },
  {
    id: "dw-357",
    sku: "DW-357",
    title: "وحدة أدراج خشب إم دي إف - 61 × 42 × 70 سم",
    short: "وحدة أدراج خشب إم دي إف",
    parent: "storage",
    collection: "drawers",
    material: "خشب إم دي إف",
    finish: "ميلامين",
    width: 61,
    depth: 42,
    height: 70,
    price: 4983,
    compare: 7475,
    image: cdn + "DU250_1.jpg?v=1787508777",
    localImage: "/images/dw-357.jpg",
  },
  {
    id: "com-02",
    sku: "com-02",
    title: "كومود خشب إم دي إف - 50 × 40 × 50 سم",
    short: "كومود خشب إم دي إف",
    parent: "bedroom",
    collection: "commodes",
    material: "خشب إم دي إف",
    width: 50,
    depth: 40,
    height: 50,
    price: 1735.5,
    compare: 2342.925,
    image:
      "https://cdn.shopify.com/s/files/1/0377/5909/0821/products/SM-C011.jpg?v=1644938789",
    localImage: "/images/com-02.jpg",
  },
];
export type Category = {
  id: string;
  name: string;
  tag: string;
  photo: string;
  children: {
    id: string;
    name: string;
    children?: { id: string; name: string }[];
  }[];
};
export const categories: Category[] = [
  {
    id: "bedroom",
    name: "غرف النوم",
    tag: "راحة تبدأ من هنا",
    photo: "/images/rooms.webp",
    children: [
      { id: "beds", name: "سراير" },
      {
        id: "wardrobes",
        name: "دواليب",
        children: [
          { id: "sliding-wardrobes", name: "دواليب جرار" },
          { id: "hinged-wardrobes", name: "دواليب مفصلية" },
        ],
      },
      { id: "dressings", name: "تسريحات" },
      { id: "commodes", name: "كومود" },
      { id: "bedroom-sets", name: "غرف نوم كاملة" },
    ],
  },
  {
    id: "living",
    name: "غرف المعيشة",
    tag: "لكل لمّة حلوة",
    photo: "/images/hero.webp",
    children: [
      { id: "corners", name: "ركنات" },
      { id: "sofas", name: "كنب" },
      { id: "armchairs", name: "فوتيه" },
      { id: "recliners", name: "كراسي ريكلاينر" },
      { id: "tv-units", name: "وحدات تلفزيون" },
      { id: "coffee-tables", name: "ترابيزات قهوة" },
      { id: "side-tables", name: "ترابيزات جانبية" },
      {
        id: "consoles",
        name: "ترابيزات كونسول",
        children: [
          { id: "wood-consoles", name: "كونسول خشب" },
          { id: "metal-consoles", name: "كونسول معدن" },
        ],
      },
      { id: "bookcases", name: "مكتبات" },
      { id: "coffee-corners", name: "كوفي كورنر" },
    ],
  },
  {
    id: "dining",
    name: "غرف السفرة",
    tag: "لحظات تستاهل تتجمعوا",
    photo: "/images/rooms.webp",
    children: [
      { id: "dining-sets", name: "غرف سفرة كاملة" },
      { id: "dining-tables", name: "ترابيزات سفرة" },
      { id: "dining-chairs", name: "كراسي سفرة" },
      { id: "buffets", name: "بوفيهات" },
      { id: "bar-chairs", name: "كراسي بار" },
    ],
  },
  {
    id: "office",
    name: "الأثاث المكتبي",
    tag: "مساحة لأفكارك",
    photo: "/images/rooms.webp",
    children: [
      { id: "desks", name: "مكاتب" },
      { id: "metal-desks", name: "مكاتب معدن" },
      { id: "office-chairs", name: "كراسي مكتب" },
      { id: "executive-chairs", name: "كراسي مدير" },
    ],
  },
  {
    id: "storage",
    name: "وحدات التخزين",
    tag: "مكان لكل حاجة",
    photo: "/images/dw-357.jpg",
    children: [
      { id: "drawers", name: "وحدات أدراج" },
      { id: "shoe-cabinets", name: "جزامات" },
      { id: "bookcases", name: "مكتبات" },
    ],
  },
];
export const collectionNames = Object.fromEntries(
  categories
    .flatMap((c) => [
      ...[{ id: c.id, name: c.name }],
      ...c.children.flatMap((s) => [s, ...(s.children || [])]),
    ])
    .map((c) => [c.id, c.name]),
);
export const price = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  ) + " ج.م";
export const discount = (p: Product) =>
  Math.round((1 - p.price / p.compare) * 100);
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .trim();
export function searchProducts(q: string) {
  const n = normalize(q);
  const aliases: Record<string, string> = {
    ركنه: "ركنات",
    كنبه: "كنب",
    "وحده ادراج": "وحدات ادراج",
    "ترابيزه قهوه": "ترابيزات قهوه",
  };
  const query = aliases[n] || n;
  return products.filter((p) =>
    normalize(
      [
        p.title,
        p.sku,
        p.variants?.map((v) => v.sku).join(" "),
        p.material,
        p.color,
        p.fabric,
        collectionNames[p.collection],
        collectionNames[p.parent],
      ].join(" "),
    ).includes(query),
  );
}
