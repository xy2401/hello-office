# Hello Office

面向日常办公的中文手册与练习台。围绕 Word 文档、PowerPoint 汇报、Excel 表格，以及文件格式、审阅协作和最终交付组织内容。

沿用 Hello 系列的独立 VitePress 架构、公共视觉模板、中文搜索与导航。学习入口以具体工作任务为主，WPS Office、LibreOffice 的互操作边界放在工具对照与格式指南中。

## 本地开发

建议使用 Node.js 22.16+ 与 PowerShell 7。在本项目目录执行：

```powershell
npm ci
npm run docs:dev
```

本地开发地址为 `http://127.0.0.1:5179/`。保持当前终端运行，按 `Ctrl+C` 停止开发服务。

```powershell
npm run check:content
npm run test:office
npm run docs:build
npm run docs:preview
```

内容检查只读取页面、导航和本地链接；单元测试验证预算计算、输入恢复和导出规则。构建、安装依赖与验证须遵守当前会话及仓库的执行许可约定。

通过环境变量 `DOCS_BASE` 支持子路径，例如 `$env:DOCS_BASE='/hello-office/'`。公共模板保留在本仓库内，安装、构建与部署均在本仓库完成。

## 内容与目录

| 目录 | 用途 |
| --- | --- |
| `docs/guide/` | 学习路径、文件格式与协作交付 |
| `docs/products/` | Word、PowerPoint、Excel 总览、操作方法与版本边界 |
| `docs/scenarios/` | 会议纪要、月度汇报、预算分析的完整任务 |
| `docs/matrix/` | 按任务对照 Microsoft Office、WPS Office、LibreOffice |
| `docs/playground/` | 文档大纲、汇报结构、预算表练习入口 |
| `docs/reference/` | 模板、快捷键与官方资料 |
| `docs/public/templates/` | 可下载的 Markdown/CSV 练习素材 |
| `docs/.vitepress/theme/` | 主题、办公练习组件与公共模板副本 |
| `demos/` | 与练习资料对应的本地操作说明 |
| `scripts/`、`tests/` | 轻量内容检查与办公逻辑测试 |

## 练习台能力

页面可以编辑并预览文档大纲、生成五页汇报结构、计算预算偏差与分类汇总，下载 Markdown 或 UTF-8 CSV。草稿只有点击“保存草稿”才写入当前浏览器的本地存储，可恢复或清除；没有服务端和上传接口。

这是学习辅助工具，不是 Word/PPT/Excel 在线编辑器。它不执行 Excel 公式、不读写 `.docx/.pptx/.xlsx`，也不验证 Office 的真实排版。原生格式需要在对应办公软件中完成，再按场景清单核对。

## 仓库组织

本项目使用独立 Git 仓库，SSH 地址为 `git@github.com:xy2401/hello-office.git`：

```powershell
git clone git@github.com:xy2401/hello-office.git
cd hello-office
```

依赖、构建脚本与部署配置由本仓库维护。公共设计模板的副本位于 `docs/.vitepress/`；领域样式和办公内容在本项目维护。
