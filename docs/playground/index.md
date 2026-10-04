---
title: 办公练习台
aside: false
---

# 办公练习台

先练结构和口径，再在实际办公软件中完成原生文件。这里可以编辑文档大纲、组织五页汇报、计算预算与分类汇总，下载 Markdown 或 UTF-8 CSV。

<OfficePlayground />

## 能力与边界

页面使用本地固定逻辑，不运行 Word、PowerPoint 或 Excel，不执行输入的公式，不导入或生成 `.docx/.pptx/.xlsx`。文档预览是文字大纲，汇报预览是内容卡片，预算是按分计算的示例工具。

所有字段均在当前页面处理。点击“保存草稿”才写入当前浏览器本地存储，“恢复草稿”读取之前保存的内容，“清除保存”删除该存储。页面刷新会丢失尚未保存的编辑；共用设备完成练习后可清除保存。

预算金额支持 0 到 1000000 元、最多两位小数，空值和负金额会提示错误。差额为实际减预算；总预算为 0 时不计算支出占比。文本导出为 CSV 时会转义引号，并把可能触发公式的文本标记为文字。

## 下一步

- 文档大纲 → [会议纪要](/scenarios/meeting-notes) → [Word 样式](/products/word/layout)。
- 汇报结构 → [月度汇报](/scenarios/monthly-report) → [演示设计](/products/powerpoint/design)。
- 预算表 → [费用分析](/scenarios/budget-analysis) → [Excel 公式](/products/excel/formulas)。
