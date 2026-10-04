import { defineConfig } from 'vitepress'
import { sharedThemeLabels } from './shared-ui'
// @ts-ignore -- 与轻量内容检查共享导航数据
import { nav, sidebar } from './nav.mjs'

const base = process.env.DOCS_BASE || '/'

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: 'Hello Office',
  titleTemplate: ':title | 办公实用手册',
  description: 'Word 文档、PowerPoint 汇报、Excel 表格与日常办公协作：从任务到交付的中文手册和练习台',
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }]],
  transformPageData(pageData) {
    if (!pageData.relativePath.startsWith('products/')) return
    const classes = String(pageData.frontmatter.pageClass || '').split(/\s+/).filter(Boolean)
    pageData.frontmatter.pageClass = [...new Set([...classes, 'product-doc-page'])].join(' ')
  },
  themeConfig: {
    ...sharedThemeLabels,
    logo: '/favicon.svg',
    nav,
    sidebar,
    outline: { level: [2, 3], label: '本页目录' },
    lastUpdated: { text: '最后更新' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    footer: {
      message: '写清楚 · 讲明白 · 算准确 · 交付可靠',
      copyright: 'Hello Office',
    },
  },
})
