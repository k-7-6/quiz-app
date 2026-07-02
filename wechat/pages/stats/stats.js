const app = getApp();
Page({
  data: { totalQuestions:0, typeCounts:{}, avgPct:0, quizHistory:[] },
  onShow() {
    const { questions, quizHistory } = app.globalData;
    const tc = {}; questions.forEach(q => { tc[q.type] = (tc[q.type]||0) + 1; });
    const totalAnswered = quizHistory.reduce((s,r) => s + r.total, 0);
    const totalCorrect = quizHistory.reduce((s,r) => s + r.correct, 0);
    this.setData({
      totalQuestions: questions.length, typeCounts: tc,
      avgPct: totalAnswered > 0 ? Math.round(totalCorrect/totalAnswered*100) : 0,
      quizHistory: quizHistory.slice(-20).reverse()
    });
  }
});
