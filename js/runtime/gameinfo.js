import Emitter from '../libs/tinyemitter.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render.js';

/**
 * 修仙游戏UI系统
 * 负责渲染事件文本、选项按钮、角色属性等
 */
export default class GameInfo extends Emitter {
  constructor() {
    super();

    this.choiceButtons = []; // 选项按钮区域
    this.restartBtn = {
      x: SCREEN_WIDTH / 2 - 60,
      y: SCREEN_HEIGHT - 100,
      width: 120,
      height: 40
    };

    // 绑定触摸事件(支持移动端和PC端)
    const canvas = window.canvas || document.getElementById('gameCanvas');
    if (canvas) {
      // 移动端触摸事件
      canvas.addEventListener('touchstart', this.touchEventHandler.bind(this));
      // PC端点击事件
      canvas.addEventListener('click', this.mouseEventHandler.bind(this));
    }
  }

  /**
   * 主渲染函数
   */
  render(ctx) {
    const databus = window.GameGlobal.databus;

    if (databus.isGameOver) {
      this.renderGameOver(ctx);
    } else if (databus.currentEvent) {
      this.renderPlayerInfo(ctx); // 渲染角色信息
      // 根据状态显示结果或事件
      if (databus.showResultScreen) {
        this.renderResultInStory(ctx); // 在故事区域显示选择结果
      } else {
        this.renderEvent(ctx); // 渲染当前事件
        this.renderChoices(ctx); // 渲染选项
      }
    } else {
      this.renderWelcome(ctx); // 渲染欢迎界面
    }
  }

  /**
   * 渲染欢迎界面
   */
  renderWelcome(ctx) {
    // 绘制标题背景装饰
    ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
    ctx.fillRect(0, SCREEN_HEIGHT / 2 - 150, SCREEN_WIDTH, 300);
    
    // 主标题 - 添加发光效果
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 32px "Microsoft YaHei", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('天道来了个修仙公司', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 80);
    
    // 重置阴影
    ctx.shadowBlur = 0;
    
    // 副标题
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px "Microsoft YaHei", Arial';
    ctx.fillText('一个修仙文字游戏', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 30);
    
    // 提示文字 - 闪烁效果
    const alpha = (Math.sin(Date.now() / 500) + 1) / 2 * 0.5 + 0.5; // 0.5-1之间闪烁
    ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
    ctx.font = '18px "Microsoft YaHei", Arial';
    ctx.fillText('点击任意位置开始', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 60);
    
    // 装饰线
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(SCREEN_WIDTH / 2 - 100, SCREEN_HEIGHT / 2 + 90);
    ctx.lineTo(SCREEN_WIDTH / 2 + 100, SCREEN_HEIGHT / 2 + 90);
    ctx.stroke();
    
    ctx.textAlign = 'left';
  }

  /**
   * 渲染玩家信息面板
   */
  renderPlayerInfo(ctx) {
    const player = window.GameGlobal.databus.player;
    const stage = window.GameGlobal.databus.stageNames[window.GameGlobal.databus.currentStage];
    
    // 绘制半透明背景 (更透明)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // 从0.8改为0.4
    ctx.fillRect(10, 10, 220, 135);
    
    // 绘制金色边框
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // 增强边框不透明度
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 220, 135);
    
    // 角标装饰
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(10, 10, 30, 3);
    ctx.fillRect(10, 10, 3, 30);
    ctx.fillRect(200, 10, 30, 3);
    ctx.fillRect(227, 10, 3, 30);
    
    // 添加文字阴影提高可读性
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px "Microsoft YaHei", Arial';
    ctx.textAlign = 'left';
    
    let y = 28;
    // 使用图标 + 文字
    ctx.fillStyle = '#FFD700';
    ctx.fillText('⚔️', 15, y);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${player.name}`, 40, y);
    
    y += 18;
    ctx.fillStyle = '#87CEEB';
    ctx.fillText('📅', 15, y);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${player.age}岁`, 40, y);
    
    y += 18;
    ctx.fillStyle = '#FFD700';
    ctx.fillText('⭐', 15, y);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${player.realm}`, 40, y);
    
    y += 18;
    ctx.fillStyle = '#FF6B6B';
    ctx.fillText('❤️', 15, y);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${player.lifespan}年`, 40, y);
    
    y += 18;
    ctx.fillStyle = '#90EE90';
    ctx.fillText('⚡', 15, y);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${player.cultivation}`, 40, y);
    
    y += 18;
    ctx.fillStyle = '#DDA0DD';
    ctx.fillText('🎯', 15, y);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${stage}`, 40, y);
    
    // 重置阴影
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  /**
   * 渲染当前事件
   */
  renderEvent(ctx) {
    const event = window.GameGlobal.databus.currentEvent;
    if (!event) return;
    
    // 绘制事件背景(动态高度)
    const eventY = 180;
    const eventHeight = Math.min(280, SCREEN_HEIGHT * 0.35);
    
    // 背景 + 边框 (更透明)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // 从0.85改为0.5
    ctx.fillRect(20, eventY, SCREEN_WIDTH - 40, eventHeight);
    
    // 金色边框
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // 增强边框
    ctx.lineWidth = 2;
    ctx.strokeRect(20, eventY, SCREEN_WIDTH - 40, eventHeight);
    
    // 顶部装饰条
    const gradient = ctx.createLinearGradient(20, eventY, SCREEN_WIDTH - 20, eventY);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(20, eventY, SCREEN_WIDTH - 40, 3);
    
    // 添加文字阴影提高可读性
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // 绘制事件标题
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 18px "Microsoft YaHei", Arial';
    ctx.textAlign = 'center';
    ctx.fillText(event.title, SCREEN_WIDTH / 2, eventY + 30);
    
    // 绘制事件描述(支持自动换行)
    ctx.fillStyle = '#FFFFFF'; // 从#E0E0E0改为纯白
    ctx.font = '14px "Microsoft YaHei", Arial';
    this.drawMultilineText(ctx, event.description, SCREEN_WIDTH / 2, eventY + 55, SCREEN_WIDTH - 90, 20, eventHeight - 65);
    
    // 重置阴影
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.textAlign = 'left';
  }

  /**
   * 在故事描述区域显示选择结果和属性变化
   */
  renderResultInStory(ctx) {
    const databus = window.GameGlobal.databus;
    const result = databus.lastChoiceResult;
    
    if (!result) return;
    
    // 绘制事件背景(增大高度) (更透明)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // 从0.9改为0.5
    ctx.fillRect(20, 180, SCREEN_WIDTH - 40, 380);
    
    // 金色边框
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 180, SCREEN_WIDTH - 40, 380);
    
    // 顶部装饰
    const gradient = ctx.createLinearGradient(20, 180, SCREEN_WIDTH - 20, 180);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(20, 180, SCREEN_WIDTH - 40, 3);
    
    // 添加文字阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // 绘制标题
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 18px "Microsoft YaHei", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✔ 你的选择', SCREEN_WIDTH / 2, 210);
    
    // 显示选择的文本
    ctx.fillStyle = '#90EE90';
    ctx.font = 'bold 15px "Microsoft YaHei", Arial';
    const choiceLines = this.wrapText(ctx, result.choiceText, SCREEN_WIDTH - 80);
    let currentY = 240;
    choiceLines.forEach((line) => {
      ctx.fillText(line, SCREEN_WIDTH / 2, currentY);
      currentY += 20;
    });
    
    // 显示结果文案（如果有）
    currentY += 15;
    if (result.resultText) {
      ctx.fillStyle = '#FFFFFF'; // 从#E0E0E0改为纯白
      ctx.font = '14px "Microsoft YaHei", Arial';
      const resultLines = this.wrapText(ctx, result.resultText, SCREEN_WIDTH - 80);
      resultLines.forEach((line) => {
        ctx.fillText(line, SCREEN_WIDTH / 2, currentY);
        currentY += 20;
      });
    }
    
    // 分隔线
    currentY += 10;
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, currentY);
    ctx.lineTo(SCREEN_WIDTH - 60, currentY);
    ctx.stroke();
    
    currentY += 5;
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px "Microsoft YaHei", Arial';
    ctx.fillText('------ 属性变化 ------', SCREEN_WIDTH / 2, currentY);
    
    // 属性变化详情
    currentY += 25;
    const changes = databus.attributeChanges;
    
    // 属性名称映射
    const attrNames = {
      'age': '年龄',
      'cultivation': '修为',
      'spiritualPower': '灵力',
      'health': '生命值',
      'socialAnxiety': '社恐值',
      'fishingSkill': '摸鱼技能',
      'versaillesIndex': '凡尔赛指数',
      'salaryFish': '咸鱼值',
      'cookingSkill': '厨修属性',
      'lifespan': '寿元',
      'realmLevel': '境界'
    };
    
    ctx.font = 'bold 13px "Microsoft YaHei", Arial';
    ctx.textAlign = 'left';
    
    Object.keys(changes).forEach((key) => {
      const value = changes[key];
      const name = attrNames[key] || key;
      const color = value >= 0 ? '#90EE90' : '#FF6B6B';
      const displayValue = value >= 0 ? `+${value}` : `${value}`;
      
      ctx.fillStyle = color;
      ctx.fillText(`● ${name}: ${displayValue}`, 50, currentY);
      currentY += 22;
    });
    
    // 提示文字
    ctx.fillStyle = '#FFD700';
    ctx.font = '14px "Microsoft YaHei", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('点击屏幕继续...', SCREEN_WIDTH / 2, SCREEN_HEIGHT - 120);
    
    // 重置阴影
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.textAlign = 'left';
  }
  
  /**
   * 渲染选择结果效果界面
   */
  renderChoiceResult(ctx) {
    const databus = window.GameGlobal.databus;
    const result = databus.lastChoiceResult;
    
    if (!result) return;
    
    // 半透明黑色背景，窗口样式
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(30, 100, SCREEN_WIDTH - 60, SCREEN_HEIGHT - 200);
    
    // 装饰边框
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 100, SCREEN_WIDTH - 60, SCREEN_HEIGHT - 200);
    
    // 标题：你的选择
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✓ 你的选择', SCREEN_WIDTH / 2, 140);
    
    // 选择文本（高亮显示）
    ctx.fillStyle = '#00FF00';
    ctx.font = 'bold 16px Arial';
    const lines = this.wrapText(ctx, result.choiceText, SCREEN_WIDTH - 120);
    let currentY = 180;
    lines.forEach((line) => {
      ctx.fillText(line, SCREEN_WIDTH / 2, currentY);
      currentY += 24;
    });
    
    // 分隔线
    currentY += 10;
    ctx.fillStyle = '#FFD700';
    ctx.font = '16px Arial';
    ctx.fillText('===== 属性变化 =====', SCREEN_WIDTH / 2, currentY);
    
    // 属性变化详情
    currentY += 40;
    const changes = databus.attributeChanges;
    const changeKeys = Object.keys(changes).filter(key => key !== 'age');
    
    // 显示年龄
    if (changes.age) {
      ctx.fillStyle = '#FF69B4';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`• 年龄: +${changes.age}`, 60, currentY);
      currentY += 28;
    }
    
    // 属性名称映射
    const attrNames = {
      'cultivation': '修为',
      'spiritualPower': '灵力',
      'health': '生命值',
      'socialAnxiety': '社恐值',
      'fishingSkill': '摸鱼技能',
      'versaillesIndex': '凡尔赛指数',
      'salaryFish': '咸鱼值',
      'cookingSkill': '厨修属性',
      'lifespan': '寿元',
      'realmLevel': '境界',
      'sect': '宗门'
    };
    
    // 显示其他属性变化
    changeKeys.forEach((key) => {
      const value = changes[key];
      const name = attrNames[key] || key;
      const color = value >= 0 ? '#90EE90' : '#FF6B6B';
      
      ctx.fillStyle = color;
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      const displayValue = value >= 0 ? `+${value}` : `${value}`;
      ctx.fillText(`• ${name}: ${displayValue}`, 60, currentY);
      currentY += 24;
    });
    
    // 提示文字（底部）
    currentY = SCREEN_HEIGHT - 80;
    ctx.fillStyle = '#FFD700';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('点击屏幕继续...', SCREEN_WIDTH / 2, currentY);
    
    ctx.textAlign = 'left';
  }
  renderChoices(ctx) {
    const event = window.GameGlobal.databus.currentEvent;
    if (!event || !event.choices) return;
    
    this.choiceButtons = []; // 重置按钮区域
    
    // 动态计算起始位置,确保按钮在屏幕下方可见区域
    const eventAreaHeight = 280; // 事件描述区域高度
    const eventAreaY = 180; // 事件描述起始Y
    const availableHeight = SCREEN_HEIGHT - (eventAreaY + eventAreaHeight) - 20; // 可用高度
    const startY = eventAreaY + eventAreaHeight + 20; // 按钮起始位置
    
    const buttonMinHeight = 45; // 减小最小高度
    const buttonGap = 6; // 减小间距
    const buttonWidth = SCREEN_WIDTH - 80;
    const buttonX = 40;
    const padding = 10; // 减小内边距
    
    let currentY = startY;
    
    // 计算所有按钮的总高度
    let totalButtonsHeight = 0;
    const buttonHeights = [];
    event.choices.forEach((choice) => {
      ctx.font = '13px Arial'; // 稍微减小字体
      const lines = this.wrapText(ctx, choice.text, buttonWidth - padding * 2);
      const textHeight = lines.length * 18; // 减小行高
      const buttonHeight = Math.max(buttonMinHeight, textHeight + padding * 2);
      buttonHeights.push(buttonHeight);
      totalButtonsHeight += buttonHeight + buttonGap;
    });
    
    // 如果按钮总高度超过可用高度,调整按钮尺寸
    let scale = 1;
    if (totalButtonsHeight > availableHeight) {
      scale = availableHeight / totalButtonsHeight;
    }
    
    event.choices.forEach((choice, index) => {
      const buttonHeight = buttonHeights[index] * scale;
      
      // 保存按钮区域用于点击检测
      this.choiceButtons.push({
        x: buttonX,
        y: currentY,
        width: buttonWidth,
        height: buttonHeight,
        index: index
      });
      
      // 绘制按钮背景 - 渐变效果
      const btnGradient = ctx.createLinearGradient(buttonX, currentY, buttonX, currentY + buttonHeight);
      btnGradient.addColorStop(0, '#5CB85C');
      btnGradient.addColorStop(1, '#449D44');
      ctx.fillStyle = btnGradient;
      
      // 圆角矩形
      this.roundRect(ctx, buttonX, currentY, buttonWidth, buttonHeight, 8);
      ctx.fill();
      
      // 绘制按钮边框
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      this.roundRect(ctx, buttonX, currentY, buttonWidth, buttonHeight, 8);
      ctx.stroke();
      
      // 左侧装饰条
      ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.fillRect(buttonX + 5, currentY + 10, 3, buttonHeight - 20);
      
      // 绘制按钮文字(多行居中)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px "Microsoft YaHei", Arial';
      ctx.textAlign = 'center';
      
      const lines = this.wrapText(ctx, choice.text, buttonWidth - padding * 2);
      const textHeight = lines.length * 18;
      const textStartY = currentY + (buttonHeight - textHeight) / 2 + 13;
      
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line, SCREEN_WIDTH / 2, textStartY + lineIndex * 18);
      });
      
      currentY += buttonHeight + (buttonGap * scale);
    });
    
    ctx.textAlign = 'left';
  }

  /**
   * 渲染游戏结束界面
   */
  renderGameOver(ctx) {
    const result = window.GameGlobal.databus.gameResult;
    const player = window.GameGlobal.databus.player;
    
    // 半透明黑色背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // 标题 - 发光效果
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 32px "Microsoft YaHei", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('修仙之路结束', SCREEN_WIDTH / 2, 100);
    ctx.shadowBlur = 0;
    
    // 绘制信息面板
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.roundRect(ctx, 30, 140, SCREEN_WIDTH - 60, 200, 10);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, 30, 140, SCREEN_WIDTH - 60, 200, 10);
    ctx.stroke();
    
    // 玩家最终信息
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px "Microsoft YaHei", Arial';
    let y = 170;
    ctx.fillText(`姓名：${player.name}`, SCREEN_WIDTH / 2, y);
    y += 30;
    ctx.fillText(`最终年龄：${player.age}岁`, SCREEN_WIDTH / 2, y);
    y += 30;
    ctx.fillText(`最终境界：${player.realm}`, SCREEN_WIDTH / 2, y);
    y += 30;
    ctx.fillText(`修为：${player.cultivation}`, SCREEN_WIDTH / 2, y);
    y += 50;
    
    // 结局描述（支持多行）
    ctx.fillStyle = '#FFD700';
    ctx.font = '16px "Microsoft YaHei", Arial';
    this.drawMultilineText(ctx, result, SCREEN_WIDTH / 2, y, SCREEN_WIDTH - 80, 24);
    
    // 重新开始按钮 - 渐变效果
    const btn = this.restartBtn;
    const btnGradient = ctx.createLinearGradient(btn.x, btn.y, btn.x, btn.y + btn.height);
    btnGradient.addColorStop(0, '#5CB85C');
    btnGradient.addColorStop(1, '#449D44');
    ctx.fillStyle = btnGradient;
    this.roundRect(ctx, btn.x, btn.y, btn.width, btn.height, 8);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, btn.x, btn.y, btn.width, btn.height, 8);
    ctx.stroke();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px "Microsoft YaHei", Arial';
    ctx.fillText('重新开始', SCREEN_WIDTH / 2, btn.y + 26);
    
    ctx.textAlign = 'left';
  }

  /**
   * 绘制圆角矩形
   */
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * 绘制多行文本（自动换行）
   */
  drawMultilineText(ctx, text, x, y, maxWidth, lineHeight, maxHeight = null) {
    const words = text.split('');
    let line = '';
    let currentY = y;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        // 如果设置了最大高度,检查是否超出
        if (maxHeight && (currentY - y + lineHeight) > maxHeight) {
          // 超出部分用省略号表示
          ctx.fillText(line + '...', x, currentY);
          return;
        }
        ctx.fillText(line, x, currentY);
        line = words[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    // 检查最后一行
    if (!maxHeight || (currentY - y) <= maxHeight) {
      ctx.fillText(line, x, currentY);
    }
  }

  /**
   * 文本换行处理（返回数组）
   */
  wrapText(ctx, text, maxWidth) {
    const words = text.split('');
    const lines = [];
    let line = '';
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n];
      } else {
        line = testLine;
      }
    }
    if (line) {
      lines.push(line);
    }
    return lines;
  }

  /**
   * 鼠标事件处理(PC端)
   */
  mouseEventHandler(event) {
    const canvas = window.canvas || document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX - rect.left;
    const clientY = event.clientY - rect.top;
      
    this.handleInput(clientX, clientY);
  }
  
  /**
   * 触摸事件处理(移动端)
   */
  touchEventHandler(event) {
    event.preventDefault();
    const canvas = window.canvas || document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const clientX = touch.clientX - rect.left;
    const clientY = touch.clientY - rect.top;
      
    this.handleInput(clientX, clientY);
  }
  
  /**
   * 统一处理输入事件
   */
  handleInput(clientX, clientY) {
    const databus = window.GameGlobal.databus;
  
    // 游戏结束时，只处理重新开始按钮
    if (databus.isGameOver) {
      const btn = this.restartBtn;
      if (clientX >= btn.x && clientX <= btn.x + btn.width &&
          clientY >= btn.y && clientY <= btn.y + btn.height) {
        this.emit('restart');
      }
      return;
    }
  
    // 显示选择结果画面时，任意点击继续
    if (databus.showResultScreen) {
      this.emit('continueGame');
      return;
    }
  
    // 欢迎界面，点击任意位置开始游戏
    if (!databus.currentEvent) {
      this.emit('startGame');
      return;
    }
  
    // 游戏进行中，检查选项按钮点击
    for (let btn of this.choiceButtons) {
      if (clientX >= btn.x && clientX <= btn.x + btn.width &&
          clientY >= btn.y && clientY <= btn.y + btn.height) {
        this.emit('choiceSelected', btn.index);
        break;
      }
    }
  }
}
