# 佟子易 · 作品集网站

纯静态站点，无构建步骤、无外部依赖（字体/脚本全部本机渲染）。

## 两个线上地址

| 用途 | 地址 |
|---|---|
| 主站（电脑） | https://laotong1.github.io/portfolio/ |
| 备用镜像 | https://tongziyi-portfolio.pages.dev/ |
| 手机版 | https://laotong1.github.io/portfolio/m/ |

手机打开主站会自动跳到 `/m/`；想留在电脑版加 `?desktop=1`。

## 更新流程

改完内容后，在文件夹里执行：

```powershell
.\deploy.ps1 "这次改了什么"
```

会同时推到 GitHub Pages 和 Cloudflare Pages，约 1 分钟生效。

只改内容不动版式时，通常只需要编辑 `assets/js/content.js`。

## 目录

```
index.html            电脑版（横向 12 屏）
m/index.html          手机版（竖屏，一屏一部片）
assets/js/content.js  所有文案与数据（唯一内容源）
assets/js/main.js     电脑版渲染与交互
assets/js/mobile.js   手机版渲染与交互
assets/js/particles.js 背景粒子
assets/css/style.css  电脑版样式
m/mobile.css          手机版样式
assets/video/         7 条成片片段（480×854，各约 2.2MB）
assets/img/           海报、分镜、头像
assets/pdf/           两份简历 PDF
_headers              Cloudflare 缓存策略
```

## 注意

- 视频码率 550kbps，是为国内慢速网络选的；换更大码率前先看 `main.js` 里的 `canAutoPlay()`
- 视频改名或换文件后，建议同时改一下 `content.js` 里的路径，避免浏览器缓存旧文件
