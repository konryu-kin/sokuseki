import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveAbsoluteDate,
  resolveAbsoluteTime,
  resolveRelativeDate,
  resolveRelativeTime,
} from "../src/utils/date.ts";

const resolve = (base, reference, offset, specifier) =>
  resolveRelativeDate({
    base,
    reference,
    expression: { offset, ...(specifier ? { specifier } : {}) },
  });

test("resolves absolute dates", () => {
  assert.equal(
    resolveAbsoluteDate({ type: "day-base", year: 2026, month: 10, day: 5 }),
    "2026-10-05",
  );
  assert.equal(
    resolveAbsoluteDate({
      type: "week-base",
      year: 2026,
      month: 10,
      week: 2,
      day: 3,
    }),
    "2026-10-14",
  );
  assert.equal(
    resolveAbsoluteDate({ type: "day-base", year: 2026, month: 12, day: 31 }),
    "2026-12-31",
  );
  assert.equal(
    resolveAbsoluteDate({ type: "day-base", year: 2024, month: 2, day: 29 }),
    "2024-02-29",
  );
  assert.throws(
    () =>
      resolveAbsoluteDate({ type: "day-base", year: 2026, month: 2, day: 30 }),
    RangeError,
  );
  assert.throws(
    () =>
      resolveAbsoluteDate({
        type: "week-base",
        year: 2026,
        month: 2,
        week: 5,
        day: 1,
      }),
    RangeError,
  );
});

test("resolves absolute times", () => {
  assert.equal(resolveAbsoluteTime({ hour: 0, minute: 0 }), "00:00");
  assert.equal(resolveAbsoluteTime({ hour: 12, minute: 30 }), "12:30");
  assert.equal(resolveAbsoluteTime({ hour: 23, minute: 59 }), "23:59");
  assert.throws(() => resolveAbsoluteTime({ hour: 24, minute: 0 }), RangeError);
  assert.throws(
    () => resolveAbsoluteTime({ hour: 12, minute: 60 }),
    RangeError,
  );
  assert.throws(() => resolveAbsoluteTime({ hour: -1, minute: 0 }), RangeError);
});

test("resolves relative times across midnight", () => {
  const base = new Date(2026, 8, 20, 12, 0, 0, 0);
  assert.equal(
    resolveRelativeTime(base, { minute: 30 }).toString(),
    new Date(2026, 8, 20, 12, 30).toString(),
  );
  assert.equal(
    resolveRelativeTime(base, { hour: 2, minute: 0 }).toString(),
    new Date(2026, 8, 20, 14, 0).toString(),
  );
  assert.equal(
    resolveRelativeTime(base, { hour: 2, minute: 30 }).toString(),
    new Date(2026, 8, 20, 14, 30).toString(),
  );
  assert.equal(
    resolveRelativeTime(new Date(2026, 8, 20, 23, 30), {
      hour: 2,
      minute: 0,
    }).toString(),
    new Date(2026, 8, 21, 1, 30).toString(),
  );
  assert.equal(
    resolveRelativeTime(new Date(2026, 8, 20, 23, 45), {
      minute: 30,
    }).toString(),
    new Date(2026, 8, 21, 0, 15).toString(),
  );
  assert.throws(
    () => resolveRelativeTime(base, { hour: -1, minute: 0 }),
    RangeError,
  );
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
