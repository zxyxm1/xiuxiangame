/**
 * 事件系统
 * 管理游戏事件流程、选项处理、属性变化等
 */

// 导入事件数据
import { eventData } from './eventData.js';

export default class EventSystem {
  constructor(databus) {
    this.databus = databus;
    this.lastEventId = null; // 记录上一个事件ID，避免立即重复
  }

  /**
   * 根据当前阶段和条件获取随机事件
   */
  getRandomEvent() {
    const stage = this.databus.currentStage;
    const player = this.databus.player;
      
    // 获取当前阶段的事件列表（排除开场事件）
    const stageEvents = eventData.filter(event => {
      // 排除开场事件
      if (event.stage === -1) return false;
        
      // 检查阶段匹配
      if (event.stage !== stage) return false;
        
      // 检查条件（如果有）
      if (event.condition) {
        return this.checkCondition(event.condition, player);
      }
        
      return true;
    });
      
    // 过滤掉已经触发过的事件
    const availableEvents = stageEvents.filter(event => {
      return !this.databus.eventHistory.some(recordedEvent => recordedEvent.id === event.id);
    });
      
    // 如果没有未触发的事件，则优先尝试下一阶段的事件，否则使用默认事件
    if (availableEvents.length > 0) {
      // 进一步过滤掉上一个事件（额外保护）
      const filteredEvents = availableEvents.filter(event => event.id !== this.lastEventId);
      const eventsToUse = filteredEvents.length > 0 ? filteredEvents : availableEvents;
      
      const randomIndex = Math.floor(Math.random() * eventsToUse.length);
      const selectedEvent = eventsToUse[randomIndex];
      this.lastEventId = selectedEvent.id;
      return selectedEvent;
    }
    
    // 如果当前阶段没有可用事件，尝试下一阶段
    const nextStage = this.databus.currentStage + 1;
    if (nextStage < this.databus.stageNames.length) {
      // 检查下一阶段是否有事件
      const nextStageEvents = eventData.filter(event => {
        if (event.stage === -1 || event.stage !== nextStage) return false;
        if (event.condition) {
          return this.checkCondition(event.condition, player);
        }
        return true;
      });
      
      if (nextStageEvents.length > 0) {
        // 过滤掉上一个事件（额外保护）
        const filteredNextStageEvents = nextStageEvents.filter(event => event.id !== this.lastEventId);
        const eventsToUse = filteredNextStageEvents.length > 0 ? filteredNextStageEvents : nextStageEvents;
        
        const randomIndex = Math.floor(Math.random() * eventsToUse.length);
        const selectedEvent = eventsToUse[randomIndex];
        this.lastEventId = selectedEvent.id;
        return selectedEvent;
      }
    }
    
    // 如果没有其他选择，使用默认事件
    // 随机选择一个事件
    if (stageEvents.length > 0) {
      // 过滤掉上一个事件（额外保护）
      const filteredEvents = stageEvents.filter(event => event.id !== this.lastEventId);
      const eventsToUse = filteredEvents.length > 0 ? filteredEvents : stageEvents;
      
      const randomIndex = Math.floor(Math.random() * eventsToUse.length);
      const selectedEvent = eventsToUse[randomIndex];
      this.lastEventId = selectedEvent.id;
      return selectedEvent;
    }
      
    // 如果没有找到事件，返回默认事件
    return this.getDefaultEvent(stage);
  }

  /**
   * 检查事件条件是否满足
   */
  checkCondition(condition, player) {
    for (let key in condition) {
      if (key === 'minAge' && player.age < condition[key]) return false;
      if (key === 'maxAge' && player.age > condition[key]) return false;
      if (key === 'sect' && player.sect !== condition[key]) return false;
      if (key === 'minRealm' && player.realmLevel < condition[key]) return false;
      if (key === 'minFishingSkill' && player.fishingSkill < condition[key]) return false;
    }
    return true;
  }

  /**
   * 处理选项选择
   */
  handleChoice(event, choiceIndex) {
    if (!event || !event.choices || choiceIndex >= event.choices.length) {
      return;
    }
    
    const choice = event.choices[choiceIndex];
    
    // 设置选择结果信息（包含结果文案）
    const resultText = choice.result || '';
    if (choice.effects) {
      this.databus.setChoiceResult(choice.text, choice.effects, resultText);
      
      // 应用属性变化
      this.applyEffects(choice.effects);
    } else {
      this.databus.setChoiceResult(choice.text, {}, resultText);
    }
    
    // 记录事件
    this.databus.recordEvent(event.id);
    
    // 记录当前事件ID作为上一个事件，防止立即重复
    this.lastEventId = event.id;
    
    // 检查是否触发结局
    if (choice.ending) {
      // 如果是结局，直接结束游戏，不显示结果画面
      this.databus.showResultScreen = false;
      this.databus.gameOver(choice.ending);
      return;
    }
    
    // 不立即加载下一个事件，等待玩家点击继续
    // 下一个事件由loadNextEvent()加载
  }
  
  /**
   * 加载下一个事件（玩家点击继续后调用）
   */
  loadNextEvent() {
    const nextEvent = this.getRandomEvent();
    this.databus.currentEvent = nextEvent;
    
    // 确保lastEventId被更新为当前加载的事件
    if (nextEvent) {
      this.lastEventId = nextEvent.id;
    }
  }

  /**
   * 应用效果（属性变化）
   */
  applyEffects(effects) {
    for (let key in effects) {
      if (key === 'age') {
        this.databus.ageGrow(effects[key]);
      } else {
        this.databus.updatePlayerAttr(key, effects[key]);
      }
    }
  }

  /**
   * 获取默认事件（当没有合适事件时）
   */
  getDefaultEvent(stage) {
    const defaultEvents = {
      0: {
        id: 'default_0',
        title: '平凡的一天',
        description: '你度过了平凡的一天，时光流逝...',
        choices: [
          {
            text: '继续',
            effects: { age: 1 }
          }
        ]
      },
      1: {
        id: 'default_1',
        title: '日常修炼',
        description: '你在宗门中努力修炼，感觉修为略有精进。',
        choices: [
          {
            text: '继续修炼',
            effects: { age: 1, cultivation: 10 }
          }
        ]
      },
      2: {
        id: 'default_2',
        title: '历练',
        description: '你外出历练，见识了修仙界的广阔天地。',
        choices: [
          {
            text: '继续',
            effects: { age: 5, cultivation: 20 }
          }
        ]
      },
      3: {
        id: 'default_3',
        title: '闭关修炼',
        description: '你选择闭关修炼，感悟天道。',
        choices: [
          {
            text: '出关',
            effects: { age: 10, cultivation: 50 }
          }
        ]
      },
      4: {
        id: 'default_4',
        title: '准备渡劫',
        description: '你感觉雷劫将至，需要做好准备。',
        choices: [
          {
            text: '继续准备',
            effects: { age: 20, cultivation: 100 }
          }
        ]
      },
      5: {
        id: 'default_5',
        title: '最终选择',
        description: '你的修仙之路即将画上句号...',
        choices: [
          {
            text: '接受命运',
            effects: { age: 50 },
            ending: '平凡结局：你在岁月中慢慢老去，最终化作一抔黄土。'
          }
        ]
      }
    };
    
    return defaultEvents[stage] || defaultEvents[0];
  }

  /**
   * 初始化游戏，获取第一个事件（固定开场事件）
   */
  startGame() {
    // 首先显示固定开场事件
    const openingEvent = eventData.find(event => event.id === 'opening_event');
    if (openingEvent) {
      this.databus.currentEvent = openingEvent;
      return openingEvent;
    }
    
    // 如果没有开场事件，则随机获取
    const firstEvent = this.getRandomEvent();
    this.databus.currentEvent = firstEvent;
    return firstEvent;
  }
}
