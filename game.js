// Web版本入口文件
// 等待DOM加载完成
window.addEventListener('DOMContentLoaded', () => {
  // 动态导入Main模块
  import('./js/main.js').then(module => {
    const Main = module.default;
    new Main();
  }).catch(err => {
    console.error('游戏加载失败:', err);
  });
});
