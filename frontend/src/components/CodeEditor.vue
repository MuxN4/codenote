<template>
  <div class="code-editor" ref="editorRef"></div>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { EditorState, basicSetup } from '@codemirror/basic-setup'
import { EditorView, keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'

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
    const editorRef = ref(null)
    let view = null

    const getLanguage = (lang) => {
      switch (lang) {
        case 'javascript': return javascript()
        case 'python': return python()
        case 'css': return css()
        case 'html': return html()
        default: return javascript()
      }
    }

    const createEditor = () => {
      const state = EditorState.create({
        doc: props.modelValue,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          getLanguage(props.language),
          EditorView.updateListener.of((v) => {
            if (v.docChanged) {
              emit('update:modelValue', v.state.doc.toString())
            }
          })
        ]
      })

      view = new EditorView({
        state,
        parent: editorRef.value
      })
    }

    onMounted(() => {
      createEditor()
    })

    watch(() => props.language, (newLang) => {
      if (view) {
        view.dispatch({
          effects: EditorState.reconfigure.of([getLanguage(newLang)])
        })
      }
    })

    watch(() => props.modelValue, (newValue) => {
      if (view && newValue !== view.state.doc.toString()) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: newValue }
        })
      }
    })

    onUnmounted(() => {
      if (view) {
        view.destroy()
      }
    })

    return {
      editorRef
    }
  }
}
</script>

<style scoped>
.code-editor {
  height: 100%;
  width: 100%;
  border: 1px solid #ccc;
}
</style>