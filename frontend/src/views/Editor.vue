<template>
  <div class="editor">
    <div class="editor-header">
      <input v-model="fileName" placeholder="File name" class="input file-name">
      <div class="editor-controls">
        <select v-model="language" class="select">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
        </select>
        <select v-model="selectedFolder" class="select">
          <option value="">No Folder</option>
          <option v-for="folder in folders" :key="folder.id" :value="folder.id">
            {{ folder.name }}
          </option>
        </select>
        <button @click="saveNote" class="btn">Save</button>
      </div>
    </div>
    <CodeEditor
      v-model="code"
      :language="language"
      class="code-editor"
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
  height: calc(100vh - 100px);
}

.editor-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.file-name {
  flex-grow: 1;
}

.editor-controls {
  display: flex;
  gap: 10px;
}

.code-editor {
  flex-grow: 1;
  overflow: auto;
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
  }

  .editor-controls {
    flex-wrap: wrap;
  }
}
</style>