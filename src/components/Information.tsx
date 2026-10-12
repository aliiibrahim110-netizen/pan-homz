import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  HelpCircle,
  ShieldCheck,
  Truck,
  Heart,
  Leaf,
} from "lucide-react";
import { useShop } from "../store";
import { ButtonLink, DemoNote, Empty } from "./UI";
const content: Record<
  string,
  { title: string; intro: string; sections: [string, string][] }
> = {
  about: {
    title: "بيت يجمع ذوقك وراحتك",
    intro:
      "PAN HOMZ مفهوم لسوق أثاث مصري يجمع اختيارات من موردين ومصنّعين مختلفين في تجربة تسوق موحدة.",
    sections: [
      [
        "اختيارات تبدأ من بيتك",
        "من غرف المعيشة إلى غرف النوم والتخزين، نركز على تجربة اكتشاف سهلة وتفاصيل منتج واضحة. المنتجات المعروضة هنا عينات أصلية من الكتالوج.",
      ],
      [
        "تجربة واحدة، عمليات منظمة",
        "يوضح هذا العرض كيف يمكن تنظيم الطلبات، توزيع البنود على الموردين، متابعة التسليم، ومراجعة المستحقات.",
      ],
      [
        "عن هذه النسخة",
        "هذا موقع مستقل للعرض التقديمي. لا يتصل بمتجر حي أو شركة شحن أو بوابة دفع، ولا ينفّذ معاملات حقيقية.",
      ],
    ],
  },
  shipping: {
    title: "الشحن والتوصيل",
    intro:
      "اعرف تفاصيل التوصيل قبل ما تختار. المعلومات التالية هي إعدادات العرض التجريبي.",
    sections: [
      [
        "مدة التوصيل",
        "يعرض النموذج مدة إرشادية 7–15 يوم عمل. لا نضمن مدة فعلية أو مخزونًا متاحًا دون التحقق من بيانات المنتج وقت الشراء الحقيقي.",
      ],
      [
        "رسوم واضحة",
        "في محاكاة السلة: 250 ج.م للقاهرة والجيزة، و450 ج.م لباقي المحافظات. لا توجد حملة توصيل مجاني مفعّلة.",
      ],
      [
        "متابعة المنتجات",
        "لكل منتج مراحل تنفيذ مستقلة، وقد تختلف مواعيد التسليم بين بنود الطلب الواحد. إجمالي الطلب لا يظهر كمسلّم إلا بعد تسليم كل البنود.",
      ],
    ],
  },
  warranty: {
    title: "ضمان يطمنك",
    intro: "سياسة ضمان إرشادية للعرض، وليست تأكيدًا لشروط تعاقد حي.",
    sections: [
      [
        "ضمان سنة ضد عيوب الصناعة",
        "يعرض النموذج ضمان سنة ضد عيوب الصناعة. التغطية والشروط النهائية تحتاج تأكيدًا من PAN HOMZ عند تفعيل المتجر.",
      ],
      [
        "استخدام الأثاث والعناية به",
        "حافظ على الأثاث بعيدًا عن الرطوبة المباشرة، واستخدم مواد تنظيف مناسبة للخامة. الضرر الناتج عن سوء الاستخدام ليس عيب صناعة.",
      ],
      [
        "طلب المساعدة",
        "يمكنك تجربة إرسال طلب مساعدة محلي من مركز المساعدة. لا يُرسل الطلب إلى فريق خدمة عملاء حقيقي.",
      ],
    ],
  },
  returns: {
    title: "الاستبدال والاسترجاع",
    intro: "خطوات تجريبية واضحة تشرح التعامل مع طلبات ما بعد الشراء.",
    sections: [
      [
        "راجع المنتج عند الاستلام",
        "افحص حالة القطعة ومقاساتها، وسجّل أي ملاحظة. لا توجد سياسة إرجاع تجارية مؤكدة أو مواعيد قانونية مصطنعة في هذا النموذج.",
      ],
      [
        "طلب استرجاع",
        "التسجيل التجريبي للمرتجع متاح في شاشة عمليات الإدارة بعد وصول البند إلى «تم التوصيل». يتم استبعاد تكلفته من صافي مستحقات المورد.",
      ],
      [
        "الإلغاء مختلف عن المرتجع",
        "يتم الإلغاء قبل اكتمال التسليم. لا يمثل تسجيل مرتجع ولا يُحتسب ضمن مستحقات البنود المسلّمة.",
      ],
      [
        "الشروط النهائية",
        "قبل تشغيل المتجر، يجب اعتماد سياسة موثقة تشمل أهلية الاسترجاع، حالة المنتج، رسوم النقل، وآلية رد الأموال. لا تُنفّذ هذه النسخة ردًا ماليًا.",
      ],
    ],
  },
  privacy: {
    title: "سياسة الخصوصية — نسخة العرض",
    intro: "نحافظ على وضوح البيانات التي يستخدمها هذا النموذج المحلي.",
    sections: [
      [
        "البيانات المحلية",
        "تُحفظ السلة والمفضلة ومعرّفات الطلبات التجريبية وسجلات العمليات الافتراضية في متصفحك فقط.",
      ],
      [
        "بيانات نموذج الشراء",
        "الاسم والعنوان والملاحظات لا تُحفظ. يُحفظ بصمة تحقق مشفّرة لرقم الموبايل، وليس الرقم الخام، للتحقق المحلي من الطلب. البصمة لا تشكل نظام حماية أو تسجيل دخول تجاري.",
      ],
      [
        "صور وخدمات خارجية",
        "عند عرض صور المنتجات قد يطلب المتصفح الملفات من نطاق الصور الأصلي. لا تتصل النسخة ببوابة دفع أو مزود شحن.",
      ],
      [
        "مسح البيانات",
        "يمكنك مسح بيانات العرض من صفحة حسابي. هذا يحذف البيانات المحلية لهذا الموقع فقط.",
      ],
    ],
  },
  terms: {
    title: "شروط تجربة العرض",
    intro: "هذا النموذج مخصص لتقديم تجربة PAN HOMZ، وليس منصة تجارة حية.",
    sections: [
      [
        "منتجات وأسعار تاريخية",
        "يحتوي العرض على سبعة سجلات أصلية وفّرها صاحب المشروع. الأسعار تاريخية وليست تأكيدًا للسعر الحالي أو التوفر.",
      ],
      [
        "الشراء والدفع",
        "كل طلب يحمل معرّف DEMO، ولا ينتج عنه تحصيل أموال أو تمويل أو حجز للمخزون. PAN10 خصم محاكاة بنسبة 10٪ على المنتجات فقط.",
      ],
      [
        "العمليات الافتراضية",
        "الموردون والتكاليف وبيانات العملاء في لوحات العمليات افتراضية. فصل أدوار الموردين للعرض فقط، وليس تحكم وصول آمنًا.",
      ],
      [
        "قبل الإطلاق التجاري",
        "يتطلب التشغيل التجاري أنظمة خلفية موثوقة، تحققًا من الهوية، إدارة مخزون، تعاقدات موردين، وسياسات قانونية معتمدة.",
      ],
    ],
  },
};
const faq = [
  [
    "هل الطلبات هنا حقيقية؟",
    "لا. هذه نسخة عرض تفاعلية. كل الطلبات محلية وتجريبية، ولا يتم دفع أموال أو إرسال طلب إلى مورد حقيقي.",
  ],
  [
    "هل الأسعار المعروضة هي الأسعار الحالية؟",
    "الأسعار من عينات تاريخية لكتالوج PAN HOMZ. تُعرض بالجنيه المصري، وتُحسب نسب الخصم من السعر الأصلي والسعر المسجل.",
  ],
  [
    "إزاي أختار اتجاه الركنة؟",
    "في صفحة الركنة اختر يمين أو شمال. يتغير رمز النسخة في السلة، بينما السعر والصورة يظلان كما في سجل المصدر.",
  ],
  [
    "هل كل الأقسام فيها منتجات؟",
    "هيكل الأقسام كامل، لكن عينة الكتالوج تحتوي على سبعة منتجات فقط. الأقسام الأخرى تعرض حالة واضحة دون اختراع منتجات.",
  ],
  [
    "إزاي أجرّب كود PAN10؟",
    "أدخل PAN10 في السلة لتطبيق خصم تجريبي 10٪ على قيمة المنتجات. لا يُطبَّق الخصم على التوصيل.",
  ],
  [
    "إزاي أتابع الطلب؟",
    "أنشئ طلبًا تجريبيًا، ثم استخدم معرّفه ونفس رقم الموبايل للتحقق المحلي. أو اضغط تجربة المثال الافتراضي في صفحة التتبع.",
  ],
  [
    "هل توجد تقييمات للمنتجات؟",
    "لا توجد بيانات مراجعات أصلية في المصدر، لذلك لا نعرض تقييمات أو آراء عملاء غير موثقة.",
  ],
  [
    "إزاي يعمل مركز الموردين؟",
    "يُظهر كل مورد تجريبي البنود المخصصة له فقط. التفاصيل الإضافية للتوصيل تظهر عند وصول المنتج إلى جاهز للشحن، والتسليم يتطلب إثباتًا محليًا.",
  ],
];
export function Information() {
  const key = useLocation().pathname.slice(1);
  const data = content[key];
  if (!data) return <Empty title="الصفحة غير موجودة" />;
  return (
    <main className="container page narrow">
      <div className="breadcrumbs">
        <Link to="/">الرئيسية</Link>
        <span>/</span>
        <span>{data.title}</span>
      </div>
      <div className="info-heading">
        <Leaf size={30} />
        <h1>{data.title}</h1>
        <p className="lead">{data.intro}</p>
      </div>
      <div className="info-sections">
        {data.sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
      <div className="help-cta">
        <HelpCircle size={28} />
        <div>
          <h3>عندك سؤال؟</h3>
          <p>مركز المساعدة هنا علشانك.</p>
        </div>
        <ButtonLink to="/contact">اطلب المساعدة</ButtonLink>
      </div>
    </main>
  );
}
export function FAQ() {
  return (
    <main className="container page narrow">
      <span className="eyebrow">إجابات تخلي الصورة أوضح</span>
      <h1>الأسئلة الشائعة</h1>
      <p className="lead">كل اللي تحب تعرفه عن تجربة العرض.</p>
      {faq.map(([q, a]) => (
        <details className="faq-item" key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
      <ButtonLink to="/contact">لسه عندك سؤال؟</ButtonLink>
    </main>
  );
}
export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <main className="container page narrow">
      <span className="eyebrow">هنا علشانك</span>
      <h1>خلّينا نساعدك</h1>
      <p className="lead">اختار موضوع سؤالك، واكتشف تجربة طلب المساعدة.</p>
      <DemoNote>
        نموذج محاكاة محلي فقط. لا تُرسل الرسالة أو تحفظ بيانات التواصل، ولا توجد
        أرقام أو عناوين خدمة موثقة في المصدر.
      </DemoNote>
      {sent ? (
        <div className="panel contact-success">
          <ShieldCheck size={40} />
          <h2>تم تسجيل مثال طلب المساعدة</h2>
          <p>هذه رسالة تأكيد محلية للعرض فقط، ولن يتواصل معك فريق فعلي.</p>
          <button className="button" onClick={() => setSent(false)}>
            جرّب رسالة أخرى
          </button>
        </div>
      ) : (
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="form-grid">
            <label>
              الاسم
              <input required name="name" />
            </label>
            <label>
              البريد الإلكتروني
              <input required type="email" name="email" />
            </label>
            <label className="span-2">
              موضوع الرسالة
              <select>
                <option>تفاصيل منتج</option>
                <option>التوصيل</option>
                <option>الضمان</option>
                <option>الاسترجاع</option>
                <option>شراكة الموردين</option>
              </select>
            </label>
            <label className="span-2">
              رسالتك
              <textarea required minLength={5} rows={5} />
            </label>
          </div>
          <button className="button" type="submit">
            تجربة إرسال الرسالة
            <ArrowLeft size={17} />
          </button>
        </form>
      )}
      <Link className="text-link" to="/faq">
        اكتشف الأسئلة الشائعة
        <ArrowLeft size={17} />
      </Link>
    </main>
  );
}
export function Account() {
  const s = useShop();
  const [name, setName] = useState("");
  const [logged, setLogged] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <main className="container page narrow">
      <h1>مساحتك في PAN HOMZ</h1>
      <DemoNote>
        حساب محلي للعرض فقط، دون مصادقة أو اتصال بقاعدة عملاء. لا تدخل كلمة
        مرور.
      </DemoNote>
      {!logged ? (
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            setLogged(true);
          }}
        >
          <h2>أهلًا بيك</h2>
          <label>
            اسم للعرض (اختياري)
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك في جلسة العرض"
            />
          </label>
          <button className="button" type="submit">
            استكشف حساب العرض
            <ArrowLeft size={17} />
          </button>
        </form>
      ) : (
        <div className="panel">
          <h2>أهلًا {name || "بيك"}!</h2>
          <p>اختياراتك وطلباتك التجريبية في مكان واحد.</p>
          <button className="text-link" onClick={() => setLogged(false)}>
            إنهاء جلسة الحساب التجريبي
          </button>
        </div>
      )}
      <div className="account-links">
        <ButtonLink secondary to="/wishlist">
          المفضلة ({s.wishlist.length})
        </ButtonLink>
        <ButtonLink secondary to="/cart">
          سلة التسوق
        </ButtonLink>
        <ButtonLink secondary to="/track-order">
          تتبع طلب
        </ButtonLink>
      </div>
      <section className="panel">
        <h2>طلبات العرض المحلية</h2>
        {s.orders.length ? (
          s.orders.map((o) => (
            <div className="account-order" key={o.id}>
              <bdi>{o.id}</bdi>
              <span>
                {new Date(o.created).toLocaleDateString("ar-EG-u-nu-latn", {
                  timeZone: "Africa/Cairo",
                })}
              </span>
              <Link to={"/order/" + o.id}>عرض التأكيد</Link>
            </div>
          ))
        ) : (
          <p>لم تُنشئ طلبات تجريبية بعد.</p>
        )}
      </section>
      <section className="panel">
        <h2>خصوصية بيانات العرض</h2>
        <p>
          يمكنك حذف السلة والمفضلة والطلبات والعمليات المحفوظة محليًا. هذه
          الخطوة لا تمس أي بيانات تجارية.
        </p>
        {confirm ? (
          <>
            <p>سيتم حذف بيانات العرض من هذا المتصفح وإعادة تحميل الصفحة.</p>
            <button
              className="button"
              onClick={() => {
                Object.keys(localStorage)
                  .filter((k) => k.startsWith("ph-"))
                  .forEach((k) => localStorage.removeItem(k));
                window.location.reload();
              }}
            >
              تأكيد مسح بيانات العرض
            </button>
            <button
              className="button secondary"
              onClick={() => setConfirm(false)}
            >
              تراجع
            </button>
          </>
        ) : (
          <button className="text-link" onClick={() => setConfirm(true)}>
            مسح بيانات العرض المحلية
          </button>
        )}
      </section>
    </main>
  );
}
