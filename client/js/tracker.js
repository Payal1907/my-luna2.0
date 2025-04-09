document.getElementById('trackerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token'); // adjust if you’re not using auth

  const periodStart = document.getElementById('start').value;
  const periodEnd = document.getElementById('end').value;
  const symptoms = document.getElementById('symptoms').value.split(',').map(s => s.trim());
  const notes = document.getElementById('notes').value;
  const flowLevel = document.getElementById('flowLevel').value;
  const painLevel = parseInt(document.getElementById('painLevel').value);
  const mood = document.getElementById('mood').value;

  const response = await fetch('http://localhost:5000/tracker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({
      periodStart,
      periodEnd,
      symptoms,
      notes,
      flowLevel,
      painLevel,
      mood
    })
  });

  const data = await response.json();
  if (response.ok) {
    alert('Entry saved!');
    displayNextPeriod(periodStart);
    updateCalendar(periodStart, periodEnd);
  } else {
    alert('Error: ' + data.msg);
  }
});

function displayNextPeriod(startDate) {
  const nextDate = calculateNextPeriodFixed(startDate);
  document.getElementById('nextPeriodDate').innerHTML = `<strong>Predicted Next Period:</strong> ${nextDate.toDateString()}`;
}

function calculateNextPeriodFixed(startDate) {
  const start = new Date(startDate);
  const next = new Date(start);
  next.setDate(start.getDate() + 28); // assuming 28-day cycle
  return next;
}

function updateCalendar(start, end) {
  const calendarDiv = document.getElementById('calendar');
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = [];

  while (startDate <= endDate) {
    days.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }

  calendarDiv.innerHTML = "<strong>Marked Period Days:</strong><ul>" +
    days.map(d => `<li>${d.toDateString()}</li>`).join('') +
    "</ul>";
}

  