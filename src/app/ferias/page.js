"use client";

import { useEffect, useState, useMemo } from "react";
import { isBusinessDayForFerias, calculateBusinessDays } from "../utils/dates";

export default function Home() {
  const [businessDaysCount, setBusinessDaysCount] = useState("Calculando...");
  const [timerDisplay, setTimerDisplay] = useState("");

  const businessDays = useMemo(() => calculateBusinessDays(true), []);

  useEffect(() => {
    setBusinessDaysCount(`${businessDays} DIAS`);

    let timerInterval = null;

    function manageTimer() {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= 8 && currentHour < 12 && isBusinessDayForFerias(now)) {
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
  }, [businessDays]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-[80%] text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">FÉRIAS</h1>
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6"
          role="alert"
        >
          <p className="font-bold text-2xl" id="businessDaysCount">
            {businessDaysCount}
          </p>
          {timerDisplay && (
            <p className="timer-display font-bold">{timerDisplay}</p>
          )}
        </div>
      </div>
    </div>
  );
}
