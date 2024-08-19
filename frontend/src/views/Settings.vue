<template>
  <div class="settings">
    <h2>Settings</h2>
    <div class="setting-group">
      <label for="theme">Theme:</label>
      <select id="theme" v-model="settings.theme" @change="saveSettings" class="select">
        <option value="default">Default</option>
        <option value="monokai">Monokai</option>
        <option value="solarized">Solarized</option>
      </select>
    </div>
    <div class="setting-group">
      <label for="fontSize">Font Size:</label>
      <input type="number" id="fontSize" v-model="settings.fontSize" @change="saveSettings" min="8" max="24" class="input">
    </div>
    <div class="setting-group">
      <label for="tabSize">Tab Size:</label>
      <input type="number" id="tabSize" v-model="settings.tabSize" @change="saveSettings" min="1" max="8" class="input">
    </div>
    <div class="setting-group checkbox">
      <label for="lineWrapping">
        <input type="checkbox" id="lineWrapping" v-model="settings.lineWrapping" @change="saveSettings">
        Enable Line Wrapping
      </label>
    </div>
  </div>
</template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import pb from '@/pocketbase'
  
  export default {
    name: 'Settings',
    setup() {
      const store = useStore()
      const settings = ref({
        theme: 'default',
        fontSize: 14,
        tabSize: 4,
        lineWrapping: false
      })
  
      const loadSettings = async () => {
        try {
          const userSettings = await pb.collection('user_settings').getFirstListItem(`user="${store.state.user.id}"`)
          settings.value = { ...settings.value, ...userSettings.settings }
        } catch (error) {
          console.error('Error loading settings:', error)
        }
      }
  
      const saveSettings = async () => {
        try {
          const userSettings = await pb.collection('user_settings').getFirstListItem(`user="${store.state.user.id}"`)
          await pb.collection('user_settings').update(userSettings.id, {
            settings: settings.value
          })
          store.commit('setEditorSettings', settings.value)
        } catch (error) {
          if (error.status === 404) {
            // Settings don't exist, create new
            await pb.collection('user_settings').create({
              user: store.state.user.id,
              settings: settings.value
            })
            store.commit('setEditorSettings', settings.value)
          } else {
            console.error('Error saving settings:', error)
          }
        }
      }
  
      onMounted(loadSettings)
  
      return {
        settings,
        saveSettings
      }
    }
  }
  </script>
  
  <style scoped>
.settings {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.setting-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

.checkbox {
  display: flex;
  align-items: center;
}

.checkbox input {
  margin-right: 10px;
}

@media (max-width: 768px) {
  .settings {
    padding: 10px;
  }
}
</style>