# 个人作品集网站 — 项目文档

> **最后更新**：2026-03-14
> **当前阶段**：正式上线（GitHub Pages），已完成首页、关于我、跑马灯、作品画廊、导览分割页、移动端适配、无障碍优化与代码健康修复

---

## 1. 项目定位

| 维度 | 决策方案 |
| :--- | :--- |
| **项目用途** | 个人求职作品集 |
| **目标受众** | HR、设计总监、同行设计师 |
| **核心人设** | 拥有优秀 AI 落地能力的运营设计师 |
| **内容占比** | 运营设计 10 项 + 视觉设计 4 项 + 动效设计 1 项（Bento 合集）+ AI 设计（规划中） |
| **开发方式** | 代码自建（HTML/CSS/Vanilla JS），全 Vibe Coding |
| **部署方式** | GitHub Pages，仓库 `BaiPian0302/Baipian-portfolio` |

---

## 2. 设计系统与规范

### 2.1 核心风格
- **iOS 商业化设计**：务实、专业、高质感，强调信息清晰传达。
- **macOS 交互逻辑**：拟物化与系统级交互（Dock 顶部导航、文件夹隐喻、平滑滚动）。

### 2.2 视觉参数

| 属性 | 规范值 |
| :--- | :--- |
| **排版字体** | `Inter` (数字/英文) + `Noto Sans SC` (中文) + `Outfit` (标题) + `Pacifico` (手写标签) |
| **背景基调** | `#f5f5f7` (Apple 浅灰) / 径向渐变点阵背景 |
| **品牌主题色** | `#48dbbd` (青绿色) |
| **文字层级** | 主文 `#1d1d1f` / 辅助 `#86868b` / 弱化 `#ababaf` |
| **桌面端字号体系** | 标题 20px / 正文 15px / 标签 13px / 小标签 12px |
| **移动端字号体系** | 标题 16px / 正文 14px / 标签 12px（480px: 15/13/12） |
| **圆角体系** | Bento 卡片 24px / 通用 12px / 移动端 18px→14px |
| **玻璃拟态** | `backdrop-filter: blur(20px~28px) saturate(1.4~1.6)` |

### 2.3 动画与交互
- **缓动曲线**：`power3.out`（入场）、`cubic-bezier(0.23, 1, 0.32, 1)`（悬停）
- **自定义光标**：默认 16px 黑圆点 / 悬停 28px 青绿半透明圆环 / 触控设备自动隐藏（`matchMedia('(hover: hover)')` 检测）
- **加载骨架屏**：Shimmer 渐变动画，图片/视频加载后 0.4s 淡入

---

## 3. 页面架构

### 3.1 整体拓扑

```text
┌──────────────────────────────────────────────┐
│  Section 1: Landing (首屏, 100dvh)            │
│  └─ 4 个文件夹卡片 (Visual/Motion/AI/Operational) │
│  └─ 玻璃拟态标题 + 液态光效游走                   │
│              ↓ Lenis 平滑滚动                   │
│  Section 2: About (Bento Grid)               │
│  └─ 7 模块卡片 + 工具图标物理堆放动画              │
│              ↓                                │
│  Section 3: Marquee (技能关键词滚动带)           │
│              ↓                                │
│  Section 4: Gallery (垂直滚动作品画廊)           │
│  └─ 左侧 sticky 分类侧边栏                     │
│  └─ 导览标题页分割 + 项目展示 + AI 占位           │
│                                              │
│  [全局] <header> Dock 导航栏 (顶部固定)          │
│  [全局] Contact Modal (ARIA dialog + 焦点陷阱)  │
│  [全局] Custom Cursor (仅桌面端)                │
└──────────────────────────────────────────────┘
```

### 3.2 首页 (Landing)
- 中心 "PORTFOLIO" SVG 标题 + 液态玻璃胶囊动画
- 4 个 macOS 文件夹卡片（Visual / Motion / AI / Operational），点击跳转到对应分类
- 鼠标视差偏移 + 悬停开箱动画（GSAP quickTo）
- CSS 预隐藏所有动画元素（防 FOUC），`<noscript>` 降级

### 3.3 关于我 (About)
- Bento Grid 绝对定位布局（桌面端），≤1280px 切换为 CSS Grid 两列，≤768px 单列
- 移动端通过 CSS `order` 重排卡片顺序：头像 → 简介 → 数据 → 经历1 → 经历2 → 实习 → 工具
- 工具图标：桌面端物理堆放动画 / 移动端切换为 5 列网格（480px 为 3 列）

### 3.4 跑马灯 (Marquee)
- 专业关键词无缝轮播，支持拖拽交互 + 悬停减速

### 3.5 作品画廊 (Gallery)
- **布局**：CSS Grid 两栏（侧边栏 190px + 主区域），垂直滚动
- **侧边栏**：`position: sticky`，手风琴分类折叠（Operational / Visual / Motion / AI）
- **导览页**：每个分类前插入全宽导览标题图（Guide），共 4 张（含 AI 结尾页）
- **项目跟踪**：ScrollTrigger `onEnter`/`onEnterBack` 触发侧边栏高亮、计数器更新、分类自动展开
- **Bento 视频**：动效设计板块以 Bento Grid 形式展示，IntersectionObserver 懒加载 + canplay 触发
- **AI 占位**：Gallery 末尾显示虚线边框占位卡片（"即将更新"）
- **加载优化**：`.project-hero` 加 `min-height: 40vh` 防止懒加载图片高度塌陷导致 trigger 错位

### 3.6 Dock 导航栏
- 顶部固定，品牌 logo + 两组胶囊导航（Homepage/About/Work + Connect/Resume）
- ScrollTrigger 自动高亮当前区域
- Gallery 进入时显示当前项目名悬浮胶囊

---

## 4. 技术选型

| 技术 | 版本 | 用途 |
| :--- | :--- | :--- |
| **HTML5 + CSS3** | — | 语义化结构、CSS 变量、Grid/Flex、`100dvh`、`overflow-x: clip` |
| **Vanilla JS (ES Modules)** | ES2020+ | 模块化架构，零框架依赖 |
| **Lenis** | 1.1.18 | 平滑滚动引擎 |
| **GSAP + ScrollTrigger** | 3.12.5 | 动画引擎、滚动触发 |

> **极简理念**：零构建工具，无 npm，CDN 脚本带 SRI 校验，`<script>` 置于 `</body>` 前

---

## 5. 无障碍与安全

| 项目 | 实现 |
| :--- | :--- |
| **语义化** | `<main>` 包裹内容区，`<h1>`→`<h2>`→`<h3>` 完整层级，`.sr-only` 视觉隐藏 |
| **模态框** | `role="dialog"` + `aria-modal` + `aria-labelledby` + 焦点陷阱 |
| **触控适配** | `matchMedia('(hover: hover) and (pointer: fine)')` 检测，`@media (hover: none)` CSS 降级 |
| **Safe Area** | `env(safe-area-inset-*)` 适配刘海/灵动岛设备 |
| **CDN 安全** | 所有第三方脚本带 `integrity` + `crossorigin="anonymous"` |
| **剪贴板** | `navigator.clipboard` + `execCommand('copy')` 双重降级 |

---

## 6. 项目结构

```text
portfolio/
├── index.html                  # 主页面
├── PROJECT.md                  # 本文档
├── css/
│   ├── style.css               # 主样式表（含响应式 768px/480px 断点）
│   └── gallery.css             # Gallery 侧边栏与布局样式
├── js/
│   ├── main.js                 # 入口，初始化各模块
│   └── modules/
│       ├── core.js             # Lenis/GSAP 初始化、项目数据、工具函数
│       ├── dock.js             # 导航栏交互与高亮
│       ├── gallery.js          # Gallery 渲染、侧边栏、滚动跟踪
│       └── sections.js         # 首页动画、About 动画、联系弹窗、光标
├── assets/
│   ├── images/
│   │   ├── projects/           # 作品图片（按分类子目录）
│   │   ├── Guide/              # 分类导览标题页（4 张 webp）
│   │   ├── tools/              # 工具图标 (icon1~9.png)
│   │   ├── stickers/           # 文件夹贴纸
│   │   └── ui/                 # UI 矢量素材（标题/文件夹/导航 SVG）
│   └── (favicon 待添加)
└── docs/                       # 规划文档（不被网站引用）
    ├── project-copy.md         # 项目文案（中英双语）
    ├── project-03-detail.md    # 圣诞活动详细方案
    ├── project-08-detail.md    # Banner 合集拆解
    ├── resume.md               # 简历内容
    ├── resume-bosszhipin.md    # Boss 直聘版简历
    └── portfolio-intro-hiring-manager.md  # HR 版介绍信
```

---

## 7. 已完成与待办

### ✅ 已完成
- [x] 全站框架与 Lenis 平滑滚动
- [x] 首页 3D 文件夹卡片、开箱动画、视差浮动
- [x] About Bento Grid（桌面精确定位 + 响应式网格降级）
- [x] 工具图标物理堆放动画（移动端切换为网格布局）
- [x] Marquee 轮播带与拖拽交互
- [x] Gallery 垂直滚动画廊 + sticky 侧边栏 + 分类手风琴
- [x] 导览标题页分割（4 张 Guide 图片）
- [x] AI 分类占位（侧边栏 + Gallery 占位卡片）
- [x] Bento 视频布局（动效设计合集，IntersectionObserver 懒加载）
- [x] 全局自定义光标（桌面端）
- [x] Dock 顶部导航 + 区域高亮 + 当前项目悬浮胶囊
- [x] 联系弹窗（ARIA + 焦点陷阱 + 剪贴板双重降级）
- [x] 移动端适配（768px / 480px 双断点 + safe-area + dvh）
- [x] Shimmer 骨架屏加载 + 图片/视频淡入
- [x] FOUC 修复（CSS 预隐藏 + noscript 降级）
- [x] 代码健康修复（SRI、`:has()` 兼容、`overflow-x: clip` 降级、通配符优化）
- [x] 无障碍（`<main>`、标题层级、ARIA dialog、触控检测）
- [x] 项目文案文档（中英双语，含四章节介绍）
- [x] GitHub Pages 部署

### 🔄 待推进
- [ ] **Favicon**：设计并添加 `favicon.svg` / `favicon.ico`
- [ ] **AI 分类内容**：填充 AI 设计项目（替换占位卡片）
- [ ] **资产优化**：WebP 深度压缩、图片尺寸属性（防布局偏移）
- [ ] **项目详情页**：将 `docs/project-copy.md` 中的文案接入网站展示
- [ ] **性能监控**：Lighthouse 评分优化、Core Web Vitals 达标
- [ ] **自定义域名**：绑定个人域名
