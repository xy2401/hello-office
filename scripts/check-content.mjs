import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { nav, sidebar } from '../docs/.vitepress/nav.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const docs = resolve(root, 'docs')
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  if (['.vitepress', 'public'].includes(entry.name)) return []
  const file = resolve(directory, entry.name)
  return entry.isDirectory() ? walk(file) : entry.name.endsWith('.md') ? [file] : []
})
const pages = walk(docs)
const visited = new Set()
let links = 0
function checkLink(url, file) {
  if (/^(?:[a-z]+:|#|\/\/)/i.test(url)) return
  const route = decodeURIComponent(url.split(/[?#]/)[0])
  const path = route.startsWith('/') ? resolve(docs, '.' + route) : resolve(dirname(file), route)
  const target = [path + '.md', resolve(path, 'index.md'), path].find(candidate => existsSync(candidate))
  assert(target, `Missing route ${url} in ${relative(root, file)}`)
  visited.add(target)
  links++
}
function checkNavigation(value) {
  if (Array.isArray(value)) value.forEach(checkNavigation)
  else if (value && typeof value === 'object') {
    if (value.link) checkLink(value.link, resolve(docs, 'index.md'))
    Object.values(value).forEach(checkNavigation)
  }
}
checkNavigation([nav, sidebar])
for (const file of pages) {
  const source = readFileSync(file, 'utf8')
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').replace(/```[\s\S]*?```/g, '')
  const headings = body.match(/^# /gm) || []
  const home = file === resolve(docs, 'index.md')
  assert.equal(headings.length, home ? 0 : 1, `Unexpected H1 count in ${relative(root, file)}`)
  for (const match of source.matchAll(/\]\(([^)]+)\)/g)) checkLink(match[1], file)
  for (const match of source.matchAll(/^\s+link:\s*(\/\S+)\s*$/gm)) checkLink(match[1], file)
}
for (const file of pages) {
  if (file !== resolve(docs, 'index.md')) assert(visited.has(file), `Page has no inbound link: ${relative(root, file)}`)
}
const products = readdirSync(resolve(docs, 'products'), { withFileTypes: true }).filter(entry => entry.isDirectory())
for (const { name } of products) {
  const source = readFileSync(resolve(docs, 'products', name, 'index.md'), 'utf8')
  assert(/^# .+ 总览$/m.test(source), `${name}: expected overview title`)
  for (const pattern of [/边界/, /学习/, /\/version\//, /## 实验入口与范围/]) {
    assert(pattern.test(source), `${name}: missing overview section ${pattern}`)
  }
}
for (const file of ['meeting-notes.md', 'monthly-report.md', 'budget.csv']) {
  assert(existsSync(resolve(docs, 'public/templates', file)), `Missing download ${file}`)
}
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const lock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'))
assert.equal(lock.name, pkg.name)
assert.deepEqual(lock.packages[''].devDependencies, pkg.devDependencies)
assert.deepEqual(lock.packages[''].engines, pkg.engines)
assert.equal(pkg.devDependencies.vitepress, '1.6.4')
assert.equal(lock.packages['node_modules/vitepress'].version, '1.6.4')
console.log(JSON.stringify({ pages: pages.length, products: products.length, localLinks: links, downloads: 3 }))
