// Simple Calendar Script
    document.addEventListener('DOMContentLoaded', function() {
      // Track the displayed month/year (separate from current date)
      let displayedMonth = new Date().getMonth();
      let displayedYear = new Date().getFullYear();
      
      function updateCalendar() {
        const now = new Date();
        const currentDate = now.getDate();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Update month and year
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        document.getElementById('calendar-month').textContent = monthNames[displayedMonth];
        document.getElementById('calendar-year').textContent = displayedYear;
        
        // Get first day of month and total days for the DISPLAYED month
        const firstDay = new Date(displayedYear, displayedMonth, 1);
        const lastDay = new Date(displayedYear, displayedMonth + 1, 0);
        const totalDays = lastDay.getDate();
        const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Clear calendar days
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';
        
        // Add days from previous month to fill empty cells at start
        const previousMonth = displayedMonth === 0 ? 11 : displayedMonth - 1;
        const previousYear = displayedMonth === 0 ? displayedYear - 1 : displayedYear;
        const previousLastDay = new Date(previousYear, previousMonth + 1, 0).getDate();
        
        for (let i = startingDay - 1; i >= 0; i--) {
          const dayElement = document.createElement('div');
          dayElement.className = 'calendar-day text-center text-xs py-1.5 rounded-md cursor-default transition-all duration-200 h-7 flex items-center justify-center text-gray-300';
          dayElement.textContent = previousLastDay - i;
          calendarDays.appendChild(dayElement);
        }
        
        // Add days of displayed month
        for (let day = 1; day <= totalDays; day++) {
          const dayElement = document.createElement('div');
          dayElement.className = 'calendar-day text-center text-xs py-1.5 rounded-md cursor-default transition-all duration-200 h-7 flex items-center justify-center text-gray-900';
          dayElement.textContent = day;

          // Highlight today only if viewing the current month
          if (day === currentDate && displayedMonth === currentMonth && displayedYear === currentYear) {
            dayElement.classList.add('bg-[#0F172A]', 'text-white', 'font-semibold');
          }

          calendarDays.appendChild(dayElement);
        }
        
        // Add days from next month to fill remaining cells (to complete 7x6 grid)
        const totalCells = 35; // 7 days * 6 rows
        const filledCells = startingDay + totalDays;
        const remainingCells = totalCells - filledCells;
        
        for (let day = 1; day <= remainingCells; day++) {
          const dayElement = document.createElement('div');
          dayElement.className = 'calendar-day text-center text-xs py-1.5 rounded-md cursor-default transition-all duration-200 h-7 flex items-center justify-center text-gray-300';
          dayElement.textContent = day;
          calendarDays.appendChild(dayElement);
        }
      }
      
      // Initialize calendar
      updateCalendar();
      
      // Update calendar at midnight
      const now = new Date();
      const millisecondsUntilMidnight = 
        (24 * 60 * 60 * 1000) - 
        (now.getHours() * 60 * 60 * 1000 + 
         now.getMinutes() * 60 * 1000 + 
         now.getSeconds() * 1000 + 
         now.getMilliseconds());
      
      setTimeout(function() {
        updateCalendar();
        // Update every 24 hours
        setInterval(updateCalendar, 24 * 60 * 60 * 1000);
      }, millisecondsUntilMidnight);
      
      // Add navigation button handlers
      document.getElementById('prev-month').addEventListener('click', function() {
        displayedMonth--;
        if (displayedMonth < 0) {
          displayedMonth = 11;
          displayedYear--;
        }
        updateCalendar();
      });
      
      document.getElementById('next-month').addEventListener('click', function() {
        displayedMonth++;
        if (displayedMonth > 11) {
          displayedMonth = 0;
          displayedYear++;
        }
        updateCalendar();
      });
    });
