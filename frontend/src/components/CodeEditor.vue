<template>
    <div class="code-editor">
      <codemirror
        v-model="code"
        :options="cmOptions"
        @input="onCodeChange"
      />
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/theme/monokai.css'
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/python/python.js'
  import 'codemirror/mode/go/go.js'
  import 'codemirror/mode/css/css.js'
  import 'codemirror/mode/htmlmixed/htmlmixed.js'
  
  export default {
    name: 'CodeEditor',
    components: {
      codemirror
    },
    props: {
      initialCode: {
        type: String,
        default: ''
      },
      language: {
        type: String,
        default: 'javascript'
      }
    },
    emits: ['update:code'],
    setup(props, { emit }) {
      const code = ref(props.initialCode)
      
      const cmOptions = computed(() => ({
        tabSize: 2,
        mode: props.language,
        theme: 'monokai',
        lineNumbers: true,
        line: true,
      }))
  
      const onCodeChange = (newCode) => {
        code.value = newCode
        emit('update:code', newCode)
      }
  
      onMounted(() => {
        // You can add any initialization logic here if needed
      })
  
      return {
        code,
        cmOptions,
        onCodeChange
      }
    }
  }
  </script>
  
  <style scoped>
  .code-editor {
    height: 100%;
    width: 100%;
  }
  </style>