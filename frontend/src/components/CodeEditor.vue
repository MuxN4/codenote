<template>
  <div>
    <div class="editor-options">
      <label>
        Theme:
        <select v-model="theme" @change="updateEditorOptions">
          <option value="default">Default</option>
          <option value="monokai">Monokai</option>
          <option value="solarized">Solarized</option>
        </select>
      </label>
      <label>
        Font Size:
        <input type="number" v-model="fontSize" @change="updateEditorOptions" min="8" max="24">
      </label>
    </div>
    <textarea ref="textarea"></textarea>
  </div>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'

export default {
  name: 'CodeEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'javascript'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const textarea = ref(null)
    let editor = null
    const theme = ref('default')
    const fontSize = ref(14)

    const getMode = (lang) => {
      switch (lang) {
        case 'javascript': return 'javascript'
        case 'python': return 'python'
        case 'css': return 'css'
        case 'html': return 'htmlmixed'
        default: return 'javascript'
      }
    }

    const updateEditorOptions = () => {
      if (editor) {
        editor.setOption('theme', theme.value)
        editor.getWrapperElement().style.fontSize = `${fontSize.value}px`
      }
    }

    onMounted(() => {
      editor = CodeMirror.fromTextArea(textarea.value, {
        lineNumbers: true,
        mode: getMode(props.language),
        theme: theme.value,
        viewportMargin: Infinity
      })

      editor.on('change', () => {
        emit('update:modelValue', editor.getValue())
      })

      editor.setValue(props.modelValue)
      editor.getWrapperElement().style.fontSize = `${fontSize.value}px`
    })

    watch(() => props.language, (newLang) => {
      if (editor) {
        editor.setOption('mode', getMode(newLang))
      }
    })

    watch(() => props.modelValue, (newValue) => {
      if (editor && newValue !== editor.getValue()) {
        editor.setValue(newValue)
      }
    })

    onUnmounted(() => {
      if (editor) {
        editor.toTextArea()
      }
    })

    return {
      textarea,
      theme,
      fontSize,
      updateEditorOptions
    }
  }
}
</script>

<style scoped>
.editor-options {
  margin-bottom: 10px;
}
.editor-options label {
  margin-right: 10px;
}
.CodeMirror {
  height: auto;
  border: 1px solid #ddd;
}
</style>