import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Headphones,
  Play,
  Square,
  ChevronLeft,
  Home,
} from "lucide-react";
import { categories, products, searchProducts } from "../data/catalog";
import { useShop } from "../store";
import { Modal, DemoNote } from "./UI";
import { CartContents } from "./Shopping";
export function Header() {
  const shop = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    setActive(null);
    setMobile(false);
    setFocus(false);
  }, [location.pathname]);
  const results = query
    ? searchProducts(query)
        .filter((p) => shop.catalog[p.id].active)
        .slice(0, 4)
    : [];
  const category = categories.find((c) => c.id === active);
  return (
    <>
      <div className="announcement">
        <span>أثاث على ذوقك… وراحة في كل ركن</span>
        <Link to="/track-order">
          تتبع طلبك <Truck size={14} />
        </Link>
      </div>
      <header className="header">
        <div className="header-main container">
          <button
            className="mobile-menu icon-button"
            aria-label="فتح القائمة"
            onClick={() => setMobile(true)}
          >
            <Menu />
          </button>
          <Link className="logo" to="/" aria-label="PAN HOMZ الرئيسية">
            <span>
              PAN<span className="logo-o">HOMZ</span>
              <i />
            </span>
            <small>بيتك. على ذوقك.</small>
          </Link>
          <div className="search-wrap">
            <form
              className="search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate("/search?q=" + encodeURIComponent(query));
                setFocus(false);
              }}
            >
              <Search size={21} />
              <input
                aria-label="ابحث عن الأثاث"
                placeholder="بتدور على إيه لبيتك؟"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocus(true)}
              />
              <button type="submit" aria-label="تنفيذ البحث">
                <ArrowLeft size={18} />
              </button>
            </form>
            {focus && query && (
              <div className="search-suggestions">
                {results.length ? (
                  results.map((p) => (
                    <Link key={p.id} to={"/product/" + p.id}>
                      {p.short}
                      <ArrowLeft size={15} />
                    </Link>
                  ))
                ) : (
                  <p>لا توجد نتائج لهذا البحث</p>
                )}
                <Link to={"/search?q=" + encodeURIComponent(query)}>
                  عرض كل النتائج
                </Link>
              </div>
            )}
          </div>
          <div className="header-actions">
            <Link to="/account" aria-label="حسابي">
              <UserRound />
              <span>حسابي</span>
            </Link>
            <Link to="/wishlist" aria-label="المفضلة" className="count-wrap">
              <Heart />
              <span>المفضلة</span>
              {shop.wishlist.length > 0 && <b>{shop.wishlist.length}</b>}
            </Link>
            <button
              aria-label="سلة التسوق"
              className="cart-trigger count-wrap"
              onClick={() => shop.setCartOpen(true)}
            >
              <ShoppingBag />
              <span>سلة التسوق</span>
              <b>{shop.cart.reduce((n, l) => n + l.qty, 0)}</b>
            </button>
          </div>
        </div>
        <nav className="category-nav" aria-label="الأقسام">
          <div
            className="container nav-inner"
            onMouseLeave={() => setActive(null)}
          >
            {categories.map((c) => (
              <div
                className="nav-category"
                key={c.id}
                onMouseEnter={() => setActive(c.id)}
              >
                <Link to={"/collections/" + c.id}>{c.name}</Link>
                <button
                  aria-expanded={active === c.id}
                  aria-label={"فتح أقسام " + c.name}
                  onClick={() => setActive(active === c.id ? null : c.id)}
                >
                  <ChevronDown size={13} />
                </button>
              </div>
            ))}
            <Link className="offers" to="/collections/offers">
              العروض <span className="tiny-dot" />
            </Link>
            <Link to="/collections/all">اختيارات PAN HOMZ</Link>
            <span className="nav-note">تفاصيل صغيرة، راحة كبيرة</span>
            {category && (
              <div
                className="mega-menu"
                onKeyDown={(e) => e.key === "Escape" && setActive(null)}
              >
                <div>
                  <small>اكتشف مجموعاتنا</small>
                  <h3>{category.name}</h3>
                  <Link
                    className="text-link"
                    to={"/collections/" + category.id}
                  >
                    كل {category.name}
                    <ArrowLeft size={17} />
                  </Link>
                </div>
                <div className="mega-links">
                  {category.children.map((c) => (
                    <div key={c.id}>
                      <Link to={"/collections/" + c.id}>
                        {c.name}
                        <ArrowLeft size={14} />
                      </Link>
                      {c.children?.map((sub) => (
                        <Link
                          className="sub-link"
                          key={sub.id}
                          to={"/collections/" + sub.id}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mega-editorial">
                  <img
                    src={category.photo}
                    alt={"تصور تحريري لـ" + category.name}
                  />
                  <span>{category.tag}</span>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
      {mobile && (
        <Modal
          title="اكتشف الأقسام"
          drawer
          side="start"
          onClose={() => setMobile(false)}
        >
          <div className="mobile-links">
            {categories.map((c) => (
              <details key={c.id}>
                <summary>
                  <Link to={"/collections/" + c.id}>{c.name}</Link>
                  <ChevronDown size={18} />
                </summary>
                {c.children.map((s) => (
                  <div key={s.id}>
                    <Link to={"/collections/" + s.id}>{s.name}</Link>
                    {s.children?.map((sub) => (
                      <Link key={sub.id} to={"/collections/" + sub.id}>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </details>
            ))}
            <Link to="/collections/offers">العروض</Link>
            <Link to="/track-order">تتبع الطلب</Link>
            <Link to="/seller-center">مركز الموردين</Link>
          </div>
        </Modal>
      )}
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link className="logo" to="/">
            <span>
              PAN<span className="logo-o">HOMZ</span>
              <i />
            </span>
          </Link>
          <p>
            أثاث يشبهك، وراحة تجمعك.
            <br />
            اكتشف تجربة واحدة لاختيارات الأثاث المصري.
          </p>
          <span className="footer-demo">تجربة عرض مستقلة</span>
        </div>
        <div>
          <h3>اختار لبيتك</h3>
          {categories.map((c) => (
            <Link key={c.id} to={"/collections/" + c.id}>
              {c.name}
            </Link>
          ))}
        </div>
        <div>
          <h3>هنا علشانك</h3>
          <Link to="/about">عن PAN HOMZ</Link>
          <Link to="/contact">تواصل معنا</Link>
          <Link to="/faq">الأسئلة الشائعة</Link>
          <Link to="/track-order">تتبع الطلب</Link>
          <Link to="/shipping">الشحن والتوصيل</Link>
        </div>
        <div>
          <h3>تسوق باطمئنان</h3>
          <Link to="/warranty">الضمان</Link>
          <Link to="/returns">الاستبدال والاسترجاع</Link>
          <Link to="/privacy">سياسة الخصوصية</Link>
          <Link to="/terms">الشروط والأحكام</Link>
          <Link to="/seller-center">مركز الموردين</Link>
          <Link to="/admin/demo">الإدارة التجريبية</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} PAN HOMZ · عرض تجريبي</span>
        <span>مصمم لبيوتنا، وللحظاتنا.</span>
      </div>
    </footer>
  );
}
export function TrustStrip() {
  return (
    <div className="trust-strip container">
      <div>
        <ShieldCheck />
        <span>
          <strong>راحة تطمنك</strong>
          <small>ضمان سنة وفق سياسة العرض</small>
        </span>
      </div>
      <div>
        <Truck />
        <span>
          <strong>كل خطوة واضحة</strong>
          <small>تتبع مراحل طلبك التجريبي</small>
        </span>
      </div>
      <div>
        <ShoppingBag />
        <span>
          <strong>اختيارات على ذوقك</strong>
          <small>من عينات كتالوج PAN HOMZ</small>
        </span>
      </div>
      <div>
        <Headphones />
        <span>
          <strong>هنا علشان نساعدك</strong>
          <Link to="/contact">اكتشف مركز المساعدة</Link>
        </span>
      </div>
    </div>
  );
}
const tour = [
  ["/", "هوية PAN HOMZ"],
  ["/collections/living", "اكتشف الأقسام"],
  ["/collections/sofas", "تصفح المنتجات"],
  ["/product/corner-419", "تفاصيل واتجاه الركنة"],
  ["/cart", "السلة والشراء التجريبي"],
  ["/track-order", "تتبع كل منتج"],
  ["/seller-center/demo", "مركز الموردين"],
  ["/admin/demo", "إدارة العمليات"],
];
export function Presenter() {
  const navigate = useNavigate();
  const location = useLocation();
  const [enabled, setEnabled] = useState(
    () => new URLSearchParams(location.search).get("demo") === "1",
  );
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(location.search).get("demo") === "1")
      setEnabled(true);
  }, [location.search]);
  if (!enabled) return null;
  return (
    <div className="presenter">
      <span className="tiny-dot" />
      <span>وضع العرض</span>
      {running ? (
        <>
          <span className="tour-title">
            {step + 1}/8 · {tour[step][1]}
          </span>
          <button
            aria-label="الخطوة السابقة"
            disabled={step === 0}
            onClick={() => {
              setStep(step - 1);
              navigate(tour[step - 1][0]);
            }}
          >
            ←
          </button>
          <button
            onClick={() => {
              const n = (step + 1) % tour.length;
              setStep(n);
              navigate(tour[n][0]);
            }}
          >
            التالي
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => setRunning(false)} aria-label="إيقاف الجولة">
            <Square size={14} />
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            setRunning(true);
            setStep(0);
            navigate("/");
          }}
        >
          <Play size={14} />
          الجولة الموجهة
        </button>
      )}
      <button aria-label="إخفاء أدوات العرض" onClick={() => setEnabled(false)}>
        ×
      </button>
    </div>
  );
}
export function GlobalOverlays() {
  const s = useShop();
  return (
    <>
      {s.toast && (
        <div className="toast" role="status">
          {s.toast}
        </div>
      )}
      {s.cartOpen && (
        <Modal title="سلة التسوق" drawer onClose={() => s.setCartOpen(false)}>
          <CartContents compact />
          <Link
            className="button full"
            to="/cart"
            onClick={() => s.setCartOpen(false)}
          >
            عرض السلة وإتمام الطلب
            <ArrowLeft size={18} />
          </Link>
        </Modal>
      )}
    </>
  );
}
