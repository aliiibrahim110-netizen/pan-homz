import { DAY } from "./domain.mjs";
export type OpItem = {
  id: string;
  orderId: string;
  productId: string;
  vendor: string;
  cost: number;
  qty?: number;
  sku?: string;
  variant?: string;
  created: string;
  status: number;
  proof?: string;
  deliveredAt?: string;
  returned?: boolean;
  cancelled?: boolean;
  customer: string;
  governorate: string;
  address: string;
  phone: string;
};
export const demoNow = () => Date.now();
export function initialOperations(): OpItem[] {
  const now = Date.now();
  return [
    {
      id: "D-01",
      orderId: "DEMO-1001",
      productId: "sofa-459",
      vendor: "A",
      cost: 14000,
      created: new Date(now - 9 * DAY).toISOString(),
      status: 2,
      customer: "عميل تجريبي أ",
      governorate: "القاهرة",
      address: "عنوان افتراضي للعرض — منطقة أ",
      phone: "رقم مخفي في المثال",
    },
    {
      id: "D-02",
      orderId: "DEMO-1001",
      productId: "wardrobe-203",
      vendor: "B",
      cost: 10000,
      created: new Date(now - 12 * DAY).toISOString(),
      status: 3,
      customer: "عميل تجريبي أ",
      governorate: "القاهرة",
      address: "عنوان افتراضي للعرض — منطقة أ",
      phone: "رقم مخفي في المثال",
    },
    {
      id: "D-03",
      orderId: "DEMO-1002",
      productId: "corner-419",
      vendor: "A",
      cost: 13000,
      created: new Date(now - 18 * DAY - 1000).toISOString(),
      status: 3,
      customer: "عميل تجريبي ب",
      governorate: "الإسكندرية",
      address: "عنوان افتراضي للعرض — منطقة ب",
      phone: "رقم مخفي في المثال",
    },
    {
      id: "D-04",
      orderId: "DEMO-1003",
      productId: "dw-357",
      vendor: "B",
      cost: 3000,
      created: new Date(now - 20 * DAY).toISOString(),
      status: 4,
      deliveredAt: new Date(now - DAY).toISOString(),
      proof: "إثبات تجريبي",
      customer: "عميل تجريبي ج",
      governorate: "الجيزة",
      address: "عنوان افتراضي للعرض — منطقة ج",
      phone: "رقم مخفي في المثال",
    },
    {
      id: "D-05",
      orderId: "DEMO-1004",
      productId: "com-02",
      vendor: "B",
      cost: 1100,
      created: new Date(now - 5 * DAY).toISOString(),
      status: 1,
      customer: "عميل تجريبي د",
      governorate: "القاهرة",
      address: "عنوان افتراضي للعرض — منطقة د",
      phone: "رقم مخفي في المثال",
    },
  ];
}
export const vendorFor = (id: string) =>
  ["wardrobe-203", "dw-357", "com-02"].includes(id) ? "B" : "A";
export const governors = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "القليوبية",
  "الشرقية",
  "الدقهلية",
  "البحيرة",
  "الغربية",
  "المنوفية",
  "كفر الشيخ",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "شمال سيناء",
  "جنوب سيناء",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "الوادي الجديد",
  "مطروح",
];
