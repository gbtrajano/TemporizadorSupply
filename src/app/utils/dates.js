// utils/dates.js

export function isBusinessDay(date) {
  const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado

  // Período de férias conforme o código original
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Janeiro, 11 = Dezembro
  const day = date.getDate();

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  // Período de férias conforme o código original (para pagina inicial)
  if (year === 2025 && month === 8) {
    return false;
  }

  // Período de férias conforme o código original (para pagina inicial)
  if (year === 2025 && month === 6 && day === 29) {
    return false;
  }

  return true;
}

export function isBusinessDayForFerias(date) {
  const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  return true;
}

export function calculateBusinessDays(isFeriasPage = false) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = isFeriasPage ? new Date(2025, 8, 12) : new Date(2025, 9, 20);
  endDate.setHours(0, 0, 0, 0);

  let businessDays = 0;
  let startDateForCounting = new Date(today);

  if (new Date().getHours() >= 12) {
    startDateForCounting.setDate(startDateForCounting.getDate() + 1);
  }

  let currentDate = new Date(startDateForCounting);

  while (currentDate <= endDate) {
    if (isFeriasPage) {
      if (isBusinessDayForFerias(currentDate)) {
        businessDays++;
      }
    } else {
      if (isBusinessDay(currentDate)) {
        businessDays++;
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return businessDays;
}
