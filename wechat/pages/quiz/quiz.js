const app = getApp();
const typeLabels = { single:'单选题', multiple:'多选题', truefalse:'判断题', fillblank:'填空题', essay:'应用题' };

Page({
  data: {
    sectionOptions: [], limit: 0, started: false,
    questions: [], current: 0, total: 0, progress: 0,
    question: null, typeLabel: '', displayOptions: [],
    answered: false, isCorrect: false, correctAnswer: '',
    textAnswer: '', correctCount: 0, wrongCount: 0,
    answers: {},
    showResult: false, score: 0, totalPoints: 0,
    grade: '', gradeText: '', percent: 0
  },

  onShow() { this.loadSections(); },

  loadSections() {
    const { sections, questions } = app.globalData;
    const opts = sections.map(s => ({
      ...s, checked: true,
      count: questions.filter(q => q.sectionId === s.id).length
    })).filter(s => s.count > 0);
    this.setData({ sectionOptions: opts });
  },

  toggleSection(e) {
    const id = e.currentTarget.dataset.id;
    const opts = this.data.sectionOptions.map(s =>
      s.id === id ? {...s, checked: !s.checked} : s
    );
    this.setData({ sectionOptions: opts });
  },

  onLimit(e) { this.setData({ limit: parseInt(e.detail.value) || 0 }); },

  startQuiz() {
    const selectedIds = this.data.sectionOptions.filter(s => s.checked).map(s => s.id);
    if (!selectedIds.length) { wx.showToast({ title:'请选择分区', icon:'none' }); return; }
    let pool = app.globalData.questions.filter(q => selectedIds.includes(q.sectionId));
    if (!pool.length) { wx.showToast({ title:'没有题目', icon:'none' }); return; }
    // 打乱
    pool = pool.sort(() => Math.random() - 0.5);
    if (this.data.limit > 0 && this.data.limit < pool.length) pool = pool.slice(0, this.data.limit);

    const q = pool[0];
    this.setData({
      started: true, questions: pool, current: 1, total: pool.length,
      progress: Math.round(1 / pool.length * 100),
      question: q, typeLabel: typeLabels[q.type] || q.type,
      displayOptions: this._buildOptions(q),
      answered: false, answers: {}, correctCount: 0, textAnswer: ''
    });
  },

  _buildOptions(q) {
    if (q.type === 'truefalse') return [{label:'A', text:'对'}, {label:'B', text:'错'}];
    const letters = 'ABCDEFGH';
    return (q.options || []).map((o,i) => ({label: letters[i], text: o, selected: false, correct: false}));
  },

  selectOption(e) {
    if (this.data.answered) return;
    const idx = e.currentTarget.dataset.index;
    const opts = this.data.displayOptions;
    const q = this.data.question;

    if (q.type === 'multiple') {
      opts[idx].selected = !opts[idx].selected;
      this.setData({ displayOptions: opts });
    } else {
      // 单选
      opts.forEach(o => o.selected = false);
      opts[idx].selected = true;
      this.setData({ displayOptions: opts });
      // 自动判断
      const userAns = opts[idx].text;
      const correct = Array.isArray(q.answer) ? q.answer.includes(userAns) : q.answer === userAns;
      opts.forEach(o => { o.correct = Array.isArray(q.answer) ? q.answer.includes(o.text) : q.answer === o.text; });
      const answers = {...this.data.answers, [q.id]: userAns};
      const correctCount = correct ? this.data.correctCount + 1 : this.data.correctCount;
      this.setData({
        answered: true, isCorrect: correct,
        correctAnswer: Array.isArray(q.answer) ? q.answer.join('、') : q.answer,
        displayOptions: opts, answers, correctCount
      });
    }
  },

  submitText() {
    if (!this.data.textAnswer.trim()) return;
    const q = this.data.question;
    const ua = this.data.textAnswer.trim();
    const correct = q.answer && ua.toLowerCase() === q.answer.toLowerCase();
    const answers = {...this.data.answers, [q.id]: ua};
    this.setData({
      answered: true, isCorrect: correct,
      correctAnswer: q.answer || '',
      answers,
      correctCount: correct ? this.data.correctCount + 1 : this.data.correctCount
    });
  },

  onTextAnswer(e) { this.setData({ textAnswer: e.detail.value }); },

  prevQ() {
    const idx = this.data.current - 2;
    if (idx < 0) return;
    const q = this.data.questions[idx];
    this.setData({
      current: idx + 1, progress: Math.round((idx + 1) / this.data.total * 100),
      question: q, typeLabel: typeLabels[q.type] || q.type,
      displayOptions: this._buildOptions(q),
      answered: !!this.data.answers[q.id], textAnswer: ''
    });
  },

  nextQ() {
    const idx = this.data.current;
    if (idx >= this.data.total) return;
    const q = this.data.questions[idx];
    this.setData({
      current: idx + 1, progress: Math.round((idx + 1) / this.data.total * 100),
      question: q, typeLabel: typeLabels[q.type] || q.type,
      displayOptions: this._buildOptions(q),
      answered: !!this.data.answers[q.id], textAnswer: ''
    });
  },

  finishQuiz() {
    let correct = 0, wrong = 0, tp = 0, score = 0;
    this.data.questions.forEach(q => {
      const ua = this.data.answers[q.id];
      const ok = ua ? (Array.isArray(q.answer) ? q.answer.includes(ua) : ua === q.answer || ua.toLowerCase() === (q.answer||'').toLowerCase()) : false;
      tp += q.points;
      if (ok) { correct++; score += q.points; } else { wrong++; }
    });
    const pct = tp > 0 ? Math.round(score / tp * 100) : 0;
    const grade = pct >= 90 ? 'excellent' : pct >= 75 ? 'good' : pct >= 60 ? 'fair' : 'poor';
    const gt = pct >= 90 ? '🌟 优秀！' : pct >= 75 ? '👍 良好！' : pct >= 60 ? '📚 及格' : '💪 继续努力！';
    this.setData({
      showResult: true, score, totalPoints: tp, correctCount: correct, wrongCount: wrong,
      grade, gradeText: gt, percent: pct
    });
    // 保存到历史
    app.globalData.quizHistory.push({ date: new Date().toLocaleDateString(), total: this.data.total, correct, wrong, totalPoints: tp, score });
    app.saveData();
  },

  newQuiz() {
    this.setData({
      started: false, showResult: false, questions: [], answers: {},
      correctCount: 0, wrongCount: 0
    });
  }
});
