# AI发展史：1950—2026

这是一个用于抖音发布的中文竖屏 HyperFrames 短视频项目。当前阶段只包含 HTML、CSS、SVG 与 GSAP 动画，不包含旁白音频和音乐。

## 视频规格
- 标题：AI发展史：1950—2026
- 画布：1080 × 1920
- 方向：9:16 竖屏
- 帧率：30fps
- 总时长：72秒
- 语言：简体中文

## 文件结构
```text
.
├── .gitignore
├── DESIGN.md
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── compositions
│   └── ai-history.html
├── scripts
│   └── validate-project.mjs
└── renders
    └── .gitkeep
```

## 安装
```bash
npm install --ignore-scripts
```

## Lint
```bash
npm run lint
```

## Validate
```bash
npm run validate
```

## Inspect
```bash
npm run inspect
```

## Preview
不要用 `file://` 直接打开 `index.html`。请使用 HyperFrames Studio：

```bash
npm run preview
```

正确预览入口是 HyperFrames Studio 项目 URL，例如当前仓库目录对应：

```text
http://localhost:3002/#project/yixing
```

## 草稿渲染
本轮不要运行渲染。需要草稿时再执行：

```bash
npm run render:draft
```

## 正式渲染
本轮不要运行渲染。需要正式版时再执行：

```bash
npm run render:final
```

## 浏览器或 Chrome 缺失
如果 inspect、preview 或 render 提示浏览器缺失，请先运行：

```bash
npx hyperframes doctor
npx hyperframes browser
```

## 当前音频状态
当前不包含旁白和音乐；画面可先完成审阅，后续再接入本地授权音频或生成音频。
