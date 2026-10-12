import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Plus,
  Minus,
  X,
  ImageOff,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { type Product, price, discount } from "../data/catalog";
import { useShop } from "../store";
export function ButtonLink({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={"button " + (secondary ? "secondary" : "")} to={to}>
      {children}
      <ArrowLeft size={18} />
    </Link>
  );
}
export function SectionTitle({
  title,
  sub,
  to,
  label = "شوف كل الاختيارات",
}: {
  title: string;
  sub?: string;
  to?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {to && (
        <Link className="text-link" to={to}>
          {label}
          <ArrowLeft size={18} />
        </Link>
      )}
    </div>
  );
}
export function ProductImage({
  p,
  zoom = false,
}: {
  p: Product;
  zoom?: boolean;
}) {
  const [error, setError] = useState(false);
  const [local, setLocal] = useState(true);
  useEffect(() => {
    setError(false);
    setLocal(true);
  }, [p.id]);
  return error ? (
    <div className="image-fallback">
      <ImageOff size={38} />
      <span>{p.short}</span>
      <small>صورة المنتج غير متاحة حاليًا</small>
    </div>
  ) : (
    <img
      loading="lazy"
      className={zoom ? "zoom-image" : ""}
      src={local ? p.localImage : p.image}
      alt={p.title}
      onError={() => (local ? setLocal(false) : setError(true))}
    />
  );
}
export function Price({ p }: { p: Product }) {
  return (
    <div className="price">
      <strong>{price(p.price)}</strong>
      {p.compare > p.price && <del>{price(p.compare)}</del>}
    </div>
  );
}
export function ProductCard({ p }: { p: Product }) {
  const shop = useShop();
  if (!shop.catalog[p.id].active) return null;
  return (
    <article className="product-card">
      <div className="product-picture">
        <Link to={"/product/" + p.id} aria-label={p.title}>
          <ProductImage p={p} />
        </Link>
        <span className="discount">خصم {discount(p)}٪</span>
        <button
          className={
            "icon-button wish " +
            (shop.wishlist.includes(p.id) ? "selected" : "")
          }
          aria-label={"إضافة للمفضلة: " + p.short}
          aria-pressed={shop.wishlist.includes(p.id)}
          onClick={() => shop.toggleWish(p.id)}
        >
          <Heart
            size={19}
            fill={shop.wishlist.includes(p.id) ? "currentColor" : "none"}
          />
        </button>
        <Link className="quick-view" to={"/product/" + p.id}>
          تفاصيل المنتج <ArrowLeft size={15} />
        </Link>
      </div>
      <div className="product-content">
        <small>{p.material}</small>
        <Link to={"/product/" + p.id}>
          <h3>{p.short}</h3>
        </Link>
        <p className="dimensions" dir="rtl">
          العرض {p.width} · العمق {p.depth} · الارتفاع {p.height} سم
        </p>
        <div className="product-bottom">
          <Price p={p} />
          {p.variants ? (
            <Link
              className="icon-button add"
              to={"/product/" + p.id}
              aria-label={"اختيار اتجاه " + p.short}
            >
              <Plus size={20} />
            </Link>
          ) : (
            <button
              className="icon-button add"
              onClick={() => shop.add(p.id)}
              aria-label={"أضف للسلة: " + p.short}
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
export function ProductGrid({ items }: { items: Product[] }) {
  const s = useShop();
  items = items.filter((p) => s.catalog[p.id].active);
  return (
    <div
      className={
        "product-grid " +
        (items.length === 1 ? "single" : items.length === 2 ? "sparse" : "")
      }
    >
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
export function Empty({
  title = "لا توجد منتجات مطابقة",
  text = "جرّب تغيير البحث أو اكتشف اختياراتنا المتاحة.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <div className="empty">
      <ShoppingBag size={42} />
      <h2>{title}</h2>
      <p>{text}</p>
      <ButtonLink to="/collections/all">اكتشف المنتجات</ButtonLink>
    </div>
  );
}
export function Quantity({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="quantity">
      <button
        aria-label="تقليل الكمية"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus size={16} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label="زيادة الكمية"
        disabled={value >= 20}
        onClick={() => onChange(Math.min(20, value + 1))}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
export function Modal({
  title,
  onClose,
  children,
  drawer = false,
  side = "end",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  drawer?: boolean;
  side?: "start" | "end";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={
          "modal " +
          (drawer ? "drawer" + (side === "start" ? " drawer-start" : "") : "")
        }
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="إغلاق">
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <div className="demo-note">
      {children ||
        "نسخة عرض تفاعلية · المنتجات والأسعار عينات تاريخية، ولا يتم تنفيذ طلبات أو مدفوعات فعلية."}
    </div>
  );
}
