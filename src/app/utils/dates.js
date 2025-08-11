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

  // A data final agora depende se a contagem é para férias ou para o fim do contrato
  const endDate = isFeriasPage ? new Date(2025, 8, 7) : new Date(2025, 9, 20);
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