const app = getApp();
Page({
  data: { mode:'add', editId:null, typeIndex:0, types:['单选题','多选题','判断题','填空题','应用题'],
    type:'single', title:'', points:5, options:[], showOptions:true,
    answer:'', explanation:'' },
  onLoad(opts) {
    this.setData({ mode: opts.mode || 'add', editId: opts.id });
    if (opts.id) {
      const q = app.globalData.questions.find(q => q.id === opts.id);
      if (q) {
        const ti = ['single','multiple','truefalse','fillblank','essay'].indexOf(q.type);
        this.setData({
          typeIndex: ti >= 0 ? ti : 0, type: q.type, title: q.title,
          points: q.points, answer: q.answer, explanation: q.explanation||'',
          options: (q.options||[]).map((o,i) => ({letter:String.fromCharCode(65+i), text:o})),
          showOptions: ['single','multiple','truefalse'].includes(q.type)
        });
      }
    }
  },
  onType(e) {
    const types = ['single','multiple','truefalse','fillblank','essay'];
    const type = types[parseInt(e.detail.value)];
    const showOptions = ['single','multiple','truefalse'].includes(type);
    let options = this.data.options;
    if (type === 'truefalse') options = [{letter:'A',text:'对'},{letter:'B',text:'错'}];
    this.setData({ typeIndex: parseInt(e.detail.value), type, showOptions, options, answer:'' });
  },
  onTitle(e) { this.setData({ title:e.detail.value }); },
  onPoints(e) { this.setData({ points:parseInt(e.detail.value)||5 }); },
  onAnswer(e) { this.setData({ answer:e.detail.value }); },
  onExp(e) { this.setData({ explanation:e.detail.value }); },
  onOpt(e) {
    const idx = parseInt(e.currentTarget.dataset.idx);
    const opts = this.data.options;
    opts[idx].text = e.detail.value;
    this.setData({ options: opts });
  },
  addOpt() {
    const opts = this.data.options;
    opts.push({ letter: String.fromCharCode(65 + opts.length), text: '' });
    this.setData({ options: opts });
  },
  setAnswer(e) { this.setData({ answer: e.currentTarget.dataset.v }); },
  toggleAnswer(e) {
    const idx = e.currentTarget.dataset.idx;
    const opts = this.data.options;
    if (this.data.type === 'multiple') {
      opts[idx].selected = !opts[idx].selected;
      this.setData({ options: opts, answer: opts.filter(o => o.selected).map(o => o.text) });
    } else {
      opts.forEach(o => o.selected = false);
      opts[idx].selected = true;
      this.setData({ options: opts, answer: opts[idx].text });
    }
  },
  save() {
    if (!this.data.title.trim()) { wx.showToast({ title:'请输入题目', icon:'none' }); return; }
    const q = {
      id: this.data.editId || app.uid(),
      sectionId: app.globalData.activeSectionId,
      type: this.data.type, title: this.data.title.trim(),
      options: this.data.showOptions ? this.data.options.map(o => o.text) : [],
      answer: this.data.answer, points: this.data.points,
      explanation: this.data.explanation.trim()
    };
    if (this.data.editId) {
      const idx = app.globalData.questions.findIndex(q => q.id === this.data.editId);
      if (idx >= 0) app.globalData.questions[idx] = q;
    } else {
      app.globalData.questions.push(q);
    }
    app.saveData();
    wx.navigateBack();
  }
});
