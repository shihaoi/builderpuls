# BuilderPulse Reader

将 [BuilderPulse/BuilderPulse](https://github.com/BuilderPulse/BuilderPulse) 的每日 Markdown 报告做成更易阅读的网站，并自动从上游仓库同步最新内容。

## 功能

- 中英文双语浏览
- 首页展示今日 build 建议 + 历史归档
- 日报阅读页带目录导航、上一篇/下一篇
- 构建前自动从 GitHub 拉取最新报告

## 本地开发

```bash
pnpm install
pnpm dev
```

首次启动会自动执行 `pnpm sync` 拉取内容。访问 http://localhost:3000 （默认跳转中文版 `/zh`）。

## 手动同步

```bash
pnpm sync
```

## 部署

项目配置为静态导出（`output: "export"`），可部署到 GitHub Pages、Vercel、Cloudflare Pages 等。

### GitHub Pages

1. 将本仓库推送到 GitHub
2. 在仓库 Settings → Pages 中，Source 选择 **GitHub Actions**
3. 推送 `main` 分支后，`.github/workflows/sync-and-deploy.yml` 会自动：
   - 每天 2 次从上游同步内容
   - 构建并部署网站

也可在 Actions 页手动触发 **Sync & Deploy**。

## 内容来源

所有报告内容版权归 [BuilderPulse](https://github.com/BuilderPulse/BuilderPulse) / [刘小排](https://github.com/liuxiaopai-ai) 所有，采用 [CC BY-NC 4.0](https://github.com/BuilderPulse/BuilderPulse/blob/main/LICENSE.md) 许可。