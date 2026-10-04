export const nav = [
  { text: '办公入门', link: '/guide/' },
  { text: '应用手册', items: [
    { text: '应用总览', link: '/products/' },
    { text: 'Word 文档', link: '/products/word/' },
    { text: 'PowerPoint 汇报', link: '/products/powerpoint/' },
    { text: 'Excel 表格', link: '/products/excel/' },
  ] },
  { text: '场景实战', link: '/scenarios/' },
  { text: '工具对照', link: '/matrix/' },
  { text: '办公练习台', link: '/playground/' },
  { text: '模板与速查', link: '/reference/' },
]

export const sidebar = {
  '/': [
    { text: '办公入门', items: [
      { text: '从任务到交付', link: '/guide/' },
      { text: '文件格式与兼容', link: '/guide/file-formats' },
      { text: '协作、审阅与交付', link: '/guide/collaboration' },
      { text: '应用总览', link: '/products/' },
    ] },
    { text: 'Word · 文档写作', collapsed: false, items: [
      { text: 'Word 总览', link: '/products/word/' },
      { text: '样式、目录与分页', link: '/products/word/layout' },
      { text: '批注、修订与定稿', link: '/products/word/review' },
      { text: '版本与平台', link: '/products/word/version/' },
    ] },
    { text: 'PowerPoint · 演示汇报', collapsed: false, items: [
      { text: 'PowerPoint 总览', link: '/products/powerpoint/' },
      { text: '结构、叙事与讲稿', link: '/products/powerpoint/storytelling' },
      { text: '母版、图表与可读性', link: '/products/powerpoint/design' },
      { text: '版本与平台', link: '/products/powerpoint/version/' },
    ] },
    { text: 'Excel · 表格分析', collapsed: false, items: [
      { text: 'Excel 总览', link: '/products/excel/' },
      { text: '公式、引用与查找', link: '/products/excel/formulas' },
      { text: '整理、透视与图表', link: '/products/excel/analysis' },
      { text: '版本与平台', link: '/products/excel/version/' },
    ] },
    { text: '场景实战', items: [
      { text: '任务目录', link: '/scenarios/' },
      { text: '会议纪要与行动项', link: '/scenarios/meeting-notes' },
      { text: '月度工作汇报', link: '/scenarios/monthly-report' },
      { text: '费用预算与偏差分析', link: '/scenarios/budget-analysis' },
    ] },
    { text: '练习与参考', items: [
      { text: '办公工具对照', link: '/matrix/' },
      { text: '办公练习台', link: '/playground/' },
      { text: '模板与官方资料', link: '/reference/' },
      { text: '练习素材与模板', link: '/reference/templates' },
      { text: '常用快捷键', link: '/reference/shortcuts' },
    ] },
  ],
}
