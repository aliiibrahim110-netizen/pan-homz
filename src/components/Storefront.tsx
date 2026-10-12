import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Truck,
  Maximize2,
  SlidersHorizontal,
  Check,
  Armchair,
} from "lucide-react";
import {
  products,
  categories,
  collectionNames,
  searchProducts,
  type Product,
} from "../data/catalog";
import { useShop } from "../store";
import {
  ButtonLink,
  SectionTitle,
  ProductGrid,
  ProductImage,
  Price,
  Empty,
  Quantity,
  Modal,
  DemoNote,
} from "./UI";
import { TrustStrip } from "./Layout";
export function Home() {
  return (
    <>
      <section className="hero">
        <img
          className="hero-image"
          src="/images/hero.webp"
          alt="تصور تحريري لغرفة معيشة دافئة؛ لا يمثل منتجًا محددًا في الكتالوج"
          fetchPriority="high"
        />
        <div className="hero-wash" />
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> تفاصيل تشبهك. بيت يريحك.
            </div>
            <h1>
              بيتك يستاهل
              <br />
              راحة <em>أكتر</em>
            </h1>
            <p>
              اختار الأثاث اللي يشبه ذوقك،
              <br />
              ويخلي كل ركن في بيتك أحلى.
            </p>
            <div className="hero-buttons">
              <ButtonLink to="/collections/corners">تسوق الركنات</ButtonLink>
              <Link className="hero-secondary" to="/collections/all">
                اكتشف المجموعات <ArrowLeft size={18} />
              </Link>
            </div>
            <div className="hero-foot">
              <span className="line" /> لحظات بسيطة. راحة تدوم.
            </div>
          </div>
        </div>
        <span className="editorial-label">صورة تحريرية للإلهام</span>
        <div className="hero-pagination">
          <small>مجموعة الإلهام / 01</small>
        </div>
      </section>
      <TrustStrip />
      <section className="section container" id="categories">
        <SectionTitle
          title="كل اللي بيتك محتاجه"
          sub="اختار القسم المناسب، واكتشف اختيارات تناسب مساحتك وذوقك."
        />
        <div className="category-grid">
          {categories.map((c) => (
            <Link
              className={"category-card category-" + c.id}
              key={c.id}
              to={"/collections/" + c.id}
            >
              <div
                className="category-image"
                style={{ backgroundImage: `url(${c.photo})` }}
              />
              {c.id === "storage" && (
                <div className="storage-art">
                  <Armchair size={90} />
                </div>
              )}
              <div className="category-caption">
                <div>
                  <small>{c.tag}</small>
                  <h3>{c.name}</h3>
                </div>
                <span className="round-arrow">
                  <ArrowLeft size={20} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="subtle-caption">
          صور الأقسام للإلهام؛ لا تمثل منتجات محددة.
        </p>
      </section>
      <section className="section featured-section">
        <div className="container">
          <SectionTitle
            title="اختيارات تستاهل تشوفها"
            sub="تفاصيل مدروسة، وخامات تحب تعيش معاها."
            to="/collections/all"
          />
          <DemoNote>
            عينات كتالوج أصلية · الأسعار تاريخية والخصومات محسوبة من السجلات،
            وليست عروضًا حية.
          </DemoNote>
          <ProductGrid items={products.slice(0, 4)} />
        </div>
      </section>
      <section className="container editorial-banner">
        <div className="editorial-photo">
          <img src="/images/hero.webp" alt="صورة تحريرية لركنة في غرفة معيشة" />
          <span className="editorial-label">صورة تحريرية للإلهام</span>
        </div>
        <div className="editorial-copy">
          <div className="eyebrow">للحظات اللي بتجمعنا</div>
          <h2>
            ركنتك المفضلة
            <br />
            في البيت
          </h2>
          <p>
            مساحة للراحة، ولمّة العيلة،
            <br />
            واللحظات اللي بتحبها.
          </p>
          <ButtonLink to="/collections/corners">اكتشف الركنات</ButtonLink>
          <span className="editorial-number">01 / لحظات البيت</span>
        </div>
      </section>
      <section className="section container">
        <SectionTitle
          title="بيت متجدد، على ذوقك"
          sub="ابدأ بركن واحد… وخلي الباقي يحكي حكايتك."
        />
        <div className="room-grid">
          <Link className="room-card room-bedroom" to="/collections/bedroom">
            <div className="room-photo" />
            <div>
              <small>راحة كل يوم</small>
              <h3>جدّد غرفة نومك</h3>
              <span>
                اكتشف الاختيارات <ArrowLeft size={16} />
              </span>
            </div>
          </Link>
          <Link className="room-card room-dining" to="/collections/dining">
            <div className="room-photo" />
            <div>
              <small>لَمّة من القلب</small>
              <h3>سفرة تجمع أحلى اللحظات</h3>
              <span>
                اكتشف القسم <ArrowLeft size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <section className="promo-band container">
        <div>
          <small>ميزة تجريبية للعرض</small>
          <h2>اختيارات حلوة… بسعر أحلى</h2>
          <p>جرّب خصم 10٪ على قيمة المنتجات في السلة باستخدام</p>
        </div>
        <div className="promo-code">
          <span dir="ltr">PAN10</span>
          <small>محاكاة فقط · لا يشمل التوصيل</small>
        </div>
        <ButtonLink secondary to="/collections/offers">
          اكتشف عروض الكتالوج
        </ButtonLink>
      </section>
      <section className="section container">
        <SectionTitle
          title="ركنات تستاهل التجربة"
          sub="اختار الاتجاه اللي يناسب مساحتك."
          to="/collections/corners"
        />
        <ProductGrid
          items={products.filter((p) => p.collection === "corners")}
        />
      </section>
      <section className="section container">
        <SectionTitle
          title="اختيارات لغرفة نومك"
          sub="تفاصيل صغيرة، تفرق في يومك."
          to="/collections/bedroom"
        />
        <ProductGrid items={products.filter((p) => p.parent === "bedroom")} />
      </section>
      <section className="section container">
        <SectionTitle
          title="وحدات تخزين عملية"
          sub="كل حاجة في مكانها، وكل ركن أهدى."
          to="/collections/storage"
        />
        <ProductGrid items={products.filter((p) => p.parent === "storage")} />
      </section>
      <section className="final-cta">
        <div className="container">
          <small>بيتك… مساحة تشبهك</small>
          <h2>كل ركن في بيتك له حكاية</h2>
          <p>ابدأ تختار الأثاث اللي يناسبك.</p>
          <ButtonLink to="/collections/all">ابدأ التسوق</ButtonLink>
        </div>
      </section>
    </>
  );
}
export function Collection() {
  const s = useShop();
  const { id = "all" } = useParams();
  const [params] = useSearchParams();
  const isSearch = window.location.pathname === "/search";
  const q = params.get("q") || "";
  const [sort, setSort] = useState("featured");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [max, setMax] = useState("");
  const [width, setWidth] = useState("");
  const [direction, setDirection] = useState("");
  const [dimensions, setDimensions] = useState<Record<string, string>>({});
  const [fabric, setFabric] = useState("");
  const [min, setMin] = useState("");
  const [filters, setFilters] = useState(false);
  const category = categories.find((c) => c.id === id);
  const base = useMemo(
    () =>
      (isSearch
        ? searchProducts(q)
        : products.filter(
            (p) =>
              id === "all" ||
              (id === "offers" && p.compare > p.price) ||
              p.parent === id ||
              p.collection === id,
          )
      ).filter((p) => s.catalog[p.id].active),
    [id, q, isSearch, s.catalog],
  );
  useEffect(() => {
    setMaterial("");
    setColor("");
    setMax("");
    setWidth("");
    setDirection("");
    setDimensions({});
    setFabric("");
    setMin("");
    setSort(id === "drawers" ? "asc" : "featured");
  }, [id, q]);
  let items = base.filter(
    (p) =>
      (!material || p.material === material) &&
      (!color || p.color === color) &&
      (!max || p.price <= Number(max)) &&
      (!width || p.width === Number(width)) &&
      (!direction || p.variants?.some((v) => v.label === direction)) &&
      (!fabric || p.fabric === fabric) &&
      (!min || p.price >= Number(min)) &&
      Object.entries(dimensions).every(
        ([k, v]) => !v || p[k as "height" | "depth" | "chaise"] === Number(v),
      ),
  );
  if (sort === "featured")
    items = [...items].sort(
      (a, b) => s.catalog[a.id].rank - s.catalog[b.id].rank,
    );
  if (sort === "asc") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "desc") items = [...items].sort((a, b) => b.price - a.price);
  const unique = (field: "material" | "color" | "width") => [
    ...new Set(base.map((p) => p[field]).filter((v) => v !== undefined)),
  ];
  const title = isSearch
    ? "نتائج البحث"
    : id === "all"
      ? "اختيارات PAN HOMZ"
      : id === "offers"
        ? "عروض الكتالوج"
        : collectionNames[id] || "المجموعة";
  const hasFilters =
    material ||
    color ||
    max ||
    width ||
    direction ||
    fabric ||
    min ||
    Object.values(dimensions).some(Boolean);
  return (
    <main className="container page">
      <div className="breadcrumbs">
        <Link to="/">الرئيسية</Link>
        <span>/</span>
        <span>{title}</span>
      </div>
      <div className="collection-heading">
        <div>
          <small className="eyebrow">مساحات تحب تعيش فيها</small>
          <h1>{title}</h1>
          <p>
            {isSearch
              ? `نتائج البحث عن «${q}»`
              : "اختيارات تناسب مساحتك وذوقك، بتفاصيل تستاهل."}
          </p>
        </div>
        <span className="collection-count">
          {base.length} منتجات في عينة الكتالوج
        </span>
      </div>
      {category && (
        <div className="subcategory-pills">
          {category.children.map((s) => (
            <Link key={s.id} to={"/collections/" + s.id}>
              {s.name}
            </Link>
          ))}
          {id === "storage" && (
            <>
              <Link to="/collections/wardrobes">دواليب</Link>
              <Link to="/collections/commodes">كومود</Link>
            </>
          )}
        </div>
      )}
      <DemoNote />
      {category && (
        <div className={"collection-scene scene-" + category.id}>
          <div style={{ backgroundImage: `url(${category.photo})` }} />
          <span>
            {category.tag}
            <small>صورة تحريرية للإلهام</small>
          </span>
        </div>
      )}
      <div className="collection-toolbar">
        <button
          className="secondary button"
          onClick={() => setFilters(!filters)}
          aria-expanded={filters}
        >
          <SlidersHorizontal size={17} /> تصفية النتائج{" "}
          {hasFilters && <span className="tiny-dot" />}
        </button>
        <span>{items.length} منتجات</span>
        <label className="sort-label">
          ترتيب حسب{" "}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">الموصى به</option>
            <option value="asc">السعر: من الأقل للأعلى</option>
            <option value="desc">السعر: من الأعلى للأقل</option>
          </select>
        </label>
      </div>
      <div className={"collection-body " + (filters ? "with-filters" : "")}>
        {filters && (
          <aside className="filter-panel">
            <h3>اختار المناسب ليك</h3>
            <label>
              السعر من (ج.م)
              <input
                type="number"
                min="0"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                placeholder="بدون حد أدنى"
              />
            </label>
            <label>
              السعر حتى (ج.م)
              <input
                type="number"
                min="0"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="كل الأسعار"
              />
            </label>
            {unique("material").length > 0 && (
              <label>
                الخامة
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                >
                  <option value="">كل الخامات</option>
                  {unique("material").map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            )}
            {unique("color").length > 0 && (
              <label>
                اللون
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option value="">كل الألوان</option>
                  {unique("color").map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            )}
            {base.length > 0 && (
              <label>
                العرض
                <select
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                >
                  <option value="">كل المقاسات</option>
                  {unique("width").map((v) => (
                    <option key={v} value={v}>
                      {v} سم
                    </option>
                  ))}
                </select>
              </label>
            )}
            {(["height", "depth", "chaise"] as const)
              .filter((k) => base.some((p) => p[k] !== undefined))
              .map((k) => (
                <label key={k}>
                  {k === "height"
                    ? "الارتفاع"
                    : k === "depth"
                      ? "العمق"
                      : "طول الشيزلونج"}
                  <select
                    value={dimensions[k] || ""}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, [k]: e.target.value })
                    }
                  >
                    <option value="">كل المقاسات</option>
                    {[
                      ...new Set(
                        base.map((p) => p[k]).filter((v) => v !== undefined),
                      ),
                    ].map((v) => (
                      <option key={v} value={v}>
                        {v} سم
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            {base.some((p) => p.fabric) && (
              <label>
                نوع القماش
                <select
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                >
                  <option value="">كل الأقمشة</option>
                  {[...new Set(base.map((p) => p.fabric).filter(Boolean))].map(
                    (v) => (
                      <option key={v}>{v}</option>
                    ),
                  )}
                </select>
              </label>
            )}
            {base.some((p) => p.variants) && (
              <label>
                اتجاه الشيزلونج
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                >
                  <option value="">كل الاتجاهات</option>
                  <option>يمين</option>
                  <option>شمال</option>
                </select>
              </label>
            )}
            <button
              className="text-link"
              onClick={() => {
                setMax("");
                setMaterial("");
                setColor("");
                setWidth("");
                setDirection("");
                setDimensions({});
                setFabric("");
                setMin("");
              }}
            >
              مسح كل الفلاتر
            </button>
          </aside>
        )}
        <div>
          {hasFilters && (
            <div className="active-filters">
              {[
                material,
                color,
                width && "العرض " + width + " سم",
                max && "حتى " + max + " ج.م",
                min && "من " + min + " ج.م",
                fabric,
                ...Object.entries(dimensions)
                  .filter(([k, v]) => v)
                  .map(
                    ([k, v]) =>
                      (k === "height"
                        ? "الارتفاع"
                        : k === "depth"
                          ? "العمق"
                          : "طول الشيزلونج") +
                      " " +
                      v +
                      " سم",
                  ),
                direction,
              ]
                .filter(Boolean)
                .map((v) => (
                  <span key={v}>{v}</span>
                ))}
            </div>
          )}
          {items.length ? (
            <ProductGrid items={items} />
          ) : (
            <Empty
              title={
                base.length
                  ? "لا توجد منتجات مطابقة"
                  : "لا توجد منتجات في عينة هذا القسم"
              }
              text={
                base.length
                  ? "غيّر الفلاتر للوصول إلى اختيار مناسب."
                  : "هذا القسم جزء من هيكل المتجر. ستظهر منتجاته عند تزويدنا بسجلات كتالوج موثقة."
              }
            />
          )}
        </div>
      </div>
    </main>
  );
}
export function ProductPage() {
  const { id } = useParams();
  const p = products.find((p) => p.id === id);
  const s = useShop();
  const [variant, setVariant] = useState("");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    setVariant(p?.sku || "");
    setQty(1);
    if (p)
      s.setRecent((old) =>
        [p.id, ...old.filter((x) => x !== p.id)].slice(0, 5),
      );
  }, [p?.id]);
  useEffect(() => {
    const existing = document.getElementById("product-schema");
    existing?.remove();
    if (!p || !s.catalog[p.id].active) return;
    const script = document.createElement("script");
    script.id = "product-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.title,
      sku: variant || p.sku,
      image: p.image,
      material: p.material,
      color: p.color,
      category: collectionNames[p.collection],
      width: { "@type": "QuantitativeValue", value: p.width, unitCode: "CMT" },
      depth: { "@type": "QuantitativeValue", value: p.depth, unitCode: "CMT" },
      height: {
        "@type": "QuantitativeValue",
        value: p.height,
        unitCode: "CMT",
      },
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [p?.id, variant, s.catalog]);
  if (!p || !s.catalog[p.id].active)
    return <Empty title="المنتج غير متاح في العرض الحالي" />;
  const specifications = [
    ["الخامة", p.material],
    ["اللون", p.color],
    ["نوع القماش", p.fabric],
    ["التشطيب", p.finish],
    ["العرض", p.width + " سم"],
    ["العمق", p.depth + " سم"],
    ["الارتفاع", p.height + " سم"],
    ["طول الشيزلونج", p.chaise && p.chaise + " سم"],
  ].filter((x) => x[1]);
  return (
    <main className="container page">
      <div className="breadcrumbs">
        <Link to="/">الرئيسية</Link>
        <span>/</span>
        <Link to={"/collections/" + p.parent}>{collectionNames[p.parent]}</Link>
        <span>/</span>
        <Link to={"/collections/" + p.collection}>
          {collectionNames[p.collection]}
        </Link>
      </div>
      <div className="product-detail">
        <div className="product-gallery">
          <div className="gallery-main">
            <ProductImage p={p} />
            <button
              className="icon-button gallery-zoom"
              aria-label="تكبير صورة المنتج"
              onClick={() => setZoom(true)}
            >
              <Maximize2 size={20} />
            </button>
          </div>
          <p className="subtle-caption">
            الصورة الأصلية للمنتج · الصورة لا تتغير بتغيير الاتجاه
          </p>
        </div>
        <div className="product-info">
          <small className="eyebrow">تفاصيل تستاهل تعيش معاها</small>
          <h1>{p.title}</h1>
          <Price p={p} />
          <p className="tax-note">
            السعر شامل ضريبة القيمة المضافة وفق سياسة العرض
          </p>
          <DemoNote>
            سعر تاريخي من عينة الكتالوج · الشراء محاكاة محلية فقط.
          </DemoNote>
          {p.variants && (
            <fieldset className="variant-selector">
              <legend>اتجاه الشيزلونج</legend>
              <div>
                {p.variants.map((v) => (
                  <button
                    key={v.sku}
                    className={variant === v.sku ? "selected" : ""}
                    onClick={() => setVariant(v.sku)}
                    aria-pressed={variant === v.sku}
                  >
                    {v.label}
                    {variant === v.sku && <Check size={16} />}
                  </button>
                ))}
              </div>
              <small>
                اختار الاتجاه المناسب لمساحتك. صورة المصدر موحدة للاتجاهين.
              </small>
            </fieldset>
          )}
          <p className="sku">
            رمز المنتج: <bdi>{variant || p.sku}</bdi>
          </p>
          <div className="purchase-controls">
            <Quantity value={qty} onChange={setQty} />
            <button
              className="button"
              onClick={() => {
                s.add(p.id, variant || p.sku, qty);
                s.setCartOpen(true);
              }}
            >
              أضف لسلة التسوق
              <ShoppingIcon />
            </button>
            <button
              className="icon-button"
              aria-label="إضافة للمفضلة"
              aria-pressed={s.wishlist.includes(p.id)}
              onClick={() => s.toggleWish(p.id)}
            >
              <Heart
                fill={s.wishlist.includes(p.id) ? "currentColor" : "none"}
              />
            </button>
          </div>
          <div className="product-assurances">
            <div>
              <Truck size={21} />
              <span>
                التوصيل خلال 7–15 يوم عمل
                <small>مدة العرض الإرشادية؛ لا يوجد حجز فعلي للمخزون.</small>
              </span>
            </div>
            <div>
              <ShieldCheck size={21} />
              <span>
                ضمان سنة ضد عيوب الصناعة
                <small>وفق سياسة الضمان التجريبية.</small>
              </span>
            </div>
          </div>
          <details open className="specifications">
            <summary>تفاصيل المنتج</summary>
            <dl>
              {specifications.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </details>
          <details className="specifications">
            <summary>التوصيل والاسترجاع</summary>
            <p>
              رسوم العرض: 250 ج.م للقاهرة والجيزة، و450 ج.م لباقي المحافظات.{" "}
              <Link to="/returns">اعرف سياسة الاسترجاع التجريبية</Link>.
            </p>
          </details>
        </div>
      </div>
      <section className="section">
        <SectionTitle title="اختيارات ممكن تعجبك" />
        <ProductGrid
          items={products
            .filter((x) => x.parent === p.parent && x.id !== p.id)
            .slice(0, 4)}
        />
      </section>
      {s.recent.filter((x) => x !== p.id).length > 0 && (
        <section className="section">
          <SectionTitle title="شفتها مؤخرًا" />
          <ProductGrid
            items={s.recent
              .filter((x) => x !== p.id)
              .map((x) => products.find((p) => p.id === x)!)
              .filter(Boolean)}
          />
        </section>
      )}
      {zoom && (
        <Modal title={p.short} onClose={() => setZoom(false)}>
          <div className="zoom-view">
            <ProductImage p={p} zoom />
          </div>
        </Modal>
      )}
    </main>
  );
}
function ShoppingIcon() {
  return <ArrowLeft size={18} />;
}
export function Wishlist() {
  const s = useShop();
  const items = products.filter(
    (p) => s.wishlist.includes(p.id) && s.catalog[p.id].active,
  );
  return (
    <main className="container page">
      <h1>اختياراتك المفضلة</h1>
      <p>احتفظ بالقطع اللي حبيتها، وارجع لها وقت ما تحب.</p>
      {items.length ? (
        <ProductGrid items={items} />
      ) : (
        <Empty
          title="لسه ما اخترتش مفضلاتك"
          text="اضغط على القلب جنب أي منتج علشان تحتفظ بيه هنا."
        />
      )}
    </main>
  );
}
