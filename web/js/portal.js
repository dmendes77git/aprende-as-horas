/**
 * Aprende Brincando Portal Controller - Dynamic Module Status Calculator
 */
document.addEventListener('DOMContentLoaded', () => {
  const updateModuleStatuses = () => {
    // 1. Horas Status
    const horasScore = parseInt(localStorage.getItem('time_teacher_score') || '0', 10);
    const horasBadges = JSON.parse(localStorage.getItem('time_teacher_unlocked_badges') || '[]');
    const statusHoras = document.getElementById('statusHoras');

    if (horasBadges.length >= 4 || horasScore >= 50) {
      statusHoras.className = 'status-badge status-completa';
      statusHoras.textContent = '🟢 Completa';
    } else if (horasScore > 0 || horasBadges.length > 0) {
      statusHoras.className = 'status-badge status-em-curso';
      statusHoras.textContent = '🟡 Em Curso';
    } else {
      statusHoras.className = 'status-badge status-por-iniciar';
      statusHoras.textContent = '🔴 Por Iniciar';
    }

    // 2. Dias Status
    const diasScore = parseInt(localStorage.getItem('dias_score') || '0', 10);
    const statusDias = document.getElementById('statusDias');
    if (diasScore >= 30) {
      statusDias.className = 'status-badge status-completa';
      statusDias.textContent = '🟢 Completa';
    } else if (diasScore > 0) {
      statusDias.className = 'status-badge status-em-curso';
      statusDias.textContent = '🟡 Em Curso';
    } else {
      statusDias.className = 'status-badge status-por-iniciar';
      statusDias.textContent = '🔴 Por Iniciar';
    }

    // 3. Meses Status
    const mesesScore = parseInt(localStorage.getItem('meses_score') || '0', 10);
    const statusMeses = document.getElementById('statusMeses');
    if (mesesScore >= 30) {
      statusMeses.className = 'status-badge status-completa';
      statusMeses.textContent = '🟢 Completa';
    } else if (mesesScore > 0) {
      statusMeses.className = 'status-badge status-em-curso';
      statusMeses.textContent = '🟡 Em Curso';
    } else {
      statusMeses.className = 'status-badge status-por-iniciar';
      statusMeses.textContent = '🔴 Por Iniciar';
    }

    // 4. Estações Status
    const estacoesScore = parseInt(localStorage.getItem('estacoes_score') || '0', 10);
    const statusEstacoes = document.getElementById('statusEstacoes');
    if (estacoesScore >= 30) {
      statusEstacoes.className = 'status-badge status-completa';
      statusEstacoes.textContent = '🟢 Completa';
    } else if (estacoesScore > 0) {
      statusEstacoes.className = 'status-badge status-em-curso';
      statusEstacoes.textContent = '🟡 Em Curso';
    } else {
      statusEstacoes.className = 'status-badge status-por-iniciar';
      statusEstacoes.textContent = '🔴 Por Iniciar';
    }
  };

  updateModuleStatuses();
});
