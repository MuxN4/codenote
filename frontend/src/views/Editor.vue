<template>
  <div class="editor">
    <h2>Code Editor</h2>
    <div class="editor-controls">
      <input v-model="fileName" placeholder="File name" />
      <select v-model="language">
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="css">CSS</option>
        <option value="htmlmixed">HTML</option>
      </select>
      <button @click="saveNote">Save</button>
    </div>
    <CodeEditor
      v-model:code="code"
      :language="language"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import CodeEditor from '@/components/CodeEditor.vue'
import pb from '@/pocketbase'

export default {
  name: 'Editor',
  components: {
    CodeEditor
  },
  setup() {
    const store = useStore()
    const code = ref('')
    const fileName = ref('')
    const language = ref('javascript')

    const saveNote = async () => {
      try {
        const data = {
          title: fileName.value,
          content: code.value,
          syntax: language.value,
          user: store.state.user.id
        }
        await pb.collection('notes').create(data)
        alert('Note saved successfully!')
      } catch (error) {
        console.error('Error saving note:', error)
        alert('Failed to save note. Please try again.')
      }
    }

    return {
      code,
      fileName,
      language,
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