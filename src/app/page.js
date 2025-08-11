"use client";

import { useEffect, useState, useMemo } from "react";
import { isBusinessDay, calculateBusinessDays } from "./utils/dates";

export default function Home() {
  const [motivationalQuote, setMotivationalQuote] = useState(
    "Carregando frase..."
  );
  const [businessDaysCount, setBusinessDaysCount] = useState("Calculando...");
  const [timerDisplay, setTimerDisplay] = useState("");

  const businessDays = useMemo(() => calculateBusinessDays(), []);

  useEffect(() => {
    let frases = [];

    async function loadFrases() {
      try {
        const response = await fetch("/frases.json");
        frases = await response.json();
      } catch (error) {
        console.error("Erro ao carregar as frases:", error);
        setMotivationalQuote("Não foi possível carregar as frases.");
      }
    }

    async function displayResults() {
      await loadFrases();
      setBusinessDaysCount(`${businessDays} DIAS`);

      const totalFrases = frases.length;
      if (totalFrases > 0) {
        let quoteIndex = totalFrases - businessDays;

        if (quoteIndex < 0) {
          quoteIndex = 0;
        } else if (quoteIndex >= totalFrases) {
          quoteIndex = totalFrases - 1;
        }
        setMotivationalQuote(frases[quoteIndex]);
      } else {
        setMotivationalQuote("Nenhuma frase disponível.");
      }
    }

    let timerInterval = null;

    function manageTimer() {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= 8 && currentHour < 12 && isBusinessDay(now)) {
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

    displayResults();
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">FIM DA CLT</h1>
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
        <div className="bg-gray-100 border-l-4 border-gray-500 text-black p-4 rounded-md">
          <p className="text-lg italic" id="motivationalQuote">
            {motivationalQuote}
          </p>
        </div>
      </div>
    </div>
  );
}
