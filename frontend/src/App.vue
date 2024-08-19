<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link v-if="!isAuthenticated" to="/login">Login</router-link> |
      <router-link v-if="!isAuthenticated" to="/signup">Signup</router-link> |
      <router-link v-if="isAuthenticated" to="/editor">Editor</router-link> |
      <router-link v-if="isAuthenticated" to="/settings">Settings</router-link> |
      <a v-if="isAuthenticated" href="#" @click.prevent="handleLogout">Logout</a>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()

    const isAuthenticated = computed(() => store.getters.isAuthenticated)

    const handleLogout = async () => {
      await store.dispatch('logout')
      router.push('/')
    }

    return {
      isAuthenticated,
      handleLogout,
    }
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>