"use client";

import { useState, useEffect, useMemo } from "react";

function isBusinessDayForSalary(date) {
  const dayOfWeek = date.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
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
    if (isBusinessDayForSalary(currentDate)) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
}

export default function Home() {
  const [salaryDaysCount, setSalaryDaysCount] = useState("Calculando...");
  const [timerDisplay, setTimerDisplay] = useState("");

  const daysToSalary = useMemo(() => calculateDaysToSalary(), []);

  useEffect(() => {
    setSalaryDaysCount(`${daysToSalary} DIAS`);

    let timerInterval = null;

    function manageTimer() {
      const now = new Date();
      const currentHour = now.getHours();

      // O contador só roda se for um dia útil e entre 8h e 12h
      if (currentHour >= 8 && currentHour < 12 && isBusinessDayForSalary(now)) {
        const endTime = new Date(now);
        endTime.setHours(12, 0, 0, 0);

        if (timerInterval) {
          clearInterval(timerInterval);
        }

        timerInterval = setInterval(() => {
          const currentTime = new Date();
          const timeLeft = endTime.getTime() - currentTime.getTime();

          if (timeLeft <= 0) {
            setTimerDisplay("");
            clearInterval(timerInterval);
            timerInterval = null;
            return;
          }

          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          const formattedTime = `${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

          setTimerDisplay(formattedTime);
        }, 1000);
      } else {
        setTimerDisplay("");
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      }
    }

    manageTimer();

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
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
          {timerDisplay && (
            <p className="font-bold">{timerDisplay}</p>
          )}
        </div>
      </div>
    </div>
  );
}