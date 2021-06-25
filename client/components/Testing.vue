<template>
  <div class="testing">
    <span class="label" style="display: block">API Testing</span>
    <div style="display: flex">
      <select v-model="methods" class="api-methods" @change="results = ''">
        <option value="get">GET</option>
        <option value="post">POST</option>
      </select>
      <input
        type="text"
        v-model="apiURL"
        class="api-url"
        placeholder="https://sheets2api.aakritsubedi9.com.np/sheets2api?key=..&gid=.."
      />
      <button class="api-send-btn" @click="invoke" v-if="!jsonerror.length">
        Send
      </button>
      <button class="api-send-btn btn-disabled" @click="invoke" disabled v-else>
        Send
      </button>
    </div>
    <div class="api-input" :class="{ displayBlock: methods === 'post' }">
      <span class="label" style="display: block">Body (JSON format)</span>
      <textarea
        rows="8"
        id="prettyJSONFormat"
        v-model="apiBody"
        @blur="prettyFormat"
        @change="prettyFormat"
        :class="jsonerror ? 'border-red' : 'border-green'"
      ></textarea>
      <div class="text-danger" v-if="apiBody && jsonerror">{{ jsonerror }}</div>
      <div class="text-success" v-if="!jsonerror">Valid JSON ✔</div>
    </div>
    <div class="response-result" v-if="results">
      <span class="label" style="display: block">Response Data</span>
      <vue-json-pretty :path="'res'" :data="results" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

export default {
  name: 'APITesting',
  components: {
    VueJsonPretty,
  },
  props: ['defaultURL', 'defaultMethod', 'sampleInputData'],
  data() {
    return {
      methods: 'get',
      apiURL: '',
      jsonData: '',
      results: '',
      apiBody: {},
      jsonerror: '',
    }
  },
  methods: {
    invoke: async function () {
      if (this.methods == 'get') {
        try {
          this.results = await axios.get(this.apiURL)
          this.results = this.results.data
        } catch (err) {
          this.results = {
            success: false,
            message: err.message,
          }
        }
      } else if (this.methods == 'post') {
        try {
          this.results = await axios.post(this.apiURL, this.apiBody, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          this.results = this.results.data
        } catch (err) {
          this.results = {
            success: false,
            message: err.message,
          }
        }
      }
    },
    prettyFormat: function () {
      // reset error
      this.jsonerror = ''
      let jsonValue = ''
      try {
        jsonValue = JSON.parse(this.apiBody)
      } catch (e) {
        this.jsonerror = JSON.stringify(e.message)
        let textarea = document.getElementById('prettyJSONFormat')
        if (this.jsonerror.indexOf('position') > -1) {
          // highlight error position
          let positionStr = this.jsonerror.lastIndexOf('position') + 8
          let posi = parseInt(
            this.jsonerror.substr(positionStr, this.jsonerror.lastIndexOf('"'))
          )
          if (posi >= 0) {
            textarea.setSelectionRange(posi, posi + 1)
          }
        }
        return ''
      }

      this.apiBody = JSON.stringify(jsonValue, null, 2)
    },
  },
  mounted() {
    this.methods = this.defaultMethod
    this.apiURL = this.defaultURL
    this.invoke()

    this.apiBody = JSON.stringify(this.sampleInputData)
    this.prettyFormat()
  },
}
</script>

<style scoped>
@import url('@/assets/css/testing.css');
</style>