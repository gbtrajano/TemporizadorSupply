function updateTimer() {
    const now = new Date();
    const targetDate = new Date('2025-10-20T12:00:00'); // Target date set to 12:00

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
    let current = new Date(now);
    // Adjust current to use 12:00 as the day boundary
    if (current.getHours() < 12) {
      current.setDate(current.getDate() - 1); // Consider previous day if before 12:00
    }
    current.setHours(12, 0, 0, 0); // Set to 12:00:00.000 of the current day
    const end = new Date('2025-10-20T12:00:00'); // End at 12:00
    let workdays = 0;

    const vacationStart = new Date('2025-08-01T12:00:00');
    const vacationEnd = new Date('2025-08-31T12:00:00');
    const holiday = new Date('2025-06-15T12:00:00'); // Adjusted to 12:00

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