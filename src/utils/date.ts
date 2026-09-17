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
  return date < todayStart
}

// 明日より後の日付かどうかを判定
export function isFutureDate(date: Date) {
  const tomorrowEnd = new Date();
  tomorrowEnd.setHours(48, 0, 0, 0);
  return tomorrowEnd <= date
}