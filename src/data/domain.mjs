export const DAY = 86400000;
export function totals(lines, promo = false, governorate = "القاهرة") {
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const discount = promo ? subtotal * 0.1 : 0;
  const shipping = lines.length
    ? governorate === "القاهرة" || governorate === "الجيزة"
      ? 250
      : 450
    : 0;
  return {
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
  };
}
export function sla(created, now = Date.now()) {
  const deadline = new Date(created).getTime() + 14 * DAY;
  const delta = deadline - now;
  return {
    deadline,
    remaining: Math.ceil(delta / DAY),
    overdue: Math.max(0, Math.floor(-delta / DAY)),
    state: delta < 0 ? "late" : delta <= 3 * DAY ? "risk" : "within",
  };
}
export function finance(item, now = Date.now()) {
  const timing = sla(
    item.created,
    item.status === 4 && item.deliveredAt
      ? new Date(item.deliveredAt).getTime()
      : now,
  );
  const penalty = timing.overdue >= 4 ? item.cost * 0.1 : 0;
  const delivered = item.status === 4 && !item.cancelled;
  const gross = delivered ? item.cost : 0;
  const returns = delivered && item.returned ? item.cost : 0;
  return {
    gross,
    returns,
    penalty: delivered && !item.returned ? penalty : 0,
    net: delivered && !item.returned ? item.cost - penalty : 0,
  };
}
export const steps = [
  "تم الطلب",
  "تم التأكيد",
  "قيد التنفيذ",
  "جاهز للشحن",
  "تم التوصيل",
];
export function advance(item, now = Date.now()) {
  if (item.cancelled || item.returned || item.status >= 4) return item;
  if (item.status === 3 && !item.proof)
    throw new Error("يلزم إرفاق إثبات التسليم أولًا");
  return {
    ...item,
    status: item.status + 1,
    ...(item.status === 3 ? { deliveredAt: new Date(now).toISOString() } : {}),
  };
}
