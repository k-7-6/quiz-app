const app = getApp();
const typeLabels = { single:'单选题', multiple:'多选题', truefalse:'判断题', fillblank:'填空题', essay:'应用题' };

Page({
  data: {
    sections: [], activeSectionId: null, questions: [],
    filteredQuestions: [], searchText: '', questionCount: {},
    typeLabels
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const { sections, questions, activeSectionId } = app.globalData;
    const countMap = {};
    questions.forEach(q => { countMap[q.sectionId] = (countMap[q.sectionId]||0) + 1; });
    const filtered = questions.filter(q => q.sectionId === activeSectionId);
    this.setData({
      sections, activeSectionId, questions,
      filteredQuestions: filtered,
      questionCount: countMap
    });
  },

  selectSection(e) {
    const id = e.currentTarget.dataset.id;
    app.globalData.activeSectionId = id;
    this.loadData();
  },

  onSearch(e) {
    const text = e.detail.value.toLowerCase();
    const filtered = this.data.questions.filter(q =>
      q.sectionId === this.data.activeSectionId &&
      q.title.toLowerCase().includes(text)
    );
    this.setData({ searchText: e.detail.value, filteredQuestions: filtered });
  },

  showAdd() { wx.navigateTo({ url: '/pages/bank/bank?mode=add' }); },
  editQ(e) { wx.navigateTo({ url: '/pages/bank/bank?mode=edit&id=' + e.currentTarget.dataset.id }); },

  deleteQ(e) {
    wx.showModal({
      title: '删除题目', content: '确定删除吗？',
      success: res => {
        if (res.confirm) {
          app.globalData.questions = app.globalData.questions.filter(
            q => q.id !== e.currentTarget.dataset.id
          );
          app.saveData();
          this.loadData();
        }
      }
    });
  },

  showImport() {
    wx.showToast({ title: '导入功能开发中', icon: 'none' });
  }
});
