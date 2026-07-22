/**
 * Child Profiles, Onboarding & Top Results Leaderboard (Quadro de Honra)
 * Manages 1st access onboarding, multi-child profiles, per-child scores/badges, and leaderboards.
 */
class ProfilesEngine {
  constructor() {
    this.avatars = ['🦁', '🦊', '🦄', '🚀', '👑', '🎨', '🐬', '🐯'];
    this.profiles = this.loadProfiles();
    this.activeProfileId = localStorage.getItem('app_active_child_id') || null;

    // Check if active profile exists
    let active = this.getActiveProfile();
    if (!active && this.profiles.length > 0) {
      this.setActiveProfile(this.profiles[0].id);
      active = this.profiles[0];
    }
  }

  loadProfiles() {
    try {
      const stored = localStorage.getItem('app_child_profiles');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveProfiles() {
    try {
      localStorage.setItem('app_child_profiles', JSON.stringify(this.profiles));
    } catch (e) {}
  }

  getActiveProfile() {
    if (!this.activeProfileId) return null;
    return this.profiles.find(p => p.id === this.activeProfileId) || null;
  }

  setActiveProfile(id) {
    this.activeProfileId = id;
    localStorage.setItem('app_active_child_id', id);
    this.updateProfilePill();
    if (window.achievements) {
      window.achievements.unlockedMap = window.achievements.loadUnlocked();
      window.achievements.updatePillCount();
    }
    // Refresh page scoreboards if needed
    window.location.reload();
  }

  createProfile(name, avatar) {
    const newProfile = {
      id: 'child_' + Date.now(),
      name: name.trim() || 'Pequeno Aprendiz',
      avatar: avatar || '🦁',
      scores: {
        horas: 0,
        dias: 0,
        meses: 0,
        estacoes: 0,
        exame: 0
      },
      streaks: {
        horas: 0,
        dias: 0,
        meses: 0,
        estacoes: 0,
        exame: 0
      },
      unlockedAchievements: {},
      examsCompleted: 0,
      createdAt: new Date().toLocaleDateString('pt-PT')
    };

    this.profiles.push(newProfile);
    this.saveProfiles();
    this.activeProfileId = newProfile.id;
    localStorage.setItem('app_active_child_id', newProfile.id);
    return newProfile;
  }

  getTotalPoints(profile) {
    if (!profile || !profile.scores) return 0;
    return (profile.scores.horas || 0) +
           (profile.scores.dias || 0) +
           (profile.scores.meses || 0) +
           (profile.scores.estacoes || 0) +
           (profile.scores.exame || 0);
  }

  updateProfileScore(moduleKey, scoreToAdd, streakVal = 0) {
    const active = this.getActiveProfile();
    if (!active) return;

    if (!active.scores) active.scores = {};
    if (!active.streaks) active.streaks = {};

    active.scores[moduleKey] = Math.max(active.scores[moduleKey] || 0, scoreToAdd);
    active.streaks[moduleKey] = Math.max(active.streaks[moduleKey] || 0, streakVal);
    this.saveProfiles();
  }

  checkFirstAccess() {
    if (!this.getActiveProfile()) {
      this.renderOnboardingModal();
    } else {
      this.injectProfilePill();
    }
  }

  renderOnboardingModal() {
    let modal = document.getElementById('onboardingModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'onboardingModal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    let selectedAvatar = this.avatars[0];

    modal.innerHTML = `
      <div class="modal-card glass-card onboarding-modal-card">
        <div class="onboarding-header">
          <span class="onboarding-icon">🚀</span>
          <h2>Bem-vindo ao Aprende Brincando!</h2>
          <p>Para começares a aprender, ganhares pontos e desbloqueares conquistas, escreve o teu nome:</p>
        </div>

        <div class="onboarding-body">
          <div class="form-group">
            <label class="form-label">Escolhe o teu Avatar:</label>
            <div id="avatarPickerGrid" class="avatar-picker-grid">
              ${this.avatars.map((av, idx) => `
                <button class="avatar-option-btn ${idx === 0 ? 'selected' : ''}" data-avatar="${av}">
                  ${av}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <label for="childNameInput" class="form-label">Como te chamas?</label>
            <input type="text" id="childNameInput" class="child-name-input" placeholder="Escreve o teu nome aqui (ex: Maria, João)..." maxlength="20" autofocus />
          </div>

          <button id="submitOnboardingBtn" class="btn-primary width-full">
            ✨ Começar a Jogar!
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    // Avatar selector logic
    const avatarBtns = modal.querySelectorAll('.avatar-option-btn');
    avatarBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        avatarBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedAvatar = btn.getAttribute('data-avatar');
      });
    });

    const nameInput = document.getElementById('childNameInput');
    const submitBtn = document.getElementById('submitOnboardingBtn');

    const handleSubmit = () => {
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.style.borderColor = '#ef4444';
        nameInput.focus();
        return;
      }
      this.createProfile(name, selectedAvatar);
      modal.classList.add('hidden');
      this.injectProfilePill();
      if (typeof FireworksEngine !== 'undefined') {
        new FireworksEngine('fireworksCanvas').triggerFireworks();
      }
    };

    submitBtn.addEventListener('click', handleSubmit);
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });
  }

  renderProfileSwitcherModal() {
    let modal = document.getElementById('profileSwitcherModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'profileSwitcherModal';
      modal.className = 'modal-backdrop hidden';
      document.body.appendChild(modal);
    }

    const active = this.getActiveProfile();

    modal.innerHTML = `
      <div class="modal-card glass-card profile-switcher-card">
        <div class="modal-header">
          <h2>👤 Gestão de Perfis</h2>
          <button id="closeProfileModalBtn" class="modal-close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <div class="profiles-list">
            ${this.profiles.map(p => {
              const isActive = active && active.id === p.id;
              const pts = this.getTotalPoints(p);
              return `
                <div class="profile-item-card ${isActive ? 'active-profile' : ''}" data-id="${p.id}">
                  <div class="profile-left">
                    <span class="profile-avatar">${p.avatar}</span>
                    <div class="profile-info">
                      <span class="profile-name">${p.name} ${isActive ? '⭐ (Atual)' : ''}</span>
                      <span class="profile-pts">🏆 ${pts} Pontos Totais</span>
                    </div>
                  </div>
                  ${!isActive ? `<button class="btn-secondary switch-profile-btn" data-id="${p.id}">Escolher</button>` : `<span class="active-badge">Em Jogo</span>`}
                </div>
              `;
            }).join('')}
          </div>

          <button id="addNewChildBtn" class="btn-primary width-full style-add-child">
            ➕ Adicionar Nova Criança
          </button>
        </div>

        <button id="closeProfileBtn" class="btn-secondary width-full">
          Fechar
        </button>
      </div>
    `;

    modal.classList.remove('hidden');

    const closeModal = () => modal.classList.add('hidden');
    document.getElementById('closeProfileModalBtn').addEventListener('click', closeModal);
    document.getElementById('closeProfileBtn').addEventListener('click', closeModal);

    modal.querySelectorAll('.switch-profile-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.setActiveProfile(id);
      });
    });

    document.getElementById('addNewChildBtn').addEventListener('click', () => {
      modal.classList.add('hidden');
      this.renderOnboardingModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  renderLeaderboardModal() {
    let modal = document.getElementById('leaderboardModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'leaderboardModal';
      modal.className = 'modal-backdrop hidden';
      document.body.appendChild(modal);
    }

    // Sort profiles by Total Points descending
    const sorted = [...this.profiles].sort((a, b) => this.getTotalPoints(b) - this.getTotalPoints(a));

    modal.innerHTML = `
      <div class="modal-card glass-card leaderboard-modal-card">
        <div class="modal-header">
          <div class="lead-header-title">
            <span class="lead-icon">🥇</span>
            <h2>Quadro de Honra (Classificação)</h2>
          </div>
          <button id="closeLeadModalBtn" class="modal-close-btn">&times;</button>
        </div>

        <div class="modal-body lead-modal-body">
          ${sorted.length === 0 ? `<p class="empty-lead">Ainda não existem crianças registadas!</p>` : ''}

          <!-- Podium Top 3 -->
          ${sorted.length > 0 ? `
            <div class="podium-container">
              ${sorted[1] ? `
                <div class="podium-card silver">
                  <span class="podium-rank">🥈 2º Lugar</span>
                  <span class="podium-avatar">${sorted[1].avatar}</span>
                  <span class="podium-name">${sorted[1].name}</span>
                  <span class="podium-pts">${this.getTotalPoints(sorted[1])} pts</span>
                </div>
              ` : ''}

              <div class="podium-card gold">
                <span class="podium-rank">🥇 1º Lugar</span>
                <span class="podium-avatar">${sorted[0].avatar}</span>
                <span class="podium-name">${sorted[0].name}</span>
                <span class="podium-pts">${this.getTotalPoints(sorted[0])} pts</span>
              </div>

              ${sorted[2] ? `
                <div class="podium-card bronze">
                  <span class="podium-rank">🥉 3º Lugar</span>
                  <span class="podium-avatar">${sorted[2].avatar}</span>
                  <span class="podium-name">${sorted[2].name}</span>
                  <span class="podium-pts">${this.getTotalPoints(sorted[2])} pts</span>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Full Table -->
          <div class="lead-table">
            <div class="lead-table-header">
              <span>Posição</span>
              <span>Criança</span>
              <span>Pontos Totais</span>
              <span>Melhor Exame</span>
            </div>

            ${sorted.map((p, idx) => {
              const pts = this.getTotalPoints(p);
              const rankIcon = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
              return `
                <div class="lead-row ${idx < 3 ? 'top-three' : ''}">
                  <span class="lead-rank">${rankIcon}</span>
                  <span class="lead-child"><span class="lead-av">${p.avatar}</span> ${p.name}</span>
                  <span class="lead-pts">${pts} pts</span>
                  <span class="lead-exame">${p.scores ? (p.scores.exame || 0) : 0} pts</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <button id="closeLeadBtn" class="btn-primary width-full">
          Fechar Classificação
        </button>
      </div>
    `;

    modal.classList.remove('hidden');

    const closeModal = () => modal.classList.add('hidden');
    document.getElementById('closeLeadModalBtn').addEventListener('click', closeModal);
    document.getElementById('closeLeadBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  injectProfilePill() {
    const active = this.getActiveProfile();
    if (!active) return;

    const scoreCard = document.querySelector('.score-card');
    if (scoreCard && !document.getElementById('profilePillBtn')) {
      const profileBtn = document.createElement('button');
      profileBtn.id = 'profilePillBtn';
      profileBtn.className = 'score-profile-btn';
      profileBtn.setAttribute('title', 'Mudar de Perfil de Criança');
      profileBtn.innerHTML = `<span class="pill-av">${active.avatar}</span> <span class="pill-name">${active.name}</span>`;
      profileBtn.addEventListener('click', () => this.renderProfileSwitcherModal());

      const divider = document.createElement('div');
      divider.className = 'score-divider';

      scoreCard.insertBefore(profileBtn, scoreCard.firstChild);
      scoreCard.insertBefore(divider, profileBtn.nextSibling);
    }
  }

  updateProfilePill() {
    const pillName = document.querySelector('#profilePillBtn .pill-name');
    const pillAv = document.querySelector('#profilePillBtn .pill-av');
    const active = this.getActiveProfile();
    if (pillName && pillAv && active) {
      pillName.textContent = active.name;
      pillAv.textContent = active.avatar;
    }
  }
}

// Global Singleton
window.profiles = new ProfilesEngine();

document.addEventListener('DOMContentLoaded', () => {
  window.profiles.checkFirstAccess();

  // Bind top bar leaderboard button if present
  const leadNavBtn = document.getElementById('openLeaderboardBtn');
  if (leadNavBtn) {
    leadNavBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.profiles.renderLeaderboardModal();
    });
  }
});
