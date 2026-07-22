/**
 * Seasons of the Year Module Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const fireworks = new FireworksEngine('fireworksCanvas');
  const audio = new AudioEngine();

  const SEASONS = [
    { name: 'Primavera', icon: '🌸', climate: 'Flores e Tempo Suave', months: 'Março, Abril, Maio' },
    { name: 'Verão', icon: '☀️', climate: 'Calor e Praia', months: 'Junho, Julho, Agosto' },
    { name: 'Outono', icon: '🍁', climate: 'Folhas a Cair e Vento', months: 'Setembro, Outubro, Novembro' },
    { name: 'Inverno', icon: '❄️', climate: 'Frio e Chuva', months: 'Dezembro, Janeiro, Fevereiro' }
  ];

  let score = parseInt(localStorage.getItem('estacoes_score') || '0', 10);
  let streak = 0;

  const seasonsGrid = document.getElementById('seasonsGrid');
  const estacoesPrompt = document.getElementById('estacoesPrompt');
  const estacoesOptions = document.getElementById('estacoesOptions');
  const estacoesFeedback = document.getElementById('estacoesFeedback');
  const nextEstacoesBtn = document.getElementById('nextEstacoesBtn');
  const scoreValue = document.getElementById('scoreValue');
  const streakValue = document.getElementById('streakValue');

  // Render Seasons Grid
  SEASONS.forEach(s => {
    const item = document.createElement('div');
    item.className = 'season-card';
    item.innerHTML = `
      <span class="season-icon">${s.icon}</span>
      <span class="season-name">${s.name}</span>
      <span class="season-climate">${s.climate}</span>
      <span class="season-months">${s.months}</span>
    `;
    item.addEventListener('click', () => {
      if (audio.synth) {
        audio.synth.cancel();
        const u = new SpeechSynthesisUtterance(`${s.name}. ${s.climate}. Meses: ${s.months}.`);
        u.lang = 'pt-PT';
        audio.synth.speak(u);
      }
    });
    seasonsGrid.appendChild(item);
  });

  const QUESTIONS = [
    { prompt: 'Em que estação do ano faz mais calor e vamos à praia? ☀️🏖️', correct: 'Verão', choices: ['Verão', 'Inverno', 'Outono', 'Primavera'] },
    { prompt: 'Em que estação do ano caem as folhas das árvores? 🍁🍂', correct: 'Outono', choices: ['Outono', 'Verão', 'Primavera', 'Inverno'] },
    { prompt: 'Em que estação nascem as flores e o tempo fica suave? 🌸🌻', correct: 'Primavera', choices: ['Primavera', 'Inverno', 'Outono', 'Verão'] },
    { prompt: 'Em que estação do ano faz mais frio e chove mais? ❄️🌧️', correct: 'Inverno', choices: ['Inverno', 'Verão', 'Primavera', 'Outono'] },
    { prompt: 'Quantas estações tem o ano em Portugal?', correct: '4 estações', choices: ['4 estações', '2 estações', '7 estações', '12 estações'] }
  ];

  let currentQuestion = null;

  const generateQuestion = () => {
    estacoesFeedback.className = 'feedback-banner';
    estacoesFeedback.textContent = '';

    currentQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    estacoesPrompt.innerHTML = currentQuestion.prompt;

    const shuffled = [...currentQuestion.choices].sort(() => Math.random() - 0.5);
    estacoesOptions.innerHTML = '';

    shuffled.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => handleAnswer(choice, btn));
      estacoesOptions.appendChild(btn);
    });
  };

  const handleAnswer = (choice, btn) => {
    const buttons = estacoesOptions.querySelectorAll('.quiz-option-btn');
    buttons.forEach(b => b.disabled = true);

    if (choice === currentQuestion.correct) {
      btn.classList.add('correct');
      score += 10;
      streak += 1;
      localStorage.setItem('estacoes_score', score);
      updateScore();
      audio.playSuccessSound();
      fireworks.triggerFireworks();
      showFeedback('✨ Espetacular! Acertaste!', 'success');
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
    estacoesFeedback.textContent = msg;
    estacoesFeedback.className = `feedback-banner show ${type}`;
  };

  nextEstacoesBtn.addEventListener('click', generateQuestion);

  updateScore();
  generateQuestion();
});
