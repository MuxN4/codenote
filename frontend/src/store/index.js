import { createStore } from 'vuex'

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
    // We'll add authentication actions here later
  },
  modules: {
  }
})