export const modes = ['document', 'slides', 'budget']

export function createExample() {
  return {
    mode: 'document',
    document: {
      title: '客户培训筹备会议纪要',
      context: '准备下一月的客户培训，讨论报名、场地和演示内容。',
      conclusion: '先准备两场培训；是否增加第三场，根据报名人数另行决定。',
      actions: '小林：2026-10-09 前确认报名表和场地。\n小周：2026-10-12 前准备演示初稿。',
    },
    presentation: {
      title: '月度工作汇报',
      audience: '团队负责人',
      conclusion: '本月完成 8/10 项，两项外部依赖影响后续计划。',
      evidence: '计划 10 项，实际完成 8 项。\n来源：虚构练习任务清单；实际使用时补充截止日期与口径。',
      risks: '两项任务等待外部确认，需要评估影响与替代方案。',
      actions: '确认外部依赖，并明确下月优先级、负责人和截止日期。',
    },
    budget: [
      { item: '客户拜访交通', category: '差旅', budget: '1200.00', actual: '1350.00' },
      { item: '异地住宿', category: '差旅', budget: '800.00', actual: '760.00' },
      { item: '团队工作餐', category: '餐饮', budget: '600.00', actual: '540.00' },
      { item: '资料印刷', category: '办公', budget: '400.00', actual: '450.00' },
    ],
  }
}

export function moneyToCents(value) {
  const text = String(value).trim()
  if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(text)) {
    throw new Error('金额请填写非负数字，最多两位小数。')
  }
  const [whole, fraction = ''] = text.split('.')
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  if (cents > 100000000) throw new Error('每笔金额上限为 1000000 元。')
  return cents
}

export const formatMoney = cents => (cents / 100).toFixed(2)

export function summarizeBudget(rows) {
  if (!Array.isArray(rows) || rows.length < 1 || rows.length > 30) {
    throw new Error('预算表需要 1–30 条明细。')
  }
  let budget = 0
  let actual = 0
  const groups = new Map()
  const details = rows.map((row, index) => {
    if (!row || typeof row.item !== 'string' || !row.item.trim() || row.item.length > 120 ||
        typeof row.category !== 'string' || !row.category.trim() || row.category.length > 120) {
      throw new Error(`第 ${index + 1} 行需要项目与分类，且各不超过 120 字。`)
    }
    let planned
    let spent
    try {
      planned = moneyToCents(row.budget)
      spent = moneyToCents(row.actual)
    } catch (error) {
      throw new Error(`第 ${index + 1} 行：${error.message}`)
    }
    budget += planned
    actual += spent
    const category = row.category.trim()
    const group = groups.get(category) || { category, budget: 0, actual: 0 }
    group.budget += planned
    group.actual += spent
    groups.set(category, group)
    return { item: row.item.trim(), category, budget: planned, actual: spent, difference: spent - planned }
  })
  return {
    budget, actual, difference: actual - budget,
    usage: budget === 0 ? null : actual / budget * 100,
    details,
    groups: [...groups.values()].map(group => ({ ...group, difference: group.actual - group.budget })),
  }
}

function csvText(value) {
  // Protect editable text from spreadsheet formula interpretation, including whitespace prefixes.
  let text = String(value)
  if (/^\s*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text
  return '"' + text.replaceAll('"', '""') + '"'
}

export function budgetCsv(rows) {
  const report = summarizeBudget(rows)
  const header = ['项目', '分类', '预算（元）', '实际（元）', '差额（实际减预算）'].map(csvText).join(',')
  const lines = report.details.map(row => [
    csvText(row.item), csvText(row.category),
    formatMoney(row.budget), formatMoney(row.actual), formatMoney(row.difference),
  ].join(','))
  // No total row: imported files remain a clean detail table for subsequent analysis.
  return '\uFEFF' + [header, ...lines].join('\r\n') + '\r\n'
}

export function documentOutline(fields) {
  return `# ${fields.title.trim() || '未命名文档'}\n\n## 背景与范围\n\n${fields.context}\n\n## 核心结论\n\n${fields.conclusion}\n\n## 行动项\n\n${fields.actions}\n`
}

export function presentationSlides(fields) {
  return [
    { title: '本次要点', content: `${fields.title || '未命名汇报'}\n汇报对象：${fields.audience || '待填写'}` },
    { title: '核心结论', content: fields.conclusion },
    { title: '支持证据', content: fields.evidence },
    { title: '风险与取舍', content: fields.risks },
    { title: '下一步', content: fields.actions },
  ]
}

export function presentationOutline(fields) {
  const body = presentationSlides(fields).map((slide, index) => `## ${index + 1}. ${slide.title}\n\n${slide.content}`).join('\n\n')
  return `# ${fields.title.trim() || '未命名汇报'}\n\n${body}\n`
}

export function readDraft(source) {
  if (typeof source !== 'string' || source.length > 100000) throw new Error('草稿大小无效。')
  let saved
  try { saved = JSON.parse(source) } catch { throw new Error('草稿内容损坏，无法恢复。') }
  if (!saved || saved.version !== 1 || !saved.state || !modes.includes(saved.state.mode)) {
    throw new Error('草稿版本或练习类型无效。')
  }
  const state = saved.state
  const result = { mode: state.mode }
  for (const section of ['document', 'presentation']) {
    const expected = Object.keys(createExample()[section])
    result[section] = {}
    for (const key of expected) {
      const value = state[section]?.[key]
      if (typeof value !== 'string' || value.length > (['title', 'audience'].includes(key) ? 120 : 2000)) {
        throw new Error('草稿字段缺失或过长，无法恢复。')
      }
      result[section][key] = value
    }
  }
  summarizeBudget(state.budget)
  result.budget = state.budget.map(row => ({
    item: row.item, category: row.category, budget: String(row.budget), actual: String(row.actual),
  }))
  return result
}

export function writeDraft(state) {
  const text = JSON.stringify({ version: 1, state })
  readDraft(text)
  return text
}
