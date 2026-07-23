# 美国创业与工业设备市场进入计划

一套无需后端、数据保存在浏览器本地的 React + Vite 创业运营系统。

## 本地运行

```bash
npm install
npm run dev
```

开发服务器会输出本地访问地址。首次使用后，SOP、时间线、CRM、费用、周复盘、决策记录、学习资源、模板草稿和月度能力评估会保存在当前浏览器的 `localStorage`。

## 测试与构建

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run preview
```

生产文件位于 `dist/`。Vite 使用相对资源路径，因此兼容 GitHub Pages 的任意项目子路径。

## 部署到 GitHub Pages

1. 将项目推送到独立 GitHub 仓库的 `main` 分支。
2. 在仓库 `Settings → Pages → Build and deployment` 中选择 `GitHub Actions`。
3. 推送后 `.github/workflows/deploy.yml` 会自动测试、构建并发布。

## 数据与备份

- 本项目没有服务器，数据不会跨浏览器或设备自动同步。
- 在“工作模板 → 备份与迁移”中导出 JSON，建议每周备份。
- 导入会校验格式并在确认后覆盖当前浏览器的数据。
- 清理站点数据或浏览器存储会删除未导出的记录。

## 专业事项说明

本计划用于创业准备、市场验证和内部运营管理。涉及移民、税务、产品合规、进口、保险和合同的内容，需要由相关专业人士根据实际情况确认。
