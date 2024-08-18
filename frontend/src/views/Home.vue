<template>
  <div class="home">
    <h1>Welcome to CodeNote</h1>
    <div v-if="isAuthenticated">
      <h2>Your Notes</h2>
      <ul>
        <li v-for="note in notes" :key="note.id">
          {{ note.title }} ({{ note.syntax }})
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Please log in to view and create notes.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import pb from '@/pocketbase'

export default {
  name: 'Home',
  setup() {
    const store = useStore()
    const notes = ref([])
    const isAuthenticated = computed(() => store.getters.isAuthenticated)

    const fetchNotes = async () => {
      if (isAuthenticated.value) {
        try {
          const resultList = await pb.collection('notes').getList(1, 50, {
            filter: `user = "${store.state.user.id}"`
          })
          notes.value = resultList.items
        } catch (error) {
          console.error('Error fetching notes:', error)
        }
      }
    }

    onMounted(fetchNotes)

    return {
      isAuthenticated,
      notes
    }
  }
}
</script>