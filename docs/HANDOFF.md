# 实施交接文档

## 0. 交接状态

规划已完成，前端实现尚未开始。后续模型应把以下文档视为产品契约：

1. `docs/PRD.md`：范围、功能、算法和验收。
2. `docs/UI-SPEC.md`：布局、视觉、响应式和无障碍。
3. `docs/COLOR-SOURCES.md`：颜色权威源、28 人与 8 组合映射、JSON 扩展。
4. `CONTEXT.md`：领域术语。

本阶段没有创建应用代码、依赖或构建配置。

## 1. 已确认且不得自行改动的产品决策

- 三页：总榜、组合榜、双人对比。
- React + TypeScript + Vite 静态 SPA。
- 简体中文 UI，日文主名，英文副名。
- 总榜控制：维度、组合、姓名搜索、升降序。
- 总榜进度条：全部 28 人当前维度全局 min/max 映射到 12%-100%，筛选不改变尺度。
- 组合榜：按选定单一维度的组合平均值排序。
- 对比页：两个不同成员，三轴雷达图，每轴按全部 28 人对应维度独立归一化。
- 所有筛选、排序、主题和成员选择写入 URL。
- 主题支持 system、light、dark，默认 system。
- 成员和组合颜色以 shinycolors.moe API 为产品权威源。
- 浅色数据站风格，保留深色支持，不做 AIDA、GSAP 或重型动效。
- 不进入身体评价，不创建综合指数或胜负结论。

若实现者认为某项要变更，应先向产品负责人提问，不能静默调整。

## 2. 当前仓库事实

### 已有文件

```text
shiny_colors_idol_measurements.json
assets/shiny-colors/idol-icons/001.png ... 028.png
assets/shiny-colors/unit-icons/001.png ... 008.png
CONTEXT.md
docs/PRD.md
docs/UI-SPEC.md
docs/COLOR-SOURCES.md
docs/HANDOFF.md
```

### 数据统计

- 成员：28。
- 组合：8。
- B 范围：70-93 cm，平均 81.68 cm。
- W 范围：52-60 cm，平均 56.79 cm。
- H 范围：73-92 cm，平均 82.57 cm。

组合原始平均值：

| unit_id | 人数 | B | W | H |
|---|---:|---:|---:|---:|
| `illumination_stars` | 3 | 83.67 | 57.33 | 85.00 |
| `lantica` | 5 | 83.40 | 56.20 | 84.60 |
| `hokagoclimaxgirls` | 5 | 79.00 | 56.60 | 81.00 |
| `alstroemeria` | 3 | 83.33 | 57.33 | 85.00 |
| `straylight` | 3 | 82.00 | 58.33 | 82.00 |
| `noctchill` | 4 | 79.75 | 56.50 | 79.00 |
| `shhis` | 2 | 83.50 | 56.00 | 84.50 |
| `cometik` | 3 | 80.67 | 56.33 | 81.00 |

### Git 状态提醒

`assets/` 当前未跟踪。搭建工程时必须保留并纳入版本控制，不得因脚手架初始化而删除数据、素材或 docs。

## 3. 第一项实施任务：扩展 JSON

在搭建 UI 前先按 `docs/COLOR-SOURCES.md` 扩展数据。

### 根级变化

- `schema_version`: `1.0` -> `1.1`。

### 每个成员增加

- `source_id`: shinycolors.moe `idolId`，范围 1-28。
- `representative_color.hex`: API `color2`。
- `representative_color.source`: `shinycolors_moe`。
- `representative_color.source_field`: `color2`。
- `representative_color.source_url`。
- `representative_color.verified_at`: `2026-07-12`。

### 每个组合增加

- `source_id`: shinycolors.moe `unitId`，范围 1-8。
- `representative_colors.soft`: API `color1`。
- `representative_colors.primary`: API `color2`。
- 来源字段和核验日期。

### 关键图片映射警告

成员图片编号对应 `source_id`，不对应当前 JSON 扁平顺序：

```text
iconPath = idol-icons/{source_id 补足三位数}.png
```

例如：

- `004.png` 是月岡恋鐘。
- `005.png` 是田中摩美々，不是当前 JSON 中排在第五位的幽谷霧子。
- `008.png` 是幽谷霧子。
- `014.png` 是大崎甘奈。
- `016.png` 是桑山千雪。

组合图标同样按组合 `source_id` 1-8 映射。不要按数组下标隐式映射，也不要维护第二份重复 manifest。

### 数据扩展验收

- 原有 28 人、8 组合、顺序、snake_case ID、B/W/H 和官方资料 URL 不变。
- 28 个 `source_id` 恰好覆盖 1-28，无重复。
- 8 个组合 `source_id` 恰好覆盖 1-8，无重复。
- 颜色与 `docs/COLOR-SOURCES.md` 完全一致。
- 所有颜色匹配 `^#[0-9a-fA-F]{6}$`。
- 实现运行时不请求 shinycolors.moe。

## 4. 建议技术方案

遵循最小实现：

### 运行时依赖

- React。
- React DOM。
- React Router，使用 Hash Router。

### 不引入

- Tailwind 或大型设计系统。
- Zustand、Redux、Jotai 等全局状态。
- Recharts、Chart.js 等图表库。
- Motion、GSAP 等动画库。
- Zod 等运行时 schema 库。
- 后端或数据请求层。

理由：只有固定的 28 条数据、3 个路由和一个固定三轴图，原生 TypeScript、CSS 和 SVG 已足够。

### 开发依赖

- Vite React TypeScript 模板。
- Vitest。
- Testing Library 仅用于关键交互和 URL 测试。
- ESLint 使用 Vite 模板默认配置即可，不追加多套格式化工具。

## 5. 建议文件结构

保持少文件，避免提前抽象：

```text
src/
  main.tsx
  App.tsx
  data.ts
  domain.ts
  domain.test.ts
  urlState.ts
  urlState.test.ts
  styles.css
  pages/
    OverallPage.tsx
    UnitsPage.tsx
    ComparePage.tsx
  components/
    AppShell.tsx
    MetricControl.tsx
    RankingList.tsx
    MemberSelect.tsx
    RadarChart.tsx
```

约束：

- `data.ts` 只负责导入、类型、标准化、图片路径和开发断言。
- `domain.ts` 只放纯函数：筛选、排序、排名、平均、尺度、差值。
- `urlState.ts` 集中解析和序列化三页 URL 状态。
- 页面先组合已有组件。只有真实复用后再新增组件文件。
- 不创建 services、repositories、stores、hooks 目录来包装静态 JSON。

## 6. 静态资源策略

最少移动文件的方案：

- 在 Vite 中把现有 `assets` 设为 `publicDir`。
- 构建后资源路径为 `shiny-colors/idol-icons/...` 和 `shiny-colors/unit-icons/...`。
- URL 必须结合 `import.meta.env.BASE_URL`，支持子目录部署。

另一可接受方案是把素材整体移动到 `public/assets`。二选一，不复制两份。首选设置 `publicDir`，因为 diff 更小。

图片固定宽高：成员 54x54，组合 40x40。相邻已有文本时图片 `alt=""`，避免重复朗读。

## 7. 数据标准化

建议标准化后生成：

### Idol

- 原成员字段。
- `unitId`、双语组合名。
- `unitSourceId`。
- `unitColors`。
- `iconUrl`，由成员 `source_id` 派生。
- `sourceOrder`，记录 JSON 当前顺序，用于并列稳定排序。

### Unit

- 原组合字段。
- `iconUrl`，由组合 `source_id` 派生。
- `members`。
- `sourceOrder`。

开发期断言：

- `idol_count === 28`。
- 实际成员数为 28，组合数为 8。
- 成员 ID、成员 `source_id`、组合 ID、组合 `source_id` 分别唯一。
- B/W/H 是有限数值。
- 单位是 `cm`。
- 三项全局范围符合已知值。
- 颜色字段和 HEX 格式完整。

静态受控 JSON 不需要 Zod。TypeScript 类型加开发断言即可。

## 8. 领域算法契约

### 搜索

1. 查询和候选都做 NFKC。
2. 查询 trim。
3. 英文匹配转小写。
4. 同时匹配 `name_ja` 和 `name_en`。

### 成员排序和排名

1. 先按维度和方向排序。
2. 相同整数值共享竞赛排名 1、2、2、4。
3. 并列内部按 `sourceOrder`。
4. 排名在过滤后的可见结果中计算。

### 成员进度条

```text
12 + 88 * (value - globalMin) / (globalMax - globalMin)
```

- 全部 28 人全局范围。
- `min === max` 时 100。
- `aria-valuenow` 使用真实 cm，不使用视觉百分比。

### 组合平均值

- `sum / count`。
- 排序使用未舍入值。
- 显示 1 位小数。
- 并列使用 `sumA * countB === sumB * countA`。
- 已知 W 和 H 存在组合并列，必须测试。

### 组合榜可视化

对当前维度的 8 个组合平均值，按最小平均值到最大平均值映射 12%-100%。`min === max` 时全部 100%。

### 雷达归一化

每轴独立：

```text
(value - globalMin[metric]) / (globalMax[metric] - globalMin[metric])
```

- 绘图范围 0-1。
- `min === max` 时 0.5。
- 图形只表达相对位置，表格显示原始 cm。

### 雷达几何

固定三个角度即可，例如顶部 -90°、右下 30°、左下 150°。每个点：

```text
x = centerX + radius * relative * cos(angle)
y = centerY + radius * relative * sin(angle)
```

用原生 SVG 绘制网格、轴、A/B polygon、halo、点和标签。不需要通用图表抽象。

## 9. URL 契约

### 路由

```text
/#/overall
/#/units
/#/compare
```

未知路由 replace 到 `/#/overall`。

### 总榜

- `metric=bust|waist|hip`，默认 bust。
- `unit={unit_id}`，默认省略。
- `q={text}`，空白省略。
- `dir=asc|desc`，默认 desc。
- `theme=system|light|dark`，默认 system。

### 组合榜

- `metric`、`dir`、`theme`。

### 对比页

- `a={idol_id}`。
- `b={idol_id}`。
- `theme`。

### 历史行为

- 页面、维度、组合、排序、成员选择、交换：push。
- 搜索输入、非法值修复、默认值清理：replace。
- 非法成员 ID 清除。
- `a === b` 时保留 a、清除 b、replace URL。
- 删除未知参数。

URL 是页面状态单一事实来源，不把筛选状态复制到 context 或 store。

## 10. 主题行为

优先级：

1. 当前 URL `theme`。
2. `localStorage` 上次手动值。
3. `prefers-color-scheme`。

手动选择时同时更新 URL 和本地偏好。避免首屏闪烁：主题初始化应尽早发生，但不需要额外主题库。

代表色只做身份与数据系列。正文、按钮、焦点使用语义 token。千雪 `#fbfafa` 必须有中性外边界。

## 11. 页面实施顺序

### 阶段 A：工程和数据

1. 在当前非空仓库初始化 Vite React TypeScript，先保护已有文件。
2. 增加 Hash Router 和最小测试依赖。
3. 配置静态资源目录和 base-aware 路径。
4. 扩展 JSON 颜色与 `source_id`。
5. 完成数据类型、标准化和断言。

完成条件：数据测试通过，28 张头像和 8 个图标身份正确。

### 阶段 B：纯函数和 URL

1. 搜索、筛选、稳定排序、竞赛排名。
2. 组合平均值和并列。
3. 进度和雷达尺度。
4. 三页 URL parse/serialize 和非法值规范化。

完成条件：纯逻辑测试全部通过，再开始页面。

### 阶段 C：应用外壳和总榜

1. 全局 token、浅深主题、导航和页脚。
2. 总榜控制区、摘要、桌面数据行、移动重排、空状态。
3. URL 同步和后退/前进。

完成条件：总榜所有控制可组合使用，刷新可复现。

### 阶段 D：组合榜

1. 单维度平均排序。
2. 并列和显示格式。
3. 组合颜色、图标、成员范围。
4. 查看成员深链接。

完成条件：8 个组合正确，已知并列正确。

### 阶段 E：双人对比

1. 两个分组成员选择器和重复防护。
2. 交换行为。
3. 原生 SVG 雷达。
4. 原始数值和差值表。
5. URL 非法同人修正。

完成条件：图、表、身份、颜色和 URL 同步。

### 阶段 F：质量

1. 320px、768px、1440px。
2. system、light、dark。
3. 键盘和焦点。
4. reduced motion。
5. 非法 URL、空搜索、同人、并列、`min === max`。
6. Vite production build 和静态子目录部署。
7. Lighthouse。

## 12. 最小测试清单

### `domain.test.ts`

- 扁平化为 28 人。
- 三项全局范围。
- 日文、英文、大小写、空白、NFKC 搜索。
- 升降序。
- 竞赛排名和稳定并列。
- 进度最小 12、最大 100、退化 100。
- 8 个组合平均值。
- W/H 已知并列。
- 雷达 min 0、max 1、退化 0.5。
- 差值符号。

### `urlState.test.ts`

- 三页合法参数往返。
- 默认参数省略。
- 非法 metric、dir、unit、theme、idol 回退。
- 空 q 省略。
- 同一 A/B 清除 B。
- 未知参数删除。

### 关键交互

- 默认总榜 28 人。
- 组合筛选加姓名搜索。
- 搜索无结果后恢复。
- 组合查看成员跳转。
- 选择、禁用同人和交换。
- 后退、前进、刷新恢复。
- 主题切换。

不要为每个展示组件写快照测试。测试应集中在容易错的算法、URL 和跨组件行为。

## 13. 无障碍交付要求

- 每页唯一 `h1`。
- 可见 label。
- 当前导航 `aria-current`。
- 44x44 点击目标。
- 焦点清晰。
- 结果摘要礼貌播报。
- 进度朗读真实 cm。
- 雷达有简短描述和完整表格替代。
- A/B 不只靠颜色。
- 外部链接有明确名称和安全属性。
- 浅色、深色均达 WCAG AA。

## 14. 明确禁止的过度实现

- 不建后端。
- 不运行时同步第三方 API。
- 不引入全局 store。
- 不引入图表、动画或组件大库。
- 不建立通用查询语言、插件系统或多数据源抽象。
- 不新增详情页、综合分、多语言或收藏。
- 不把固定三轴雷达抽成任意 N 轴图表框架。
- 不把静态 JSON 包装成 repository/service 层。

## 15. 完成审计

实现者报告完成前，应逐项提供证据：

- `git diff` 中没有误删原数据、素材和文档。
- JSON 数据扩展测试通过。
- 单元和交互测试通过。
- production build 通过。
- 三种视口、三种主题截图或人工检查记录。
- 键盘流程和无障碍检查记录。
- 静态部署路径刷新和资源加载验证。
- PRD 第 14 节所有验收项均有对应结果。

只有全部满足才算完成，不以“页面能打开”代替验收。
