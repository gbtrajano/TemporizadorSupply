"use client";

import { useState, useEffect, useMemo } from "react";

function isBusinessDayForSalary(date) {
  const dayOfWeek = date.getDay();
  return dayOfWeek !== 0;
}

function getFifthBusinessDay(date) {
  let businessDaysCount = 0;
  let currentDate = new Date(date.getFullYear(), date.getMonth(), 1);

  while (businessDaysCount < 5) {
    if (isBusinessDayForSalary(currentDate)) {
      businessDaysCount++;
    }

    if (businessDaysCount === 5) {
      if (currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() - 1);
      }
      return currentDate;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return null;
}

function calculateDaysToSalary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let fifthBusinessDay = getFifthBusinessDay(today);

  if (today.getTime() > fifthBusinessDay.getTime()) {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    fifthBusinessDay = getFifthBusinessDay(nextMonth);
  }

  let count = 0;
  let currentDate = new Date(today);

  while (currentDate.getTime() <= fifthBusinessDay.getTime()) {
    count++;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count - 1;
}

export default function Home() {
  const [salaryDaysCount, setSalaryDaysCount] = useState("Calculando...");

  const daysToSalary = useMemo(() => calculateDaysToSalary(), []);

  useEffect(() => {
    setSalaryDaysCount(`${daysToSalary} DIAS`);
  }, [daysToSalary]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-[80%] text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Salário</h1>
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6"
          role="alert"
        >
          <p className="font-bold text-2xl" id="businessDaysCount">
            {salaryDaysCount}
          </p>
        </div>
      </div>
    </div>
  );
}
