/**
 * Main Application Logic & Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Subsystems
  const fireworks = new FireworksEngine('fireworksCanvas');
  const audio = new AudioEngine();

  // State Variables
  let currentMode = 'practice'; // 'practice' | 'quiz' | 'timeattack'
  let score = 0;
  let streak = 0;
  let alreadyScored = false;

  let targetHour = 15;
  let targetMinute = 0;

  // Quiz / Time Attack Variables
  let quizTimer = null;
  let quizTimeLeft = 60;

  // UI Elements
  const periodBadge = document.getElementById('periodBadge');
  const amPmToggleBtn = document.getElementById('amPmToggleBtn');
  const digitalTimeStr = document.getElementById('digitalTimeStr');
  const speakTimeBtn = document.getElementById('speakTimeBtn');
  const scoreValue = document.getElementById('scoreValue');
  const streakValue = document.getElementById('streakValue');

  // Mode Buttons
  const modePracticeBtn = document.getElementById('modePracticeBtn');
  const modeQuizBtn = document.getElementById('modeQuizBtn');
  const modeTimeAttackBtn = document.getElementById('modeTimeAttackBtn');

  // Panel Containers
  const practiceContainer = document.getElementById('practiceContainer');
  const quizContainer = document.getElementById('quizContainer');

  // Practice View Elements
  const challengePrompt = document.getElementById('challengePrompt');
  const checkAnswerBtn = document.getElementById('checkAnswerBtn');
  const nextChallengeBtn = document.getElementById('nextChallengeBtn');
  const feedbackMessage = document.getElementById('feedbackMessage');

  // Quiz View Elements
  const quizOptions = document.getElementById('quizOptions');
  const quizFeedback = document.getElementById('quizFeedback');
  const quizPromptText = document.getElementById('quizPromptText');
  const nextQuizBtn = document.getElementById('nextQuizBtn');
  const quizTimerBadge = document.getElementById('quizTimer');

  // --------------------------------------------------------------------------
  // Initialize Interactive Canvas Clock
  // --------------------------------------------------------------------------
  const clock = new InteractiveClock('clockCanvas', (timeData) => {
    digitalTimeStr.textContent = timeData.digitalStr;
    audio.playClickSound();
  });

  // AM/PM Toggle Button
  amPmToggleBtn.addEventListener('click', () => {
    const isPm = !clock.isPm;
    clock.setPmMode(isPm);

    if (isPm) {
      document.body.className = 'theme-pm';
      periodBadge.className = 'period-badge badge-pm';
      periodBadge.textContent = '🌙 Tarde/Noite / PM (13:00 - 24:00)';
      amPmToggleBtn.textContent = 'Mudar para AM ☀️';
    } else {
      document.body.className = 'theme-am';
      periodBadge.className = 'period-badge badge-am';
      periodBadge.textContent = '☀️ Manhã / AM (01:00 - 12:00)';
      amPmToggleBtn.textContent = 'Mudar para PM 🌙';
    }
  });

  // Speak Time Button
  speakTimeBtn.addEventListener('click', () => {
    audio.speakTimeInPortuguese(clock.hour, clock.minute, clock.isPm);
  });

  // --------------------------------------------------------------------------
  // Game Mode Switching
  // --------------------------------------------------------------------------
  const setGameMode = (mode) => {
    currentMode = mode;
    
    // Tab highlights
    modePracticeBtn.classList.toggle('active', mode === 'practice');
    modeQuizBtn.classList.toggle('active', mode === 'quiz');
    modeTimeAttackBtn.classList.toggle('active', mode === 'timeattack');

    // Container visibility
    practiceContainer.classList.toggle('active', mode === 'practice');
    quizContainer.classList.toggle('active', mode === 'quiz' || mode === 'timeattack');

    if (quizTimer) {
      clearInterval(quizTimer);
      quizTimer = null;
    }

    if (mode === 'practice') {
      quizTimerBadge.classList.add('hidden');
      generatePracticeChallenge();
    } else if (mode === 'quiz') {
      quizTimerBadge.classList.add('hidden');
      generateQuizQuestion();
    } else if (mode === 'timeattack') {
      quizTimerBadge.classList.remove('hidden');
      start60sTimeAttack();
    }
  };

  modePracticeBtn.addEventListener('click', () => setGameMode('practice'));
  modeQuizBtn.addEventListener('click', () => setGameMode('quiz'));
  modeTimeAttackBtn.addEventListener('click', () => setGameMode('timeattack'));

  // --------------------------------------------------------------------------
  // MODE 1: Practice Challenge (Set the Clock Hands)
  // --------------------------------------------------------------------------
  const sampleChallenges = [
    { hour: 3, minute: 0, isPm: false, desc: "3:00 da manhã" },
    { hour: 15, minute: 0, isPm: true, desc: "3:00 da tarde" },
    { hour: 8, minute: 30, isPm: false, desc: "8:30 da manhã" },
    { hour: 20, minute: 0, isPm: true, desc: "8:00 da noite" },
    { hour: 12, minute: 0, isPm: false, desc: "12:00 Meio-dia" },
    { hour: 14, minute: 30, isPm: true, desc: "2:30 da tarde" },
    { hour: 18, minute: 15, isPm: true, desc: "6:15 da tarde" },
    { hour: 9, minute: 45, isPm: false, desc: "9:45 da manhã" }
  ];

  const generatePracticeChallenge = () => {
    alreadyScored = false;
    hideFeedback(feedbackMessage);

    const challenge = sampleChallenges[Math.floor(Math.random() * sampleChallenges.length)];
    targetHour = challenge.hour;
    targetMinute = challenge.minute;

    const displayHStr = String(targetHour).padStart(2, '0');
    const displayMStr = String(targetMinute).padStart(2, '0');

    challengePrompt.innerHTML = `Mova os ponteiros para mostrar <strong class="highlight-time">${displayHStr}:${displayMStr}</strong> (${challenge.desc})!`;
  };

  checkAnswerBtn.addEventListener('click', () => {
    const userHour = clock.hour;
    const userMinute = clock.minute;

    if (userHour === targetHour && userMinute === targetMinute) {
      if (!alreadyScored) {
        score += 5;
        streak += 1;
        alreadyScored = true;
        updateScoreboard();
        audio.playSuccessSound();
        fireworks.triggerFireworks();
        showFeedback(feedbackMessage, `✨ Muito bem! Acertaste e ganhaste +5 pontos!`, 'success');
      } else {
        showFeedback(feedbackMessage, `🌟 Excelente! Já acertaste esta pergunta!`, 'success');
      }
    } else {
      streak = 0;
      updateScoreboard();
      audio.playErrorSound();
      const targetStr = `${String(targetHour).padStart(2, '0')}:${String(targetMinute).padStart(2, '0')}`;
      showFeedback(feedbackMessage, `❌ Tenta outra vez! Procuras a hora ${targetStr}.`, 'error');
    }
  });

  nextChallengeBtn.addEventListener('click', generatePracticeChallenge);

  // --------------------------------------------------------------------------
  // MODE 2 & 3: Multiple Choice Quiz & Time Attack
  // --------------------------------------------------------------------------
  const generateQuizQuestion = () => {
    hideFeedback(quizFeedback);
    nextQuizBtn.classList.add('hidden');

    // Pick random hour and minute for clock
    const randomHour = Math.floor(Math.random() * 24) + 1;
    const randomMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const isPm = randomHour > 12;

    clock.setTime(randomHour, randomMinute, isPm);

    const correctStr = clock.getFormattedDigitalStr();

    // Create 4 choices
    const choices = new Set([correctStr]);
    while (choices.size < 4) {
      const h = Math.floor(Math.random() * 24) + 1;
      const m = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const hStr = String(h).padStart(2, '0');
      const mStr = String(m).padStart(2, '0');
      choices.add(`${hStr}:${mStr}`);
    }

    const shuffledChoices = Array.from(choices).sort(() => Math.random() - 0.5);

    quizOptions.innerHTML = '';
    shuffledChoices.forEach(optionStr => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = optionStr;
      btn.addEventListener('click', () => handleQuizSelection(optionStr, correctStr, btn));
      quizOptions.appendChild(btn);
    });
  };

  const handleQuizSelection = (selectedStr, correctStr, selectedBtn) => {
    const buttons = quizOptions.querySelectorAll('.quiz-option-btn');
    buttons.forEach(b => b.disabled = true);

    if (selectedStr === correctStr) {
      selectedBtn.classList.add('correct');
      score += 10;
      streak += 1;
      updateScoreboard();
      audio.playSuccessSound();
      fireworks.triggerFireworks();
      showFeedback(quizFeedback, `🎉 Correto! Ganhaste +10 pontos!`, 'success');
    } else {
      selectedBtn.classList.add('wrong');
      buttons.forEach(b => {
        if (b.textContent === correctStr) b.classList.add('correct');
      });
      streak = 0;
      updateScoreboard();
      audio.playErrorSound();
      showFeedback(quizFeedback, `❌ A resposta correta era ${correctStr}.`, 'error');
    }

    nextQuizBtn.classList.remove('hidden');
  };

  nextQuizBtn.addEventListener('click', () => {
    generateQuizQuestion();
  });

  const start60sTimeAttack = () => {
    score = 0;
    streak = 0;
    updateScoreboard();
    quizTimeLeft = 60;
    quizTimerBadge.textContent = `⏱️ ${quizTimeLeft}s`;

    generateQuizQuestion();

    quizTimer = setInterval(() => {
      quizTimeLeft--;
      quizTimerBadge.textContent = `⏱️ ${quizTimeLeft}s`;

      if (quizTimeLeft <= 0) {
        clearInterval(quizTimer);
        quizTimer = null;
        quizOptions.innerHTML = '';
        showFeedback(quizFeedback, `🏆 Fim do tempo! Pontuação Final: ${score} pontos!`, 'success');
        audio.playSuccessSound();
        fireworks.triggerFireworks();
      }
    }, 1000);
  };

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  const updateScoreboard = () => {
    scoreValue.textContent = score;
    streakValue.textContent = `🔥 ${streak}`;
  };

  const showFeedback = (el, text, type) => {
    el.textContent = text;
    el.className = `feedback-banner show ${type}`;
  };

  const hideFeedback = (el) => {
    el.textContent = '';
    el.className = 'feedback-banner';
  };

  // Initial Load
  generatePracticeChallenge();
});
