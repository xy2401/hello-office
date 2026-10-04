<script setup>
import { withBase } from 'vitepress'

const templates = [
  { file: 'meeting-notes.md', title: '会议纪要', detail: 'Markdown · 决定、问题与行动项' },
  { file: 'monthly-report.md', title: '五页汇报大纲', detail: 'Markdown · 结论、证据与下一步' },
  { file: 'budget.csv', title: '费用预算明细', detail: 'UTF-8 CSV · 四笔虚构费用' },
]
</script>

<template>
  <div class="template-downloads" aria-label="下载办公练习素材">
    <a v-for="item in templates" :key="item.file" :href="withBase('/templates/' + item.file)" :download="item.file">
      <strong>{{ item.title }} ↓</strong>
      <span>{{ item.detail }}</span>
    </a>
  </div>
</template>
