import { createStore } from 'vuex'
import pb from '../pocketbase'

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
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
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
})