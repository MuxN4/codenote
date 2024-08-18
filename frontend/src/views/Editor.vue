<template>
  <div class="editor">
    <h2>Code Editor</h2>
    <div class="editor-controls">
      <input v-model="fileName" placeholder="File name" />
      <select v-model="language">
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
      </select>
      <select v-model="selectedFolder">
        <option value="">No Folder</option>
        <option v-for="folder in folders" :key="folder.id" :value="folder.id">
          {{ folder.name }}
        </option>
      </select>
      <button @click="saveNote">Save</button>
    </div>
    <CodeEditor
      v-model="code"
      :language="language"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import CodeEditor from '@/components/CodeEditor.vue'
import pb from '@/pocketbase'

export default {
  name: 'Editor',
  components: {
    CodeEditor
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const code = ref('')
    const fileName = ref('')
    const language = ref('javascript')
    const selectedFolder = ref('')
    const folders = ref([])
    const noteId = ref(null)

    const fetchFolders = async () => {
      try {
        const resultFolders = await pb.collection('folders').getFullList({
          filter: `user = "${store.state.user.id}"`
        })
        folders.value = resultFolders
      } catch (error) {
        console.error('Error fetching folders:', error)
      }
    }

    const fetchNote = async (id) => {
      try {
        const note = await pb.collection('notes').getOne(id)
        code.value = note.content
        fileName.value = note.title
        language.value = note.syntax
        selectedFolder.value = note.folder
        noteId.value = note.id
      } catch (error) {
        console.error('Error fetching note:', error)
      }
    }

    const saveNote = async () => {
      try {
        const data = {
          title: fileName.value,
          content: code.value,
          syntax: language.value,
          user: store.state.user.id,
          folder: selectedFolder.value || null
        }
        if (noteId.value) {
          await pb.collection('notes').update(noteId.value, data)
        } else {
          await pb.collection('notes').create(data)
        }
        alert('Note saved successfully!')
        router.push('/')
      } catch (error) {
        console.error('Error saving note:', error)
        alert('Failed to save note. Please try again.')
      }
    }

    onMounted(async () => {
      await fetchFolders()
      if (route.params.id) {
        await fetchNote(route.params.id)
      }
    })

    return {
      code,
      fileName,
      language,
      selectedFolder,
      folders,
      saveNote
    }
  }
}
</script>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 80vh;
  padding: 20px;
}

.editor-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.editor-controls input,
.editor-controls select,
.editor-controls button {
  padding: 5px 10px;
}
</style>