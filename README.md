# ShinyColors BWH Visualizer

<div align="center">

一个基于 React、TypeScript、Vite 构建的《偶像大师 闪耀色彩》三围数据可视化站点。  
支持全员排行、组合视图、双人对比，并已适配 `Vercel`、`Netlify`、`Cloudflare Pages` 三个平台。

<p>
  <img alt="Vite 5" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" />
  <img alt="React 18" src="https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript 5" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Router" src="https://img.shields.io/badge/Router-BrowserRouter-CA4245" />
  <img alt="Deploy Ready" src="https://img.shields.io/badge/Deploy-Vercel%20%7C%20Netlify%20%7C%20CF%20Pages-111111" />
  <img alt="License MIT for code" src="https://img.shields.io/badge/License-Code%20MIT-2EA44F" />
</p>

</div>

## 一眼看懂这个项目

这是一个静态前端项目，目标很直接：

- 把 28 位偶像的 `Bust / Waist / Hips` 数据做成直观排行
- 在组合维度下快速观察成员差异和平均值
- 在双人对比页面里同时比较三项数据
- 保持部署简单，构建后只输出纯静态资源

如果你只是想跑起来，先看下面这块。

## Quick Start

安装依赖：

```bash
npm install
```

启动本地开发：

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

## Feature Snapshot

| 页面 | 路径 | 说明 |
| --- | --- | --- |
| 首页排行 | `/` | 展示全员排行，支持维度切换和升降序 |
| 小组页 | `/units` | 按组合展示排行、人数和当前维度平均值 |
| 双人对比 | `/compare` | 左右选择两位偶像，直接比较三项数据 |

## Why This Repo Is Easy To Deploy

项目当前是标准静态 SPA：

- 构建命令固定为 `npm run build`
- 构建产物固定输出到 `dist`
- 路由使用 `BrowserRouter`
- 仓库已内置三平台需要的 SPA fallback 配置

这意味着你把仓库导入部署平台后，不需要再改运行时代码。

## Deploy

默认部署假设：

- 站点部署在域名根路径 `/`
- 不做子目录 `base` 适配
- 输出目录是 `dist`

### Vercel

仓库内已提供 [vercel.json](./vercel.json)。

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- 已配置 SPA rewrite，刷新 `/units`、`/compare` 不会直接 404

### Netlify

仓库内已提供 [netlify.toml](./netlify.toml) 和 [public/_redirects](./public/_redirects)。

- Build command: `npm run build`
- Publish directory: `dist`
- `_redirects` 会在构建后进入产物目录
- 所有前端路由都会回退到 `index.html`

### Cloudflare Pages

Cloudflare Pages 直接复用 [public/_redirects](./public/_redirects) 的回退规则。

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- 保持根目录部署即可

## Project Structure

```text
src/
  components/        Reusable UI components
  data/              Static idol and unit data
  lib/               Ranking and comparison helpers
  pages/             Route-level pages
  state/             Ranking preference state
  types.ts           Shared domain types
  styles.css         Global visual styles
public/
  assets/idols/      Idol visual assets
  _redirects         SPA fallback for Netlify / Cloudflare Pages
docs/
  idol-assets.md     Asset naming rules
  development.md     Maintenance notes
  releases/          Release notes
```

## Data And Assets

核心数据位于 [src/data/idols.ts](./src/data/idols.ts)。

每位偶像包含：

- `id`
- `name`
- `japaneseName`
- `unit`
- `accent`
- `measurements`
- `sourceUrl`

立绘素材放在：

```text
public/assets/idols/
```

具体命名规则和兜底行为见 [docs/idol-assets.md](./docs/idol-assets.md)。

## Maintainer Notes

- 当前路由基于 `BrowserRouter`
- 排序偏好写入浏览器 `localStorage`
- 仓库已内置 `vercel.json`、`netlify.toml`、`public/_redirects`
- 当前没有 `lint` 和自动化测试，提交前至少跑一次 `npm run build`

更完整的维护说明见 [docs/development.md](./docs/development.md)。

## Release Notes

当前发布准备文档见 [docs/releases/v0.2.0.md](./docs/releases/v0.2.0.md)。

建议发布标签：

```text
v0.2.0
```

## License

本仓库采用 [MIT License](./LICENSE) 许可原创源码与文档。

和《偶像大师 闪耀色彩》相关的角色名称、官方设定、品牌元素，以及 `public/assets/` 下可能涉及第三方版权或商标的素材，不自动纳入 MIT 授权范围。具体见 [COPYRIGHT](./COPYRIGHT)。
