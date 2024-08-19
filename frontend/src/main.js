import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder, faFolderOpen, faFileAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFolder, faFolderOpen, faFileAlt)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

store.dispatch('fetchUser').then(() => {
  if (store.getters.isAuthenticated) {
    store.dispatch('loadEditorSettings')
  }
  app.use(store).use(router).mount('#app')
})