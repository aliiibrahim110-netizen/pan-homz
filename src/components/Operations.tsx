import { dayKey } from "../data/dates";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Users,
  RotateCcw,
  Truck,
  Wallet,
  ChartNoAxesCombined,
  History,
  ArrowLeft,
  Download,
  Check,
  AlertTriangle,
  Clock,
  Upload,
  Store,
  ShieldCheck,
} from "lucide-react";
import { products, price, collectionNames } from "../data/catalog";
import { sla, finance, steps, advance, DAY } from "../data/domain.mjs";
import { type OpItem, vendorFor } from "../data/operations";
import { useShop } from "../store";
import { ButtonLink, DemoNote, Modal } from "./UI";
const tabs = [
  ["overview", "نظرة عامة", LayoutDashboard],
  ["orders", "الطلبات", ClipboardList],
  ["products", "المنتجات", Package],
  ["vendors", "الموردون", Users],
  ["returns", "المرتجعات", RotateCcw],
  ["delivery", "إدارة التوصيل", Truck],
  ["finance", "المستحقات", Wallet],
  ["reports", "تقارير الأداء", ChartNoAxesCombined],
  ["log", "سجل النظام", History],
] as const;
const stateNames = {
  within: "ضمن المدة المحددة",
  risk: "معرّض للتأخير",
  late: "متأخر",
};
export function SellerLanding() {
  return (
    <main className="container page">
      <div className="seller-landing">
        <div>
          <span className="eyebrow">شراكة تبني راحة</span>
          <h1>
            منتجاتك. عمليات أوضح.
            <br />
            فرص أكبر.
          </h1>
          <p className="lead">
            مركز الموردين في PAN HOMZ يجمع الطلبات، مراحل التنفيذ، ومراجعة
            المستحقات في تجربة واحدة.
          </p>
          <DemoNote>
            عرض محلي بموردين وسجلات افتراضية. لا يمثل موردين موثقين أو مستحقات
            حقيقية.
          </DemoNote>
          <ButtonLink to="/seller-center/demo">استكشف مركز الموردين</ButtonLink>
        </div>
        <div className="seller-visual">
          <Store size={70} />
          <h2>من الطلب إلى التسليم</h2>
          <div>
            {[
              "طلباتك المخصصة فقط",
              "تحديث مراحل التنفيذ",
              "متابعة المدة المحددة",
              "مراجعة المستحقات الأسبوعية",
            ].map((v) => (
              <span key={v}>
                <Check size={18} />
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
function downloadCsv(items: OpItem[], now: number) {
  const header = [
    "رقم الطلب",
    "البند",
    "المورد التجريبي",
    "تكلفة المورد التجريبية",
    "قيمة التسليم",
    "المرتجعات",
    "غرامة التأخير",
    "الصافي",
  ];
  const rows = items.map((i) => {
    const f = finance(i, now);
    return [
      i.orderId,
      i.id,
      i.vendor,
      i.cost,
      f.gross,
      f.returns,
      f.penalty,
      f.net,
    ];
  });
  const escaped = [header, ...rows]
    .map((row) =>
      row
        .map((cell) => '"' + String(cell).replaceAll('"', '""') + '"')
        .join(","),
    )
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + escaped], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "PAN-HOMZ-demo-settlement.csv";
  a.click();
  URL.revokeObjectURL(url);
}
export function Dashboard() {
  const admin = useLocation().pathname.startsWith("/admin");
  const s = useShop();
  const [vendor, setVendor] = useState("A");
  const [tab, setTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<OpItem | null>(null);
  const logs = s.logs;
  const [lookup, setLookup] = useState("");
  const now = Date.now();
  const scoped = s.operations.filter((i) => admin || i.vendor === vendor);
  const dateItems = scoped.filter(
    (i) =>
      (!dateFrom || dayKey(i.created) >= dateFrom) &&
      (!dateTo || dayKey(i.created) <= dateTo),
  );
  const active = scoped.filter((i) => !i.cancelled && !i.returned);
  const sums = dateItems.reduce(
    (a, i) => {
      const f = finance(i, now);
      return {
        gross: a.gross + f.gross,
        returns: a.returns + f.returns,
        penalty: a.penalty + f.penalty,
        net: a.net + f.net,
      };
    },
    { gross: 0, returns: 0, penalty: 0, net: 0 },
  );
  const weekly = dateItems
    .filter((i) => i.status === 4 && !i.cancelled)
    .reduce<Record<string, number>>((group, i) => {
      const date = new Date(dayKey(i.deliveredAt || i.created) + "T12:00:00Z");
      const day = (date.getUTCDay() + 6) % 7;
      date.setUTCDate(date.getUTCDate() - day);
      const week = dayKey(date);
      group[week] = (group[week] || 0) + finance(i, now).net;
      return group;
    }, {});
  const update = (item: OpItem, patch: Partial<OpItem>, message: string) => {
    s.setOperations((old) =>
      old.map((i) => (i.id === item.id ? { ...i, ...patch } : i)),
    );
    s.recordLog(message + " · " + item.id);
    s.notify(message);
    if (selected?.id === item.id) setSelected({ ...item, ...patch });
  };
  const next = (item: OpItem) => {
    try {
      const moved = advance(item);
      update(
        item,
        { status: moved.status, deliveredAt: moved.deliveredAt },
        "تم تحديث مرحلة المنتج",
      );
    } catch (e) {
      s.notify((e as Error).message);
    }
  };
  const displayed =
    filter === "all"
      ? dateItems
      : dateItems.filter((i) =>
          filter === "cancelled"
            ? i.cancelled
            : filter === "returned"
              ? i.returned
              : sla(i.created, now).state === filter,
        );
  const metrics = [
    ["إجمالي بنود الطلبات", scoped.length, ClipboardList],
    ["طلبات تحتاج تأكيد", active.filter((i) => i.status === 0).length, Clock],
    ["طلبات قيد التنفيذ", active.filter((i) => i.status === 2).length, Package],
    ["طلبات جاهزة للشحن", active.filter((i) => i.status === 3).length, Truck],
    ["طلبات تم توصيلها", active.filter((i) => i.status === 4).length, Check],
    [
      "بنود متأخرة",
      active.filter((i) => i.status < 4 && sla(i.created, now).state === "late")
        .length,
      AlertTriangle,
    ],
  ] as const;
  const itemTable = (items: OpItem[]) => (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>الطلب / المنتج</th>
            {admin && <th>المورد</th>}
            <th>العميل / المحافظة</th>
            <th>المرحلة</th>
            <th>المدة المحددة</th>
            <th>الإجراء</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => {
            const p = products.find((p) => p.id === i.productId)!;
            const timing = sla(i.created, now);
            return (
              <tr key={i.id}>
                <td>
                  <bdi>{i.orderId}</bdi>
                  <small>{p.short}</small>
                  <small>
                    الكمية: {i.qty || 1}
                    {i.variant && " · الاتجاه: " + i.variant}
                  </small>
                </td>
                {admin && (
                  <td>
                    <select
                      aria-label={"مورد " + i.id}
                      value={i.vendor}
                      onChange={(e) =>
                        update(
                          i,
                          { vendor: e.target.value },
                          "تم تغيير المورد التجريبي",
                        )
                      }
                    >
                      <option value="A">مورد تجريبي أ</option>
                      <option value="B">مورد تجريبي ب</option>
                    </select>
                  </td>
                )}
                <td>
                  {i.customer}
                  <small>{i.governorate}</small>
                  {(admin || i.status >= 3) && (
                    <small>
                      {i.address} · {i.phone}
                    </small>
                  )}
                </td>
                <td>
                  <span className="badge">
                    {i.cancelled
                      ? "ملغي"
                      : i.returned
                        ? "مرتجع"
                        : steps[i.status]}
                  </span>
                </td>
                <td>
                  <span className={"sla " + timing.state}>
                    {i.status === 4
                      ? "اكتمل التسليم"
                      : stateNames[timing.state as keyof typeof stateNames]}
                  </span>
                  <small>
                    {timing.overdue
                      ? `متأخر ${timing.overdue} أيام كاملة`
                      : `متبقي ${timing.remaining} يوم`}
                  </small>
                </td>
                <td>
                  <button className="text-link" onClick={() => setSelected(i)}>
                    عرض التفاصيل
                    <ArrowLeft size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
          {!items.length && (
            <tr>
              <td colSpan={6}>لا توجد بنود مطابقة للفترة أو التصفية.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  return (
    <main className="dashboard">
      <aside className="dashboard-sidebar">
        <Link className="dash-brand" to="/">
          PAN HOMZ<span>مساحة العمليات</span>
        </Link>
        <div className="role-badge">
          <ShieldCheck size={17} />
          {admin ? "إدارة تجريبية" : "مورد تجريبي"}
        </div>
        {!admin && (
          <label className="vendor-select">
            تبديل الدور للعرض
            <select
              value={vendor}
              onChange={(e) => {
                setVendor(e.target.value);
                setSelected(null);
              }}
            >
              <option value="A">مورد تجريبي أ</option>
              <option value="B">مورد تجريبي ب</option>
            </select>
          </label>
        )}
        <nav>
          {tabs
            .filter(([id]) => admin || !["vendors", "log"].includes(id))
            .map(([id, label, Icon]) => (
              <button
                className={tab === id ? "active" : ""}
                key={id}
                onClick={() => {
                  setTab(id);
                  setFilter("all");
                }}
              >
                <Icon size={19} />
                {label}
              </button>
            ))}
        </nav>
        <Link to={admin ? "/seller-center/demo" : "/admin/demo"}>
          {admin ? "مركز الموردين" : "عرض الإدارة"}
          <ArrowLeft size={16} />
        </Link>
        <Link to="/">
          العودة للمتجر
          <ArrowLeft size={16} />
        </Link>
      </aside>
      <div className="dashboard-content">
        <div className="dashboard-top">
          <div>
            <small>أهلًا بك في تجربة PAN HOMZ</small>
            <h1>{tabs.find((t) => t[0] === tab)?.[1]}</h1>
          </div>
          <span className="badge">
            بيانات افتراضية ·{" "}
            {new Date().toLocaleDateString("ar-EG-u-nu-latn", {
              timeZone: "Africa/Cairo",
            })}
          </span>
        </div>
        <DemoNote>
          محاكاة تشغيلية محلية، وليست نظامًا آمنًا متعدد المستخدمين. كل الموردين
          والتكاليف والبيانات المالية افتراضية. تكلفة الطلبات الجديدة غير محددة
          (0) حتى يضيفها مقدم العرض.
        </DemoNote>
        {["overview", "reports"].includes(tab) && (
          <>
            <div className="metrics-grid">
              {metrics.map(([label, value, Icon]) => (
                <div className="metric" key={label}>
                  <Icon size={22} />
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <small>محسوب من سجلات العرض</small>
                </div>
              ))}
            </div>
            <div className="dashboard-two">
              <section className="panel">
                <h2>مراحل تنفيذ المنتجات</h2>
                <div className="bar-chart">
                  {steps.map((label, n) => {
                    const count = active.filter((i) => i.status === n).length;
                    return (
                      <div key={n}>
                        <span>{label}</span>
                        <div className="bar-track">
                          <div
                            style={{
                              width:
                                (active.length
                                  ? (count / active.length) * 100
                                  : 0) + "%",
                            }}
                          />
                        </div>
                        <b>{count}</b>
                      </div>
                    );
                  })}
                </div>
              </section>
              <section className="panel">
                <h2>متابعة مدة التسليم</h2>
                {(["within", "risk", "late"] as const).map((state) => (
                  <button
                    className={"sla-card " + state}
                    key={state}
                    onClick={() => {
                      setTab("orders");
                      setFilter(state);
                    }}
                  >
                    <span>
                      {stateNames[state]}
                      <small>موعد التسليم: 14 يومًا من إنشاء الطلب</small>
                    </span>
                    <strong>
                      {
                        active.filter(
                          (i) =>
                            i.status < 4 && sla(i.created, now).state === state,
                        ).length
                      }
                    </strong>
                    <ArrowLeft size={17} />
                  </button>
                ))}
              </section>
            </div>
            <section className="panel">
              <div className="section-heading">
                <h2>أحدث بنود الطلبات</h2>
                <button className="text-link" onClick={() => setTab("orders")}>
                  كل الطلبات
                  <ArrowLeft size={16} />
                </button>
              </div>
              {itemTable(scoped.slice(0, 5))}
            </section>
          </>
        )}
        {["orders", "delivery", "returns"].includes(tab) && (
          <section className="panel">
            <div className="dashboard-filters">
              <label>
                تصفية
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">كل البنود</option>
                  <option value="within">ضمن المدة المحددة</option>
                  <option value="risk">معرّض للتأخير</option>
                  <option value="late">متأخر</option>
                  <option value="cancelled">ملغي</option>
                  <option value="returned">مرتجع</option>
                </select>
              </label>
              <label>
                من تاريخ
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </label>
              <label>
                إلى تاريخ
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </label>
            </div>
            {tab === "returns" && (
              <p>
                المرتجع يحدث بعد التسليم، والإلغاء قبل التسليم. افتح التفاصيل
                لإجراء محاكاة واضحة لكل منهما.
              </p>
            )}
            {itemTable(
              tab === "returns"
                ? displayed.filter((i) => i.returned || i.cancelled)
                : tab === "delivery"
                  ? displayed.filter((i) => i.status >= 2 && !i.cancelled)
                  : displayed,
            )}
          </section>
        )}
        {tab === "finance" && (
          <>
            <div className="finance-cards">
              {[
                ["إجمالي بنود التسليم", sums.gross],
                ["المرتجعات", sums.returns],
                ["غرامات التأخير", sums.penalty],
                ["صافي المستحقات", sums.net],
              ].map(([label, value]) => (
                <div className="metric" key={label}>
                  <span>{label}</span>
                  <strong>{price(Number(value))}</strong>
                </div>
              ))}
            </div>
            <section className="panel">
              <div className="section-heading">
                <h2>تسوية أسبوعية تجريبية</h2>
                <button
                  className="button secondary"
                  onClick={() => downloadCsv(dateItems, now)}
                >
                  <Download size={16} />
                  تحميل ملف CSV
                </button>
              </div>
              <div className="dashboard-filters">
                <label>
                  من تاريخ
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </label>
                <label>
                  إلى تاريخ
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </label>
                <button
                  className="text-link"
                  onClick={() => {
                    const date = new Date();
                    date.setDate(date.getDate() - 7);
                    setDateFrom(dayKey(date));
                    setDateTo(dayKey(new Date()));
                  }}
                >
                  آخر 7 أيام
                </button>
              </div>
              <p>
                غرامة 10٪ من تكلفة المورد عند مرور 4 أيام كاملة بعد الموعد.
                الصافي يشمل البنود المسلّمة فقط، ويستبعد المرتجعات والإلغاء.
                الفلترة بتاريخ إنشاء البند. تثبت الغرامة عند وقت التسليم، وتُلغى
                في محاكاة المرتجع الكامل.
              </p>
              <div className="weekly-settlements">
                <h3>المبالغ المعلقة حسب أسبوع التسليم</h3>
                <p>كل المبالغ تجريبية ومعلقة؛ لم يُنفذ تحويل مالي.</p>
                {Object.entries(weekly).map(([week, net]) => (
                  <div key={week}>
                    <span>
                      أسبوع يبدأ في <bdi>{week}</bdi>
                    </span>
                    <strong>{price(net)}</strong>
                  </div>
                ))}
                {!Object.keys(weekly).length && (
                  <p>لا توجد بنود مسلّمة في الفترة المحددة.</p>
                )}
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>البند</th>
                      <th>التكلفة الافتراضية</th>
                      <th>قيمة التسليم</th>
                      <th>مرتجعات</th>
                      <th>غرامة</th>
                      <th>الصافي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateItems.map((i) => {
                      const f = finance(i, now);
                      return (
                        <tr key={i.id}>
                          <td>{i.id}</td>
                          <td>{price(i.cost)}</td>
                          <td>{price(f.gross)}</td>
                          <td>{price(f.returns)}</td>
                          <td>{price(f.penalty)}</td>
                          <td>{price(f.net)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
        {tab === "products" && (
          <section className="panel">
            <h2>تخصيص المنتجات — عرض فقط</h2>
            <p>
              تعديلات العرض محفوظة محليًا: المسودات تُخفى من المتجر التجريبي،
              والتخصيص يُستخدم للطلبات الجديدة. سجلات المصدر الأصلية محفوظة.
            </p>
            <input
              placeholder="بحث بالرمز أو المنتج"
              aria-label="بحث المنتجات بالرمز"
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
            />
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>المنتج / الرمز</th>
                    <th>القسم</th>
                    <th>الحالة</th>
                    <th>المورد التجريبي</th>
                    <th>ترتيب العرض</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(
                      (p) =>
                        (admin || s.catalog[p.id].vendor === vendor) &&
                        (p.sku.toLowerCase().includes(lookup.toLowerCase()) ||
                          p.title.includes(lookup)),
                    )
                    .map((p, n) => (
                      <tr key={p.id}>
                        <td>
                          {p.short}
                          <small dir="ltr">{p.sku}</small>
                        </td>
                        <td>{collectionNames[p.collection]}</td>
                        <td>
                          <select
                            aria-label={"حالة " + p.sku}
                            value={s.catalog[p.id].active ? "active" : "draft"}
                            onChange={(e) =>
                              s.updateCatalog(p.id, {
                                active: e.target.value === "active",
                              })
                            }
                          >
                            <option value="active">نشط — ظاهر</option>
                            <option value="draft">
                              مسودة — مخفي من المتجر
                            </option>
                          </select>
                        </td>
                        <td>
                          {admin ? (
                            <select
                              aria-label={"تخصيص " + p.sku}
                              value={s.catalog[p.id].vendor}
                              onChange={(e) =>
                                s.updateCatalog(p.id, {
                                  vendor: e.target.value,
                                })
                              }
                            >
                              <option value="A">مورد تجريبي أ</option>
                              <option value="B">مورد تجريبي ب</option>
                            </select>
                          ) : vendor === "A" ? (
                            "مورد تجريبي أ"
                          ) : (
                            "مورد تجريبي ب"
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            aria-label={"ترتيب " + p.sku}
                            value={s.catalog[p.id].rank}
                            onChange={(e) =>
                              s.updateCatalog(p.id, {
                                rank: Math.max(
                                  1,
                                  Math.min(99, Number(e.target.value)),
                                ),
                              })
                            }
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {tab === "vendors" && (
          <div className="dashboard-two">
            {["A", "B"].map((v) => (
              <section className="panel" key={v}>
                <Store size={30} />
                <h2>مورد تجريبي {v === "A" ? "أ" : "ب"}</h2>
                <p>هوية افتراضية لشرح توزيع المنتجات؛ ليست جهة تجارية موثقة.</p>
                <div className="vendor-stats">
                  <span>
                    بنود الطلبات
                    <strong>
                      {s.operations.filter((i) => i.vendor === v).length}
                    </strong>
                  </span>
                  <span>
                    ضمن المدة
                    <strong>
                      {
                        s.operations.filter(
                          (i) =>
                            i.vendor === v &&
                            sla(i.created, now).state === "within" &&
                            i.status < 4,
                        ).length
                      }
                    </strong>
                  </span>
                </div>
                <button
                  className="text-link"
                  onClick={() => {
                    setTab("orders");
                    setFilter("all");
                  }}
                >
                  عرض توزيع البنود
                  <ArrowLeft size={16} />
                </button>
              </section>
            ))}
          </div>
        )}
        {tab === "log" && (
          <section className="panel">
            <h2>سجل التغييرات في الجلسة</h2>
            {logs.length ? (
              <ul>
                {logs.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            ) : (
              <p>لا توجد أحداث بعد. تحديث حالة أو تخصيص مورد سيظهر هنا.</p>
            )}
          </section>
        )}
        {selected && (
          <Modal
            title={"تفاصيل البند " + selected.id}
            onClose={() => setSelected(null)}
          >
            <div className="operation-detail">
              <h3>
                {products.find((p) => p.id === selected.productId)?.title}
              </h3>
              <dl>
                <div>
                  <dt>الكمية</dt>
                  <dd>{selected.qty || 1}</dd>
                </div>
                {selected.sku && (
                  <div>
                    <dt>رمز النسخة</dt>
                    <dd>
                      <bdi>{selected.sku}</bdi>
                    </dd>
                  </div>
                )}
                {selected.variant && (
                  <div>
                    <dt>اتجاه الشيزلونج</dt>
                    <dd>{selected.variant}</dd>
                  </div>
                )}
                <div>
                  <dt>رقم الطلب</dt>
                  <dd>
                    <bdi>{selected.orderId}</bdi>
                  </dd>
                </div>
                <div>
                  <dt>العميل</dt>
                  <dd>{selected.customer}</dd>
                </div>
                <div>
                  <dt>المحافظة</dt>
                  <dd>{selected.governorate}</dd>
                </div>
                {(admin || selected.status >= 3) && (
                  <>
                    <div>
                      <dt>العنوان الافتراضي</dt>
                      <dd>{selected.address}</dd>
                    </div>
                    <div>
                      <dt>الموبايل الافتراضي</dt>
                      <dd>{selected.phone}</dd>
                    </div>
                  </>
                )}
                <div>
                  <dt>المرحلة الحالية</dt>
                  <dd>
                    {selected.cancelled
                      ? "ملغي"
                      : selected.returned
                        ? "مرتجع"
                        : steps[selected.status]}
                  </dd>
                </div>
                <div>
                  <dt>موعد التسليم المحدد</dt>
                  <dd>
                    {new Date(
                      sla(selected.created, now).deadline,
                    ).toLocaleDateString("ar-EG-u-nu-latn", {
                      timeZone: "Africa/Cairo",
                    })}
                  </dd>
                </div>
              </dl>
              {selected.status < 3 && !admin && (
                <DemoNote>
                  العنوان ورقم الموبايل لا يظهران للمورد قبل «جاهز للشحن».
                </DemoNote>
              )}
              {!selected.cancelled &&
                !selected.returned &&
                selected.status < 4 && (
                  <>
                    <label className="upload-label">
                      <Upload size={18} />
                      إرفاق إثبات تسليم تجريبي
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              s.notify("الحد الأقصى 5 ميجابايت");
                              return;
                            }
                            if (
                              !file.type.startsWith("image/") &&
                              file.type !== "application/pdf"
                            ) {
                              s.notify("اختر صورة أو ملف PDF");
                              return;
                            }
                            update(
                              selected,
                              { proof: file.name },
                              "تم إرفاق إثبات محلي للعرض",
                            );
                          }
                        }}
                      />
                    </label>
                    {selected.proof && (
                      <p>
                        <Check size={16} /> تم إرفاق {selected.proof}
                      </p>
                    )}
                    <button
                      className="button full"
                      disabled={selected.status === 3 && !selected.proof}
                      onClick={() => next(selected)}
                    >
                      انتقال إلى {steps[selected.status + 1]}
                      <ArrowLeft size={17} />
                    </button>
                    {selected.status === 3 && !selected.proof && (
                      <small>يلزم رفع إثبات قبل تسجيل التسليم.</small>
                    )}
                  </>
                )}
              {!selected.cancelled && !selected.returned && (
                <button
                  className="button secondary full"
                  onClick={() =>
                    update(
                      selected,
                      selected.status === 4
                        ? { returned: true }
                        : { cancelled: true },
                      selected.status === 4
                        ? "تم تسجيل مرتجع تجريبي"
                        : "تم إلغاء البند التجريبي",
                    )
                  }
                >
                  {selected.status === 4
                    ? "تسجيل مرتجع تجريبي"
                    : "إلغاء البند التجريبي"}
                </button>
              )}
              {admin && (
                <label>
                  تكلفة المورد الافتراضية لإجمالي البند
                  <input
                    type="number"
                    min="0"
                    value={selected.cost}
                    onChange={(e) =>
                      update(
                        selected,
                        { cost: Math.max(0, Number(e.target.value)) },
                        "تم تحديث تكلفة العرض",
                      )
                    }
                  />
                </label>
              )}
              <DemoNote>
                الإثبات محاكاة محلية تحفظ اسم الملف فقط، ولا يُرفع الملف إلى
                خدمة خارجية.
              </DemoNote>
            </div>
          </Modal>
        )}
      </div>
    </main>
  );
}
