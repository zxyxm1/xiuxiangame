// 初始化全局对象
if (typeof window.GameGlobal === 'undefined') {
  window.GameGlobal = {};
}

// 获取Canvas元素
const canvas = document.getElementById('gameCanvas');
if (!canvas) {
  throw new Error('Canvas element not found');
}

// 加载背景图片
const backgroundImage = new Image();
backgroundImage.src = './images/image.png';
window.GameGlobal.backgroundImage = backgroundImage;

// 获取设备像素比(解决高分辨率屏幕模糊问题)
const dpr = window.devicePixelRatio || 1;

// 设置Canvas尺寸 - 适配移动端
const getCanvasSize = () => {
  // 获取视口尺寸
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // 计算Canvas显示尺寸(逻辑像素)
  const displayWidth = Math.min(viewportWidth, 414);
  const displayHeight = Math.min(viewportHeight, 896);
  
  // 根据视口比例调整,确保完整显示
  let finalWidth = displayWidth;
  let finalHeight = displayHeight;
  
  // 如果是移动端,使用全屏模式
  if (viewportWidth < 768) {
    finalWidth = viewportWidth;
    finalHeight = viewportHeight;
  }
  
  return { finalWidth, finalHeight };
};

const { finalWidth, finalHeight } = getCanvasSize();
const SCREEN_WIDTH = finalWidth;
const SCREEN_HEIGHT = finalHeight;

// 设置Canvas的CSS显示尺寸(逻辑像素)
canvas.style.width = SCREEN_WIDTH + 'px';
canvas.style.height = SCREEN_HEIGHT + 'px';

// 设置Canvas的实际绘制尺寸(物理像素,解决模糊问题)
canvas.width = SCREEN_WIDTH * dpr;
canvas.height = SCREEN_HEIGHT * dpr;

// 获取绘图上下文并缩放,使绘制时使用逻辑坐标
const ctx = canvas.getContext('2d');
ctx.scale(dpr, dpr);

// 挂载到全局对象
window.GameGlobal.canvas = canvas;
window.canvas = canvas; // 兼容旧代码

// 监听窗口大小变化,动态调整Canvas尺寸
window.addEventListener('resize', () => {
  const { finalWidth: newWidth, finalHeight: newHeight } = getCanvasSize();
  
  canvas.style.width = newWidth + 'px';
  canvas.style.height = newHeight + 'px';
  canvas.width = newWidth * dpr;
  canvas.height = newHeight * dpr;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
});

export { SCREEN_WIDTH, SCREEN_HEIGHT };