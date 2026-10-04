import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createExample, moneyToCents, summarizeBudget, budgetCsv, readDraft, writeDraft,
} from '../docs/.vitepress/theme/office-tools.mjs'

test('预算明细与分类汇总一致，编辑后正确更新', () => {
  const { budget: rows } = createExample()
  const report = summarizeBudget(rows)
  assert.deepEqual([report.budget, report.actual, report.difference], [300000, 310000, 10000])
  assert.deepEqual(report.groups.find(group => group.category === '差旅'), {
    category: '差旅', budget: 200000, actual: 211000, difference: 11000,
  })
  assert.equal(report.groups.reduce((sum, group) => sum + group.actual, 0), report.actual)
  rows[0].actual = '1250.00'
  assert.equal(summarizeBudget(rows).difference, 0)
  rows.push({ item: '补充费用', category: '办公', budget: '0.10', actual: '0.20' })
  assert.equal(summarizeBudget(rows).difference, 10)
})

test('金额使用整数分，零预算不计算占比，非法金额不会被当作零', () => {
  assert.equal(moneyToCents('0.29'), 29)
  for (const input of ['', '-1', '1.001', 'NaN', '1e3', '1000000.01']) {
    assert.throws(() => moneyToCents(input))
  }
  const rows = [{ item: '示例', category: '办公', budget: '0', actual: '0.30' }]
  assert.equal(summarizeBudget(rows).usage, null)
  rows[0].actual = ''
  assert.throws(() => summarizeBudget(rows), /第 1 行/)
})

test('CSV 转义用户文本、保护公式前缀，保留数值和纯明细', () => {
  const csv = budgetCsv([
    { item: ' =HYPERLINK("x")', category: '办公,资料', budget: '0.30', actual: '0.10' },
    { item: '\t+1', category: '@SUM(A1)', budget: '1', actual: '2' },
  ])
  assert(csv.startsWith('\uFEFF'))
  assert(csv.includes('"\'=HYPERLINK(""x"")"'))
  assert(csv.includes('"办公,资料",0.30,0.10,-0.20'))
  assert(csv.includes('"\'+1","\'@SUM(A1)"'))
  assert.equal(csv.trimEnd().split('\r\n').length, 3)
})

test('草稿恢复接受已知字段，拒绝损坏、未知版本与错误明细', () => {
  const state = createExample()
  state.document.title = '恢复测试'
  state.mode = 'budget'
  assert.deepEqual(readDraft(writeDraft(state)), state)
  assert.throws(() => readDraft('broken'), /损坏/)
  assert.throws(() => readDraft(JSON.stringify({ version: 2, state })), /版本/)
  assert.throws(() => readDraft(JSON.stringify({ version: 1, state: { ...state, document: {} } })), /字段/)
  assert.throws(() => readDraft(JSON.stringify({ version: 1, state: { ...state, budget: [] } })), /明细/)
  const withUnknownFields = JSON.stringify({ version: 1, state: { ...state, unexpected: 'ignored' } })
  assert.equal(Object.hasOwn(readDraft(withUnknownFields), 'unexpected'), false)
})
