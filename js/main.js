import './render.js'; // 初始化Canvas
import GameInfo from './runtime/gameinfo.js'; // 导入游戏UI类
import DataBus from './databus.js'; // 导入数据类,用于管理游戏状态和数据
import EventSystem from './runtime/eventSystem.js'; // 导入事件系统

// 获取canvas元素和上下文
const canvas = window.canvas || document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // 获取canvas的2D绘图上下文

// 初始化全局数据管理
if (!window.GameGlobal) {
  window.GameGlobal = {};
}
window.GameGlobal.databus = new DataBus(); // 全局数据管理

/**
 * 修仙游戏主函数
 */
export default class Main {
  aniId = 0; // 用于存储动画帧的ID
  gameInfo = new GameInfo(); // 创建UI显示
  eventSystem = new EventSystem(window.GameGlobal.databus); // 创建事件系统

  constructor() {
    // 监听重启游戏事件
    this.gameInfo.on('restart', this.restart.bind(this));
    
    // 监听开始游戏事件
    this.gameInfo.on('startGame', this.startGame.bind(this));
    
    // 监听选项选择事件
    this.gameInfo.on('choiceSelected', this.handleChoice.bind(this));
    
    // 监听继续游戏事件（点击结果画面后继续）
    this.gameInfo.on('continueGame', this.continueGame.bind(this));

    // 开始游戏循环
    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * 重启游戏
   */
  restart() {
    window.GameGlobal.databus.reset(); // 重置数据
    cancelAnimationFrame(this.aniId); // 清除上一局的动画
    this.aniId = requestAnimationFrame(this.loop.bind(this)); // 开始新的动画循环
  }

  /**
   * 开始游戏，加载第一个事件
   */
  startGame() {
    window.GameGlobal.databus.reset();
    this.eventSystem.startGame();
  }

  /**
   * 处理玩家的选项选择
   */
  handleChoice(choiceIndex) {
    const currentEvent = window.GameGlobal.databus.currentEvent;
    if (currentEvent) {
      this.eventSystem.handleChoice(currentEvent, choiceIndex);
    }
  }
  
  /**
   * 继续游戏（点击结果画面后加载下一个事件）
   */
  continueGame() {
    window.GameGlobal.databus.hideResultScreen();
    this.eventSystem.loadNextEvent();
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布

    // 绘制背景图片(如果已加载)
    const bgImage = window.GameGlobal.backgroundImage;
    if (bgImage && bgImage.complete) {
      // 计算图片缩放,使其覆盖整个Canvas
      const scale = Math.max(canvas.width / bgImage.width, canvas.height / bgImage.height);
      const x = (canvas.width - bgImage.width * scale) / 2;
      const y = (canvas.height - bgImage.height * scale) / 2;
      ctx.drawImage(bgImage, x, y, bgImage.width * scale, bgImage.height * scale);
      
      // 添加半透明遮罩,让文字更清晰
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // 图片未加载时使用渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1a0033');
      gradient.addColorStop(0.5, '#330066');
      gradient.addColorStop(1, '#000033');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 绘制UI
    this.gameInfo.render(ctx);
  }

  /**
   * 游戏帧循环
   */
  loop() {
    this.render(); // 渲染游戏画面

    // 请求下一帧动画
    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }
}
