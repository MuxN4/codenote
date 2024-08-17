<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const email = ref('')
    const password = ref('')

    const handleLogin = async () => {
      const success = await store.dispatch('login', {
        email: email.value,
        password: password.value,
      })
      if (success) {
        router.push('/editor')
      } else {
        alert('Login failed. Please check your credentials.')
      }
    }

    return {
      email,
      password,
      handleLogin,
    }
  },
}
</script>