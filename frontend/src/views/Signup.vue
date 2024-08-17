<template>
  <div class="signup">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignup">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div>
        <label for="passwordConfirm">Confirm Password:</label>
        <input type="password" id="passwordConfirm" v-model="passwordConfirm" required>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Signup',
  setup() {
    const store = useStore()
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const passwordConfirm = ref('')

    const handleSignup = async () => {
      if (password.value !== passwordConfirm.value) {
        alert('Passwords do not match')
        return
      }
      const success = await store.dispatch('signup', {
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
      })
      if (success) {
        router.push('/editor')
      } else {
        alert('Signup failed. Please try again.')
      }
    }

    return {
      email,
      password,
      passwordConfirm,
      handleSignup,
    }
  },
}
</script>