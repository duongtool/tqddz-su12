// ========== TABS ==========
function showTab(btn, contentId) {
  const parent = btn.closest('.card') || btn.parentElement.parentElement;
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById(contentId);
  if (el) el.classList.add('active');
}

// ========== FLASHCARDS ==========
const flashStores = {};

function initFlash(id, data) {
  flashStores[id] = { data, index: 0 };
  renderFlash(id);
}

function renderFlash(id) {
  const store = flashStores[id];
  if (!store) return;
  const { data, index } = store;
  const card = document.getElementById('fc-' + id);
  if (!card) return;
  card.classList.remove('flipped');
  document.getElementById('fc-' + id + '-q').textContent = data[index].q;
  document.getElementById('fc-' + id + '-a').textContent = data[index].a;
  document.getElementById('fc-' + id + '-count').textContent = (index + 1) + ' / ' + data.length;
}

function flipCard(id) {
  document.getElementById('fc-' + id).classList.toggle('flipped');
}

function nextFlash(id) {
  const store = flashStores[id];
  if (store && store.index < store.data.length - 1) {
    store.index++;
    renderFlash(id);
  }
}

function prevFlash(id) {
  const store = flashStores[id];
  if (store && store.index > 0) {
    store.index--;
    renderFlash(id);
  }
}

// ========== QUIZ ==========
function checkQuiz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const questions = container.querySelectorAll('.quiz-q');
  let correct = 0;
  questions.forEach(q => {
    const answer = q.dataset.answer;
    const selected = q.querySelector('input:checked');
    q.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('correct', 'wrong'));
    if (selected) {
      const label = selected.closest('.quiz-option');
      if (selected.value === answer) {
        label.classList.add('correct');
        correct++;
      } else {
        label.classList.add('wrong');
        const right = q.querySelector(`input[value="${answer}"]`);
        if (right) right.closest('.quiz-option').classList.add('correct');
      }
    } else {
      const right = q.querySelector(`input[value="${answer}"]`);
      if (right) right.closest('.quiz-option').classList.add('correct');
    }
  });
  const box = document.getElementById(containerId + '-score');
  if (box) {
    box.style.display = 'block';
    const pct = Math.round((correct / questions.length) * 100);
    box.style.background = pct >= 70 ? '#f0fff4' : '#fff5f5';
    box.style.color = pct >= 70 ? '#276749' : '#c53030';
    box.textContent = `Bạn đúng ${correct}/${questions.length} câu (${pct}%). ${pct >= 80 ? 'Xuất sắc! 🎉' : pct >= 60 ? 'Khá tốt!' : 'Cần ôn lại kỹ hơn nhé!'}`;
  }
}

function resetQuiz(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('input').forEach(i => i.checked = false);
  container.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('correct', 'wrong'));
  const box = document.getElementById(containerId + '-score');
  if (box) box.style.display = 'none';
}

// ========== MATCHING ==========
const matchStates = {};

function selectMatch(el, gameId) {
  if (el.classList.contains('matched')) return;
  if (!matchStates[gameId]) matchStates[gameId] = { selected: null, matched: 0, total: 0 };
  const state = matchStates[gameId];
  if (state.total === 0) {
    const pairs = new Set();
    document.querySelectorAll(`#match-${gameId} .match-item`).forEach(i => pairs.add(i.dataset.pair));
    state.total = pairs.size;
  }
  if (!state.selected) {
    el.classList.add('selected');
    state.selected = el;
  } else {
    if (state.selected === el) {
      el.classList.remove('selected');
      state.selected = null;
      return;
    }
    if (state.selected.dataset.pair === el.dataset.pair) {
      state.selected.classList.remove('selected');
      state.selected.classList.add('matched');
      el.classList.add('matched');
      state.matched++;
      state.selected = null;
      const msg = document.getElementById('match-' + gameId + '-msg');
      if (state.matched === state.total && msg) {
        msg.textContent = '🎉 Hoàn thành! Bạn đã ghép đúng tất cả.';
        msg.style.color = '#276749';
      }
    } else {
      state.selected.classList.add('wrong');
      el.classList.add('wrong');
      const prev = state.selected;
      setTimeout(() => {
        prev.classList.remove('selected', 'wrong');
        el.classList.remove('wrong');
        state.selected = null;
      }, 650);
    }
  }
}
