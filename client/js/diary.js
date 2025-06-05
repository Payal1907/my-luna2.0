document.getElementById('diaryForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const mood = document.getElementById('mood').value;
  const entry = document.getElementById('entry').value;
  const food = document.getElementById('food').value;
  const stressLevel = parseInt(document.getElementById('stressLevel').value,10) || 0;
  const sleepHours = parseInt(document.getElementById('sleepHours').value,10) || 0;
  const screenTime = parseInt(document.getElementById('screenTime').value,10) || 0;

  const harmonyScore = calculateHarmonyScore(stressLevel, sleepHours, screenTime, mood);
  const token = localStorage.getItem('token');

  const res = await fetch('https://my-luna2.onrender.com/diary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' ,
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      date, mood, entry, food, stressLevel, sleepHours, screenTime, harmonyScore
    })
  });

  const data = await res.json();
  if (res.ok) {
    updateHarmonyCircle(harmonyScore);
    document.getElementById('feedback').innerHTML = generateMoodFeedback(mood, harmonyScore);
    alert("Diary saved!");
  } else {
    alert("Error: " + data.msg);
  }
});

function calculateHarmonyScore(stress, sleep, screen, mood) {
  let score = 100;

  score -= stress * 5;
  score -= (screen > 6 ? (screen - 6) * 2 : 0);
  score += (sleep >= 7 && sleep <= 9) ? 10 : -5;

  const moodAdjustments = {
    Happy: 10,
    Sad: -10,
    Angry: -15,
    Anxious: -8,
    Neutral: 0
  };

  score += moodAdjustments[mood];
  return Math.max(0, Math.min(100, score)); // clamp between 0–100
}

function generateMoodFeedback(mood, score) {
  const tips = {
    Happy: "Keep it up! Consider sharing your happiness with someone today 💬",
    Sad: "It's okay to feel down. Try journaling or taking a short walk 🌱",
    Angry: "Take a breather. A few deep breaths or meditation might help 🧘‍♀️",
    Anxious: "You're doing your best. Try grounding yourself with 5-4-3-2-1 🖐️",
    Neutral: "Try something new today — maybe a hobby or a call with a friend 🎨📞"
  };

  return `
    <div class="score">Harmony Score: ${score}/100</div>
    <div class="tip">${tips[mood]}</div>
  `;
}


function updateHarmonyCircle(score) {
  const angle = (score / 100) * 360;
  const fill1 = document.getElementById("fill1");
  const fill2 = document.getElementById("fill2");

  if (angle <= 180) {
    fill1.style.transform = `rotate(${angle}deg)`;
    fill2.style.transform = `rotate(0deg)`;
  } else {
    fill1.style.transform = `rotate(180deg)`;
    fill2.style.transform = `rotate(${angle - 180}deg)`;
  }

  document.getElementById("harmonyScoreText").textContent = score;
}

function populateSelect(id, start, end) {
  const select = document.getElementById(id);
  for (let i = start; i <= end; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
}

// Populate the dropdowns
populateSelect('stressLevel', 1, 10);
populateSelect('sleepHours', 0, 12);
populateSelect('screenTime', 0, 12);



