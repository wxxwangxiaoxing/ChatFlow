---
version: alpha
name: ChatFlow-Web-User-Design-System
description: "ChatFlow 用户端 Web 的设计系统。企业协作风：以 ChatFlow Blue (#0B6BCB) 为唯一品牌色，冷中性灰阶承载 90% 的信息层级，克制的 4px 间距体系与 12px 气泡圆角。浅色为默认主题，深色 token 同步定义。信息密度偏高，为长时间办公阅读与多人群聊场景优化。"

scope: 用户端 Web（桌面浏览器 1280px 起）。管理后台与移动端另行定义，但共用基础层 token。

colors:
  # ---- 品牌主色 ----
  blue-50:  "#EBF4FE"
  blue-100: "#D3E7FC"
  blue-200: "#A8CFF8"
  blue-300: "#74B0F2"
  blue-400: "#3D8EE8"
  blue-500: "#0B6BCB"   # 品牌主色
  blue-600: "#0A5CAE"
  blue-700: "#094C8F"
  blue-800: "#083C71"
  blue-900: "#062B51"

  # ---- 中性灰阶（冷中性） ----
  gray-0:   "#FFFFFF"
  gray-25:  "#FCFCFD"
  gray-50:  "#F8F9FB"
  gray-100: "#F1F3F7"
  gray-200: "#E4E7EC"
  gray-300: "#D0D5DD"
  gray-400: "#98A2B3"
  gray-500: "#667085"
  gray-600: "#475467"
  gray-700: "#344054"
  gray-800: "#1D2939"
  gray-900: "#101828"

  # ---- 语义色：indicator 用于点/条/底色，text 用于文字（已校验对比度） ----
  success-indicator: "#12B76A"
  success-text:      "#027A48"
  success-surface:   "#ECFDF3"
  warning-indicator: "#F79009"
  warning-text:      "#B54708"
  warning-surface:   "#FFFAEB"
  danger-indicator:  "#F04438"
  danger-text:       "#B42318"
  danger-surface:    "#FEF3F2"
  attention:         "#F04438"   # 未读红点、@我 —— IM 关键注意力色

  # ---- 语义角色（浅色主题，组件只引用这一层） ----
  canvas:        "{colors.gray-50}"
  surface-1:     "{colors.gray-0}"
  surface-2:     "{colors.gray-100}"
  surface-3:     "{colors.gray-200}"
  surface-inverse: "{colors.gray-900}"
  hairline:      "{colors.gray-200}"
  hairline-strong: "{colors.gray-300}"
  text-primary:  "{colors.gray-900}"
  text-secondary: "{colors.gray-600}"
  text-tertiary: "{colors.gray-500}"
  text-disabled: "{colors.gray-400}"
  text-on-brand: "{colors.gray-0}"
  primary:       "{colors.blue-500}"
  primary-hover: "{colors.blue-600}"
  primary-active: "{colors.blue-700}"
  primary-subtle: "{colors.blue-50}"
  focus-ring:    "rgba(11,107,203,0.28)"

  # ---- IM 专有语义（浅色） ----
  bubble-self-bg:   "{colors.blue-500}"
  bubble-self-text: "{colors.gray-0}"
  bubble-other-bg:  "{colors.gray-0}"
  bubble-other-text: "{colors.gray-900}"
  bubble-system-text: "{colors.gray-500}"
  bubble-quote-bg:  "{colors.blue-50}"
  conv-item-hover:  "{colors.gray-100}"
  conv-item-active: "{colors.blue-50}"
  presence-online:  "{colors.success-indicator}"

  # ---- 深色主题覆盖 ----
  dark-canvas:        "#0C111D"
  dark-surface-1:     "#161B26"
  dark-surface-2:     "#1F242F"
  dark-surface-3:     "#2A303C"
  dark-hairline:      "#2A303C"
  dark-text-primary:  "#F5F6F7"
  dark-text-secondary: "#98A2B3"
  dark-text-tertiary: "#667085"
  dark-primary:       "{colors.blue-400}"
  dark-bubble-self-bg: "#0A5CAE"
  dark-bubble-other-bg: "#1F242F"

typography:
  fontFamilySans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'Source Han Sans SC', sans-serif"
  fontFamilyMono: "'JetBrains Mono', SFMono-Regular, Consolas, 'Liberation Mono', monospace"

  display:  { fontSize: 28px, fontWeight: 500, lineHeight: 1.25, letterSpacing: -0.02em }
  h1:       { fontSize: 20px, fontWeight: 600, lineHeight: 1.4,  letterSpacing: 0 }
  h2:       { fontSize: 16px, fontWeight: 600, lineHeight: 1.5,  letterSpacing: 0 }
  h3:       { fontSize: 14px, fontWeight: 600, lineHeight: 1.5,  letterSpacing: 0 }
  body:     { fontSize: 14px, fontWeight: 400, lineHeight: 1.6,  letterSpacing: 0 }
  body-sm:  { fontSize: 13px, fontWeight: 400, lineHeight: 1.55, letterSpacing: 0 }
  caption:  { fontSize: 12px, fontWeight: 400, lineHeight: 1.5,  letterSpacing: 0 }
  micro:    { fontSize: 11px, fontWeight: 400, lineHeight: 1.4,  letterSpacing: 0 }
  button:   { fontSize: 14px, fontWeight: 500, lineHeight: 1.0,  letterSpacing: 0 }
  code:     { fontSize: 13px, fontWeight: 400, lineHeight: 1.5,  letterSpacing: 0 }

rounded:
  none: 0
  xs:   4px
  sm:   6px
  md:   8px
  lg:   12px
  xl:   16px
  xxl:  20px
  pill: 999px
  bubble: 12px
  bubble-tail: 4px

spacing:
  0: 0
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px

shadow:
  xs: "0 1px 2px rgba(16,24,40,0.05)"
  sm: "0 1px 3px rgba(16,24,40,0.08), 0 1px 2px rgba(16,24,40,0.04)"
  md: "0 4px 8px -2px rgba(16,24,40,0.08), 0 2px 4px -2px rgba(16,24,40,0.04)"
  lg: "0 12px 16px -4px rgba(16,24,40,0.08), 0 4px 6px -2px rgba(16,24,40,0.03)"
  xl: "0 20px 24px -4px rgba(16,24,40,0.08), 0 8px 8px -4px rgba(16,24,40,0.03)"
  overlay: "0 24px 48px -12px rgba(16,24,40,0.18)"

zIndex:
  base: 0
  sticky: 100
  dropdown: 200
  overlay: 300
  dragOverlay: 350
  modal: 400
  toast: 500
  tooltip: 600

motion:
  duration: { instant: 100ms, fast: 150ms, base: 200ms, slow: 300ms, slower: 400ms }
  easing:
    standard:   "cubic-bezier(0.2, 0, 0, 1)"
    decelerate: "cubic-bezier(0, 0, 0.2, 1)"
    accelerate: "cubic-bezier(0.4, 0, 1, 1)"
    emphasized: "cubic-bezier(0.05, 0.7, 0.1, 1)"

components:
  button-primary:      { backgroundColor: "{colors.primary}", textColor: "{colors.text-on-brand}", typography: "{typography.button}", rounded: "{rounded.sm}", padding: "0 16px", height: 32px }
  button-primary-hover: { backgroundColor: "{colors.primary-hover}" }
  button-primary-active: { backgroundColor: "{colors.primary-active}" }
  button-secondary:    { backgroundColor: "{colors.surface-1}", textColor: "{colors.text-primary}", border: "1px solid {colors.hairline-strong}", rounded: "{rounded.sm}", padding: "0 16px", height: 32px }
  button-ghost:        { backgroundColor: "transparent", textColor: "{colors.text-secondary}", rounded: "{rounded.sm}", padding: "0 12px", height: 32px }
  button-danger:       { backgroundColor: "{colors.danger-indicator}", textColor: "{colors.gray-0}", rounded: "{rounded.sm}", padding: "0 16px", height: 32px }
  button-icon:         { backgroundColor: "transparent", textColor: "{colors.text-secondary}", rounded: "{rounded.sm}", size: 32px, hitArea: 40px }
  message-bubble-self:  { backgroundColor: "{colors.bubble-self-bg}", textColor: "{colors.bubble-self-text}", rounded: "12px 12px 4px 12px", padding: "8px 12px", maxWidth: 520px }
  message-bubble-other: { backgroundColor: "{colors.bubble-other-bg}", textColor: "{colors.bubble-other-text}", border: "1px solid {colors.hairline}", rounded: "12px 12px 12px 4px", padding: "8px 12px", maxWidth: 520px }
  message-bubble-system: { backgroundColor: "transparent", textColor: "{colors.bubble-system-text}", typography: "{typography.caption}", padding: "4px 8px" }
  conversation-item:   { backgroundColor: "transparent", textColor: "{colors.text-primary}", rounded: "{rounded.md}", padding: "10px 12px", height: 64px }
  conversation-item-hover:  { backgroundColor: "{colors.conv-item-hover}" }
  conversation-item-active: { backgroundColor: "{colors.conv-item-active}" }
  chat-input:          { backgroundColor: "{colors.surface-1}", textColor: "{colors.text-primary}", border: "1px solid {colors.hairline}", rounded: "{rounded.lg}", padding: "10px 12px" }
  chat-input-focused:  { border: "1px solid {colors.primary}", boxShadow: "0 0 0 3px {colors.focus-ring}" }
  avatar:              { rounded: "{rounded.pill}", sizes: "24px | 32px | 40px | 48px" }
  badge-unread:        { backgroundColor: "{colors.attention}", textColor: "{colors.gray-0}", typography: "{typography.micro}", rounded: "{rounded.pill}", minWidth: 18px, height: 18px, padding: "0 5px" }
  modal:               { backgroundColor: "{colors.surface-1}", rounded: "{rounded.lg}", boxShadow: "{shadow.xl}", padding: "{spacing.6}" }
  overlay-scrim:       { backgroundColor: "rgba(16,24,40,0.45)" }
  toast:               { backgroundColor: "{colors.surface-inverse}", textColor: "{colors.gray-0}", rounded: "{rounded.md}", boxShadow: "{shadow.lg}", padding: "10px 14px" }
  tooltip:             { backgroundColor: "{colors.surface-inverse}", textColor: "{colors.gray-0}", typography: "{typography.caption}", rounded: "{rounded.xs}", padding: "6px 8px" }
  skeleton:            { backgroundColor: "{colors.surface-2}", rounded: "{rounded.xs}" }
---

# ChatFlow 用户端 Web — 设计系统

> **适用范围**：ChatFlow 用户端 Web（桌面浏览器，1280px 起）。管理后台与移动端另行定义，但**共用基础层 token**（色彩 / 字体 / 间距 / 圆角 / 阴影 / 动效）。
> **技术基线**：CSS 变量 + 原生 CSS；若用 Tailwind，须通过 `theme.extend` 映射本文 token，禁止直接写裸值。

---

## 1. 视觉主题与氛围（Visual Theme & Atmosphere）

ChatFlow 是一个**企业协作工具**，不是消费级社交产品。用户每天在这里待 6–8 小时，处理工作沟通、文件、审批与通知。设计的第一目标不是"好看"，而是**让人长时间盯着不累、信息一眼可辨、操作不用思考**。

### 核心视觉特征

| 关键词 | 含义 |
|---|---|
| **克制** | 唯一品牌色只出现在"当前状态"与"主要操作"上；其余 90% 的信息层级由冷中性灰阶承担 |
| **高密度** | 会话列表项 64px、消息行高 1.6、面板内边距 16px —— 比营销站紧一档，为的是同屏容纳更多信息 |
| **可辨识** | 未读、@我、在线、发送中/失败 这些状态必须有明确的视觉出口，且互不混淆 |
| **零装饰** | 无渐变、无插画、无装饰性阴影。层次靠"表面色差 + 1px 描边"表达 |

### 光影与质感倾向

- **纯扁平 + 极轻阴影**。默认零阴影；只有真正"浮起来"的元素（弹窗、下拉、Toast）才用 `shadow.lg` 以上。
- 不使用毛玻璃（`backdrop-filter`）作为常规表面 —— 仅允许用于模态遮罩，且必须提供不支持的降级为纯色遮罩。
- 层次表达优先级：**表面色差 > 1px 描边 > 阴影**。能用背景色区分就不要加边框，能用边框就不要加阴影。

### 品牌色决策

主色选 **ChatFlow Blue `#0B6BCB`**（azure，色相 210°）：

- 对白底对比度 **5.27:1**，满足 WCAG AA 正文要求，可直接用于文字与白字反底。
- 避开消费级 IM 惯用的高饱和亮蓝，偏深一档，与"企业工具"的克制调性一致。
- 蓝 + 冷中性灰的组合在长时间阅读下疲劳度低于暖色调，也便于与红/黄/绿语义色区分。

---

## 2. 调色板与角色（Color Palette & Roles）

### 2.1 品牌主色 — ChatFlow Blue

| Token | HEX | 用途 |
|---|---|---|
| `--cf-blue-50` | `#EBF4FE` | 选中态底色、引用块背景 |
| `--cf-blue-100` | `#D3E7FC` | 悬停态加深、标签底 |
| `--cf-blue-200` | `#A8CFF8` | 深色主题下的次强调 |
| `--cf-blue-300` | `#74B0F2` | 深色主题下的描边 |
| `--cf-blue-400` | `#3D8EE8` | **深色主题主色**（对深底 5.60:1） |
| `--cf-blue-500` | `#0B6BCB` | **品牌主色**：主按钮、自己气泡、选中态、链接 |
| `--cf-blue-600` | `#0A5CAE` | 主按钮 hover |
| `--cf-blue-700` | `#094C8F` | 主按钮 active / 深色主题自己气泡 |
| `--cf-blue-800` | `#083C71` | 深色主题按下态 |
| `--cf-blue-900` | `#062B51` | 深色主题深底 |

### 2.2 中性灰阶（冷中性）

| Token | HEX | 用途 |
|---|---|---|
| `--cf-gray-0` | `#FFFFFF` | 卡片、消息区、对方气泡 |
| `--cf-gray-25` | `#FCFCFD` | 极轻分隔底 |
| `--cf-gray-50` | `#F8F9FB` | **页面画布**（应用背景） |
| `--cf-gray-100` | `#F1F3F7` | 悬停态、次级面板、代码块底 |
| `--cf-gray-200` | `#E4E7EC` | 默认描边（hairline） |
| `--cf-gray-300` | `#D0D5DD` | 强描边、输入框描边 |
| `--cf-gray-400` | `#98A2B3` | 禁用文字、占位符 |
| `--cf-gray-500` | `#667085` | 三级文字（时间戳、辅助说明） |
| `--cf-gray-600` | `#475467` | 二级文字 |
| `--cf-gray-700` | `#344054` | 深色主题描边 |
| `--cf-gray-800` | `#1D2939` | 深色主题次级面板 |
| `--cf-gray-900` | `#101828` | 一级文字、反色表面 |

### 2.3 语义色（关键：indicator 与 text 分离）

**这是本系统最重要的一条色彩规则。** 高饱和语义色在白底上达不到 4.5:1，因此**必须区分"指示色"和"文字色"**，不得混用。

| 语义 | indicator（点/条/底色） | text（文字，已校验） | surface（背景） | 对比度 |
|---|---|---|---|---|
| 成功 | `#12B76A` | `#027A48` | `#ECFDF3` | 5.41:1 |
| 警告 | `#F79009` | `#B54708` | `#FFFAEB` | 5.02:1 |
| 危险 | `#F04438` | `#B42318` | `#FEF3F2` | 6.57:1 |
| 信息 | `#0B6BCB` | `#0B6BCB` | `#EBF4FE` | 5.27:1 |

> ⚠️ **禁止**把 `#F04438` / `#F79009` / `#12B76A` 用作正文颜色 —— 它们的对比度只有 2.3–3.8:1。它们只能用于 ≥18px 的大字、图形指示点或色块。

### 2.4 IM 专有语义色

| Token（浅色） | 值 | 用途 |
|---|---|---|
| `--cf-bubble-self-bg` | `#0B6BCB` | 自己发送的消息气泡 |
| `--cf-bubble-other-bg` | `#FFFFFF` | 对方消息气泡（配 1px `--cf-hairline`） |
| `--cf-bubble-quote-bg` | `#EBF4FE` | 引用/回复块 |
| `--cf-conv-item-hover` | `#F1F3F7` | 会话列表项悬停 |
| `--cf-conv-item-active` | `#EBF4FE` | 会话列表项选中 |
| `--cf-attention` | `#F04438` | **未读红点、@我标记** —— 全系统唯一的"注意力红" |
| `--cf-presence-online` | `#12B76A` | 在线状态点 |

> `--cf-attention` 与 `danger` 同为红色系但**语义不同**：attention 表示"有新内容"，danger 表示"出错了/危险操作"。同一个视图里二者不应同时出现；若必须共存，attention 用红点、danger 用文字，不得都用红底。

### 2.5 深色主题覆盖

深色主题**不新增色彩**，只覆盖语义角色值。切换方式：`<html data-theme="dark">`。

| 角色 | 浅色 | 深色 |
|---|---|---|
| canvas | `#F8F9FB` | `#0C111D` |
| surface-1 | `#FFFFFF` | `#161B26` |
| surface-2 | `#F1F3F7` | `#1F242F` |
| surface-3 | `#E4E7EC` | `#2A303C` |
| hairline | `#E4E7EC` | `#2A303C` |
| text-primary | `#101828` | `#F5F6F7` |
| text-secondary | `#475467` | `#98A2B3` |
| text-tertiary | `#667085` | `#667085` |
| primary | `#0B6BCB` | `#3D8EE8` |
| bubble-self-bg | `#0B6BCB` | `#0A5CAE` |
| bubble-other-bg | `#FFFFFF` | `#1F242F` |

**深色主题硬性约束**

1. 深色下**不用纯黑**（`#000000`）作画布 —— 纯黑 + 白字的边缘光晕会加剧疲劳，用 `#0C111D`。
2. 深色下**不叠加阴影**（阴影在深底上不可见），改用 `1px` 亮色描边（`#2A303C`）表达层次。
3. 深色下图片、头像、代码块必须加 `1px rgba(255,255,255,0.08)` 描边，否则边界消失。

---

## 3. 排版规则（Typography Rules）

### 3.1 字体族

```css
--cf-font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI",
                "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
                "Noto Sans SC", "Source Han Sans SC", sans-serif;
--cf-font-mono: "JetBrains Mono", SFMono-Regular, Consolas,
                "Liberation Mono", monospace;
```

**字体栈顺序是刻意的**：Inter 排在中文之前，负责拉丁字母与数字（Inter 的数字形态更规整）；中文由 PingFang SC（macOS/iOS）→ Microsoft YaHei（Windows）→ Noto Sans SC（Linux/Android）逐级回退。**不要为了"统一"把中文字体提到 Inter 前面** —— 那会让英文和数字退化成中文字体内置的西文，字重与字宽都变差。

**数字必须用等宽数字**：

```css
.cf-timestamp, .cf-unread, .cf-duration { font-variant-numeric: tabular-nums; }
```

消息时间、未读数、通话时长在刷新时不得跳动 —— 非等宽数字会让"9"和"10"宽度不同，列表整体抖动。

### 3.2 层级表

| Token | Size | Weight | Line Height | Letter Spacing | 用途 |
|---|---|---|---|---|---|
| `--cf-text-display` | 28px | 500 | 1.25 | -0.02em | 空状态标题、登录页大标题 |
| `--cf-text-h1` | 20px | 600 | 1.4 | 0 | 页面标题、弹窗标题 |
| `--cf-text-h2` | 16px | 600 | 1.5 | 0 | 面板标题、会话头部名称 |
| `--cf-text-h3` | 14px | 600 | 1.5 | 0 | 分组标题、卡片标题 |
| `--cf-text-body` | 14px | 400 | 1.6 | 0 | **默认正文、消息正文** |
| `--cf-text-body-sm` | 13px | 400 | 1.55 | 0 | 会话列表摘要、次要信息 |
| `--cf-text-caption` | 12px | 400 | 1.5 | 0 | 时间戳、辅助说明、系统消息 |
| `--cf-text-micro` | 11px | 400 | 1.4 | 0 | 未读角标、极小标注（**下限，不得再小**） |
| `--cf-text-button` | 14px | 500 | 1.0 | 0 | 按钮文字 |
| `--cf-text-code` | 13px | 400 | 1.5 | 0 | 代码、文件路径 |

### 3.3 排版设计哲学

**① 中文不做负字距。** 这是与多数西方设计系统最大的差异。`-0.02em` 的负字距仅用于 `--cf-text-display` 且**仅当文案为纯拉丁字符**时；中文标题一律 `letter-spacing: 0`。汉字本身是等宽方块，负字距会让笔画粘连，直接损害可读性。

**② 字重只用 400 / 500 / 600 三档。** 中文没有真正的 700 —— `Microsoft YaHei` 与 `PingFang SC` 的 Bold 是合成加粗，笔画会糊。因此中文场景下"强调"用 600 + 颜色变化（`text-primary` vs `text-secondary`）来表达，而不是 700。

**③ 行高比拉丁文案松一档。** 中文没有词间空格，行高低于 1.5 会让多行文本糊成一块。正文固定 **1.6**，消息正文也固定 1.6 —— 不因为"消息要紧凑"而压到 1.4。

**④ 字号不随视口缩放。** 应用型界面（非营销页）不做 `clamp()` 流体排版。字号由用户浏览器设置决定，我们只保证在 200% 缩放下布局不破。

---

## 4. 组件样式约定（Component Stylings）

所有组件只引用**语义层 token**，不得直接引用色阶（如 `--cf-blue-500`）。

### 4.1 按钮

| 变体 | 背景 | 文字 | 描边 | 圆角 | 高度 | 内边距 |
|---|---|---|---|---|---|---|
| Primary | `--cf-primary` | `#FFFFFF` | 无 | `6px` | 32px | `0 16px` |
| Primary hover | `--cf-primary-hover` | `#FFFFFF` | 无 | `6px` | 32px | `0 16px` |
| Secondary | `--cf-surface-1` | `--cf-text-primary` | `1px --cf-hairline-strong` | `6px` | 32px | `0 16px` |
| Ghost | 透明 | `--cf-text-secondary` | 无 | `6px` | 32px | `0 12px` |
| Danger | `--cf-danger-indicator` | `#FFFFFF` | 无 | `6px` | 32px | `0 16px` |
| Icon | 透明 | `--cf-text-secondary` | 无 | `6px` | 32px | 视觉 32×32，**命中区 40×40** |

```css
.cf-btn {
  height: 32px; padding: 0 16px; border-radius: var(--cf-radius-sm);
  font: 500 14px/1 var(--cf-font-sans);
  transition: background-color var(--cf-duration-instant) var(--cf-ease-standard);
}
.cf-btn--primary { background: var(--cf-primary); color: #fff; }
.cf-btn--primary:hover { background: var(--cf-primary-hover); }
.cf-btn--primary:active { background: var(--cf-primary-active); }
.cf-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--cf-focus-ring); }
.cf-btn:disabled { background: var(--cf-surface-3); color: var(--cf-text-disabled); cursor: not-allowed; }
```

**约定**：同一视图内只允许出现**一个** Primary 按钮。发送按钮是消息输入区唯一的 Primary。

### 4.2 消息气泡

| 类型 | 背景 | 文字 | 圆角 | 内边距 | 最大宽度 |
|---|---|---|---|---|---|
| 自己 | `--cf-bubble-self-bg` | `#FFFFFF` | `12px 12px 4px 12px` | `8px 12px` | 520px |
| 对方 | `--cf-bubble-other-bg` | `--cf-text-primary` | `12px 12px 12px 4px` | `8px 12px` | 520px |
| 系统/撤回 | 透明 | `--cf-text-tertiary` | — | `4px 8px` | — |

- **圆角"缺角"指向发送者**：自己右下角 4px，对方左下角 4px。这是气泡的方位语义，不得对称化。
- **最大宽度 520px 且不超过容器 60%**：超长文本换行，不横向滚动。
- 气泡内**不做内阴影、不加边框**（对方气泡的 1px 描边是唯一例外，用于在白色消息区上勾出边界）。
- 连续消息（同一人 5 分钟内）：同一组内气泡间距 `2px`，组间 `12px`；头像仅组内第一条显示。

### 4.3 会话列表项

| 状态 | 背景 | 说明 |
|---|---|---|
| 默认 | 透明 | 高 64px，内边距 `10px 12px`，圆角 `8px` |
| 悬停 | `--cf-conv-item-hover` | 100ms 过渡 |
| 选中 | `--cf-conv-item-active` | 同时左侧出现 `3px` 主色指示条 |
| 有未读 | 同上 + 标题字重 500 + 摘要文字色升为 `--cf-text-secondary` | 未读角标固定右上 |

结构：`头像(40px) + [标题行 / 摘要行] + [时间 / 角标]`。标题与摘要单行省略（`text-overflow: ellipsis`），**摘要中的 @我 片段用 `--cf-primary` 着色**。

### 4.4 消息输入区

| 状态 | 描边 | 阴影 |
|---|---|---|
| 默认 | `1px --cf-hairline` | 无 |
| 聚焦 | `1px --cf-primary` | `0 0 0 3px --cf-focus-ring` |
| 禁用（无权限群） | `1px --cf-hairline` + 背景 `--cf-surface-2` | 无 |
| 拖拽文件悬停 | `2px dashed --cf-primary` + 遮罩 `--cf-primary-subtle` | 无 |

- 圆角 `12px`（比按钮大一档，因为它是"容器"而非"控件"）。
- 输入区最小高 80px，最大 200px，超出内部滚动。
- 发送按钮位于右下角，`@`、表情、附件为 Ghost 图标按钮，排在输入框下方工具条。

### 4.5 头像与角标

| 元素 | 规格 |
|---|---|
| 头像尺寸 | `24px`（消息内）/ `32px`（成员列表）/ `40px`（会话列表）/ `48px`（资料卡） |
| 头像圆角 | `999px` 圆形（个人）；群头像 `8px` 圆角 + 2×2 或 3×3 九宫格拼接 |
| 在线点 | 直径 `10px`，`--cf-presence-online`，`2px --cf-surface-1` 外描边，右下角定位 |
| 未读角标 | 高 `18px`，最小宽 `18px`，圆角 `999px`，`--cf-attention` 底 + 白字 11px，`99+` 截断 |
| @我标记 | 用角标形态但内容为 `@`，与未读数角标不同时出现（@ 优先） |

### 4.6 弹窗、遮罩与轻反馈

| 组件 | 规格 |
|---|---|
| 遮罩 | `rgba(16,24,40,0.45)`，`z-index: 300` |
| 弹窗 | `--cf-surface-1`，圆角 `12px`，`shadow.xl`，内边距 `24px`，最大宽 `480px`（确认）/ `640px`（表单） |
| Toast | `--cf-surface-inverse` 底 + 白字，圆角 `8px`，`shadow.lg`，右下角，`4s` 自动消失 |
| Tooltip | `--cf-surface-inverse` 底 + 白字 12px，圆角 `4px`，延迟 `400ms` 出现 |
| 骨架屏 | `--cf-surface-2` 底 + 圆角 `4px`，`1.4s` 脉冲循环 |

---

## 5. 布局原则（Layout Principles）

### 5.1 间距体系

**基数 4px**，采用 4 的倍数序列。所有间距必须取自下表，不得出现 `7px`、`15px` 这类值。

| Token | 值 | 典型用途 |
|---|---|---|
| `--cf-space-0` | 0 | — |
| `--cf-space-1` | 4px | 图标与文字间距、标签内边距 |
| `--cf-space-2` | 8px | 组件内元素间距、气泡内行距 |
| `--cf-space-3` | 12px | 列表项内边距、按钮组间距 |
| `--cf-space-4` | 16px | **面板内边距（默认）**、卡片内边距 |
| `--cf-space-5` | 20px | 弹窗内容区上下留白 |
| `--cf-space-6` | 24px | 弹窗内边距、区块间距 |
| `--cf-space-8` | 32px | 大区块间距 |
| `--cf-space-10` | 40px | 空状态上下留白 |
| `--cf-space-12` | 48px | 页面级留白 |
| `--cf-space-16` | 64px | 登录页等全屏页留白 |

**留白哲学**：应用型界面的留白由**面板边界**承担，而不是靠加大元素间距。三级面板（导航 / 列表 / 内容）通过 1px 描边和表面色差切分，面板内部保持 `16px` 的稳定内边距 —— 不要为了"透气"把内边距加到 24px，那会直接减少同屏信息量。

### 5.2 三栏骨架（桌面端）

```text
┌────┬──────────────┬────────────────────────────────┬──────────┐
│ 导 │  会话列表     │        消息区                   │ 详情面板  │
│ 航 │  /联系人      │                                │ (可选)    │
│ 栏 │              │                                │          │
│64px│ 280–360px    │  flex: 1  (min 480px)          │ 320px    │
│    │  可拖拽       │  消息列 max-width 760px 居中     │ ≥1440 展开│
└────┴──────────────┴────────────────────────────────┴──────────┘
```

| 区域 | 宽度 | 说明 |
|---|---|---|
| 导航栏 | 固定 `64px` | 头像、消息、联系人、文件、设置图标，垂直排列 |
| 会话/联系人列表 | `280–360px`，默认 `320px` | 可拖拽调宽，宽度记忆到本地 |
| 消息区 | `flex: 1`，最小 `480px` | 内部消息列 `max-width: 760px` 居中 |
| 详情面板 | `320px` | 群成员 / 个人资料，`≥1440px` 默认展开，可手动收起 |

**为什么消息列要限宽 760px**：超宽屏（≥1920px）下单行文本超过 90 个字符时，人眼回扫会丢行。限宽 760px 让阅读宽度保持在舒适区间，同时不浪费面板空间（空白由气泡两侧均分承担）。

### 5.3 网格

- 应用型界面**不设全局 max-width**，铺满视口。
- 面板内部使用 12 列栅格（`gap: 16px`），仅用于表单与设置页；聊天区不使用栅格。
- 卡片网格（如文件列表）：`repeat(auto-fill, minmax(220px, 1fr))`，`gap: 16px`。

### 5.4 圆角体系

| Token | 值 | 用途 |
|---|---|---|
| `--cf-radius-none` | `0` | 全宽分隔条、表格单元格 |
| `--cf-radius-xs` | `4px` | 标签、Tooltip、骨架块、气泡"缺角" |
| `--cf-radius-sm` | `6px` | **按钮、输入框、下拉项** |
| `--cf-radius-md` | `8px` | 卡片、会话列表项、Toast、群头像 |
| `--cf-radius-lg` | `12px` | **弹窗、消息输入区、面板容器、消息气泡** |
| `--cf-radius-xl` | `16px` | 大容器、图片预览 |
| `--cf-radius-xxl` | `20px` | 登录卡片等全屏页容器 |
| `--cf-radius-pill` | `999px` | 头像、未读角标、胶囊标签、开关 |

**圆角与元素尺寸的配对规则**：圆角值不超过元素高度的 1/2，且遵循"**控件 6px、容器 12px、大容器 16–20px**"三档节奏。不要给按钮用 12px —— 32px 高的按钮配 12px 圆角会显得松垮；也不要给弹窗用 6px —— 640px 宽的容器配 6px 圆角会显得尖锐廉价。

---

## 6. 深度、层级与动效（Depth, Elevation & Motion）

### 6.1 阴影系统

| Token | CSS 值 | 用途 |
|---|---|---|
| `--cf-shadow-xs` | `0 1px 2px rgba(16,24,40,0.05)` | 输入框聚焦时的轻微抬升 |
| `--cf-shadow-sm` | `0 1px 3px rgba(16,24,40,0.08), 0 1px 2px rgba(16,24,40,0.04)` | 卡片默认、头像组叠层 |
| `--cf-shadow-md` | `0 4px 8px -2px rgba(16,24,40,0.08), 0 2px 4px -2px rgba(16,24,40,0.04)` | 下拉菜单、Popover |
| `--cf-shadow-lg` | `0 12px 16px -4px rgba(16,24,40,0.08), 0 4px 6px -2px rgba(16,24,40,0.03)` | Toast、抽屉、图片预览 |
| `--cf-shadow-xl` | `0 20px 24px -4px rgba(16,24,40,0.08), 0 8px 8px -4px rgba(16,24,40,0.03)` | 模态弹窗 |
| `--cf-shadow-overlay` | `0 24px 48px -12px rgba(16,24,40,0.18)` | 全屏级浮层（如转发选择器） |

阴影色统一为 `rgba(16,24,40,α)`（即 `--cf-gray-900` 带透明度），**不要用纯黑** —— 纯黑阴影在冷灰画布上会发脏。

### 6.2 表面层级

| 层 | 表面 | 关系 |
|---|---|---|
| 0 画布 | `--cf-canvas` | 应用背景 |
| 1 内容面 | `--cf-surface-1` | 会话列表、消息区、卡片 —— **浮在画布上** |
| 2 次级面 | `--cf-surface-2` | 悬停态、代码块、引用区 |
| 3 强调面 | `--cf-surface-3` | 选中态、禁用态底 |
| 4 浮层 | `--cf-surface-1` + `shadow.md` 以上 | 下拉、弹窗、Toast |
| 反色面 | `--cf-surface-inverse` | Toast、Tooltip |

### 6.3 z-index 规范

| Token | 值 | 用途 |
|---|---|---|
| `--cf-z-base` | 0 | 常规内容 |
| `--cf-z-sticky` | 100 | 会话列表日期分组吸顶、消息区顶部栏 |
| `--cf-z-dropdown` | 200 | 下拉菜单、Popover、表情面板 |
| `--cf-z-overlay` | 300 | 模态遮罩 |
| `--cf-z-drag` | 350 | 拖拽上传遮罩（需盖住普通遮罩） |
| `--cf-z-modal` | 400 | 模态内容 |
| `--cf-z-toast` | 500 | Toast |
| `--cf-z-tooltip` | 600 | Tooltip（**永远最高**） |

**禁止**在业务代码里写裸数字 `z-index: 9999`。新增层级必须回到本表登记。

### 6.4 动效令牌

```css
--cf-duration-instant: 100ms;   /* 悬停、按压反馈 */
--cf-duration-fast:    150ms;   /* 气泡入场、红点消失 */
--cf-duration-base:    200ms;   /* 弹窗、下拉、遮罩 */
--cf-duration-slow:    300ms;   /* 抽屉、面板展开、图片加载 */
--cf-duration-slower:  400ms;   /* 全屏级过渡（慎用） */

--cf-ease-standard:   cubic-bezier(0.2, 0, 0, 1);      /* 通用 */
--cf-ease-decelerate: cubic-bezier(0, 0, 0.2, 1);      /* 入场：快进慢出 */
--cf-ease-accelerate: cubic-bezier(0.4, 0, 1, 1);      /* 出场：慢进快出 */
--cf-ease-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1); /* 强调：弹窗、抽屉 */
```

### 6.5 具体交互动效清单

| 交互 | 属性 | 时长 | 缓动 |
|---|---|---|---|
| 按钮/列表项悬停 | `background-color` | 100ms | standard |
| 消息气泡入场 | `opacity 0→1` + `translateY(4px)→0` | 150ms | decelerate |
| 新消息定位高亮 | `background-color` 脉冲 2 次 | 1200ms | standard |
| 未读红点消失 | `opacity 1→0` + `scale 1→0.6` | 150ms | accelerate |
| 下拉/表情面板 | `opacity` + `translateY(-4px)→0` | 200ms | decelerate |
| 模态弹窗 | `opacity` + `scale(0.96)→1` | 200ms | emphasized |
| 模态遮罩 | `opacity 0→1` | 200ms | standard |
| 右侧抽屉（详情面板） | `translateX(100%)→0` | 240ms | decelerate |
| 图片懒加载 | `filter: blur(8px)→0` + `opacity` | 300ms | standard |
| "回到底部"按钮 | `opacity` + `translateY(8px)→0` | 150ms | decelerate |
| 拖拽文件上传 | 描边变色 + 遮罩 `opacity 0→1` | 150ms | standard |
| 发送中 Spinner | `rotate 360°` | 800ms | linear，无限 |
| "对方正在输入"三点 | `opacity` + `translateY` | 1200ms | 每点延迟 200ms，无限 |

### 6.6 动效硬性约束

1. **单次过渡 ≤ 400ms**。超过 400ms 的 UI 过渡在一天几百次的操作里会变成折磨。
2. **入场位移 ≤ 8px**。大于 8px 的位移会产生"飞入"感，在高频界面里显得廉价。
3. **只动 `transform` 与 `opacity`**。不要对 `width` / `height` / `top` / `left` 做过渡（触发重排）。展开类动效必须用 `transform: scaleY()` 或 `grid-template-rows`。
4. **无限循环动画仅允许两种**：加载 Spinner、输入中指示。其余一律禁止（装饰性呼吸灯、渐变流动都属于反模式）。
5. **必须支持 `prefers-reduced-motion`**：

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

6. **不阻塞输入**。任何动效期间，输入框必须保持可聚焦、可输入；不要在动画期间用遮罩挡住输入区。

---

## 7. 设计规范与禁忌（Do's and Don'ts）

### Do（推荐实践）

1. **把品牌色留给"当前状态"和"主要操作"** —— 选中项、自己气泡、主按钮、链接。一个视图里主色的着墨面积应低于 10%。
2. **用表面色差表达层次**：`canvas` → `surface-1` → `surface-2` 三档足够覆盖 95% 的场景，先试色差，不行才加描边，最后才加阴影。
3. **中文用 600 字重 + 颜色变化做强调**，不要用 700 或纯靠颜色（色盲用户无法区分）。
4. **所有数字用 `tabular-nums`** —— 时间戳、未读数、时长、文件大小。
5. **状态必须有文字或图形出口**：发送失败不能只变红，要有感叹号图标 + 可点击重试。
6. **焦点态永远可见**：所有可交互元素必须有 `:focus-visible` 样式（`0 0 0 3px var(--cf-focus-ring)`），且不得用 `outline: none` 直接抹掉。
7. **深色主题不靠阴影表达层次**，用 1px 亮色描边。
8. **图标按钮给足命中区**：视觉 32×32，实际命中 40×40（用 `padding` 或伪元素扩展）。

### Don't（反模式）

1. **不要引入第二个品牌色**。主色 + 中性灰 + 四个语义色就是全集。想加"强调紫""活力橙"时，先问是不是该用已有的 attention 红。
2. **不要把语义 indicator 色当文字色**。`#F04438` 只有 3.76:1，正文用它不合规。
3. **不要给中文加负字距**，也不要给按钮文字加正字距（`letter-spacing: 0.05em` 会让"发送"两个字看起来裂开）。
4. **不要在气泡里再套卡片**。链接预览卡片、文件卡片是气泡的**替代形态**，不是气泡的子元素。
5. **不要用圆角矩形以外的按钮形状**（除胶囊标签），也不要给同一个视图的按钮混用两档圆角。
6. **不要做超过 400ms 的过渡**，不要用 `ease-in-out` 这种无性格的缓动，不要给列表项加位移动画（会造成整列抖动）。
7. **不要在深色主题下用纯黑背景 + 纯白文字**（对比度 21:1，长时间阅读刺痛）。
8. **不要写裸值**：`color: #0B6BCB`、`padding: 13px`、`z-index: 9999` 都必须在 Code Review 阶段被拦下。

---

## 8. 响应式行为（Responsive Behavior）

### 8.1 断点

| 名称 | 宽度 | 布局变化 |
|---|---|---|
| `compact` | `< 768px` | **单栏**：导航栏收为底部标签栏；会话列表与消息区**互斥显示**（点进去出列表、选会话进消息）；详情面板变为全屏抽屉 |
| `medium` | `768–1023px` | **双栏**：导航栏 64px + 内容区；会话列表 `280px` 固定；详情面板默认收起（抽屉） |
| `expanded` | `1024–1439px` | **三栏**：导航 64px + 列表 320px + 消息区；详情面板收起 |
| `wide` | `≥ 1440px` | **三栏 + 详情面板**：导航 64px + 列表 320px + 消息区 + 详情 320px |
| `ultra` | `≥ 1920px` | 同 `wide`，但消息列**锁定 760px 居中**，多余空间由气泡两侧均分 |

```css
/* 断点变量（仅作文档用途，CSS 媒体查询仍需字面量） */
--cf-bp-compact: 768px;
--cf-bp-medium: 1024px;
--cf-bp-expanded: 1440px;
--cf-bp-ultra: 1920px;
```

### 8.2 触摸目标

| 场景 | 最小尺寸 |
|---|---|
| 鼠标为主的桌面端 | 视觉 `32×32`，命中区 `40×40` |
| 触摸设备（`@media (pointer: coarse)`） | **命中区 ≥ 44×44**，图标按钮自动放大到 40×40 视觉 |
| 列表项（会话、联系人、成员） | 整行可点，高度 ≥ 56px |
| 气泡内链接 | 行内可点，四周留 `4px` 内边距 |

```css
@media (pointer: coarse) {
  .cf-btn--icon { width: 40px; height: 40px; }
}
```

### 8.3 折叠策略

| 元素 | `compact` | `medium` | `expanded` | `wide` |
|---|---|---|---|---|
| 导航栏 | 底部标签栏 | 左侧 64px 图标栏 | 同左 | 同左 |
| 会话列表 | 与消息区互斥 | `280px` | `320px` | `320px` |
| 详情面板 | 全屏抽屉 | 抽屉 | 抽屉 | 常驻 `320px` |
| 消息气泡最大宽 | `calc(100% - 64px)` | `440px` | `520px` | `520px` |
| 消息列限宽 | 无 | 无 | `760px` | `760px` |
| 输入区工具条 | 收进"+"菜单 | 部分外露 | 全部外露 | 全部外露 |
| 表格/文件列表 | 卡片化堆叠 | 卡片 2 列 | 卡片 3 列 | 卡片 4 列 |

### 8.4 字体缩放

- **不随视口缩放**。字号固定，由用户浏览器设置控制。
- 必须在 **200% 缩放**下验证：布局不横向滚动、气泡不溢出、按钮文字不截断。
- 使用 `rem` 作为字号单位（`html { font-size: 100% }`），使浏览器字号设置能生效。**唯一例外**：1px 描边用 `px`。
- 长用户名/长群名：单行 `ellipsis`；详情面板中允许 2 行 `line-clamp: 2`。

---

## 9. 命名与使用指南（Naming & Agent Prompt Guide）

### 9.1 三层 Token 架构（**最重要的工程约束**）

```
① 基础层 Primitive   --cf-blue-500 / --cf-gray-200 / --cf-space-4
        ↓ 只被语义层引用
② 语义层 Semantic    --cf-primary / --cf-text-secondary / --cf-hairline
        ↓ 只被组件层引用
③ 组件层 Component   --cf-bubble-self-bg / --cf-conv-item-active
```

**三条铁律**：

1. **组件只引用语义层**。`.cf-btn--primary { background: var(--cf-primary) }` ✅；`background: var(--cf-blue-500)` ❌。
2. **语义层只引用基础层**。`--cf-primary: var(--cf-blue-500)` ✅。
3. **禁止跨层引用与反向引用**。基础层不得引用语义层；组件层不得引用基础层。

> 这样做的好处：换主题时只改语义层（深色主题就是这么做的）；调整色阶时只改基础层。如果允许组件直接吃色阶，两个维度就会互相锁死。

### 9.2 CSS 变量命名规范

```
--cf-{类别}-{角色}-{状态}

类别：color | text | space | radius | shadow | z | duration | ease | font
```

| 正确 | 错误 | 原因 |
|---|---|---|
| `--cf-text-primary` | `--cf-color-primary-text` | 类别词冗余，`text` 本身即类别 |
| `--cf-space-4` | `--cf-spacing-medium` | 间距必须用数字刻度，语义化命名会导致"medium 到底多大"的歧义 |
| `--cf-primary-hover` | `--cf-primaryHover` | 必须 kebab-case |
| `--cf-bubble-self-bg` | `--cf-selfBubbleBackground` | 组件层用 `{组件}-{变体}-{属性}` |

### 9.3 组件类名规范（BEM 变体）

```
.cf-{block}
.cf-{block}__{element}
.cf-{block}--{modifier}
```

```html
<div class="cf-conversation-item cf-conversation-item--active cf-conversation-item--unread">
  <img class="cf-conversation-item__avatar" />
  <div class="cf-conversation-item__body">
    <span class="cf-conversation-item__title">产品群</span>
    <span class="cf-conversation-item__summary">张三：需求文档已更新</span>
  </div>
  <span class="cf-badge cf-badge--unread">3</span>
</div>
```

| 规则 | 说明 |
|---|---|
| 前缀 | 所有类名以 `cf-` 开头，避免与宿主页面冲突 |
| 状态 | 用 `--active` / `--disabled` / `--unread` 修饰符，不用 `.is-active` |
| 禁止 | 不用内联 `style`（动态尺寸除外）；不用标签选择器（`div > span`）；不写 `!important` |
| 深度 | 嵌套不超过 3 层 |

### 9.4 快速参考（Quick Reference）

```
主色 #0B6BCB · 深色主色 #3D8EE8 · 注意力红 #F04438（仅红点/角标）
画布 #F8F9FB · 内容面 #FFFFFF · 悬停 #F1F3F7 · 描边 #E4E7EC
文字 #101828 / #475467 / #667085（一级/二级/三级）
字体 Inter + PingFang SC / Microsoft YaHei，正文 14px/1.6
间距基数 4px，面板内边距 16px
圆角：控件 6px · 容器 12px · 大容器 16–20px · 胶囊 999px
阴影：默认无 → 下拉 shadow-md → 弹窗 shadow-xl
动效：悬停 100ms · 入场 150ms · 弹窗 200ms · 面板 300ms（上限 400ms）
布局：导航 64 + 列表 320 + 消息区 flex + 详情 320（≥1440）
气泡：自己 #0B6BCB 圆角 12/12/4/12 · 对方 #FFFFFF+1px 描边 圆角 12/12/12/4
```

### 9.5 组件生成 Prompt（可直接复制给 AI 编程代理）

```
1. 生成 ChatFlow 会话列表项（React + CSS 变量）
   使用 .cf-conversation-item 及 BEM 子元素。高 64px，内边距 10px 12px，
   圆角 var(--cf-radius-md)。含 40px 圆形头像（右下角在线点）、标题、
   单行省略摘要、右上时间戳（12px，var(--cf-text-tertiary)，tabular-nums）。
   三种状态：默认、--active（背景 var(--cf-conv-item-active) + 左侧 3px 主色条）、
   --unread（标题 600 字重 + 右上未读角标 var(--cf-attention)）。

2. 生成消息气泡组件
   自己：背景 var(--cf-bubble-self-bg)，白字，圆角 12px 12px 4px 12px。
   对方：背景 var(--cf-bubble-other-bg)，1px var(--cf-hairline) 描边，
   圆角 12px 12px 12px 4px，文字 var(--cf-text-primary)。
   两者 padding 8px 12px，max-width 520px，正文 14px/1.6。
   入场动画：opacity 0→1 + translateY(4px)→0，150ms，var(--cf-ease-decelerate)。

3. 生成消息输入区
   容器圆角 var(--cf-radius-lg)，默认 1px var(--cf-hairline) 描边；
   :focus-within 时描边 var(--cf-primary) 且 box-shadow 0 0 0 3px var(--cf-focus-ring)。
   最小高 80px，最大 200px 后内部滚动。右下角 Primary 发送按钮（高 32px，
   圆角 6px，禁用态背景 var(--cf-surface-3)）。
   左下工具条：@ / 表情 / 附件，Ghost 图标按钮，视觉 32×32 命中区 40×40。

4. 生成群成员选择弹窗
   遮罩 rgba(16,24,40,0.45) + z-index var(--cf-z-overlay)；
   弹窗背景 var(--cf-surface-1)，圆角 var(--cf-radius-lg)，
   box-shadow var(--cf-shadow-xl)，内边距 var(--cf-space-6)，最大宽 640px。
   入场：opacity + scale(0.96→1)，200ms，var(--cf-ease-emphasized)。
   含搜索框、已选成员胶囊列表、成员网格（头像 32px + 姓名 12px），
   底部 Secondary「取消」+ Primary「确定」两个按钮。

5. 生成"对方正在输入"指示器
   三颗 6px 圆点，间距 4px，颜色 var(--cf-text-tertiary)。
   动画 1200ms 无限循环，每点延迟 200ms，位移仅 4px，透明度 0.4→1。
   必须包裹在 @media (prefers-reduced-motion: no-preference) 内。

6. 生成文件消息卡片
   注意：这是气泡的替代形态，不要再嵌一层气泡。
   容器背景 var(--cf-surface-1)，1px var(--cf-hairline) 描边，
   圆角 var(--cf-radius-md)，内边距 var(--cf-space-3)，最大宽 360px。
   左侧 40×40 文件类型图标（圆角 6px，按类型取语义色 surface 底），
   右侧文件名（14px/1.5，单行省略）+ 大小与状态（12px，三级文字，tabular-nums）。
   右下角下载 Ghost 按钮。
```

### 9.6 迭代建议（Iteration Guide）

1. **一次只做一个组件**，并在 Prompt 里直接引用 token 名（`var(--cf-primary)`），不要让 AI 猜颜色。
2. **新组件先问"它属于哪一层"**：控件（按钮/输入框）用 6px 圆角、32px 高；容器（面板/弹窗）用 12px 圆角、16/24px 内边距。分错层会导致整站节奏崩坏。
3. **默认正文用 `--cf-text-body`（14px/1.6）**，不要为了"看起来精致"调到 13px —— IM 的消息正文是全站阅读量最大的文本。
4. **加新状态时先查本文档有没有现成 token**，尤其是颜色 —— 90% 的情况应该复用已有的语义色，而不是新增色阶。
5. **动效参数一律引用 `--cf-duration-*` / `--cf-ease-*`**，不要写 `transition: all 0.3s ease`。
6. **深色主题下必须回归验证**：重点看描边是否消失、图片边界是否还在、主色对比度是否够。
7. **每次改动后跑一次 200% 缩放检查**，中文界面的溢出问题几乎都出在放大场景。
8. **列表类组件先做虚拟滚动**：会话列表、成员列表、消息列表都可能上千条，不要等性能出问题再补。
9. **不要把管理后台的样式往这里抄**：后台是高密度表单 + 表格，用户端是低密度对话流，圆角、间距、字号都不同。
10. **新增 token 必须登记到本文档**。未登记的 token 在 Code Review 阶段一律打回。

---

## 附：本设计系统的决策依据

| 决策 | 依据 |
|---|---|
| 主色 `#0B6BCB` | 对白底 5.27:1，满足 AA 正文要求，可直接用于文字与白字反底 |
| 冷中性灰阶 | 与蓝主色同色温，长时间阅读疲劳度低于暖灰 |
| 语义色 indicator/text 分离 | 高饱和语义色对比度仅 2.3–3.8:1，不能作正文 |
| 中文零字距 + 字重上限 600 | 汉字等宽方块，负字距致笔画粘连；中文字体无真 Bold，700 为合成加粗 |
| 正文行高 1.6 | 中文无词间空格，低于 1.5 多行文本糊成一块 |
| 消息列限宽 760px | 超过约 90 字符/行时人眼回扫丢行 |
| 间距基数 4px | 与 64px 列表项、32px 控件高度整除，避免出现 7px/15px 等异形值 |
| 圆角三档（6/12/16–20） | 与元素尺寸配对，避免 32px 按钮配 12px 圆角的松垮感 |
| 动效上限 400ms | 高频操作场景下，长过渡会累积成明显的迟滞感 |

> **文档版本**：V1.0 · 2026-10-01 · 适用范围：ChatFlow 用户端 Web
> **参考基准**：Intercom（对话式克制）、IBM Carbon（企业级规范）、Slack（聊天产品模式）
