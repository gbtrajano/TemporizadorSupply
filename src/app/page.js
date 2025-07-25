"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [motivationalQuote, setMotivationalQuote] = useState(
    "Carregando frase..."
  );
  const [businessDaysCount, setBusinessDaysCount] = useState("Calculando...");
  const [timerDisplay, setTimerDisplay] = useState(""); // Inicialmente vazio para não aparecer

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

    function isBusinessDay(date) {
      const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
      const year = date.getFullYear();
      const month = date.getMonth(); // 0 = Janeiro, 11 = Dezembro
      const day = date.getDate();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
      }

      // Período de férias conforme o código original
      if (year === 2025 && month === 8) {
        return false;
      }

      return true;
    }

    function calculateBusinessDays() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const endDate = new Date(2025, 9, 20); // Outubro 20, 2025 (Mês 9 é Outubro)
      endDate.setHours(0, 0, 0, 0);

      let businessDays = 0;
      let startDateForCounting = new Date(today);

      // Se a hora atual for 12 PM ou depois E hoje for dia útil,
      // a contagem começa a partir do próximo dia útil.
      if (new Date().getHours() >= 12 && isBusinessDay(startDateForCounting)) {
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
      await loadFrases();

      const count = calculateBusinessDays();
      setBusinessDaysCount(`${count} DIAS`);

      const totalFrases = frases.length;
      if (totalFrases > 0) {
        let quoteIndex = totalFrases - count;

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

    // --- Lógica do Timer Corrigida ---
    let timerInterval;

    function manageTimer() {
      const now = new Date();
      const currentHour = now.getHours();

      // Definir horários de início e fim para o timer
      const startTime = new Date(now);
      startTime.setHours(8, 0, 0, 0);

      const endTime = new Date(now);
      endTime.setHours(12, 0, 0, 0);

      // Se o timer estiver dentro do período (8h-12h) e não for um fim de semana
      if (currentHour >= 8 && currentHour < 12 && isBusinessDay(now)) {
        // Se já existe um intervalo, limpa para evitar múltiplos timers
        if (timerInterval) {
          clearInterval(timerInterval);
        }

        const updateTimerDisplay = () => {
          const currentTime = new Date();
          const timeLeft = endTime.getTime() - currentTime.getTime();

          if (timeLeft <= 0) {
            // Timer terminou para o dia, limpa o display e o intervalo
            setTimerDisplay("");
            clearInterval(timerInterval);
            // Poderíamos chamar manageTimer novamente para reavaliar (ex: para o próximo dia)
            // Mas para este caso, o timer simplesmente para até o próximo dia na hora certa.
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
        };

        // Chama a função imediatamente e depois configura o intervalo
        updateTimerDisplay();
        timerInterval = setInterval(updateTimerDisplay, 1000);
      } else {
        // Fora do período, limpa o display e o intervalo (se houver)
        setTimerDisplay("");
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null; // Garante que a variável do intervalo seja limpa
        }
      }
    }

    // Inicializa a lógica do timer.
    // Usamos setInterval aqui para que `manageTimer` seja chamada a cada segundo
    // e possa ligar/desligar o timer principal no momento certo (8h e 12h).
    const overallTimerCheck = setInterval(manageTimer, 1000);

    // Chama as funções principais na montagem do componente
    displayResults();

    // Cleanup function para limpar todos os intervalos quando o componente for desmontado
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (overallTimerCheck) {
        clearInterval(overallTimerCheck);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-[80%] text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">FIM DA CLT</h1>
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6"
          role="alert"
        >
          <p className="font-bold text-2xl" id="businessDaysCount">
            {businessDaysCount}
          </p>
          {/* Renderiza o timerDisplay apenas se ele não estiver vazio */}
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
