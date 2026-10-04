import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { installUiLabels } from './ui-labels'
import OfficePlayground from './components/OfficePlayground.vue'
import TemplateDownloads from './components/TemplateDownloads.vue'
import './doc-baseline.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    installUiLabels(app)
    app.component('OfficePlayground', OfficePlayground)
    app.component('TemplateDownloads', TemplateDownloads)
  },
} satisfies Theme
