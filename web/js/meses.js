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
    { 
      prompt: 'Qual é o 1º mês do ano?', 
      correct: 'Janeiro', 
      choices: ['Janeiro', 'Dezembro', 'Março', 'Maio'], 
      explanation: '1️⃣ O ano novo começa a 1 de Janeiro.<br>2️⃣ O mês número 1 da lista do calendário é <strong>Janeiro</strong>!<br>3️⃣ A sequência inicial é: 1º Janeiro ➔ 2º Fevereiro ➔ 3º Março.' 
    },
    { 
      prompt: 'Qual é o último mês do ano (12º)?', 
      correct: 'Dezembro', 
      choices: ['Dezembro', 'Novembro', 'Janeiro', 'Agosto'], 
      explanation: '1️⃣ O ano tem 12 meses no total.<br>2️⃣ O mês número 12, onde celebramos o Natal e a Passagem de Ano, é <strong>Dezembro</strong>!<br>3️⃣ Por isso, o último mês do calendário é Dezembro.' 
    },
    { 
      prompt: 'Em que mês se celebra o Natal? 🎄', 
      correct: 'Dezembro', 
      choices: ['Dezembro', 'Outubro', 'Janeiro', 'Junho'], 
      explanation: '1️⃣ O Dia de Natal celebra-se no dia 25.<br>2️⃣ É no 12º e último mês do ano, que é <strong>Dezembro</strong>!<br>3️⃣ Toda a época natalícia decorre em Dezembro.' 
    },
    { 
      prompt: 'Qual é o mês mais curto do ano (28 ou 29 dias)?', 
      correct: 'Fevereiro', 
      choices: ['Fevereiro', 'Abril', 'Setembro', 'Junho'], 
      explanation: '1️⃣ Quase todos os meses têm 30 ou 31 dias.<br>2️⃣ O único mês especial que tem apenas 28 dias (ou 29 nos anos bissextos) é <strong>Fevereiro</strong>!<br>3️⃣ Logo, o mês mais curto é Fevereiro.' 
    },
    { 
      prompt: 'Quantos meses tem um ano completo?', 
      correct: '12 meses', 
      choices: ['12 meses', '10 meses', '7 meses', '24 meses'], 
      explanation: '1️⃣ Começamos em Janeiro (1º) e percorremos as 4 estações.<br>2️⃣ Terminamos em Dezembro (12º).<br>3️⃣ Um ano completo é formado por exatamente <strong>12 meses</strong>!' 
    }
  ];

  let currentQuestion = null;

  const generateQuestion = () => {
    mesesFeedback.className = 'feedback-banner';
    mesesFeedback.innerHTML = '';

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
      const expHtml = `❌ <strong>Não foi desta vez! A resposta correta é ${currentQuestion.correct}.</strong><br><br><strong>💡 Passo a passo para aprender:</strong><br>${currentQuestion.explanation}`;
      showFeedback(expHtml, 'error');
    }
  };

  const updateScore = () => {
    scoreValue.textContent = score;
    streakValue.textContent = `🔥 ${streak}`;
  };

  const showFeedback = (htmlMsg, type) => {
    mesesFeedback.innerHTML = htmlMsg;
    mesesFeedback.className = `feedback-banner show ${type}`;
  };

  nextMesesBtn.addEventListener('click', generateQuestion);

  updateScore();
  generateQuestion();
});
