/**
 * Months of the Year Module Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const fireworks = new FireworksEngine('fireworksCanvas');
  const audio = new AudioEngine();

  const MONTHS = [
    { num: 1, name: 'Janeiro', days: 31, icon: '❄️' },
    { num: 2, name: 'Fevereiro', days: 28, icon: '🎭' },
    { num: 3, name: 'Março', days: 31, icon: '🌱' },
    { num: 4, name: 'Abril', days: 30, icon: '🌧️' },
    { num: 5, name: 'Maio', days: 31, icon: '🌸' },
    { num: 6, name: 'Junho', days: 30, icon: '☀️' },
    { num: 7, name: 'Julho', days: 31, icon: '🏖️' },
    { num: 8, name: 'Agosto', days: 31, icon: '🌊' },
    { num: 9, name: 'Setembro', days: 30, icon: '🎒' },
    { num: 10, name: 'Outubro', days: 31, icon: '🍁' },
    { num: 11, name: 'Novembro', days: 30, icon: '🍂' },
    { num: 12, name: 'Dezembro', days: 31, icon: '🎄' }
  ];

  let score = parseInt(localStorage.getItem('meses_score') || '0', 10);
  let streak = 0;

  const monthsGrid = document.getElementById('monthsGrid');
  const mesesPrompt = document.getElementById('mesesPrompt');
  const mesesOptions = document.getElementById('mesesOptions');
  const mesesFeedback = document.getElementById('mesesFeedback');
  const nextMesesBtn = document.getElementById('nextMesesBtn');
  const scoreValue = document.getElementById('scoreValue');
  const streakValue = document.getElementById('streakValue');

  // Render Months Grid
  MONTHS.forEach(m => {
    const item = document.createElement('div');
    item.className = 'month-card';
    item.innerHTML = `
      <span class="month-num">${m.num}º</span>
      <span class="month-icon">${m.icon}</span>
      <span class="month-name">${m.name}</span>
      <span class="month-days">${m.days} dias</span>
    `;
    item.addEventListener('click', () => {
      if (audio.synth) {
        audio.synth.cancel();
        const u = new SpeechSynthesisUtterance(`${m.name}, mês número ${m.num}, tem ${m.days} dias.`);
        u.lang = 'pt-PT';
        audio.synth.speak(u);
      }
    });
    monthsGrid.appendChild(item);
  });

  const QUESTIONS = [
    { prompt: 'Qual é o 1º mês do ano?', correct: 'Janeiro', choices: ['Janeiro', 'Dezembro', 'Março', 'Maio'] },
    { prompt: 'Qual é o último mês do ano (12º)?', correct: 'Dezembro', choices: ['Dezembro', 'Novembro', 'Janeiro', 'Agosto'] },
    { prompt: 'Em que mês se celebra o Natal? 🎄', correct: 'Dezembro', choices: ['Dezembro', 'Outubro', 'Janeiro', 'Junho'] },
    { prompt: 'Qual é o mês mais curto do ano (28 ou 29 dias)?', correct: 'Fevereiro', choices: ['Fevereiro', 'Abril', 'Setembro', 'Junho'] },
    { prompt: 'Quantos meses tem um ano completo?', correct: '12 meses', choices: ['12 meses', '10 meses', '7 meses', '24 meses'] }
  ];

  let currentQuestion = null;

  const generateQuestion = () => {
    mesesFeedback.className = 'feedback-banner';
    mesesFeedback.textContent = '';

    currentQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    mesesPrompt.innerHTML = currentQuestion.prompt;

    const shuffled = [...currentQuestion.choices].sort(() => Math.random() - 0.5);
    mesesOptions.innerHTML = '';

    shuffled.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => handleAnswer(choice, btn));
      mesesOptions.appendChild(btn);
    });
  };

  const handleAnswer = (choice, btn) => {
    const buttons = mesesOptions.querySelectorAll('.quiz-option-btn');
    buttons.forEach(b => b.disabled = true);

    if (choice === currentQuestion.correct) {
      btn.classList.add('correct');
      score += 10;
      streak += 1;
      localStorage.setItem('meses_score', score);
      updateScore();
      audio.playSuccessSound();
      fireworks.triggerFireworks();
      showFeedback('✨ Excelente! Resposta correta!', 'success');
    } else {
      btn.classList.add('wrong');
      buttons.forEach(b => {
        if (b.textContent === currentQuestion.correct) b.classList.add('correct');
      });
      streak = 0;
      updateScore();
      audio.playErrorSound();
      showFeedback(`❌ A resposta correta era ${currentQuestion.correct}.`, 'error');
    }
  };

  const updateScore = () => {
    scoreValue.textContent = score;
    streakValue.textContent = `🔥 ${streak}`;
  };

  const showFeedback = (msg, type) => {
    mesesFeedback.textContent = msg;
    mesesFeedback.className = `feedback-banner show ${type}`;
  };

  nextMesesBtn.addEventListener('click', generateQuestion);

  updateScore();
  generateQuestion();
});
