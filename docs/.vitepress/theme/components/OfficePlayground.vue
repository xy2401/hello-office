<script setup>
import { computed, reactive, ref } from 'vue'
import {
  createExample, summarizeBudget, formatMoney, budgetCsv,
  documentOutline, presentationSlides, presentationOutline, readDraft, writeDraft,
} from '../office-tools.mjs'

const storageKey = 'hello-office:practice:v1'
const state = reactive(createExample())
const status = ref('当前为虚构示例；编辑内容不会自动保存。')
const storageError = ref(false)
const documentFields = [
  { key: 'context', label: '背景与范围' },
  { key: 'conclusion', label: '核心结论' },
  { key: 'actions', label: '行动项 · 负责人和截止时间' },
]
const presentationFields = [
  { key: 'conclusion', label: '核心结论' },
  { key: 'evidence', label: '支持证据 · 来源与口径' },
  { key: 'risks', label: '风险与取舍' },
  { key: 'actions', label: '下一步 · 负责人和截止时间' },
]
const outline = computed(() => documentOutline(state.document))
const slides = computed(() => presentationSlides(state.presentation))
const budget = computed(() => {
  try { return { report: summarizeBudget(state.budget), error: '' } }
  catch (error) { return { report: null, error: error.message } }
})

function reportStatus(message, isError = false) {
  status.value = message
  storageError.value = isError
}

function addRow() {
  if (state.budget.length >= 30) return
  state.budget.push({ item: '新增费用', category: '办公', budget: '0.00', actual: '0.00' })
}

function resetCurrent() {
  const example = createExample()
  if (state.mode === 'document') state.document = example.document
  else if (state.mode === 'slides') state.presentation = example.presentation
  else state.budget = example.budget
  reportStatus('当前练习已恢复为示例，已保存的草稿仍可恢复。')
}

function saveDraft() {
  try {
    localStorage.setItem(storageKey, writeDraft(state))
    reportStatus('三种练习已保存到当前浏览器，可点击“恢复草稿”读取。')
  } catch (error) {
    reportStatus(`无法保存草稿：${error.message}。可下载当前结果。`, true)
  }
}

function restoreDraft() {
  try {
    const source = localStorage.getItem(storageKey)
    if (source === null) { reportStatus('当前浏览器没有保存的草稿。'); return }
    const saved = readDraft(source)
    Object.assign(state, saved)
    reportStatus('草稿已恢复，原页面未保存的编辑已被替换。')
  } catch (error) {
    reportStatus(`无法恢复草稿：${error.message}。当前编辑保留，可清除保存后重试。`, true)
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(storageKey)
    reportStatus('已清除当前浏览器保存的草稿，页面编辑内容保留。')
  } catch (error) { reportStatus(`无法清除保存：${error.message}`, true) }
}

function download() {
  let url
  let anchor
  try {
    const kind = state.mode
    const content = kind === 'budget' ? budgetCsv(state.budget) : kind === 'slides' ? presentationOutline(state.presentation) : outline.value
    const filename = kind === 'budget' ? 'office-budget.csv' : kind === 'slides' ? 'office-presentation.md' : 'office-document.md'
    const type = kind === 'budget' ? 'text/csv;charset=utf-8' : 'text/markdown;charset=utf-8'
    url = URL.createObjectURL(new Blob([content], { type }))
    anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    reportStatus(`已生成 ${filename}，请在浏览器下载记录中查看。`)
  } catch (error) { reportStatus(`无法下载：${error.message}`, true) }
  finally {
    anchor?.remove()
    if (url) setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
</script>

<template>
  <section class="office-playground" aria-label="办公练习编辑与预览">
    <fieldset>
      <legend>选择练习</legend>
      <div class="office-modes">
        <label><input v-model="state.mode" type="radio" value="document" name="office-mode">文档大纲</label>
        <label><input v-model="state.mode" type="radio" value="slides" name="office-mode">汇报结构</label>
        <label><input v-model="state.mode" type="radio" value="budget" name="office-mode">预算表</label>
      </div>
    </fieldset>

    <div v-if="state.mode === 'document'" class="office-grid">
      <div class="office-form">
        <label for="office-doc-title">文档标题<input id="office-doc-title" v-model="state.document.title" maxlength="120"></label>
        <label v-for="field in documentFields" :key="field.key" :for="'office-doc-' + field.key">
          {{ field.label }}
          <textarea :id="'office-doc-' + field.key" v-model="state.document[field.key]" maxlength="2000" rows="4" />
        </label>
      </div>
      <div class="office-preview">
        <h2>文档大纲预览</h2>
        <pre>{{ outline }}</pre>
      </div>
    </div>

    <div v-else-if="state.mode === 'slides'" class="office-grid">
      <div class="office-form">
        <label for="office-ppt-title">汇报主题<input id="office-ppt-title" v-model="state.presentation.title" maxlength="120"></label>
        <label for="office-ppt-audience">汇报对象<input id="office-ppt-audience" v-model="state.presentation.audience" maxlength="120"></label>
        <label v-for="field in presentationFields" :key="field.key" :for="'office-ppt-' + field.key">
          {{ field.label }}
          <textarea :id="'office-ppt-' + field.key" v-model="state.presentation[field.key]" maxlength="2000" rows="3" />
        </label>
      </div>
      <div class="office-preview">
        <h2>五页汇报结构</h2>
        <div class="office-slides">
          <article v-for="(slide, index) in slides" :key="slide.title">
            <small>第 {{ index + 1 }} 页</small>
            <h3>{{ slide.title }}</h3>
            <p>{{ slide.content || '请补充内容' }}</p>
          </article>
        </div>
      </div>
    </div>

    <div v-else>
      <h2>费用预算 · 单位：元</h2>
      <p>差额 = 实际 − 预算，正数表示超支。金额非负、最多两位小数；空值需要补齐。</p>
      <div class="office-table-scroll">
        <table class="budget-table">
          <caption>预算明细（最多 30 条）</caption>
          <thead><tr><th scope="col">项目</th><th scope="col">分类</th><th scope="col">预算</th><th scope="col">实际</th><th scope="col">操作</th></tr></thead>
          <tbody>
            <tr v-for="(row, index) in state.budget" :key="index">
              <td><input v-model="row.item" :aria-label="'第 ' + (index + 1) + ' 行项目'" maxlength="120"></td>
              <td><input v-model="row.category" :aria-label="'第 ' + (index + 1) + ' 行分类'" maxlength="120"></td>
              <td><input v-model="row.budget" :aria-label="'第 ' + (index + 1) + ' 行预算（元）'" inputmode="decimal" maxlength="10"></td>
              <td><input v-model="row.actual" :aria-label="'第 ' + (index + 1) + ' 行实际（元）'" inputmode="decimal" maxlength="10"></td>
              <td><button type="button" :disabled="state.budget.length === 1" :aria-label="'删除第 ' + (index + 1) + ' 行'" @click="state.budget.splice(index, 1)">删除</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button type="button" :disabled="state.budget.length >= 30" @click="addRow">添加明细</button>
      <p v-if="budget.error" class="office-error" role="alert">{{ budget.error }}</p>
      <div v-if="budget.report" class="office-preview">
        <div class="office-summary" aria-label="总体预算汇总">
          <span>总预算<strong>{{ formatMoney(budget.report.budget) }}</strong></span>
          <span>总实际<strong>{{ formatMoney(budget.report.actual) }}</strong></span>
          <span>总差额<strong>{{ formatMoney(budget.report.difference) }}</strong></span>
          <span>支出占预算<strong>{{ budget.report.usage === null ? '预算为 0，不计算' : budget.report.usage.toFixed(1) + '%' }}</strong></span>
        </div>
        <div class="office-table-scroll">
          <table class="budget-table">
            <caption>分类汇总 · 单位：元</caption>
            <thead><tr><th scope="col">分类</th><th scope="col">预算</th><th scope="col">实际</th><th scope="col">差额</th></tr></thead>
            <tbody><tr v-for="group in budget.report.groups" :key="group.category">
              <th scope="row">{{ group.category }}</th>
              <td class="money">{{ formatMoney(group.budget) }}</td>
              <td class="money">{{ formatMoney(group.actual) }}</td>
              <td class="money">{{ formatMoney(group.difference) }}</td>
            </tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="office-actions">
      <button type="button" class="primary" :disabled="state.mode === 'budget' && !!budget.error" @click="download">{{ state.mode === 'budget' ? '下载 CSV' : '下载 Markdown' }}</button>
      <button type="button" @click="saveDraft">保存草稿</button>
      <button type="button" @click="restoreDraft">恢复草稿</button>
      <button type="button" @click="clearDraft">清除保存</button>
      <button type="button" @click="resetCurrent">重置当前练习</button>
    </div>
    <p class="office-status" :class="{ 'office-error': storageError }" role="status" aria-live="polite">{{ status }}</p>
    <small>草稿仅保存在当前浏览器；恢复和重置会替换页面中的对应内容。</small>
  </section>
</template>
