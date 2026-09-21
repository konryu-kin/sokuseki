import type { RelativeDateSpecifier } from "../types/relativeDateSpecifier";
import type {
  AbsoluteDateSpecifier,
  AbsoluteTimeSpecifier,
  DateTimeSpecifier,
  RelativeTimeSpecifier,
} from "../types/dateTimeSpecifier";

export function isToday(date: Date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function isTomorrow(date: Date) {
  const today = new Date();
  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

export function isPastDate(date: Date) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return date < todayStart;
}

// 明日より後の日付かどうかを判定
export function isFutureDate(date: Date) {
  const tomorrowEnd = new Date();
  tomorrowEnd.setHours(48, 0, 0, 0);
  return tomorrowEnd <= date;
}

function assertInteger(value: number, name: string) {
  if (!Number.isInteger(value)) {
    throw new RangeError(`${name} must be an integer`);
  }
}

function createExactDate(year: number, month: number, day: number) {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    throw new RangeError("Date components must be integers");
  }

  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new RangeError(`Invalid calendar date: ${year}-${month}-${day}`);
  }

  return date;
}

function parseReference(reference: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(reference);
  if (!match) {
    throw new RangeError("reference must use YYYY-MM-DD format");
  }

  return createExactDate(Number(match[1]), Number(match[2]), Number(match[3]));
}

function addDays(date: Date, days: number) {
  assertInteger(days, "day offset");
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getMonthDate(year: number, month: number, day: number) {
  return createExactDate(year, month, day);
}

function getNthWeekday(year: number, month: number, week: number, day: number) {
  assertInteger(week, "week");
  assertInteger(day, "day");
  if (week < 1) {
    throw new RangeError("week must be at least 1");
  }
  if (day < 0 || day > 6) {
    throw new RangeError("day must be between 0 and 6");
  }

  const firstDay = getMonthDate(year, month, 1);
  const dayOffset = (day - firstDay.getDay() + 7) % 7;
  return getMonthDate(year, month, 1 + dayOffset + (week - 1) * 7);
}

function getOffsetMonth(reference: Date, offset: number) {
  assertInteger(offset, "month offset");
  const absoluteMonth =
    reference.getFullYear() * 12 + reference.getMonth() + offset;
  const year = Math.floor(absoluteMonth / 12);
  const month = (((absoluteMonth % 12) + 12) % 12) + 1;
  return { year, month };
}

function formatDate(date: Date) {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(date: Date) {
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
}

function formatDateTime(date: Date) {
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${formatDate(date)}T${formatTime(date)}:${seconds}`;
}

function assertTimePart(value: number, name: string, maximum: number) {
  assertInteger(value, name);
  if (value < 0 || value > maximum) {
    throw new RangeError(`${name} must be between 0 and ${maximum}`);
  }
}

export function resolveAbsoluteDate(specifier: AbsoluteDateSpecifier): string {
  const resolved =
    specifier.type === "day-base"
      ? createExactDate(specifier.year, specifier.month, specifier.day)
      : getNthWeekday(
          specifier.year,
          specifier.month,
          specifier.week,
          specifier.day,
        );

  return formatDate(resolved);
}

export function resolveAbsoluteTime(specifier: AbsoluteTimeSpecifier): string {
  assertTimePart(specifier.hour, "hour", 23);
  assertTimePart(specifier.minute, "minute", 59);

  const date = new Date(0);
  date.setHours(specifier.hour, specifier.minute, 0, 0);
  return formatTime(date);
}

export function resolveRelativeTime(
  specifier: RelativeTimeSpecifier,
  reference: Date,
): Date {
  if (Number.isNaN(reference.getTime())) {
    throw new RangeError("reference must be a valid date");
  }

  const hour = specifier.hour ?? 0;
  assertInteger(hour, "hour");
  assertInteger(specifier.minute, "minute");
  if (hour < 0 || specifier.minute < 0) {
    throw new RangeError("relative time must not be negative");
  }
  if (specifier.minute > 59) {
    throw new RangeError("minute must be between 0 and 59");
  }

  const elapsedMinutes = hour * 60 + specifier.minute;
  return new Date(reference.getTime() + elapsedMinutes * 60 * 1000);
}

export function resolveDateTimeSpecifier(
  specifier: DateTimeSpecifier,
  reference: Date,
): string {
  if (Number.isNaN(reference.getTime())) {
    throw new RangeError("reference must be a valid date");
  }

  const hasDate = specifier.date !== undefined;
  let resolvedDate: Date;

  if (!specifier.date) {
    resolvedDate = new Date(reference);
  } else if (specifier.date.type === "absolute") {
    resolvedDate = parseReference(
      resolveAbsoluteDate(specifier.date.specifier),
    );
  } else {
    resolvedDate = parseReference(
      resolveRelativeDate(specifier.date.specifier, formatDate(reference)),
    );
  }

  if (!specifier.time) {
    if (hasDate) {
      resolvedDate.setHours(0, 0, 0, 0);
    }
    return formatDateTime(resolvedDate);
  }

  if (specifier.time.type === "absolute") {
    const { hour, minute } = specifier.time.specifier;
    assertTimePart(hour, "hour", 23);
    assertTimePart(minute, "minute", 59);
    resolvedDate.setHours(hour, minute, 0, 0);
    return formatDateTime(resolvedDate);
  }

  const timeReference = hasDate
    ? new Date(resolvedDate).setHours(0, 0, 0, 0)
    : reference.getTime();
  return formatDateTime(
    resolveRelativeTime(specifier.time.specifier, new Date(timeReference)),
  );
}

export function resolveRelativeDate(
  specifier: RelativeDateSpecifier,
  referenceString: string,
): string {
  const reference = parseReference(referenceString);
  let resolved: Date;

  switch (specifier.base) {
    case "day":
      resolved = addDays(reference, specifier.expression.offset.day);
      break;
    case "week": {
      const { week } = specifier.expression.offset;
      assertInteger(week, "week offset");
      const day = specifier.expression.specifier?.day ?? reference.getDay();
      assertInteger(day, "day");
      if (day < 0 || day > 6) {
        throw new RangeError("day must be between 0 and 6");
      }
      resolved = addDays(reference, week * 7 + day - reference.getDay());
      break;
    }
    case "month": {
      const { year, month } = getOffsetMonth(
        reference,
        specifier.expression.offset.month,
      );
      const monthSpecifier = specifier.expression.specifier;
      if (!monthSpecifier || monthSpecifier.type === "day-base") {
        resolved = getMonthDate(
          year,
          month,
          monthSpecifier?.day ?? reference.getDate(),
        );
      } else {
        resolved = getNthWeekday(
          year,
          month,
          monthSpecifier.week,
          monthSpecifier.day,
        );
      }
      break;
    }
    case "year": {
      const yearOffset = specifier.expression.offset.year;
      assertInteger(yearOffset, "year offset");
      const year = reference.getFullYear() + yearOffset;
      const yearSpecifier = specifier.expression.specifier;
      if (!yearSpecifier || yearSpecifier.type === "day-base") {
        resolved = getMonthDate(
          year,
          yearSpecifier?.month ?? reference.getMonth() + 1,
          yearSpecifier?.day ?? reference.getDate(),
        );
      } else {
        resolved = getNthWeekday(
          year,
          yearSpecifier.month,
          yearSpecifier.week,
          yearSpecifier.day,
        );
      }
      break;
    }
  }

  return formatDate(resolved);
}
