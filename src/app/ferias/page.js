"use client";

import { useEffect, useState } from 'react'; // Import useEffect and useState

export default function Home() {
  const [businessDaysCount, setBusinessDaysCount] = useState("Calculando...");
  const [timerDisplay, setTimerDisplay] = useState("");

  useEffect(() => {
    function isBusinessDay(date) {
      const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
      const year = date.getFullYear();
      const month = date.getMonth(); // 0 = Janeiro, 11 = Dezembro (ex: Junho é 5, Agosto é 7)
      const day = date.getDate();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
      }

      return true;
    }

    function calculateBusinessDays() {
      const today = new Date();
      const now = new Date();

      const endDate = new Date(2025, 7, 8);
      endDate.setHours(0, 0, 0, 0);

      let businessDays = 0;
      let startDateForCounting = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      if (now.getHours() >= 12 && isBusinessDay(startDateForCounting)) {
        startDateForCounting.setDate(startDateForCounting.getDate() + 1);
      }

      let currentDate = new Date(startDateForCounting);

      while (currentDate <= endDate) {
        if (isBusinessDay(currentDate)) {
          businessDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return businessDays;
    }

    async function displayResults() {

      const count = calculateBusinessDays();
      setBusinessDaysCount(`${count} DIAS`);

    }

    // Timer logic (this part remains largely the same, but updates state)
    function startTimer() {
      const now = new Date();
      const startTime = new Date();
      startTime.setHours(8, 0, 0, 0);

      if (now > startTime) {
        startTime.setDate(startTime.getDate() + 1);
      }

      const endTime = new Date();
      endTime.setHours(12, 0, 0, 0);

      function updateTimer() {
        const currentTime = new Date().getTime();
        const timeLeft = endTime - currentTime;

        if (timeLeft <= 0) {
          startTimer();
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

        const nextStart = new Date(startTime);
        nextStart.setDate(startTime.getDate() + 1);
        if (currentTime >= nextStart.getTime()) {
          startTimer();
          return;
        }
      }

      updateTimer();
      const timerInterval = setInterval(updateTimer, 1000);

      return () => clearInterval(timerInterval); // Cleanup
    }

    // Call functions when component mounts
    displayResults();
    startTimer();

  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Férias</h1>
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6"
          role="alert"
        >
          <p className="font-bold text-2xl" id="businessDaysCount">{businessDaysCount}</p>
          <p className="timer-display font-bold">{timerDisplay}</p>
        </div>
      </div>
    </div>
  );
}