/**
 * Achievements & Badges System (Galeria de Conquistas)
 * Manages 25 achievements across Horas, Dias, Meses, Estações, and Modo Exame.
 */
class AchievementsEngine {
  constructor() {
    this.achievements = [
      // --- HORAS (5 Badges) ---
      {
        id: 'horas_1',
        category: 'Horas',
        categoryIcon: '⏰',
        title: 'Primeira Hora',
        desc: 'Acerta a tua 1ª pergunta sobre as Horas.',
        icon: '🥉',
        targetType: 'score',
        targetValue: 10
      },
      {
        id: 'horas_50',
        category: 'Horas',
        categoryIcon: '⏰',
        title: 'Mestre do Relógio',
        desc: 'Alcança 50 pontos no módulo de Horas.',
        icon: '🥈',
        targetType: 'score',
        targetValue: 50
      },
      {
        id: 'horas_100',
        category: 'Horas',
        categoryIcon: '⏰',
        title: 'Especialista Digital',
        desc: 'Alcança 100 pontos no módulo de Horas.',
        icon: '🥇',
        targetType: 'score',
        targetValue: 100
      },
      {
        id: 'horas_streak5',
        category: 'Horas',
        categoryIcon: '⏰',
        title: 'Chama do Tempo',
        desc: 'Consegue 5 respostas certas seguidas nas Horas.',
        icon: '🔥',
        targetType: 'streak',
        targetValue: 5
      },
      {
        id: 'horas_200',
        category: 'Horas',
        categoryIcon: '⏰',
        title: 'Rei do Tempo',
        desc: 'Alcança 200 pontos no módulo de Horas.',
        icon: '👑',
        targetType: 'score',
        targetValue: 200
      },

      // --- DIAS DA SEMANA (5 Badges) ---
      {
        id: 'dias_1',
        category: 'Dias',
        categoryIcon: '📅',
        title: 'Primeiro Dia',
        desc: 'Acerta a tua 1ª pergunta dos Dias da Semana.',
        icon: '🗓️',
        targetType: 'score',
        targetValue: 10
      },
      {
        id: 'dias_50',
        category: 'Dias',
        categoryIcon: '📅',
        title: 'Trabalhador da Semana',
        desc: 'Alcança 50 pontos nos Dias da Semana.',
        icon: '💼',
        targetType: 'score',
        targetValue: 50
      },
      {
        id: 'dias_100',
        category: 'Dias',
        categoryIcon: '📅',
        title: 'Mestre do Fim de Semana',
        desc: 'Alcança 100 pontos nos Dias da Semana.',
        icon: '🏖️',
        targetType: 'score',
        targetValue: 100
      },
      {
        id: 'dias_streak5',
        category: 'Dias',
        categoryIcon: '📅',
        title: 'Super Sequência Semanal',
        desc: 'Consegue 5 respostas certas seguidas nos Dias.',
        icon: '⚡',
        targetType: 'streak',
        targetValue: 5
      },
      {
        id: 'dias_200',
        category: 'Dias',
        categoryIcon: '📅',
        title: 'Mestre dos Dias',
        desc: 'Alcança 200 pontos nos Dias da Semana.',
        icon: '🏆',
        targetType: 'score',
        targetValue: 200
      },

      // --- OS MESES (5 Badges) ---
      {
        id: 'meses_1',
        category: 'Meses',
        categoryIcon: '🗓️',
        title: 'Primeiro Mês',
        desc: 'Acerta a tua 1ª pergunta sobre os Meses.',
        icon: '📦',
        targetType: 'score',
        targetValue: 10
      },
      {
        id: 'meses_50',
        category: 'Meses',
        categoryIcon: '🗓️',
        title: 'Amigo das Festas',
        desc: 'Alcança 50 pontos no módulo dos Meses.',
        icon: '🎄',
        targetType: 'score',
        targetValue: 50
      },
      {
        id: 'meses_100',
        category: 'Meses',
        categoryIcon: '🗓️',
        title: 'Mestre do Ano',
        desc: 'Alcança 100 pontos no módulo dos Meses.',
        icon: '📆',
        targetType: 'score',
        targetValue: 100
      },
      {
        id: 'meses_streak5',
        category: 'Meses',
        categoryIcon: '🗓️',
        title: 'Sequência Festiva',
        desc: 'Consegue 5 respostas certas seguidas nos Meses.',
        icon: '🌟',
        targetType: 'streak',
        targetValue: 5
      },
      {
        id: 'meses_200',
        category: 'Meses',
        categoryIcon: '🗓️',
        title: 'Senhor do Calendário',
        desc: 'Alcança 200 pontos no módulo dos Meses.',
        icon: '🚀',
        targetType: 'score',
        targetValue: 200
      },

      // --- ESTAÇÕES DO ANO (5 Badges) ---
      {
        id: 'estacoes_1',
        category: 'Estações',
        categoryIcon: '🍂',
        title: 'Brotar da Primavera',
        desc: 'Acerta a tua 1ª pergunta sobre Estações.',
        icon: '🌸',
        targetType: 'score',
        targetValue: 10
      },
      {
        id: 'estacoes_50',
        category: 'Estações',
        categoryIcon: '🍂',
        title: 'Sol de Verão',
        desc: 'Alcança 50 pontos nas Estações do Ano.',
        icon: '☀️',
        targetType: 'score',
        targetValue: 50
      },
      {
        id: 'estacoes_100',
        category: 'Estações',
        categoryIcon: '🍂',
        title: 'Folhas de Outono',
        desc: 'Alcança 100 pontos nas Estações do Ano.',
        icon: '🍁',
        targetType: 'score',
        targetValue: 100
      },
      {
        id: 'estacoes_streak5',
        category: 'Estações',
        categoryIcon: '🍂',
        title: 'Rei do Inverno',
        desc: 'Consegue 5 respostas certas seguidas nas Estações.',
        icon: '❄️',
        targetType: 'streak',
        targetValue: 5
      },
      {
        id: 'estacoes_200',
        category: 'Estações',
        categoryIcon: '🍂',
        title: 'Guardião da Natureza',
        desc: 'Alcança 200 pontos nas Estações do Ano.',
        icon: '🌍',
        targetType: 'score',
        targetValue: 200
      },

      // --- MODO EXAME (5 Badges) ---
      {
        id: 'exame_completed1',
        category: 'Exame',
        categoryIcon: '📝',
        title: 'Candidato ao Exame',
        desc: 'Completa o teu 1º Exame Geral Sequencial.',
        icon: '🎓',
        targetType: 'exam_done',
        targetValue: 1
      },
      {
        id: 'exame_score200',
        category: 'Exame',
        categoryIcon: '📝',
        title: 'Exame Aprovado',
        desc: 'Obtém pelo menos 200 pontos no Exame Geral.',
        icon: '🥉',
        targetType: 'exam_score',
        targetValue: 200
      },
      {
        id: 'exame_score300',
        category: 'Exame',
        categoryIcon: '📝',
        title: 'Graduado com Distinção',
        desc: 'Obtém pelo menos 300 pontos no Exame Geral.',
        icon: '🥈',
        targetType: 'exam_score',
        targetValue: 300
      },
      {
        id: 'exame_perfect',
        category: 'Exame',
        categoryIcon: '📝',
        title: 'Exame Perfeito (400/400)',
        desc: 'Acerta todas as 40 perguntas no Exame Geral!',
        icon: '🥇',
        targetType: 'exam_score',
        targetValue: 400
      },
      {
        id: 'exame_completed3',
        category: 'Exame',
        categoryIcon: '📝',
        title: 'Gran Doutor do Tempo',
        desc: 'Completa 3 Exames Gerais Sequenciais.',
        icon: '👑',
        targetType: 'exam_done',
        targetValue: 3
      }
    ];

    this.unlockedMap = this.loadUnlocked();
    this.audio = typeof AudioEngine !== 'undefined' ? new AudioEngine() : null;
    this.fireworks = typeof FireworksEngine !== 'undefined' ? new FireworksEngine('fireworksCanvas') : null;
  }

  loadUnlocked() {
    try {
      const stored = localStorage.getItem('app_unlocked_achievements');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  saveUnlocked() {
    try {
      localStorage.setItem('app_unlocked_achievements', JSON.stringify(this.unlockedMap));
    } catch (e) {}
  }

  isUnlocked(id) {
    return !!this.unlockedMap[id];
  }

  unlock(achievement) {
    if (this.isUnlocked(achievement.id)) return;
    this.unlockedMap[achievement.id] = {
      unlockedAt: new Date().toLocaleDateString('pt-PT')
    };
    this.saveUnlocked();
    this.updatePillCount();

    // Trigger Toast & Celebration
    this.showToast(achievement);
    if (this.audio) this.audio.playSuccessSound();
    if (this.fireworks) this.fireworks.triggerFireworks();
  }

  showToast(achievement) {
    let toast = document.getElementById('achievementToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'achievementToast';
      toast.className = 'achievement-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="toast-icon">${achievement.icon}</div>
      <div class="toast-content">
        <span class="toast-title">🎉 Nova Conquista Desbloqueada!</span>
        <span class="toast-name">${achievement.title}</span>
      </div>
    `;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  checkCategoryProgress(category, currentScore, currentStreak = 0, extra = {}) {
    this.achievements.forEach(ach => {
      if (ach.category !== category) return;
      if (this.isUnlocked(ach.id)) return;

      if (ach.targetType === 'score' && currentScore >= ach.targetValue) {
        this.unlock(ach);
      } else if (ach.targetType === 'streak' && currentStreak >= ach.targetValue) {
        this.unlock(ach);
      } else if (ach.targetType === 'exam_score' && extra.examScore >= ach.targetValue) {
        this.unlock(ach);
      } else if (ach.targetType === 'exam_done' && extra.examsCompleted >= ach.targetValue) {
        this.unlock(ach);
      }
    });
  }

  getUnlockedCount() {
    return Object.keys(this.unlockedMap).length;
  }

  getTotalCount() {
    return this.achievements.length;
  }

  renderModal() {
    let modal = document.getElementById('achievementsGalleryModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'achievementsGalleryModal';
      modal.className = 'modal-backdrop hidden';
      document.body.appendChild(modal);
    }

    const unlockedCount = this.getUnlockedCount();
    const totalCount = this.getTotalCount();

    modal.innerHTML = `
      <div class="modal-card glass-card achievements-modal-card">
        <div class="modal-header">
          <div class="ach-header-title">
            <h2>🏆 Galeria de Conquistas</h2>
            <span class="ach-counter-badge">${unlockedCount} / ${totalCount} Desbloqueadas</span>
          </div>
          <button id="closeAchModalBtn" class="modal-close-btn">&times;</button>
        </div>

        <div class="modal-body ach-modal-body">
          <div class="ach-grid">
            ${this.achievements.map(ach => {
              const unlocked = this.isUnlocked(ach.id);
              return `
                <div class="ach-card ${unlocked ? 'unlocked' : 'locked'}">
                  <div class="ach-card-header">
                    <span class="ach-icon">${ach.icon}</span>
                    <span class="ach-category">${ach.categoryIcon} ${ach.category}</span>
                  </div>
                  <div class="ach-card-body">
                    <h4 class="ach-title">${ach.title}</h4>
                    <p class="ach-desc">${ach.desc}</p>
                  </div>
                  <div class="ach-card-footer">
                    ${unlocked 
                      ? `<span class="ach-status-unlocked">✅ Desbloqueado (${this.unlockedMap[ach.id].unlockedAt})</span>`
                      : `<span class="ach-status-locked">🔒 Bloqueado</span>`
                    }
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <button id="closeAchBtn" class="btn-primary width-full">
          Fechar Galeria
        </button>
      </div>
    `;

    modal.classList.remove('hidden');

    const closeModal = () => modal.classList.add('hidden');
    document.getElementById('closeAchModalBtn').addEventListener('click', closeModal);
    document.getElementById('closeAchBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  injectHeaderButton() {
    const scoreCard = document.querySelector('.score-card');
    if (scoreCard) {
      // Remove legacy external button if present
      const oldBtn = document.getElementById('achievementsHeaderBtn');
      if (oldBtn) oldBtn.remove();

      if (!document.getElementById('conquistasPillBtn')) {
        const divider = document.createElement('div');
        divider.className = 'score-divider';

        const btn = document.createElement('button');
        btn.id = 'conquistasPillBtn';
        btn.className = 'score-conquistas-btn';
        btn.setAttribute('title', 'Ver Galeria de Conquistas');
        btn.innerHTML = `🏆 <span id="conquistasPillCount">${this.getUnlockedCount()} / ${this.getTotalCount()}</span>`;
        btn.addEventListener('click', () => this.renderModal());

        scoreCard.appendChild(divider);
        scoreCard.appendChild(btn);
      } else {
        this.updatePillCount();
      }
    }
  }

  updatePillCount() {
    const pill = document.getElementById('conquistasPillCount');
    if (pill) {
      pill.textContent = `${this.getUnlockedCount()} / ${this.getTotalCount()}`;
    }
  }
}

// Global Singleton
window.achievements = new AchievementsEngine();

document.addEventListener('DOMContentLoaded', () => {
  window.achievements.injectHeaderButton();
});
