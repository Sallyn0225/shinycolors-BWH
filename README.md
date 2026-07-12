# 闪耀色彩三围资料

面向《偶像大师 闪耀色彩》粉丝的静态资料工具：用 **cm 原始数值**浏览 28 名偶像的 B / W / H，支持总榜排序、组合平均值与双人并排对比。

页面只呈现已发布的三围厘米数，**不生成综合指数、不评价身材**。

**在线访问：** [https://shinycolors-bwh.pages.dev/](https://shinycolors-bwh.pages.dev/)

[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node](https://img.shields.io/badge/Node-%3E%3D20.19-3c873a?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-deployed-f38020?style=flat-square&logo=cloudflarepages&logoColor=white)](https://shinycolors-bwh.pages.dev/)

## 功能

- **成员总榜** — 按胸围 / 腰围 / 臀围单项排序，支持组合筛选、搜索与升降序
- **组合榜** — 按组合成员平均值排序，可展开查看各成员原始数值
- **双人对比** — 并排查看两名成员的 B/W/H 与雷达图
- **可分享状态** — 路由与筛选条件写在 URL hash 中，刷新与分享链接可还原当前视图
- **主题** — 浅色 / 深色 / 跟随系统

## 快速开始

**前置要求：** Node.js `>= 20.19`（推荐 22，仓库内已提供 `.nvmrc`）

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview

# 运行测试
npm test
```

开发服务器默认地址：`http://localhost:5173`

## 技术栈

| 类别 | 选用 |
|------|------|
| UI | React 19 |
| 语言 | TypeScript |
| 构建 | Vite 7 |
| 测试 | Vitest + jsdom |
| 部署 | 静态站点（Cloudflare Pages） |

无后端、无数据库：数据随构建打包，浏览器内完成筛选与排序。

## 项目结构

```text
├── assets/                          # 静态资源（偶像/组合图标，CF _headers）
├── shiny_colors_idol_measurements.json  # 三围与来源元数据
├── src/
│   ├── pages/                       # 总榜 / 组合榜 / 双人对比
│   ├── components/                  # 壳层、控件、榜单、雷达图
│   ├── data.ts                      # JSON → 领域模型
│   ├── domain.ts                    # 筛选、排序、组合均值
│   ├── urlState.ts                  # hash 路由与状态序列化
│   └── styles.css                   # 设计令牌与布局
├── vite.config.ts
└── package.json
```

## 数据说明

- **三围来源：** [THE IDOLM@STER SHINY COLORS 官方偶像资料](https://shinycolors.idolmaster-official.jp/idol/) 中的「3サイズ」（B/W/H，单位 cm）
- **代表色：** 来自 [shinycolors.moe](https://api.shinycolors.moe/) 接口字段，仅用于头像描边与图表系列着色
- 数据文件：`shiny_colors_idol_measurements.json`（含每条记录的 `source_url` 与核验日期）

> [!IMPORTANT]
> 本项目为**非官方**粉丝工具。角色、名称、图像与作品相关权利归原权利方所有。页面不声称官方背书，也不对身体作任何评价。

## 路由与状态

应用使用 **hash 路由**（无需服务端 SPA rewrite）：

| 路径 | 页面 |
|------|------|
| `#/overall` | 成员总榜 |
| `#/units` | 组合榜 |
| `#/compare` | 双人对比 |

查询参数示例：

```text
#/overall?metric=bust&dir=desc&unit=illumination_stars&q=真乃&theme=dark
#/compare?a=mano_sakuragi&b=hiori_kazano
```

| 参数 | 含义 |
|------|------|
| `metric` | `bust` / `waist` / `hip` |
| `dir` | `asc` / `desc` |
| `unit` | 组合 id |
| `q` | 搜索关键字 |
| `a` / `b` | 对比双方成员 id |
| `theme` | `system` / `light` / `dark` |

## 部署（Cloudflare Pages）

仓库已按静态站点部署适配：

| 设置 | 值 |
|------|-----|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 由 `.nvmrc`（`22`）指定，也可设 `NODE_VERSION=22` |

构建产物为纯静态文件；hash 路由下刷新任意页面都会回到 `index.html`，一般**不需要**额外的 SPA fallback 规则。

`assets/_headers` 会随构建复制到 `dist/`，提供基础安全响应头与静态资源缓存策略。

## 设计原则（摘要）

1. **数字优先** — cm 数值是首要可读信息  
2. **不做评判** — 排名只是单项排序，不是「好看程度」  
3. **短路径** — 筛选、搜索、对比应在少量操作内完成  
4. **粉丝工具诚实** — 标明非官方、可追溯来源  

更完整的产品与视觉说明见 [`PRODUCT.md`](./PRODUCT.md) 与 [`DESIGN.md`](./DESIGN.md)。
