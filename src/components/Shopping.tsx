import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Trash2,
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  Truck,
  CreditCard,
  Banknote,
  PackageCheck,
  Package,
  Check,
  ClipboardList,
} from "lucide-react";
import { products, price } from "../data/catalog";
import { totals, steps } from "../data/domain.mjs";
import { governors } from "../data/operations";
import { useShop } from "../store";
import { ProductImage, Quantity, DemoNote, Empty, ButtonLink } from "./UI";
export async function phoneHash(phone: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(phone),
  );
  return Array.from(new Uint8Array(bytes))
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
export function CartContents({ compact = false }: { compact?: boolean }) {
  const s = useShop();
  if (!s.cart.length)
    return (
      <Empty
        title="سلتك مستنية اختياراتك"
        text="ابدأ بقطعة تحبها، وخلي بيتك أريح."
      />
    );
  return (
    <div className={"cart-lines " + (compact ? "compact" : "")}>
      {s.cart.map((l) => {
        const p = products.find((p) => p.id === l.id)!;
        return (
          <article className="cart-line" key={l.sku}>
            <Link
              className="cart-image"
              to={"/product/" + p.id}
              onClick={() => s.setCartOpen(false)}
            >
              <ProductImage p={p} />
            </Link>
            <div className="cart-line-info">
              <Link to={"/product/" + p.id}>
                <h3>{p.short}</h3>
              </Link>
              {l.variant && <small>اتجاه الشيزلونج: {l.variant}</small>}
              <bdi className="sku">{l.sku}</bdi>
              <strong>{price(p.price * l.qty)}</strong>
              <Quantity
                value={l.qty}
                onChange={(qty) =>
                  s.setCart((old) =>
                    old.map((x) => (x.sku === l.sku ? { ...x, qty } : x)),
                  )
                }
              />
            </div>
            <button
              className="icon-button remove"
              aria-label={"حذف " + p.short}
              onClick={() =>
                s.setCart((old) => old.filter((x) => x.sku !== l.sku))
              }
            >
              <Trash2 size={17} />
            </button>
          </article>
        );
      })}
    </div>
  );
}
export function Summary({
  governorate = "القاهرة",
  checkout = false,
}: {
  governorate?: string;
  checkout?: boolean;
}) {
  const s = useShop();
  const [code, setCode] = useState(s.promo ? "PAN10" : "");
  const [error, setError] = useState("");
  const t = totals(
    s.cart.map((l) => ({
      ...l,
      price: products.find((p) => p.id === l.id)!.price,
    })),
    s.promo,
    governorate,
  );
  return (
    <aside className="order-summary">
      <h2>ملخص الطلب</h2>
      <dl>
        <div>
          <dt>قيمة المنتجات</dt>
          <dd>{price(t.subtotal)}</dd>
        </div>
        {s.promo && (
          <div className="promo-applied">
            <dt>
              خصم PAN10 (10٪)
              <button
                className="text-link"
                onClick={() => {
                  s.setPromo(false);
                  setCode("");
                }}
              >
                إلغاء
              </button>
            </dt>
            <dd>− {price(t.discount)}</dd>
          </div>
        )}
        <div>
          <dt>التوصيل التجريبي</dt>
          <dd>{price(t.shipping)}</dd>
        </div>
      </dl>
      <form
        className="promo-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim().toUpperCase() === "PAN10") {
            s.setPromo(true);
            setError("");
            s.notify("اتطبق خصم العرض التجريبي 10٪");
          } else setError("الكود غير متاح. جرّب PAN10 في العرض التجريبي.");
        }}
      >
        <label htmlFor="promo-code">عندك كود خصم؟</label>
        <div>
          <input
            id="promo-code"
            placeholder="PAN10"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            dir="ltr"
          />
          <button type="submit">تطبيق</button>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </form>
      <div className="total">
        <span>الإجمالي</span>
        <strong data-testid="cart-total">{price(t.total)}</strong>
      </div>
      <p className="tax-note">
        سياسة العرض: الأسعار شاملة الضريبة. الخصم لا يشمل التوصيل.
      </p>
      <p className="tax-note">
        رسوم التوصيل: 250 ج.م للقاهرة والجيزة، 450 ج.م لباقي المحافظات. تُحسب
        للمحافظة المختارة.
      </p>
      {!checkout && (
        <ButtonLink to="/checkout">إتمام الطلب التجريبي</ButtonLink>
      )}
      <small className="secure">
        <LockKeyhole size={14} /> محاكاة محلية · لا يتم تحصيل أموال
      </small>
    </aside>
  );
}
export function CartPage() {
  const s = useShop();
  return (
    <main className="container page">
      <div className="breadcrumbs">
        <Link to="/">الرئيسية</Link>
        <span>/</span>
        <span>سلة التسوق</span>
      </div>
      <h1>اختياراتك لبيت أريح</h1>
      <DemoNote />
      {s.cart.length ? (
        <div className="cart-layout">
          <div>
            <CartContents />
            <Link className="text-link" to="/collections/all">
              كمل تسوقك
              <ArrowLeft size={17} />
            </Link>
          </div>
          <Summary />
        </div>
      ) : (
        <Empty title="سلتك فاضية" />
      )}
    </main>
  );
}
export function Checkout() {
  const s = useShop();
  const navigate = useNavigate();
  const [gov, setGov] = useState("القاهرة");
  const [payment, setPayment] = useState("الدفع عند الاستلام");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const fields = [
    ["name", "الاسم بالكامل"],
    ["phone", "رقم الموبايل"],
    ["city", "المدينة أو المنطقة"],
    ["address", "العنوان بالتفصيل"],
  ];
  if (!s.cart.length)
    return (
      <main className="container page">
        <Empty title="أضف منتجات للسلة أولًا" />
      </main>
    );
  return (
    <main className="container page">
      <div className="breadcrumbs">
        <Link to="/cart">سلة التسوق</Link>
        <span>/</span>
        <span>إتمام الطلب</span>
      </div>
      <h1>خطوة أخيرة… وبيتك أحلى</h1>
      <DemoNote>
        طلب تجريبي فقط. لا يتم الدفع أو إرسال بياناتك لأي خدمة، ولا نحتفظ بالاسم
        أو العنوان أو رقم الموبايل الخام.
      </DemoNote>
      <div className="cart-layout">
        <form
          className="checkout-form panel"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const next: Record<string, string> = {};
            fields.forEach(([key, label]) => {
              if (!String(form.get(key) || "").trim())
                next[key] = "من فضلك أدخل " + label;
            });
            const phone = String(form.get("phone") || "").trim();
            if (phone && !/^01[0125]\d{8}$/.test(phone))
              next.phone = "أدخل رقم موبايل مصري صحيح من 11 رقمًا.";
            setErrors(next);
            if (Object.keys(next).length) return;
            setBusy(true);
            const t = totals(
              s.cart.map((l) => ({
                ...l,
                price: products.find((p) => p.id === l.id)!.price,
              })),
              s.promo,
              gov,
            );
            const hash = await phoneHash(phone);
            const id = s.createOrder(t.total, payment, gov, hash);
            navigate("/order/" + id);
          }}
        >
          <h2>بيانات التوصيل</h2>
          <div className="form-grid">
            {fields.map(([key, label]) => (
              <label key={key} className={key === "address" ? "span-2" : ""}>
                {label}
                <input
                  aria-label={label}
                  name={key}
                  type={key === "phone" ? "tel" : "text"}
                  autoComplete={
                    key === "phone"
                      ? "tel"
                      : key === "name"
                        ? "name"
                        : key === "address"
                          ? "street-address"
                          : "address-level2"
                  }
                  aria-invalid={!!errors[key]}
                  aria-describedby={errors[key] ? key + "-error" : undefined}
                />
                {errors[key] && (
                  <small id={key + "-error"} className="error" role="alert">
                    {errors[key]}
                  </small>
                )}
              </label>
            ))}
            <label>
              المحافظة
              <select value={gov} onChange={(e) => setGov(e.target.value)}>
                {governors.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </label>
            <label className="span-2">
              ملاحظات إضافية (اختياري)
              <textarea name="notes" rows={3} />
            </label>
          </div>
          <h2>طريقة الدفع — محاكاة</h2>
          <div className="payment-options">
            {["الدفع عند الاستلام", "بطاقة بنكية", "ValU"].map((v, i) => (
              <label key={v} className={payment === v ? "selected" : ""}>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === v}
                  onChange={() => setPayment(v)}
                />
                {i === 0 ? <Banknote size={22} /> : <CreditCard size={22} />}
                <span>
                  {v}
                  <small>تجريبي · لا يوجد تحصيل أو تمويل</small>
                </span>
              </label>
            ))}
          </div>
          <p className="tax-note">
            لا تدخل بيانات بطاقة أو بيانات حساسة. جميع وسائل الدفع هنا للعرض
            فقط.
          </p>
          <button disabled={busy} className="button full" type="submit">
            {busy ? "جارٍ إنشاء الطلب…" : "تأكيد الطلب التجريبي"}
            <ArrowLeft size={18} />
          </button>
        </form>
        <Summary governorate={gov} checkout />
      </div>
    </main>
  );
}
export function Confirmation() {
  const { id } = useParams();
  const s = useShop();
  const order = s.orders.find((o) => o.id === id);
  return (
    <main className="container page">
      {order ? (
        <>
          <div className="confirmation">
            <CheckCircle2 size={64} />
            <span className="eyebrow">كل خطوة واضحة</span>
            <h1>تم إنشاء طلبك التجريبي</h1>
            <p>شكرًا لاكتشافك PAN HOMZ. هذا تأكيد للعرض فقط.</p>
            <bdi className="order-number">{order.id}</bdi>
            <div>
              <strong>{price(order.total)}</strong>
              <span>{order.payment} · محاكاة</span>
            </div>
            <ButtonLink to={"/track-order?order=" + order.id}>
              تتبع الطلب
            </ButtonLink>
          </div>
          <DemoNote>
            لم تتم أي معاملة مالية أو حجز للمخزون. استخدم نفس رقم الموبايل
            للتحقق المحلي من طلبك.
          </DemoNote>
          <ProductGridForOrder ids={order.lines.map((l) => l.id)} />
        </>
      ) : (
        <Empty title="هذا الطلب غير موجود في جلسة العرض" />
      )}
    </main>
  );
}
function ProductGridForOrder({ ids }: { ids: string[] }) {
  return (
    <div className="confirmation-lines">
      {ids.map((id, i) => {
        const p = products.find((p) => p.id === id)!;
        return (
          <div key={i}>
            <span>{p.short}</span>
            <Link to={"/product/" + id}>عرض المنتج</Link>
          </div>
        );
      })}
    </div>
  );
}
export function Tracking() {
  const s = useShop();
  const [search] = useState(
    () => new URLSearchParams(window.location.search).get("order") || "",
  );
  const [id, setId] = useState(search);
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState("");
  const [error, setError] = useState("");
  const items = s.operations.filter((i) => i.orderId === verified);
  const allDelivered =
    items.length > 0 &&
    items.every((i) => i.status === 4 && !i.cancelled && !i.returned);
  return (
    <main className="container page narrow">
      <small className="eyebrow">راحة تعرف مكانها</small>
      <h1>تتبع طلبك</h1>
      <p className="lead">اعرف طلبك وصل لفين، خطوة بخطوة.</p>
      <DemoNote>
        بيانات وتتبع تجريبيان فقط. مراحل كل منتج مستقلة، ولا توجد اتصال بشركة
        شحن.
      </DemoNote>
      <form
        className="tracking-form panel"
        onSubmit={async (e) => {
          e.preventDefault();
          const order = s.orders.find((o) => o.id === id.trim());
          const ok =
            (id.trim() === "DEMO-1001" && phone === "00000000000") ||
            (order && order.verificationHash === (await phoneHash(phone)));
          if (ok) {
            setVerified(id.trim());
            setError("");
          } else {
            setVerified("");
            setError("لم نتمكن من التحقق. راجع رقم الطلب ورقم الموبايل.");
          }
        }}
      >
        <div className="form-grid">
          <label>
            رقم الطلب
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              dir="ltr"
              required
            />
          </label>
          <label>
            رقم الموبايل
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              required
            />
          </label>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="button" type="submit">
          عرض حالة الطلب
          <ArrowLeft size={17} />
        </button>
        <button
          className="text-link"
          type="button"
          onClick={() => {
            setId("DEMO-1001");
            setPhone("00000000000");
            setVerified("DEMO-1001");
            setError("");
          }}
        >
          جرّب المثال الافتراضي DEMO-1001
        </button>
        <small>
          رقم التحقق الافتراضي للمثال: 00000000000 · لا يمثل رقمًا حقيقيًا.
        </small>
      </form>
      {verified && (
        <section className="tracking-results">
          <div className="section-heading">
            <h2>
              الطلب <bdi>{verified}</bdi>
            </h2>
            <span className="badge">
              {allDelivered ? "تم توصيل كل المنتجات" : "متابعة كل منتج على حدة"}
            </span>
          </div>
          {items.map((item) => {
            const p = products.find((p) => p.id === item.productId)!;
            return (
              <article className="tracking-item panel" key={item.id}>
                <h3>{p.short}</h3>
                <p className="tax-note">
                  الكمية: {item.qty || 1}
                  {item.variant && " · الاتجاه: " + item.variant}
                </p>
                <small>
                  تاريخ الطلب:{" "}
                  {new Date(item.created).toLocaleDateString(
                    "ar-EG-u-nu-latn",
                    { timeZone: "Africa/Cairo" },
                  )}
                </small>
                {item.cancelled || item.returned ? (
                  <div className="badge">
                    {item.returned
                      ? "تم تسجيل مرتجع تجريبي"
                      : "تم إلغاء هذا المنتج"}
                  </div>
                ) : (
                  <ol className="timeline">
                    {steps.map((step, n) => (
                      <li
                        key={step}
                        className={n <= item.status ? "complete" : ""}
                      >
                        <span>
                          {n < item.status ? (
                            <Check size={15} />
                          ) : n === 4 ? (
                            <PackageCheck size={17} />
                          ) : n === 0 ? (
                            <ClipboardList size={17} />
                          ) : (
                            <Package size={17} />
                          )}
                        </span>
                        <strong>{step}</strong>
                        {n === item.status && <small>المرحلة الحالية</small>}
                      </li>
                    ))}
                  </ol>
                )}
                <div className="demo-tracking-controls">
                  <span>تحكم العرض:</span>
                  {steps.map((step, n) => (
                    <button
                      key={n}
                      disabled={
                        item.cancelled || item.returned || n === item.status
                      }
                      onClick={() =>
                        s.setOperations((old) =>
                          old.map((x) =>
                            x.id === item.id
                              ? {
                                  ...x,
                                  status: n,
                                  deliveredAt:
                                    n === 4
                                      ? new Date().toISOString()
                                      : undefined,
                                  proof:
                                    n === 4 ? "إثبات محاكاة العرض" : x.proof,
                                }
                              : x,
                          ),
                        )
                      }
                    >
                      {step}
                    </button>
                  ))}
                </div>
                <p className="tax-note">
                  تغيير مرحلة التسليم هنا يرفق إثبات محاكاة؛ مركز الموردين يتطلب
                  رفع إثبات.
                </p>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
