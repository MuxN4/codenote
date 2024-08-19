import { createStore } from 'vuex'
import pb from '../pocketbase'

export default createStore({
  state: {
    user: null,
    editorSettings: {
      theme: 'default',
      fontSize: 14,
      tabSize: 4,
      lineWrapping: false
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setEditorSettings(state, settings) {
      state.editorSettings = settings
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const authData = await pb.collection('users').authWithPassword(email, password)
        commit('setUser', authData.record)
        return true
      } catch (error) {
        console.error('Login failed', error)
        return false
      }
    },
    async signup({ commit }, { email, password, passwordConfirm }) {
      try {
        const user = await pb.collection('users').create({
          email,
          password,
          passwordConfirm,
        })
        await pb.collection('users').authWithPassword(email, password)
        commit('setUser', user)
        return true
      } catch (error) {
        console.error('Signup failed', error)
        return false
      }
    },
    async logout({ commit }) {
      pb.authStore.clear()
      commit('setUser', null)
    },
    async fetchUser({ commit }) {
      if (pb.authStore.isValid) {
        commit('setUser', pb.authStore.model)
      } else {
        commit('setUser', null)
      }
    },
    async loadEditorSettings({ commit, state }) {
      try {
        const userSettings = await pb.collection('user_settings').getFirstListItem(`user="${state.user.id}"`)
        commit('setEditorSettings', userSettings.settings)
      } catch (error) {
        console.error('Error loading editor settings:', error)
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
})