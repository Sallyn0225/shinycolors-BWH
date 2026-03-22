# ShinyColors BWH Visualizer

一个基于 `React + TypeScript + Vite` 的网页项目，用来把《偶像大师 闪耀色彩》28 位偶像的 B/W/H 数据做成可浏览、可切换、可对比的视觉化页面。

## 项目现在能做什么

- 在首页按 `Bust`、`Waist`、`Hips` 三个维度查看全员排行
- 在小组页查看各组合内部排行与当前维度平均值
- 在双人对比页选择两位偶像，直接比较三项数据
- 记住上次选择的排序维度和排序方向
- 自动读取 `public/assets/idols/` 下的立绘，缺图时回退到占位样式

## 技术栈

- `React 18`
- `TypeScript`
- `Vite 5`
- `react-router-dom 6`

## 本地启动

先安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

## 页面说明

### `首页排行 /`

- 展示 28 位偶像的全员排行
- 顶部可以切换排序维度和升降序
- 排名条的长度按当前维度最小值和最大值归一化

### `小组页 /units`

- 按组合分区展示成员排行
- 每个组合显示人数和当前维度平均值
- 顶部提供组合锚点跳转

### `双人对比 /compare`

- 左右各选一位偶像
- 中间比分板同时展示三项数据
- 当前全局选中的维度会高亮显示

## 目录结构

```text
src/
  components/        可复用 UI 组件
  data/              偶像与组合静态数据
  lib/               排序、均值、对比等纯函数
  pages/             三个主页面
  state/             排行偏好状态与 localStorage 持久化
  types.ts           核心类型定义
  styles.css         全局样式
public/
  assets/idols/      偶像立绘资源
docs/
  idol-assets.md     立绘资源命名与素材要求
```

## 数据与素材

项目的核心静态数据在 [src/data/idols.ts](/E:/Download/others/agent-test/shinycolors-BWH/src/data/idols.ts)。

每位偶像包含：

- `id`
- `name`
- `japaneseName`
- `unit`
- `accent`
- `measurements`
- `sourceUrl`

立绘素材请放在：

```text
public/assets/idols/
```

具体命名规则和兜底行为见 [docs/idol-assets.md](/E:/Download/others/agent-test/shinycolors-BWH/docs/idol-assets.md)。

## 开发时要注意

- 当前路由基于 `BrowserRouter`，如果部署到纯静态托管平台，需要配置 SPA fallback / rewrite
- 排序偏好写入浏览器 `localStorage`，key 为 `shinycolors-bwh-preferences`
- 当前没有接入测试、lint、格式化脚本，提交前至少建议跑一次 `npm run build`

## 后续开发文档

后续要扩功能、补数据、换视觉，先看 [docs/development.md](/E:/Download/others/agent-test/shinycolors-BWH/docs/development.md)。
