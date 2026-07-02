// 刷题小程序 - 微信小程序版
App({
  globalData: {
    sections: [],
    questions: [],
    activeSectionId: null,
    quizHistory: []
  },

  onLaunch() {
    // 加载本地数据
    this.loadData();
  },

  loadData() {
    try {
      const data = wx.getStorageSync('quiz_data');
      if (data) {
        this.globalData.sections = data.sections || [];
        this.globalData.questions = data.questions || [];
      }
      const history = wx.getStorageSync('quiz_history');
      if (history) {
        this.globalData.quizHistory = history;
      }
    } catch (e) {
      console.error('加载数据失败:', e);
    }

    // 如果没有分区，创建默认分区
    if (this.globalData.sections.length === 0) {
      this.globalData.sections.push({
        id: this.uid(),
        name: '默认分区',
        createdAt: new Date().toISOString()
      });
      this.saveData();
      this.globalData.activeSectionId = this.globalData.sections[0].id;
    } else {
      this.globalData.activeSectionId = this.globalData.sections[0].id;
    }
  },

  saveData() {
    try {
      wx.setStorageSync('quiz_data', {
        sections: this.globalData.sections,
        questions: this.globalData.questions
      });
      wx.setStorageSync('quiz_history', this.globalData.quizHistory.slice(-50));
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'error' });
    }
  },

  uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
});
