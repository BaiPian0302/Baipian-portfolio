# 个人作品集网站协作规则

## 项目定位
- 这是个人求职作品集网站，核心受众是 HR、设计总监、同行设计师。
- 核心人设是「拥有优秀 AI 落地能力的运营设计师」。
- 网站应优先服务作品展示、招聘转化和专业可信度，不做炫技优先的复杂工程化改造。

## 技术边界
- 保持零构建工具：`HTML5 + CSS3 + Vanilla JS ES Modules`。
- 不引入 npm、打包器、框架迁移或复杂脚手架，除非先更新本文件并获得确认。
- 第三方运行库继续使用 CDN，并保留 `integrity` 与 `crossorigin="anonymous"`。
- 主要依赖为 `Lenis`、`GSAP`、`ScrollTrigger`，交互变更应沿用现有模块组织。

## 目录结构
- `index.html`：主页面结构，只放全站主体 DOM、CDN 引用和入口脚本。
- `css/style.css`：主视觉、响应式、动效和组件样式。
- `css/gallery.css`：Gallery 侧边栏与画廊布局相关样式。
- `js/main.js`：入口初始化，不堆业务逻辑。
- `js/modules/core.js`：全局依赖初始化、项目数据、常量和通用工具函数。
- `js/modules/dock.js`：顶部 Dock 导航、区域高亮、简历下载等导航行为。
- `js/modules/gallery.js`：作品画廊渲染、分类侧栏、滚动追踪和视频懒加载。
- `js/modules/sections.js`：Landing、About、Marquee、弹窗、自定义光标等页面段落交互。
- `assets/images/projects/`：作品图片，按分类子目录存放。
- `assets/images/Guide/`：分类导览标题图。
- `assets/images/ui/`：导航、标题、文件夹等 UI 矢量素材。
- `assets/images/tools/`：工具图标，维持 `icon1.png` 这类连续命名。
- `projects/`：AI 设计交互 Demo 独立页面。
- `docs/`：规划、文案、简历等文档，不作为网站运行入口。

## 命名规则
- 代码文件、CSS 类名、JS 变量使用英文。
- 作品素材可保留中文文件名，但路径必须与代码引用完全一致。
- 新增图片优先使用 `.webp`；UI 矢量优先使用 `.svg`。
- AI Demo 独立页文件使用 kebab-case，例如 `glitch-converter.html`。
- 不新增临时文件、导出残片、压缩包或无引用素材；需要保留过程文件时放入 `docs/` 并说明用途。

## 视觉规范
- 保持 iOS 商业化设计与 macOS 交互隐喻：玻璃拟态、Dock、文件夹、平滑滚动。
- 基础背景为 `#f5f5f7`，品牌主题色为 `#48dbbd`。
- 文字层级沿用：主文 `#1d1d1f`，辅助 `#86868b`，弱化 `#ababaf`。
- 圆角体系沿用：Bento 卡片 `24px`，通用 `12px`，移动端按现有断点降级。
- 玻璃拟态优先使用 `backdrop-filter: blur(20px~28px) saturate(1.4~1.6)` 的既有质感。
- 汇报视觉改动时必须同时说明感官变化和具体数值，例如「卡片更有呼吸感，`.about-card` 的 `padding` 从 `20px` 调到 `24px`」。

## 交互规范
- 滚动相关交互统一接入 `Lenis` 与 `ScrollTrigger`，不要混用零散 `scroll` 逻辑。
- Gallery 的项目数据优先在 `js/modules/core.js` 维护，渲染逻辑放在 `js/modules/gallery.js`。
- 触控设备必须有降级方案，沿用 `matchMedia('(hover: hover) and (pointer: fine)')` 和相关 CSS 媒体查询。
- 动画应兼顾加载稳定性，新增图片或视频必须避免造成明显布局跳动。
- 模态框、按钮、链接等交互必须保留键盘可用性和基本 ARIA 语义。

## 内容规则
- 作品集表达优先清晰、可信、可招聘转化，不堆术语。
- 项目标题、标签、描述应保持中英混合的现有风格。
- 简历、联系方式、作品描述变更需要同时检查页面展示和 `docs/` 中对应文档是否需要同步。
- `PROJECT.md` 是项目说明文档；结构、技术选型、待办变化较大时要同步更新。

## 修改纪律
- 修改前先确认当前工作区状态，避免覆盖已有未提交改动。
- 禁止删除文件、目录或 Git 历史，除非用户明确确认。
- 禁止修改 `.env`、密钥、token、CI/CD 配置或生产发布流程，除非用户明确确认。
- 不执行 `git push`、`git rebase`、`git reset --hard`、强制推送或公开发布。
- 不为了绕过报错注释掉功能代码，应定位根因并修复。

## 本地预览与验证
- 本地预览优先在项目根目录运行：`python -m http.server 5500 --bind 127.0.0.1`。
- 预览地址为：`http://127.0.0.1:5500/`。
- 修改后至少检查首页、About、Gallery、Contact Modal、Resume 下载入口和 3 个 `projects/` 独立 Demo 链接。
- 资源变更后检查是否存在缺失引用，重点包括 favicon、作品封面、视频、Demo 内部图片。
- 视觉类修改需要在桌面端、`768px`、`480px` 三个宽度检查布局和视觉重量。

## 当前已知待办
- 添加 `favicon.svg` 与 `favicon.ico`。
- 补齐 AI 分类 3 个交互 Demo 的封面截图。
- 检查并补齐 `projects/chronos.html` 引用的本地图片资源。
- 后续做资产压缩、图片尺寸属性、Lighthouse 与 Core Web Vitals 优化。
