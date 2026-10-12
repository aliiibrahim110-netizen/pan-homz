import { createContext, useContext, useState, type ReactNode } from "react";
import { products } from "./data/catalog";
import { initialOperations, vendorFor, type OpItem } from "./data/operations";
export type CatalogMap = Record<
  string,
  { active: boolean; vendor: string; rank: number }
>;
export type CartLine = {
  id: string;
  sku: string;
  variant?: string;
  qty: number;
};
export type Order = {
  id: string;
  created: string;
  lines: CartLine[];
  total: number;
  payment: string;
  governorate: string;
  verificationHash: string;
};
function read<T>(key: string, initial: T): T {
  try {
    const v = localStorage.getItem("ph-" + key);
    return v ? JSON.parse(v) : initial;
  } catch {
    return initial;
  }
}
function usePersist<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => read(key, initial));
  const set = (next: T | ((x: T) => T)) =>
    setState((old) => {
      const value =
        typeof next === "function" ? (next as (x: T) => T)(old) : next;
      try {
        localStorage.setItem("ph-" + key, JSON.stringify(value));
      } catch {}
      return value;
    });
  return [state, set] as const;
}
function useStore() {
  const [catalog, setCatalog] = usePersist<CatalogMap>(
    "catalog",
    Object.fromEntries(
      products.map((p, n) => [
        p.id,
        { active: true, vendor: vendorFor(p.id), rank: n + 1 },
      ]),
    ),
  );
  const [cart, setCart] = usePersist<CartLine[]>("cart", []);
  const [wishlist, setWishlist] = usePersist<string[]>("wishlist", []);
  const [orders, setOrders] = usePersist<Order[]>("orders", []);
  const [operations, setOperations] = usePersist<OpItem[]>(
    "operations",
    initialOperations(),
  );
  const [logs, setLogs] = usePersist<string[]>("logs", []);
  const recordLog = (message: string) =>
    setLogs((old) =>
      [
        new Date().toLocaleString("ar-EG-u-nu-latn", {
          timeZone: "Africa/Cairo",
        }) +
          " · " +
          message,
        ...old,
      ].slice(0, 200),
    );
  const [promo, setPromo] = usePersist("promo", false);
  const [recent, setRecent] = usePersist<string[]>("recent", []);
  const [toast, setToast] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };
  const add = (id: string, sku?: string, qty = 1) => {
    const p = products.find((p) => p.id === id)!;
    if (!catalog[p.id].active) {
      notify("هذا المنتج مسودة في نموذج العرض");
      return;
    }
    const variant = p.variants?.find((v) => v.sku === (sku || p.sku));
    setCart((old) => {
      const found = old.find((l) => l.sku === (sku || p.sku));
      return found
        ? old.map((l) =>
            l === found ? { ...l, qty: Math.min(20, l.qty + qty) } : l,
          )
        : [...old, { id, sku: sku || p.sku, variant: variant?.label, qty }];
    });
    notify("اتضاف المنتج لسلتك");
  };
  const toggleWish = (id: string) =>
    setWishlist((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  const createOrder = (
    total: number,
    payment: string,
    governorate: string,
    verificationHash: string,
  ) => {
    const id = "DEMO-" + Date.now().toString(36).toUpperCase();
    const created = new Date().toISOString();
    const order = {
      id,
      created,
      lines: cart,
      total,
      payment,
      governorate,
      verificationHash,
    };
    setOrders((old) => [order, ...old]);
    recordLog("تم إنشاء الطلب التجريبي " + id);
    setOperations((old) => [
      ...cart.map((l, i) => ({
        id: id + "-" + i,
        orderId: id,
        productId: l.id,
        vendor: catalog[l.id].vendor,
        cost: 0,
        qty: l.qty,
        sku: l.sku,
        variant: l.variant,
        created,
        status: 0,
        customer: "عميل عرض محلي",
        governorate,
        address: "تفاصيل شخصية لا تُحفظ في العرض",
        phone: "غير محفوظ",
      })),
      ...old,
    ]);
    setCart([]);
    setPromo(false);
    return id;
  };
  const updateCatalog = (id: string, patch: Partial<CatalogMap[string]>) => {
    recordLog("تم تعديل إعدادات عرض المنتج " + id);
    setCatalog((old) => ({ ...old, [id]: { ...old[id], ...patch } }));
    if (patch.active === false)
      setCart((old) => old.filter((l) => l.id !== id));
  };
  return {
    logs,
    recordLog,
    catalog,
    updateCatalog,
    cart,
    setCart,
    wishlist,
    toggleWish,
    orders,
    operations,
    setOperations,
    promo,
    setPromo,
    recent,
    setRecent,
    toast,
    notify,
    add,
    cartOpen,
    setCartOpen,
    createOrder,
  };
}
const Context = createContext<ReturnType<typeof useStore> | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const state = useStore();
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export const useShop = () => useContext(Context)!;
