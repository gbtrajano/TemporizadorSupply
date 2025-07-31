"use client";

// New component file: SalaryCountdown.js
import { useState, useEffect } from "react";

function isBusinessDayForSalary(date) {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // In this new rule, Saturday is a business day
  return dayOfWeek !== 0; // Excludes only Sunday
}

function getFifthBusinessDay(date) {
  let businessDaysCount = 0;
  let currentDate = new Date(date.getFullYear(), date.getMonth(), 1);

  while (businessDaysCount < 5) {
    if (isBusinessDayForSalary(currentDate)) {
      businessDaysCount++;
    }
    // If we've found the 5th business day
    if (businessDaysCount === 5) {
      // Check the special Saturday rule
      if (currentDate.getDay() === 6) {
        // 6 = Saturday
        // Payday is the preceding Friday
        currentDate.setDate(currentDate.getDate() - 1);
      }
      return currentDate;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return null; // Should not happen in a typical month
}

export default function salario() {
  const [salaryDaysCount, setSalaryDaysCount] = useState("Calculando...");

  useEffect(() => {
    function calculateDaysToSalary() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let fifthBusinessDay = getFifthBusinessDay(today);

      // If the 5th business day of the current month has already passed,
      // calculate for the next month
      if (today.getTime() > fifthBusinessDay.getTime()) {
        const nextMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          1
        );
        fifthBusinessDay = getFifthBusinessDay(nextMonth);
      }

      let count = 0;
      let currentDate = new Date(today);

      while (currentDate.getTime() <= fifthBusinessDay.getTime()) {
        count++;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return count - 1; // Subtract 1 because we're counting until the day before payday
    }

    setSalaryDaysCount(`${calculateDaysToSalary()} DIAS`);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-[80%] text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Salário</h1>
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6"
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
