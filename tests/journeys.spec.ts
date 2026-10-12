import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://cdn.shopify.com/**", (route) => route.abort());
});

test("source catalog, search, numeric sorting, filters and honest empty collections", async ({
  page,
}) => {
  await page.goto("/collections/all");
  await expect(page.locator(".product-card")).toHaveCount(7);
  await page.getByLabel("ترتيب حسب").selectOption("asc");
  await expect(page.locator(".product-card").first()).toContainText("كومود");
  await page.getByRole("button", { name: "تصفية النتائج" }).click();
  await page.getByLabel("السعر حتى (ج.م)").fill("5000");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("button", { name: "مسح كل الفلاتر" }).click();
  await expect(page.locator(".product-card")).toHaveCount(7);
  await page.goto("/search?q=ركنة");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-card")).toContainText("ركنة");
  await page.goto("/search?q=Sofa-665");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".price strong")).toHaveText("15,000 ج.م");
  await page.goto("/collections/sliding-wardrobes");
  await expect(page.locator(".product-card")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "لا توجد منتجات في عينة هذا القسم" }),
  ).toBeVisible();
});

test("variant selection, persistent wishlist and cart, quantity and exact PAN10 totals", async ({
  page,
}) => {
  await page.goto("/product/corner-419");
  await page.getByRole("button", { name: "شمال", exact: true }).click();
  await expect(page.locator(".product-info .sku")).toContainText(
    "Sofa L-Shape-419-L",
  );
  await page
    .getByRole("button", { name: "إضافة للمفضلة", exact: true })
    .click();
  await page.getByRole("button", { name: "أضف لسلة التسوق" }).click();
  await expect(page.getByRole("dialog")).toContainText("شمال");
  await page.getByRole("button", { name: "إغلاق", exact: true }).click();
  await page.goto("/cart");
  await expect(page.locator(".cart-line")).toContainText("Sofa L-Shape-419-L");
  await page.getByRole("button", { name: "زيادة الكمية", exact: true }).click();
  await page.getByLabel("عندك كود خصم؟").fill("PAN10");
  await page.getByRole("button", { name: "تطبيق", exact: true }).click();
  await expect(page.getByTestId("cart-total")).toHaveText("39,063 ج.م");
  await page.reload();
  await expect(page.getByTestId("cart-total")).toHaveText("39,063 ج.م");
  await expect(page.locator(".cart-line .quantity span")).toHaveText("2");
  await page.goto("/wishlist");
  await expect(page.locator(".product-card")).toHaveCount(1);
});

test("checkout validation, local DEMO order, phone verification and item routing", async ({
  page,
}) => {
  await page.goto("/collections/sofas");
  await page
    .getByRole("button", { name: "أضف للسلة: كنبة خشب زان — أوف وايت" })
    .click();
  await page.goto("/product/wardrobe-203");
  await page.getByRole("button", { name: "أضف لسلة التسوق" }).click();
  await page.getByRole("button", { name: "إغلاق", exact: true }).click();
  await page.goto("/checkout");
  await page.getByRole("button", { name: "تأكيد الطلب التجريبي" }).click();
  await expect(page.getByText("من فضلك أدخل الاسم بالكامل")).toBeVisible();
  await page.getByLabel("الاسم بالكامل").fill("اسم للتحقق التجريبي");
  await page.getByLabel("رقم الموبايل", { exact: true }).fill("123");
  await page.getByLabel("المدينة أو المنطقة").fill("منطقة افتراضية");
  await page.getByLabel("العنوان بالتفصيل").fill("عنوان للعرض فقط");
  await page.getByRole("button", { name: "تأكيد الطلب التجريبي" }).click();
  await expect(
    page.getByText("أدخل رقم موبايل مصري صحيح من 11 رقمًا."),
  ).toBeVisible();
  await page.getByLabel("رقم الموبايل", { exact: true }).fill("01000000000");
  await page
    .getByRole("combobox", { name: "المحافظة", exact: true })
    .selectOption("الإسكندرية");
  await expect(page.getByTestId("cart-total")).toHaveText("40,447 ج.م");
  await page.getByRole("button", { name: "تأكيد الطلب التجريبي" }).click();
  await expect(
    page.getByRole("heading", { name: "تم إنشاء طلبك التجريبي" }),
  ).toBeVisible();
  const order = await page.locator(".order-number").textContent();
  expect(order).toMatch(/^DEMO-/);
  const persisted = await page.evaluate(() =>
    localStorage.getItem("ph-orders"),
  );
  expect(persisted).not.toContain("اسم للتحقق");
  expect(persisted).not.toContain("01000000000");
  expect(persisted).not.toContain("عنوان للعرض");
  await page
    .locator(".confirmation")
    .getByRole("link", { name: "تتبع الطلب", exact: true })
    .click();
  await page.getByLabel("رقم الموبايل", { exact: true }).fill("01000000000");
  await page.getByRole("button", { name: "عرض حالة الطلب" }).click();
  await expect(page.locator(".tracking-item")).toHaveCount(2);
  await page.goto("/seller-center/demo");
  await page.getByRole("button", { name: "الطلبات", exact: true }).click();
  let row = page.locator("tr").filter({ hasText: order! });
  await expect(row).toHaveCount(1);
  await expect(row).toContainText("كنبة");
  await expect(row).not.toContainText("دولاب");
  await page.getByLabel("تبديل الدور للعرض").selectOption("B");
  row = page.locator("tr").filter({ hasText: order! });
  await expect(row).toHaveCount(1);
  await expect(row).toContainText("دولاب");
});

test("seller scope, staged visibility, proof required, returns and real CSV export", async ({
  page,
}) => {
  await page.goto("/seller-center/demo");
  await page.getByRole("button", { name: "الطلبات", exact: true }).click();
  let row = page.locator("tr").filter({ hasText: "DEMO-1001" });
  await expect(row).toHaveCount(1);
  await expect(row).not.toContainText("عنوان افتراضي");
  await page.getByLabel("تبديل الدور للعرض").selectOption("B");
  row = page.locator("tr").filter({ hasText: "DEMO-1001" });
  await expect(row).toHaveCount(1);
  await expect(row).toContainText("عنوان افتراضي");
  await row.getByRole("button", { name: "عرض التفاصيل" }).click();
  await expect(
    page.getByRole("button", { name: "انتقال إلى تم التوصيل" }),
  ).toBeDisabled();
  await page.locator("input[type=file]").setInputFiles({
    name: "proof.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 demo"),
  });
  await expect(
    page.getByRole("button", { name: "انتقال إلى تم التوصيل" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "انتقال إلى تم التوصيل" }).click();
  await page.getByRole("button", { name: "تسجيل مرتجع تجريبي" }).click();
  await page.getByRole("button", { name: "إغلاق", exact: true }).click();
  await page.getByRole("button", { name: "المرتجعات", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("مرتجع");
  await page.getByRole("button", { name: "المستحقات", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "تحميل ملف CSV" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("PAN-HOMZ-demo-settlement.csv");
});

test("demo tracking is item-level and tour remains optional", async ({
  page,
}) => {
  await page.goto("/track-order");
  await page
    .getByRole("button", { name: "جرّب المثال الافتراضي DEMO-1001" })
    .click();
  await expect(page.locator(".tracking-item")).toHaveCount(2);
  await page
    .locator(".tracking-item")
    .first()
    .getByRole("button", { name: "تم التوصيل", exact: true })
    .click();
  await expect(page.getByText("متابعة كل منتج على حدة")).toBeVisible();
  await page.goto("/?demo=1");
  await page.getByRole("button", { name: "الجولة الموجهة" }).click();
  await page.getByRole("button", { name: "التالي" }).click();
  await expect(page).toHaveURL(/collections\/living/);
  await page.getByRole("button", { name: "إيقاف الجولة" }).click();
  await expect(
    page.getByRole("button", { name: "الجولة الموجهة" }),
  ).toBeVisible();
});

test("mobile drawer is keyboard accessible and search works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "فتح القائمة" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("searchbox")
    .count()
    .then(async (count) => {
      if (!count) await page.getByLabel("ابحث عن الأثاث").fill("كومود");
    });
  await page.getByRole("button", { name: "تنفيذ البحث" }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
});

test("all required routes render without JavaScript errors at six widths or document overflow", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const paths = [
    "/",
    "/collections/living",
    "/collections/corners",
    "/collections/bedroom",
    "/collections/dining",
    "/collections/office",
    "/collections/storage",
    "/product/corner-419",
    "/product/com-02",
    "/search?q=كنبة",
    "/wishlist",
    "/cart",
    "/track-order",
    "/account",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/warranty",
    "/returns",
    "/privacy",
    "/terms",
    "/seller-center",
    "/seller-center/demo",
    "/admin/demo",
  ];
  for (const width of [1920, 1440, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(path);
      await page.locator("#main-content").waitFor();
      await expect(page.locator("h1")).toHaveCount(1);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      expect(overflow, `overflow ${path} at ${width}`).toBe(false);
    }
  }
  expect(errors).toEqual([]);
});

test("admin catalog changes persist, hide drafts and affect actual storefront ranking", async ({
  page,
}) => {
  await page.goto("/admin/demo");
  await page.getByRole("button", { name: "المنتجات", exact: true }).click();
  await page.getByLabel("حالة Sofa-459").selectOption("draft");
  await page.getByLabel("ترتيب com-02").fill("1");
  await page.getByLabel("ترتيب Sofa-665").fill("99");
  await page.getByLabel("تخصيص wardrobe-203").selectOption("A");
  await page.goto("/collections/all");
  await expect(page.locator(".product-card")).toHaveCount(6);
  await expect(page.locator(".product-card").first()).toContainText("كومود");
  await expect(page.locator(".product-card").last()).toContainText(
    "كنبة خشب زان — بيج",
  );
  await page.reload();
  await expect(page.locator(".product-card")).toHaveCount(6);
  await page.goto("/product/sofa-459");
  await expect(
    page.getByRole("heading", { name: "المنتج غير متاح في العرض الحالي" }),
  ).toBeVisible();
  await page.goto("/seller-center/demo");
  await page.getByRole("button", { name: "المنتجات", exact: true }).click();
  await expect(page.locator("tbody")).toContainText("wardrobe-203");
  await page.goto("/admin/demo");
  await page.getByRole("button", { name: "سجل النظام", exact: true }).click();
  await expect(page.locator(".panel")).toContainText(
    "تم تعديل إعدادات عرض المنتج",
  );
});

test("all original product images load offline from local cache and unavailable images have honest fallbacks", async ({
  page,
}) => {
  await page.goto("/collections/all");
  for (const picture of await page.locator(".product-picture").all()) {
    await picture.scrollIntoViewIfNeeded();
  }
  await expect(page.locator(".product-picture img")).toHaveCount(7);
  await expect
    .poll(async () =>
      page
        .locator(".product-picture img")
        .evaluateAll((nodes) =>
          nodes.every(
            (n) =>
              (n as HTMLImageElement).complete &&
              (n as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.route("**/images/com-02.jpg", (route) => route.abort());
  await page.goto("/product/com-02");
  await expect(page.locator(".gallery-main .image-fallback")).toBeVisible();
  await expect(page.locator(".gallery-main")).toContainText(
    "كومود خشب إم دي إف",
  );
});
