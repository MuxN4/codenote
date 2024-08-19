<template>
  <div id="app">
    <header>
      <nav class="container">
        <router-link to="/" class="logo">CodeNote</router-link>
        <div class="nav-links">
          <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
          <router-link v-if="!isAuthenticated" to="/signup">Signup</router-link>
          <router-link v-if="isAuthenticated" to="/editor">Editor</router-link>
          <router-link v-if="isAuthenticated" to="/settings">Settings</router-link>
          <a v-if="isAuthenticated" href="#" @click.prevent="handleLogout">Logout</a>
        </div>
      </nav>
    </header>
    <main class="container">
      <router-view/>
    </main>
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

<style>
@import './assets/styles/global.css';

header {
  background-color: var(--secondary-color);
  padding: 15px 0;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    gap: 10px;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>