function updateTimer() {
    const now = new Date();
    const targetDate = new Date('2025-10-20T00:00:00');

    // Calculate total time difference
    const timeDiff = targetDate - now;
    if (timeDiff <= 0) {
      document.getElementById('timer').textContent = 'Data atingida!';
      document.getElementById('workdays').textContent = '0 dias úteis restantes';
      document.querySelector(".daily-phrase span").textContent = 'Nenhuma frase disponível.'; // Or a default message
      return;
      }

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Update timer display
    document.getElementById('timer').textContent =
      `${days.toString().padStart(2, '0')} dias, ` +
      `${hours.toString().padStart(2, '0')} horas, ` +
      `${minutes.toString().padStart(2, '0')} minutos, ` +
      `${seconds.toString().padStart(2, '0')} segundos`;

    // Calculate workdays (Monday to Friday, excluding vacation and holiday)
    let current = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start at midnight
    const end = new Date('2025-10-20T00:00:00');
    let workdays = 0;

    const vacationStart = new Date('2025-08-01T00:00:00');
    const vacationEnd = new Date('2025-08-31T23:59:59');
    const holiday = new Date('2025-06-15T00:00:00'); // Placeholder: June 15, 2025 (Sunday)

    while (current < end) {
      const isWeekday = current.getDay() !== 0 && current.getDay() !== 6; // Not Saturday (6) or Sunday (0)
      const isNotVacation = current < vacationStart || current > vacationEnd;
      const isNotHoliday = !(current.getDate() === holiday.getDate() &&
                            current.getMonth() === holiday.getMonth() &&
                            current.getFullYear() === holiday.getFullYear());

      if (isWeekday && isNotVacation && isNotHoliday) {
        workdays++;
      }
      current.setDate(current.getDate() + 1);
    }

    // Update workdays display
    document.getElementById('workdays').textContent = `${workdays} dias`;

    // Now call the function to update the phrase using the calculated workdays
    updateDailyPhrase(workdays);
  }

  // Define a global variable to store the phrases once loaded
  let globalFrasesArray = [];

  // Function to load phrases from JSON
  async function carregarFrasesArray() {
    try {
      const response = await fetch('frases.json'); // Path to your JSON file
      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
      globalFrasesArray = await response.json(); // Store the phrases globally
      // Initial update of the phrase once phrases are loaded
      updateTimer(); // Call updateTimer to immediately display the correct phrase
    } catch (error) {
      console.error("Não foi possível carregar as frases:", error);
    }
  }

  // Function to update the daily phrase based on workdays
  function updateDailyPhrase(workdaysRemaining) {
    if (globalFrasesArray.length > 0) {
      // Use modulo to ensure the index is within the array bounds
      const index = workdaysRemaining % globalFrasesArray.length;
      const fraseDesejada = globalFrasesArray[index];
      document.querySelector(".daily-phrase").textContent = fraseDesejada;
    } else {
      document.querySelector(".daily-phrase").textContent = 'Carregando frases...';
    }
  }

  // Load phrases first
  carregarFrasesArray();

  // Update timer immediately and then every second
  // Note: updateTimer will call updateDailyPhrase
  setInterval(updateTimer, 1000);