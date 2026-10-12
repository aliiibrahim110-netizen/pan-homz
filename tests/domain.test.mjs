import { test } from "node:test";
import assert from "node:assert/strict";
import { totals, sla, finance, advance, DAY } from "../src/data/domain.mjs";
test("PAN10 applies to exact product subtotal, never shipping", () => {
  assert.deepEqual(totals([{ price: 1735.5, qty: 2 }], true, "القاهرة"), {
    subtotal: 3471,
    discount: 347.1,
    shipping: 250,
    total: 3373.9,
  });
  assert.equal(
    totals([{ price: 15000, qty: 1 }], false, "الإسكندرية").shipping,
    450,
  );
  assert.equal(totals([], true).total, 0);
});
test("SLA boundaries use exact deadline and full overdue days", () => {
  const created = "2026-10-01T12:00:00.000Z";
  const start = new Date(created).getTime();
  assert.equal(sla(created, start + 10 * DAY).state, "within");
  assert.equal(sla(created, start + 11 * DAY).state, "risk");
  assert.equal(sla(created, start + 14 * DAY).state, "risk");
  assert.equal(sla(created, start + 14 * DAY + 1).state, "late");
  assert.equal(sla(created, start + 18 * DAY - 1).overdue, 3);
  assert.equal(sla(created, start + 18 * DAY).overdue, 4);
});
test("penalty is 10% supplier cost after four full overdue days, delivered only", () => {
  const i = { created: "2026-10-01T12:00:00Z", cost: 13000, status: 4 };
  const n = new Date(i.created).getTime();
  assert.equal(finance(i, n + 18 * DAY - 1).penalty, 0);
  assert.deepEqual(finance(i, n + 18 * DAY), {
    gross: 13000,
    returns: 0,
    penalty: 1300,
    net: 11700,
  });
  assert.equal(finance({ ...i, status: 3 }, n + 18 * DAY).net, 0);
  assert.equal(finance({ ...i, returned: true }, n + 18 * DAY).net, 0);
  assert.equal(finance({ ...i, cancelled: true }, n + 18 * DAY).gross, 0);
});
test("delivery requires proof and cancelled or returned items do not advance", () => {
  assert.throws(() => advance({ status: 3 }), /إثبات/);
  assert.equal(advance({ status: 3, proof: "demo.pdf" }).status, 4);
  assert.equal(advance({ status: 1, cancelled: true }).status, 1);
  assert.equal(advance({ status: 2 }).status, 3);
});
test("delivery timestamp freezes late penalties, full returns keep settlement arithmetic consistent", () => {
  const item = {
    created: "2026-10-01T12:00:00Z",
    deliveredAt: "2026-10-14T12:00:00Z",
    cost: 10000,
    status: 4,
  };
  const later = new Date("2026-11-15T12:00:00Z").getTime();
  assert.equal(finance(item, later).penalty, 0);
  const returned = finance({ ...item, returned: true }, later);
  assert.equal(
    returned.gross - returned.returns - returned.penalty,
    returned.net,
  );
});
