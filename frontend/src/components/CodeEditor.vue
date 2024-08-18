<template>
  <textarea ref="textarea"></textarea>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
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

    const getMode = (lang) => {
      switch (lang) {
        case 'javascript': return 'javascript'
        case 'python': return 'python'
        case 'css': return 'css'
        case 'html': return 'htmlmixed'
        default: return 'javascript'
      }
    }

    onMounted(() => {
      editor = CodeMirror.fromTextArea(textarea.value, {
        lineNumbers: true,
        mode: getMode(props.language),
        theme: 'default',
        viewportMargin: Infinity
      })

      editor.on('change', () => {
        emit('update:modelValue', editor.getValue())
      })

      editor.setValue(props.modelValue)
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
      textarea
    }
  }
}
</script>

<style>
.CodeMirror {
  height: auto;
  border: 1px solid #ddd;
}
</style>