/**
 * General Exam Mode Controller (Modo Exame Sequencial)
 * 40 Questions total: 10 Horas, 10 Dias, 10 Meses, 10 Estações
 */
document.addEventListener('DOMContentLoaded', () => {
  const fireworks = new FireworksEngine('fireworksCanvas');
  const audio = new AudioEngine();
  const clock = new InteractiveClock('clockCanvas');

  // Question Banks
  const DIAS_QUESTIONS = [
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

  const MESES_QUESTIONS = [
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

  const ESTACOES_QUESTIONS = [
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

  // Helper to build 10 random Horas questions
  const buildHorasQuestions = () => {
    const questions = [];
    for (let i = 0; i < 10; i++) {
      const randomHour = Math.floor(Math.random() * 24) + 1;
      const randomMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const isPm = randomHour > 12;
      const hourStr = String(randomHour).padStart(2, '0');
      const minStr = String(randomMinute).padStart(2, '0');
      const correctStr = `${hourStr}:${minStr}`;

      const choicesSet = new Set([correctStr]);
      while (choicesSet.size < 4) {
        const h = Math.floor(Math.random() * 24) + 1;
        const m = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        choicesSet.add(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }

      const hour12 = (randomHour % 12) === 0 ? 12 : (randomHour % 12);
      const minNum = randomMinute === 0 ? 12 : (randomMinute / 5);
      const periodStr = randomHour >= 12 ? 'Tarde/Noite (PM)' : 'Manhã (AM)';

      const explanation = `1️⃣ <strong>Olha para o ponteiro VERMELHO (curto):</strong> Aponta para o <strong>${hour12}</strong> (Horas).<br>` +
        `2️⃣ <strong>Olha para o ponteiro AZUL (longo):</strong> Aponta para o <strong>${minNum}</strong> (${randomMinute} Minutos).<br>` +
        `3️⃣ <strong>Junta as duas partes:</strong> A resposta correta é <strong>${correctStr}</strong> (${periodStr})!`;

      questions.push({
        category: 'Horas',
        categoryIcon: '⏰',
        prompt: `🤔 Que hora digital está a ser mostrada no relógio analógico?`,
        correct: correctStr,
        choices: Array.from(choicesSet).sort(() => Math.random() - 0.5),
        explanation: explanation,
        clockHour: randomHour,
        clockMin: randomMinute,
        clockIsPm: isPm
      });
    }
    return questions;
  };

  // Helper to sample N questions from array
  const sampleArray = (arr, count) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    const result = [];
    while (result.length < count) {
      result.push(shuffled[result.length % shuffled.length]);
    }
    return result;
  };

  // Build Full 40 Questions List
  let allQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let streak = 0;
  let selectedChoice = null;
  let selectedBtn = null;
  let examHistory = [];

  // DOM Elements
  const examRunner = document.getElementById('examRunner');
  const examReportContainer = document.getElementById('examReportContainer');
  const phaseBadge = document.getElementById('phaseBadge');
  const questionCounter = document.getElementById('questionCounter');
  const progressBarFill = document.getElementById('progressBarFill');
  const examClockWrapper = document.getElementById('examClockWrapper');
  const examCategoryTitle = document.getElementById('examCategoryTitle');
  const examPromptText = document.getElementById('examPromptText');
  const examOptionsGrid = document.getElementById('examOptionsGrid');
  const checkExamBtn = document.getElementById('checkExamBtn');
  const nextExamBtn = document.getElementById('nextExamBtn');
  const examFeedback = document.getElementById('examFeedback');
  const scoreValue = document.getElementById('scoreValue');
  const streakValue = document.getElementById('streakValue');

  // Report Elements
  const reportFinalScore = document.getElementById('reportFinalScore');
  const reportAwardIcon = document.getElementById('reportAwardIcon');
  const reportAwardTitle = document.getElementById('reportAwardTitle');
  const statHoras = document.getElementById('statHoras');
  const statDias = document.getElementById('statDias');
  const statMeses = document.getElementById('statMeses');
  const statEstacoes = document.getElementById('statEstacoes');
  const reportQuestionsList = document.getElementById('reportQuestionsList');
  const restartExamBtn = document.getElementById('restartExamBtn');

  // Modal Elements
  const reviewModal = document.getElementById('reviewModal');
  const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');
  const closeReviewBtn = document.getElementById('closeReviewBtn');
  const reviewQuestionBox = document.getElementById('reviewQuestionBox');
  const reviewResultBox = document.getElementById('reviewResultBox');
  const reviewExplanationBox = document.getElementById('reviewExplanationBox');

  const startExam = () => {
    allQuestions = [
      ...buildHorasQuestions(),
      ...sampleArray(DIAS_QUESTIONS, 10).map(q => ({ ...q, category: 'Dias', categoryIcon: '📅' })),
      ...sampleArray(MESES_QUESTIONS, 10).map(q => ({ ...q, category: 'Meses', categoryIcon: '🗓️' })),
      ...sampleArray(ESTACOES_QUESTIONS, 10).map(q => ({ ...q, category: 'Estações', categoryIcon: '🍂' }))
    ];

    currentIndex = 0;
    score = 0;
    streak = 0;
    examHistory = [];

    examRunner.classList.remove('hidden');
    examReportContainer.classList.add('hidden');
    updateHeaderScores();
    loadQuestion(0);
  };

  const updateHeaderScores = () => {
    scoreValue.textContent = score;
    streakValue.textContent = `🔥 ${streak}`;
  };

  const loadQuestion = (index) => {
    selectedChoice = null;
    selectedBtn = null;
    examFeedback.className = 'feedback-banner';
    examFeedback.innerHTML = '';

    checkExamBtn.classList.remove('hidden');
    nextExamBtn.classList.add('hidden');

    const q = allQuestions[index];

    // Update progress bar & counters
    questionCounter.textContent = `Pergunta ${index + 1} / 40`;
    const pct = ((index + 1) / 40) * 100;
    progressBarFill.style.width = `${pct}%`;

    // Phase badges
    if (index < 10) {
      phaseBadge.textContent = 'Fase 1: Aprende as Horas ⏰ (Perguntas 1 a 10)';
      phaseBadge.className = 'phase-badge phase-horas';
    } else if (index < 20) {
      phaseBadge.textContent = 'Fase 2: Dias da Semana 📅 (Perguntas 11 a 20)';
      phaseBadge.className = 'phase-badge phase-dias';
    } else if (index < 30) {
      phaseBadge.textContent = 'Fase 3: Os Meses 🗓️ (Perguntas 21 a 30)';
      phaseBadge.className = 'phase-badge phase-meses';
    } else {
      phaseBadge.textContent = 'Fase 4: Estações do Ano 🍂 (Perguntas 31 a 40)';
      phaseBadge.className = 'phase-badge phase-estacoes';
    }

    examCategoryTitle.innerHTML = `${q.categoryIcon} Pergunta de ${q.category}`;
    examPromptText.innerHTML = q.prompt;

    // Show/Hide Clock Canvas
    if (q.category === 'Horas') {
      examClockWrapper.classList.remove('hidden');
      clock.setTime(q.clockHour, q.clockMin, q.clockIsPm);
    } else {
      examClockWrapper.classList.add('hidden');
    }

    // Render 4 choices
    examOptionsGrid.innerHTML = '';
    q.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => {
        examOptionsGrid.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedChoice = choice;
        selectedBtn = btn;
      });
      examOptionsGrid.appendChild(btn);
    });
  };

  checkExamBtn.addEventListener('click', () => {
    if (!selectedChoice) {
      showFeedback('💡 Escolhe uma resposta primeiro!', 'error');
      return;
    }
    handleAnswerSubmit(selectedChoice, selectedBtn);
  });

  const handleAnswerSubmit = (choice, btn) => {
    const q = allQuestions[currentIndex];
    const buttons = examOptionsGrid.querySelectorAll('.quiz-option-btn');
    buttons.forEach(b => {
      b.disabled = true;
      b.classList.remove('selected');
    });

    checkExamBtn.classList.add('hidden');

    const isCorrect = choice === q.correct;

    examHistory.push({
      questionNumber: currentIndex + 1,
      category: q.category,
      categoryIcon: q.categoryIcon,
      prompt: q.prompt,
      choices: q.choices,
      userChoice: choice,
      correctChoice: q.correct,
      isCorrect: isCorrect,
      explanation: q.explanation,
      clockHour: q.clockHour,
      clockMin: q.clockMin
    });

    if (isCorrect) {
      btn.classList.add('correct');
      score += 10;
      streak += 1;
      updateHeaderScores();
      audio.playSuccessSound();
      fireworks.triggerFireworks();
      showFeedback('✨ Muito bem! Resposta Correta (+10 pts)!', 'success');

      setTimeout(() => {
        advanceQuestion();
      }, 1000);
    } else {
      btn.classList.add('wrong');
      buttons.forEach(b => {
        if (b.textContent === q.correct) b.classList.add('correct');
      });
      streak = 0;
      updateHeaderScores();
      audio.playErrorSound();

      const expHtml = `❌ <strong>Não foi desta vez! A resposta correta era ${q.correct}.</strong><br><br><strong>💡 Passo a passo pedagógico:</strong><br>${q.explanation}`;
      showFeedback(expHtml, 'error');
      nextExamBtn.classList.remove('hidden');
    }
  };

  nextExamBtn.addEventListener('click', () => {
    advanceQuestion();
  });

  const advanceQuestion = () => {
    currentIndex++;
    if (currentIndex < 40) {
      loadQuestion(currentIndex);
    } else {
      renderFinalReportCard();
    }
  };

  const showFeedback = (htmlMsg, type) => {
    examFeedback.innerHTML = htmlMsg;
    examFeedback.className = `feedback-banner show ${type}`;
  };

  // Render Final Report Card
  const renderFinalReportCard = () => {
    examRunner.classList.add('hidden');
    examReportContainer.classList.remove('hidden');

    reportFinalScore.textContent = `${score} / 400`;

    // Award Title
    if (score >= 380) {
      reportAwardIcon.textContent = '🏆';
      reportAwardTitle.textContent = 'Mestre do Tempo & Calendário! (Excelente)';
      fireworks.triggerFireworks();
    } else if (score >= 300) {
      reportAwardIcon.textContent = '🌟';
      reportAwardTitle.textContent = 'Grande Conhecedor! (Muito Bom)';
      fireworks.triggerFireworks();
    } else {
      reportAwardIcon.textContent = '🎓';
      reportAwardTitle.textContent = 'Continua a Treinar! (Bom Esforço)';
    }

    // Phase breakdown stats
    const horasCorrect = examHistory.slice(0, 10).filter(h => h.isCorrect).length;
    const diasCorrect = examHistory.slice(10, 20).filter(h => h.isCorrect).length;
    const mesesCorrect = examHistory.slice(20, 30).filter(h => h.isCorrect).length;
    const estacoesCorrect = examHistory.slice(30, 40).filter(h => h.isCorrect).length;

    statHoras.textContent = `${horasCorrect} / 10`;
    statDias.textContent = `${diasCorrect} / 10`;
    statMeses.textContent = `${mesesCorrect} / 10`;
    statEstacoes.textContent = `${estacoesCorrect} / 10`;

    // Render 40 Question Rows
    reportQuestionsList.innerHTML = '';
    examHistory.forEach((item) => {
      const row = document.createElement('div');
      row.className = `report-item ${item.isCorrect ? 'item-success' : 'item-error'}`;
      
      row.innerHTML = `
        <div class="item-left">
          <span class="item-num">#${item.questionNumber}</span>
          <span class="item-icon">${item.categoryIcon}</span>
          <div class="item-details">
            <span class="item-prompt">${item.prompt}</span>
            <span class="item-answers">A tua resposta: <strong>${item.userChoice}</strong> | Correta: <strong>${item.correctChoice}</strong></span>
          </div>
        </div>
        <div class="item-right">
          <span class="item-badge ${item.isCorrect ? 'badge-right' : 'badge-wrong'}">
            ${item.isCorrect ? '✅ Certo (+10)' : '❌ Errado (0)'}
          </span>
          <span class="click-hint">💡 Clica para ver explicação</span>
        </div>
      `;

      row.addEventListener('click', () => {
        openReviewModal(item);
      });

      reportQuestionsList.appendChild(row);
    });
  };

  // Open Detailed Review Modal
  const openReviewModal = (item) => {
    reviewQuestionBox.innerHTML = `
      <div class="review-tag">${item.categoryIcon} Perguntas de ${item.category} • Pergunta #${item.questionNumber}</div>
      <h3>${item.prompt}</h3>
    `;

    reviewResultBox.innerHTML = `
      <div class="review-status ${item.isCorrect ? 'success' : 'error'}">
        ${item.isCorrect ? '✅ Resposta Correta (+10 PONTOS)' : '❌ Resposta Incorreta (0 PONTOS)'}
      </div>
      <p>A tua escolha: <strong>${item.userChoice}</strong></p>
      <p>Resposta correta: <strong>${item.correctChoice}</strong></p>
    `;

    reviewExplanationBox.innerHTML = `
      <h4>💡 Passo a passo pedagógico:</h4>
      <div class="explanation-card-body">${item.explanation}</div>
    `;

    reviewModal.classList.remove('hidden');
  };

  const closeReviewModal = () => {
    reviewModal.classList.add('hidden');
  };

  closeReviewModalBtn.addEventListener('click', closeReviewModal);
  closeReviewBtn.addEventListener('click', closeReviewModal);
  reviewModal.addEventListener('click', (e) => {
    if (e.target === reviewModal) closeReviewModal();
  });

  restartExamBtn.addEventListener('click', () => {
    startExam();
  });

  // Launch Exam on page load
  startExam();
});
