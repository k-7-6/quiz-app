// 数据管理工具
const STORAGE_KEY = 'quiz_data';
const HISTORY_KEY = 'quiz_history';

function load() {
  try {
    const data = wx.getStorageSync(STORAGE_KEY);
    if (data) return data;
  } catch(e) {}
  return { sections: [], questions: [] };
}

function save(sections, questions) {
  try {
    wx.setStorageSync(STORAGE_KEY, { sections, questions });
  } catch(e) {
    wx.showToast({ title: '保存失败', icon: 'error' });
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

module.exports = { load, save, uid };
