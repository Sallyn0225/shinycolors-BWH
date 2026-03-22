# 后续开发指南

这份文档给后续维护这个项目的人看，重点是两件事：

- 现有代码怎么组织
- 接下来要扩功能时，应该改哪里

## 先理解现在的结构

应用入口在 [src/main.tsx](../src/main.tsx)。

启动顺序是：

1. `BrowserRouter` 提供路由能力
2. `RankingPreferencesProvider` 提供全局排序偏好
3. `App` 负责整体框架、导航和路由切换

可以把结构理解成：

```text
main.tsx
  -> BrowserRouter
  -> RankingPreferencesProvider
  -> App.tsx
       -> MetricToggle
       -> HomePage
       -> UnitsPage
       -> ComparePage
```

## 核心文件职责

### 页面层

- [src/pages/HomePage.tsx](../src/pages/HomePage.tsx)：全员排行主页
- [src/pages/UnitsPage.tsx](../src/pages/UnitsPage.tsx)：按组合展示排行
- [src/pages/ComparePage.tsx](../src/pages/ComparePage.tsx)：双人对比

### 组件层

- [src/components/MetricToggle.tsx](../src/components/MetricToggle.tsx)：全局维度切换和排序方向切换
- [src/components/RankingRow.tsx](../src/components/RankingRow.tsx)：排行列表单行
- [src/components/IdolVisual.tsx](../src/components/IdolVisual.tsx)：立绘加载与缺图占位
- [src/components/UnitJumpTags.tsx](../src/components/UnitJumpTags.tsx)：组合锚点导航

### 数据与逻辑层

- [src/data/idols.ts](../src/data/idols.ts)：组合定义、偶像数据、来源链接
- [src/lib/ranking.ts](../src/lib/ranking.ts)：排序、均值、对比、条形图比例
- [src/state/ranking-preferences.tsx](../src/state/ranking-preferences.tsx)：全局偏好和持久化
- [src/types.ts](../src/types.ts)：类型约束

### 样式层

- [src/styles.css](../src/styles.css)：所有页面共享的视觉风格与响应式规则

## 现有数据流

当前项目是典型的静态数据驱动：

1. `src/data/idols.ts` 提供原始数据
2. 页面读取当前 `metric` 和 `direction`
3. `src/lib/ranking.ts` 负责计算排序、区间、均值、对比结果
4. 组件把结果渲染成列表、对比条、组合区块

这意味着现在的改动成本很低，但也意味着当数据规模变大时，后面可能要拆成 `JSON` 或远端接口。

## 常见开发任务

### 新增或修改偶像数据

直接编辑 [src/data/idols.ts](../src/data/idols.ts)。

要一起确认的字段：

- `id` 是否唯一
- `unit` 是否存在于 `unitDefinitions`
- `measurements` 是否完整
- `sourceUrl` 是否可追溯
- 立绘文件名是否与 `id` 完全一致

如果只补立绘，不改数据，按 [docs/idol-assets.md](./idol-assets.md) 放文件即可。

### 新增一个排行维度

这个改动不是只改一处，至少会影响下面几个位置：

1. [src/types.ts](../src/types.ts) 里的 `MetricKey`
2. [src/data/idols.ts](../src/data/idols.ts) 里的 `measurements`
3. [src/lib/ranking.ts](../src/lib/ranking.ts) 里的 `metricLabels` 和对比逻辑
4. [src/components/MetricToggle.tsx](../src/components/MetricToggle.tsx) 里的按钮列表

如果未来要加 `height`、`age` 这种非三围数据，建议先把 `measurements` 更名成更泛化的字段，再做一次小重构。

### 新增一个页面

按这个顺序做最稳：

1. 在 `src/pages/` 新建页面组件
2. 在 [src/App.tsx](../src/App.tsx) 增加 `Route`
3. 需要导航入口的话，同样在 `src/App.tsx` 增加 `NavLink`
4. 在 [src/styles.css](../src/styles.css) 补页面样式

### 替换或调整视觉风格

当前视觉主要集中在 [src/styles.css](../src/styles.css) 的这几块：

- `:root` 里的颜色变量、容器宽度、圆角、阴影
- `.site-header` 和 `.hero-panel` 的舞台风格
- `.ranking-row`、`.compare-row` 的玻璃感卡片样式
- 两个媒体查询断点：`1100px` 和 `760px`

如果要大改视觉，优先保留现有的类名语义，不要一边改设计一边把结构也全部打散，不然后续维护成本会明显变高。

## 已知的工程边界

### 1. 没有测试与 lint

现在 `package.json` 里只有：

- `dev`
- `build`
- `preview`

所以目前最基础的回归手段只有跑构建和手动浏览页面。

### 2. 路由需要部署侧配合

项目使用 `BrowserRouter`。如果部署平台没有把未知路径重写到 `index.html`，刷新 `/units` 或 `/compare` 会直接 404。

当前仓库已经补了这几类配置：

- `vercel.json`：给 Vercel 做 SPA rewrite
- `netlify.toml`：声明 Netlify 的构建命令和发布目录
- `public/_redirects`：给 Netlify 和 Cloudflare Pages 做静态回退

如果后面继续接 GitHub Releases，发布说明可以直接基于 `docs/releases/` 里的版本文档整理。

### 3. 数据和视图强耦合

当前 `accent` 色直接写在数据里，页面也直接拿来渲染。这个做法对小项目很快，但以后如果要统一主题策略，可能需要把视觉 token 从业务数据里拆出来。

### 4. 排序偏好只存在浏览器本地

排序偏好通过 `localStorage` 保存，不会跨设备同步，也没有版本迁移逻辑。字段结构变更时，要记得兼容旧数据或清理旧 key。

## 建议的下一步开发顺序

如果这个项目准备继续往前做，建议按下面顺序推进：

1. 增加 `lint` 与代码格式化脚本，先把基础工程约束补上
2. 把偶像数据拆到独立 `JSON` 或 `ts` 模块分片，降低单文件体积
3. 给页面补基础测试，至少覆盖排序和对比逻辑
4. 增加筛选能力，比如按组合过滤、按区间过滤
5. 视情况把数据来源从手写静态数据升级为可更新的数据源

## 提交前检查

每次改完，至少做这几步：

```bash
npm run build
```

手动检查：

- 首页切换三种维度是否正常
- 升降序切换后排行是否正确
- 小组页锚点跳转是否可用
- 双人对比时两侧是否禁止选择同一人
- 缺少立绘时是否显示占位块

## 一个简单的维护心法

这个项目现在最大的优点是直接、轻、没有绕路。

所以后续开发时，尽量保持：

- 纯计算继续放在 `lib/`
- 页面只负责组织数据和组件
- 视觉规则尽量集中在样式层
- 静态资源命名继续和 `id` 对齐

这样后面不管是补功能、补数据，还是重做 UI，都不会太痛苦。
