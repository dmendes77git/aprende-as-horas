/**
 * Days of the Week Module Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const fireworks = new FireworksEngine('fireworksCanvas');
  const audio = new AudioEngine();

  const DAYS = [
    { name: 'Segunda-feira', type: 'Útil', icon: '💼' },
    { name: 'Terça-feira', type: 'Útil', icon: '📖' },
    { name: 'Quarta-feira', type: 'Útil', icon: '✏️' },
    { name: 'Quinta-feira', type: 'Útil', icon: '🎒' },
    { name: 'Sexta-feira', type: 'Útil', icon: '🎨' },
    { name: 'Sábado', type: 'Fim de semana', icon: '⚽' },
    { name: 'Domingo', type: 'Fim de semana', icon: '🍦' }
  ];

  let score = parseInt(localStorage.getItem('dias_score') || '0', 10);
  let streak = 0;

  const daysList = document.getElementById('daysList');
  const diasPrompt = document.getElementById('diasPrompt');
  const diasOptions = document.getElementById('diasOptions');
  const diasFeedback = document.getElementById('diasFeedback');
  const nextDiasBtn = document.getElementById('nextDiasBtn');
  const scoreValue = document.getElementById('scoreValue');
  const streakValue = document.getElementById('streakValue');

  // Render Days List
  DAYS.forEach(day => {
    const item = document.createElement('div');
    item.className = 'day-card';
    item.innerHTML = `
      <span class="day-icon">${day.icon}</span>
      <span class="day-name">${day.name}</span>
      <span class="day-type">${day.type}</span>
    `;
    item.addEventListener('click', () => {
      audio.speakTimeInPortuguese(0, 0, false);
      if (audio.synth) {
        audio.synth.cancel();
        const u = new SpeechSynthesisUtterance(day.name);
        u.lang = 'pt-PT';
        audio.synth.speak(u);
      }
    });
    daysList.appendChild(item);
  });

  const QUESTIONS = [
    { 
      prompt: 'Qual é o 1º dia da semana de trabalho?', 
      correct: 'Segunda-feira', 
      choices: ['Segunda-feira', 'Sábado', 'Quarta-feira', 'Domingo'], 
      explanation: '1️⃣ O fim de semana acaba no Domingo.<br>2️⃣ O primeiro dia em que as pessoas regressam ao trabalho e à escola é a <strong>Segunda-feira</strong>!<br>3️⃣ Os dias úteis continuam com Terça, Quarta, Quinta e Sexta.' 
    },
    { 
      prompt: 'Que dias formam o Fim de Semana?', 
      correct: 'Sábado e Domingo', 
      choices: ['Sábado e Domingo', 'Segunda e Terça', 'Quinta e Sexta', 'Quarta e Quinta'], 
      explanation: '1️⃣ Os dias de trabalho/escola vão de Segunda a Sexta.<br>2️⃣ Os 2 dias de descanso e passeio são o <strong>Sábado</strong> e o <strong>Domingo</strong>!<br>3️⃣ Por isso, o Fim de Semana é formado por <strong>Sábado e Domingo</strong>.' 
    },
    { 
      prompt: 'Que dia vem a seguir a Sexta-feira?', 
      correct: 'Sábado', 
      choices: ['Sábado', 'Quinta-feira', 'Domingo', 'Segunda-feira'], 
      explanation: '1️⃣ Contamos a semana: Quinta-feira ➔ Sexta-feira...<br>2️⃣ Logo a seguir à Sexta-feira começa o fim de semana com o <strong>Sábado</strong>!<br>3️⃣ A sequência é: Sexta-feira ➔ <strong>Sábado</strong> ➔ Domingo.' 
    },
    { 
      prompt: 'Que dia vem antes de Segunda-feira?', 
      correct: 'Domingo', 
      choices: ['Domingo', 'Sábado', 'Terça-feira', 'Sexta-feira'], 
      explanation: '1️⃣ A semana recomeça na Segunda-feira.<br>2️⃣ O dia de descanso imediatamente anterior é o <strong>Domingo</strong>!<br>3️⃣ A sequência é: <strong>Domingo</strong> ➔ Segunda-feira.' 
    },
    { 
      prompt: 'Quantos dias tem uma semana?', 
      correct: '7 dias', 
      choices: ['7 dias', '5 dias', '10 dias', '12 dias'], 
      explanation: '1️⃣ Dias de trabalho/escola (5 dias): Segunda, Terça, Quarta, Quinta e Sexta.<br>2️⃣ Dias do fim de semana (2 dias): Sábado e Domingo.<br>3️⃣ Soma total: 5 + 2 = <strong>7 dias</strong> numa semana inteira!' 
    }
  ];

  let currentQuestion = null;

  const generateQuestion = () => {
    diasFeedback.className = 'feedback-banner';
    diasFeedback.innerHTML = '';
    nextDiasBtn.classList.add('hidden');

    currentQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    diasPrompt.innerHTML = currentQuestion.prompt;

    const shuffled = [...currentQuestion.choices].sort(() => Math.random() - 0.5);
    diasOptions.innerHTML = '';

    shuffled.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => handleAnswer(choice, btn));
      diasOptions.appendChild(btn);
    });
  };

  const handleAnswer = (choice, btn) => {
    const buttons = diasOptions.querySelectorAll('.quiz-option-btn');
    buttons.forEach(b => b.disabled = true);

    if (choice === currentQuestion.correct) {
      btn.classList.add('correct');
      score += 10;
      streak += 1;
      localStorage.setItem('dias_score', score);
      updateScore();
      audio.playSuccessSound();
      fireworks.triggerFireworks();
      showFeedback('✨ Muito bem! Acertaste!', 'success');
      nextDiasBtn.classList.add('hidden');

      setTimeout(() => {
        generateQuestion();
      }, 1000);
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
      nextDiasBtn.classList.remove('hidden');
    }
  };

  const updateScore = () => {
    scoreValue.textContent = score;
    streakValue.textContent = `🔥 ${streak}`;
  };

  const showFeedback = (htmlMsg, type) => {
    diasFeedback.innerHTML = htmlMsg;
    diasFeedback.className = `feedback-banner show ${type}`;
  };
    diasFeedback.className = `feedback-banner show ${type}`;
  };

  nextDiasBtn.addEventListener('click', generateQuestion);

  updateScore();
  generateQuestion();
});
