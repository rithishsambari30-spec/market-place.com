// Default timezones to display
const defaultTimezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

// Get DOM elements
const clocksContainer = document.getElementById('clocksContainer');
const addTimezoneBtn = document.getElementById('addTimezoneBtn');
const modal = document.getElementById('timezoneModal');
const closeBtn = document.querySelector('.close');
const timezoneSelect = document.getElementById('timezoneSelect');
const confirmTimezoneBtn = document.getElementById('confirmTimezoneBtn');

// Store active timezones
let activeTimezones = [];

// Initialize the clock
function init() {
    activeTimezones = JSON.parse(localStorage.getItem('activeTimezones')) || defaultTimezones;
    renderClocks();
    updateClocks();
    setInterval(updateClocks, 1000);
}

// Render clock cards for all active timezones
function renderClocks() {
    clocksContainer.innerHTML = '';
    activeTimezones.forEach((timezone, index) => {
        const clockCard = createClockCard(timezone, index);
        clocksContainer.appendChild(clockCard);
    });
}

// Create a single clock card element
function createClockCard(timezone, index) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.innerHTML = `
        <div class="timezone-name">${formatTimezoneName(timezone)}</div>
        <div class="time-period" id="period-${index}"></div>
        <div class="clock-display" id="clock-${index}">--:--:--</div>
        <div class="date-display" id="date-${index}"></div>
        <button class="remove-btn" onclick="removeTimezone(${index})">Remove</button>
    `;
    return card;
}

// Format timezone name for display
function formatTimezoneName(timezone) {
    return timezone.replace(/_/g, ' ').replace('/', ' - ');
}

// Update all clocks
function updateClocks() {
    activeTimezones.forEach((timezone, index) => {
        const time = getTimeInTimezone(timezone);
        document.getElementById(`clock-${index}`).textContent = time.timeString;
        document.getElementById(`date-${index}`).textContent = time.dateString;
        document.getElementById(`period-${index}`).textContent = time.period;
    });
}

// Get time in a specific timezone
function getTimeInTimezone(timezone) {
    const now = new Date();
    const options = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    
    const dateOptions = {
        timeZone: timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    const dateString = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
    
    const [hours, minutes] = timeString.split(':');
    const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
    
    return {
        timeString: timeString,
        dateString: dateString,
        period: period
    };
}

// Remove a timezone
function removeTimezone(index) {
    activeTimezones.splice(index, 1);
    localStorage.setItem('activeTimezones', JSON.stringify(activeTimezones));
    renderClocks();
}

// Add timezone button click handler
addTimezoneBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    timezoneSelect.value = '';
});

// Close modal click handler
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Confirm timezone button click handler
confirmTimezoneBtn.addEventListener('click', () => {
    const selectedTimezone = timezoneSelect.value;
    
    if (!selectedTimezone) {
        alert('Please select a timezone');
        return;
    }
    
    if (activeTimezones.includes(selectedTimezone)) {
        alert('This timezone is already added');
        return;
    }
    
    activeTimezones.push(selectedTimezone);
    localStorage.setItem('activeTimezones', JSON.stringify(activeTimezones));
    
    modal.style.display = 'none';
    renderClocks();
    updateClocks();
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);