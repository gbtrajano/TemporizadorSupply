// utils/dates.js

export function isBusinessDay(date) {
  const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Janeiro, 11 = Dezembro
  const day = date.getDate();

  // Período de férias de 8 de setembro a 7 de outubro de 2025
  const isFerias = (
    year === 2025 &&
    (
      (month === 8 && day >= 8 && day <= 30) || // Setembro
      (month === 9 && day >= 1 && day <= 7) // Outubro
    )
  );

  if (isFerias) {
    return false;
  }

  return true;
}
