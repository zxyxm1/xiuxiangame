# 🎮 天道来了个修仙公司

一个充满恶搞和创意的修仙文字冒险游戏

[![GitHub](https://img.shields.io/badge/GitHub-zxyxm1-blue)](https://github.com/zxyxm1/xiuxiangame)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📖 游戏简介

这是一个**纯文字修仙题材**的Web游戏,玩家在一个充满"社畜"元素的修仙世界中冒险。根据当前事件选择不同的选项,触发属性变化,经历不同的人生轨迹,最终达成各种奇葩结局!

### ✨ 游戏特色

- 🎨 **精美UI设计** - 透明玻璃材质面板,金色边框,视觉效果极佳
- 🎵 **背景音乐** - 沉浸式游戏体验,支持音乐开关控制
- 📱 **移动端适配** - 完美支持手机游玩,适配2K高分辨率屏幕
- 🎭 **恶搞剧情** - "内卷峰"、"拼多多仙盟"、"躺平谷"等沙雕设定
- 🎯 **多结局分支** - 卷王、咸鱼、暴富等多种结局等你探索

---

## 🚀 快速开始

### 在线游玩

直接访问: [游戏链接](https://zxyxm1.github.io/xiuxiangame/) *(需配置GitHub Pages)*

### 本地运行

1. **克隆仓库**
```bash
git clone https://github.com/zxyxm1/xiuxiangame.git
cd xiuxiangame
```

2. **启动本地服务器**
```bash
npm install
npm start
```

3. **打开浏览器访问**
```
http://localhost:8080
```

> 💡 提示: 也可以使用任意HTTP服务器(如`python -m http.server`)打开`index.html`

---

## 🎮 游戏玩法

### 核心机制

1. **事件驱动** - 每个事件提供多个选择
2. **属性系统** - 选择会影响修为、寿元、社恐值等属性
3. **阶段推进** - 从凡人少年到飞升成仙
4. **多重结局** - 根据你的选择达成不同结局

### 特色属性

- 💪 **修为** - 你的修炼进度
- ❤️ **寿元** - 生命值,归零即游戏结束
- 😰 **社恐值** - 影响社交事件触发
- 🐟 **摸鱼熟练度** - 影响躲懒成功率
- ✨ **凡尔赛指数** - 影响NPC嫉妒度

---

## 🌍 世界观设定

### 三大势力

#### 🏔️ 内卷峰 (原:凌霄剑宗)
- **宗训**: "今日不修,明日被修!"
- 弟子每天打卡炼气12时辰
- 迟到一次扣10年寿元
- **禁地**: 摸鱼池(上古大能躺平遗址)

#### 🛒 拼多多仙盟 (原:万宝阁)
- **口号**: "三人成团,法宝对折!"
- 买功法必须拉好友入伙
- **镇派神功**: 《砍一刀诀》(伤害随机×0.1~10倍)

#### 🌙 躺平谷 (原:无为道宫)
- 表面清静无为,实则全员"躺赚"高手
- **核心业务**: 出租元神当WiFi热点
- 一灵石/小时,包月送雷劫防护罩

### 修炼境界

```
炼气期 → 筑基期 → 金丹期 → 元婴期 → 摸鱼期 → 带薪闭关期 → 飞升(试用期)
```

---

## 🎯 结局一览

- 🏆 **卷王结局** - 飞升成功,成为天道HR
- 🐟 **咸鱼结局** - 在躺平谷开"修仙养老院"
- 💰 **暴富结局** - 靠倒卖防护罩成为仙界首富
- 💀 **Game Over** - 寿元耗尽,轮回转世

---

## 🛠️ 技术栈

- **前端**: 原生JavaScript + Canvas API
- **架构**: ES6 Module
- **样式**: CSS3 (透明玻璃材质设计)
- **音频**: Web Audio API
- **适配**: Device Pixel Ratio (DPR) 高分屏支持

---

## 📂 项目结构

```
xiuxiangame/
├── index.html          # 主页面
├── style.css           # 样式文件
├── js/
│   ├── main.js         # 游戏主逻辑
│   ├── render.js       # 渲染引擎
│   ├── databus.js      # 数据总线
│   └── runtime/        # 运行时模块
│       ├── gameinfo.js    # UI渲染
│       ├── eventSystem.js # 事件系统
│       └── eventData.js   # 事件数据
├── audio/              # 音频资源
├── images/             # 图片资源
└── README.md           # 项目说明
```

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request!

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

---

## 📜 开源协议

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 👤 作者

**zxyxm1**

- GitHub: [@zxyxm1](https://github.com/zxyxm1)
- 仓库: [xiuxiangame](https://github.com/zxyxm1/xiuxiangame)

---

## ⭐ 支持项目

如果你觉得这个项目有趣,请给个Star ⭐ 支持一下!

---

## 📝 更新日志

### v1.0.0 (2025-12-28)

- ✅ 完整的修仙文字冒险游戏
- ✅ 精美UI设计(透明面板+金色边框)
- ✅ 背景图片和背景音乐
- ✅ 移动端完美适配
- ✅ 音乐开关控制
- ✅ 高分辨率屏幕支持

---

**祝你修仙愉快! 🚀**
