import assert from "node:assert/strict";
import test from "node:test";
import { resolveRelativeDate } from "../src/utils/date.ts";

const resolve = (base, reference, offset, specifier) =>
  resolveRelativeDate({
    base,
    reference,
    expression: { offset, ...(specifier ? { specifier } : {}) },
  });

test("resolves day offsets", () => {
  assert.equal(resolve("day", "2026-09-20", { day: 0 }), "2026-09-20");
  assert.equal(resolve("day", "2026-09-20", { day: 1 }), "2026-09-21");
  assert.equal(resolve("day", "2026-09-20", { day: 3 }), "2026-09-23");
  assert.equal(resolve("day", "2026-09-20", { day: -1 }), "2026-09-19");
  assert.equal(resolve("day", "2026-09-20", { day: -3 }), "2026-09-17");
});

test("resolves week offsets and weekday specifiers", () => {
  assert.equal(resolve("week", "2026-09-20", { week: 0 }), "2026-09-20");
  assert.equal(resolve("week", "2026-09-20", { week: 1 }), "2026-09-27");
  assert.equal(
    resolve("week", "2026-09-20", { week: 1 }, { day: 3 }),
    "2026-09-30",
  );
  assert.equal(
    resolve("week", "2026-09-20", { week: 4 }, { day: 1 }),
    "2026-10-19",
  );
  assert.equal(resolve("week", "2026-09-20", { week: -2 }), "2026-09-06");
  assert.equal(resolve("week", "2026-09-19", { week: 1 }), "2026-09-26");
});

test("resolves month offsets, day bases, and nth weekdays", () => {
  assert.equal(resolve("month", "2026-09-20", { month: 0 }), "2026-09-20");
  assert.equal(resolve("month", "2026-09-20", { month: 1 }), "2026-10-20");
  assert.equal(
    resolve("month", "2026-09-20", { month: 1 }, { type: "day-base", day: 5 }),
    "2026-10-05",
  );
  assert.equal(
    resolve(
      "month",
      "2026-09-20",
      { month: 1 },
      {
        type: "week-base",
        week: 2,
        day: 3,
      },
    ),
    "2026-10-14",
  );
  assert.equal(
    resolve(
      "month",
      "2026-09-20",
      { month: 2 },
      {
        type: "week-base",
        week: 1,
        day: 1,
      },
    ),
    "2026-11-02",
  );
  assert.equal(resolve("month", "2026-09-20", { month: -1 }), "2026-08-20");
});

test("resolves year offsets, day bases, and nth weekdays", () => {
  assert.equal(resolve("year", "2026-09-20", { year: 0 }), "2026-09-20");
  assert.equal(resolve("year", "2026-09-20", { year: 1 }), "2027-09-20");
  assert.equal(
    resolve(
      "year",
      "2026-09-20",
      { year: 1 },
      { type: "day-base", month: 4, day: 5 },
    ),
    "2027-04-05",
  );
  assert.equal(
    resolve(
      "year",
      "2026-09-20",
      { year: 1 },
      {
        type: "week-base",
        month: 4,
        week: 2,
        day: 3,
      },
    ),
    "2027-04-14",
  );
  assert.equal(resolve("year", "2026-09-20", { year: 3 }), "2029-09-20");
});

test("handles calendar boundaries without Date rollover", () => {
  assert.equal(resolve("day", "2026-12-31", { day: 1 }), "2027-01-01");
  assert.equal(resolve("month", "2026-12-31", { month: 1 }), "2027-01-31");
  assert.throws(() => resolve("month", "2024-01-31", { month: 1 }), RangeError);
  assert.equal(resolve("month", "2024-01-29", { month: 1 }), "2024-02-29");
  assert.equal(resolve("year", "2020-02-29", { year: 4 }), "2024-02-29");
});

test("rejects invalid calendar dates and missing nth weekdays", () => {
  assert.throws(() => resolve("month", "2026-01-31", { month: 1 }), RangeError);
  assert.throws(() => resolve("year", "2024-02-29", { year: 1 }), RangeError);
  assert.throws(
    () =>
      resolve(
        "month",
        "2026-01-01",
        { month: 1 },
        {
          type: "week-base",
          week: 5,
          day: 1,
        },
      ),
    RangeError,
  );
  assert.throws(() => resolve("day", "2026-02-29", { day: 0 }), RangeError);
});
