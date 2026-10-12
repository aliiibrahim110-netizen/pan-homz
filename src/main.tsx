import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@fontsource/cairo/arabic-400.css";
import "@fontsource/cairo/arabic-500.css";
import "@fontsource/cairo/arabic-600.css";
import "@fontsource/cairo/arabic-700.css";
import "@fontsource/cairo/arabic-800.css";
import "@fontsource/cairo/latin-400.css";
import "@fontsource/cairo/latin-700.css";
import "./styles.css";
import { StoreProvider } from "./store";
import { Header, Footer, Presenter, GlobalOverlays } from "./components/Layout";
import {
  Home,
  Collection,
  ProductPage,
  Wishlist,
} from "./components/Storefront";
import {
  CartPage,
  Checkout,
  Confirmation,
  Tracking,
} from "./components/Shopping";
import { Dashboard, SellerLanding } from "./components/Operations";
import { Information, FAQ, Contact, Account } from "./components/Information";
import { Empty } from "./components/UI";
import { products, collectionNames } from "./data/catalog";
function App() {
  const location = useLocation();
  const dashboard =
    location.pathname === "/admin/demo" ||
    location.pathname === "/seller-center/demo";
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const bits = location.pathname.split("/");
    const title =
      bits[1] === "product"
        ? products.find((p) => p.id === bits[2])?.short
        : bits[1] === "collections"
          ? collectionNames[bits[2]]
          : {
              "": "أثاث يشبهك",
              search: "نتائج البحث",
              wishlist: "المفضلة",
              cart: "سلة التسوق",
              checkout: "إتمام الطلب",
              "track-order": "تتبع الطلب",
              account: "حسابي",
              about: "عن PAN HOMZ",
              contact: "تواصل معنا",
              faq: "الأسئلة الشائعة",
              shipping: "الشحن والتوصيل",
              warranty: "الضمان",
              returns: "الاستبدال والاسترجاع",
              privacy: "الخصوصية",
              terms: "الشروط",
              admin: "الإدارة التجريبية",
              "seller-center": "مركز الموردين",
              order: "تأكيد الطلب التجريبي",
            }[bits[1]];
    document.title = "PAN HOMZ | " + (title || "اختيارات لبيتك");
    let canonical = document.querySelector<HTMLLinkElement>(
      "link[rel=canonical]",
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + location.pathname;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute(
      "content",
      `${title || "اختيارات لبيتك"} — تجربة PAN HOMZ العربية للأثاث المصري. نسخة عرض مستقلة بعينات كتالوج تاريخية وشراء تجريبي.`,
    );
  }, [location.pathname, location.search]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        انتقل إلى المحتوى
      </a>
      {!dashboard && <Header />}
      <div id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:id" element={<Collection />} />
          <Route path="/search" element={<Collection />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Confirmation />} />
          <Route path="/track-order" element={<Tracking />} />
          <Route path="/account" element={<Account />} />
          <Route path="/seller-center" element={<SellerLanding />} />
          <Route path="/seller-center/demo" element={<Dashboard />} />
          <Route path="/admin/demo" element={<Dashboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          {["about", "shipping", "warranty", "returns", "privacy", "terms"].map(
            (path) => (
              <Route key={path} path={"/" + path} element={<Information />} />
            ),
          )}
          <Route
            path="*"
            element={
              <main className="container page">
                <Empty title="الصفحة غير موجودة" />
              </main>
            }
          />
        </Routes>
      </div>
      {!dashboard && <Footer />}
      <Presenter />
      <GlobalOverlays />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
