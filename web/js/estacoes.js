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
    { 
      prompt: 'Em que estação do ano faz mais calor e vamos à praia? ☀️🏖️', 
      correct: 'Verão', 
      choices: ['Verão', 'Inverno', 'Outono', 'Primavera'], 
      explanation: '1️⃣ Pensamos em sol forte, dias quentes, praia e férias da escola.<br>2️⃣ Esta estação decorre de Junho a Setembro e chama-se <strong>Verão</strong>!<br>3️⃣ É a época mais quente do ano!' 
    },
    { 
      prompt: 'Em que estação do ano caem as folhas das árvores? 🍁🍂', 
      correct: 'Outono', 
      choices: ['Outono', 'Verão', 'Primavera', 'Inverno'], 
      explanation: '1️⃣ O calor do verão passa e o tempo fica mais fresco e amarelado.<br>2️⃣ As folhas das árvores mudam de cor para castanho/laranja e caem.<br>3️⃣ Esta época de transição de Setembro a Dezembro chama-se <strong>Outono</strong>!' 
    },
    { 
      prompt: 'Em que estação nascem as flores e o tempo fica suave? 🌸🌻', 
      correct: 'Primavera', 
      choices: ['Primavera', 'Inverno', 'Outono', 'Verão'], 
      explanation: '1️⃣ O frio do inverno passa e a natureza desperta.<br>2️⃣ Nascem as novas flores, os campos ficam verdes e os passarinhos cantam.<br>3️⃣ Esta estação florida de Março a Junho chama-se <strong>Primavera</strong>!' 
    },
    { 
      prompt: 'Em que estação do ano faz mais frio e chove mais? ❄️🌧️', 
      correct: 'Inverno', 
      choices: ['Inverno', 'Verão', 'Primavera', 'Outono'], 
      explanation: '1️⃣ Usamos casacos, gorros e guarda-chuvas.<br>2️⃣ Os dias são mais curtos, chove muito e em alguns locais cai neve.<br>3️⃣ A estação mais fria de Dezembro a Março chama-se <strong>Inverno</strong>!' 
    },
    { 
      prompt: 'Quantas estações tem o ano em Portugal?', 
      correct: '4 estações', 
      choices: ['4 estações', '2 estações', '7 estações', '12 estações'], 
      explanation: '1️⃣ Primavera (flores) ➔ 2️⃣ Verão (sol/praia) ➔ 3️⃣ Outono (folhas a cair) ➔ 4️⃣ Inverno (frio/chuva).<br>3️⃣ O ano divide-se em exatamente <strong>4 estações</strong>!' 
    }
  ];

  let currentQuestion = null;

  const generateQuestion = () => {
    estacoesFeedback.className = 'feedback-banner';
    estacoesFeedback.innerHTML = '';

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
      const expHtml = `❌ <strong>Não foi desta vez! A resposta correta é ${currentQuestion.correct}.</strong><br><br><strong>💡 Passo a passo para aprender:</strong><br>${currentQuestion.explanation}`;
      showFeedback(expHtml, 'error');
    }
  };

  const updateScore = () => {
    scoreValue.textContent = score;
    streakValue.textContent = `🔥 ${streak}`;
  };

  const showFeedback = (htmlMsg, type) => {
    estacoesFeedback.innerHTML = htmlMsg;
    estacoesFeedback.className = `feedback-banner show ${type}`;
  };

  nextEstacoesBtn.addEventListener('click', generateQuestion);

  updateScore();
  generateQuestion();
});
