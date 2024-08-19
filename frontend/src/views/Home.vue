<template>
  <div class="home">
    <h1>Welcome to CodeNote</h1>
    <div v-if="isAuthenticated">
      <h2>Your Folders and Notes</h2>
      <div class="actions">
        <button class="btn" @click="createFolder">Create New Folder</button>
        <button class="btn" @click="createNote">Create New Note</button>
      </div>
      <div class="file-explorer">
        <ul>
          <li v-for="folder in folders" :key="folder.id">
            <span @click="toggleFolder(folder)" class="folder">
              <i :class="folder.expanded ? 'fas fa-folder-open' : 'fas fa-folder'"></i>
              {{ folder.name }}
            </span>
            <ul v-if="folder.expanded">
              <li v-for="note in folder.notes" :key="note.id" @click="openNote(note)" class="note">
                <i class="fas fa-file-alt"></i> {{ note.title }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>Please log in to view and create notes.</p>
      <router-link to="/login" class="btn">Login</router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import pb from '@/pocketbase'

export default {
  name: 'Home',
  setup() {
    const store = useStore()
    const router = useRouter()
    const folders = ref([])
    const isAuthenticated = computed(() => store.getters.isAuthenticated)

    const fetchFoldersAndNotes = async () => {
      if (isAuthenticated.value) {
        try {
          const resultFolders = await pb.collection('folders').getFullList({
            filter: `user = "${store.state.user.id}"`,
            expand: 'notes'
          })
          folders.value = resultFolders.map(folder => ({
            ...folder,
            expanded: false,
            notes: folder.expand?.notes || []
          }))
        } catch (error) {
          console.error('Error fetching folders and notes:', error)
        }
      }
    }

    const toggleFolder = (folder) => {
      folder.expanded = !folder.expanded
    }

    const createFolder = async () => {
      const name = prompt('Enter folder name:')
      if (name) {
        try {
          await pb.collection('folders').create({
            name,
            user: store.state.user.id
          })
          fetchFoldersAndNotes()
        } catch (error) {
          console.error('Error creating folder:', error)
        }
      }
    }

    const createNote = () => {
      router.push('/editor')
    }

    const openNote = (note) => {
      router.push({ name: 'Editor', params: { id: note.id } })
    }

    onMounted(fetchFoldersAndNotes)

    return {
      isAuthenticated,
      folders,
      toggleFolder,
      createFolder,
      createNote,
      openNote
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.file-explorer ul {
  list-style-type: none;
  padding-left: 20px;
}

.folder, .note {
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.folder:hover, .note:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .actions {
    flex-direction: column;
  }
}
</style>