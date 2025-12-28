let instance;

/**
 * 全局状态管理器
 * 负责管理修仙游戏的状态，包括角色属性、事件、结局等
 */
export default class DataBus {
  // 玩家属性
  player = {
    name: '无名修士',
    age: 16, // 年龄
    lifespan: 100, // 寿元（剩余生命）
    realm: '炼气期', // 境界
    realmLevel: 0, // 境界等级（0-6）
    
    // 基础属性
    cultivation: 0, // 修为
    spiritualPower: 100, // 灵力
    health: 100, // 生命值
    
    // 特殊属性
    socialAnxiety: 50, // 社恐值（越高越难触发社交事件）
    fishingSkill: 0, // 摸鱼熟练度（影响躲懒成功率）
    versaillesIndex: 0, // 凡尔赛指数（影响NPC嫉妒度）
    salaryFish: 0, // 咸鱼值
    cookingSkill: 0, // 厨修属性
    
    // 宗门相关
    sect: null, // 所属宗门
    master: null, // 师父
    disciples: [], // 徒弟
  };
  
  // 境界列表
  realms = ['炼气期', '筑基期', '金丹期', '元婴期', '摸鱼期', '带薪闭关期', '飞升（试用期）'];
  
  // 游戏状态
  currentEvent = null; // 当前事件
  currentStage = 0; // 当前人生阶段（0-5）
  stageNames = ['凡人少年', '宗门萌新', '中流砥柱', '老油条期', '渡劫危机', '终局归宿'];
  eventHistory = []; // 事件历史
  isGameOver = false; // 游戏是否结束
  gameResult = null; // 游戏结局
  
  // 选择结果显示相关
  lastChoiceResult = null; // 上一次选择的结果信息
  showResultScreen = false; // 是否显示选择结果界面
  attributeChanges = {}; // 属性变化记录
  
  constructor() {
    // 确保单例模式
    if (instance) return instance;
    instance = this;
  }

  // 重置游戏状态
  reset() {
    this.player = {
      name: '无名修士',
      age: 16,
      lifespan: 100,
      realm: '炼气期',
      realmLevel: 0,
      cultivation: 0,
      spiritualPower: 100,
      health: 100,
      socialAnxiety: 50,
      fishingSkill: 0,
      versaillesIndex: 0,
      salaryFish: 0,
      cookingSkill: 0,
      sect: null,
      master: null,
      disciples: [],
    };
    
    this.currentEvent = null;
    this.currentStage = 0;
    this.eventHistory = [];
    this.isGameOver = false;
    this.gameResult = null;
    this.lastChoiceResult = null;
    this.showResultScreen = false;
    this.attributeChanges = {};
  }

  // 更新玩家属性
  updatePlayerAttr(attrName, value) {
    if (this.player.hasOwnProperty(attrName)) {
      this.player[attrName] += value;
      
      // 特殊处理：寿元耗尽游戏结束
      if (attrName === 'lifespan' && this.player.lifespan <= 0) {
        this.gameOver('寿元耗尽，你的修仙之路就此终结...');
      }
      
      // 特殊处理：境界提升
      if (attrName === 'realmLevel') {
        this.player.realmLevel = Math.max(0, Math.min(6, this.player.realmLevel));
        this.player.realm = this.realms[this.player.realmLevel];
      }
    }
  }
  
  // 年龄增长
  ageGrow(years) {
    this.player.age += years;
    
    // 根据年龄更新人生阶段
    if (this.player.age >= 1000) {
      this.currentStage = 5;
    } else if (this.player.age >= 500) {
      this.currentStage = 4;
    } else if (this.player.age >= 100) {
      this.currentStage = 3;
    } else if (this.player.age >= 30) {
      this.currentStage = 2;
    } else if (this.player.age >= 16) {
      this.currentStage = 1;
    } else {
      this.currentStage = 0;
    }
  }

  // 游戏结束
  gameOver(result) {
    this.isGameOver = true;
    this.gameResult = result || '你的修仙之路就此终结';
  }
  
  // 记录事件
  recordEvent(eventId) {
    this.eventHistory.push({
      id: eventId,
      age: this.player.age,
      stage: this.currentStage
    });
  }
  
  // 设置选择结果信息
  setChoiceResult(choiceText, effects, resultText) {
    // 记录属性变化
    this.attributeChanges = {};
    for (let key in effects) {
      this.attributeChanges[key] = effects[key];
    }
    
    this.lastChoiceResult = {
      choiceText: choiceText,
      effects: effects,
      resultText: resultText || '',
      timestamp: Date.now()
    };
    this.showResultScreen = true;
  }
  
  // 关闭结果显示界面
  hideResultScreen() {
    this.showResultScreen = false;
  }
}
