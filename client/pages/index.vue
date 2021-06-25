<template>
  <div class="wrapper">
    <div class="main-container">
      <div class="logo">
        <img alt="Sheets2API" src="@/assets/images/logo.png" />
      </div>
      <div class="bar">
        <input
          class="searchbar"
          type="text"
          title="Google Sheet URL"
          v-model="url"
          placeholder="Copy & Paste Google Sheet URL..."
        />

        <img
          class="voice"
          src="@/assets/images/googleSheets.png"
          title="Search by Voice"
        />
      </div>

      <div class="buttons">
        <button class="button" type="button" @click="showResults">
          Show Result
        </button>
      </div>
    </div>
    <div class="info-container">
      <h2 class="info-title">Sheets2API</h2>
      <p class="info-desc">
        Turn your spreadsheets into something amazing today.
      </p>
      <p class="info-desc">
        Sheets2API turns your spreadsheet into a Restful JSON API, meaning you
        can get data in and out of your spreadsheet using simple HTTP requests
        and URLs. It also means that Sheets2API can work with pretty much
        anything you like...
      </p>
      <p class="info-desc">
        <b>Note: </b>
        You need to add
        <b>sheets2api@sheets2api.iam.gserviceaccount.com</b> as editor in
        spreadsheet.
      </p>
    </div>
    <div class="results" :class="{ showResults: isResultVisible }">
      <i class="fa fa-times hideResult" @click="hideResult"></i>
      <div style="position: relative; margin: 15px 0" v-if="!isLoading">
        <div class="responses">
          <label class="label">API Endpoint Info</label>
          <div
            class="api-methods"
            v-for="(sheetInfo, key) in sheets"
            :key="key"
          >
            <span class="sheet-title">{{ key }}</span>
            <div class="method" v-for="(info, key) in sheetInfo" :key="key">
              <span class="method-title">{{ info.method }}</span>
              <span class="method-description">{{ info.description }}</span>
              <input
                type="input"
                class="api-url"
                style="font-size: 12px"
                readonly="true"
                :value="info.url"
              />
              <div class="method-body" v-if="info.body">
                <span class="method-format"
                  ><strong>Format: </strong>{{ info.body.format }}</span
                >
                <div class="method-keys">
                  <strong>Keys:</strong>
                  <span v-for="(keys, index) in info.body.keys" :key="index">{{
                    keys
                  }}</span>
                </div>
                <span class="method-format">
                  <strong>Example:</strong>
                </span>
                <div style="overflow: hidden;">
                  <vue-json-pretty
                  :path="'res'"
                  :data="info.body.example"
                  @click="() => copyToClipboard(response)"
                />
                </div>
              </div>
            </div>
            <Testing
              :defaultURL="sheetInfo[0].url"
              defaultMethod="get"
              :sampleInputData="sheetInfo[1].body.example"
            />
          </div>
          <div class="buttons">
            <button class="button" type="button" @click="hideResult">
              Hide Result
            </button>
          </div>
        </div>
      </div>
      <div class="loading-wrapper" v-else>
        <div class="loader"></div>
        <span v-html="message"></span>
      </div>
      <input type="hidden" id="copy-paste" v-model="clipboard" />
    </div>
    <div class="github-icon">
      <a href="https://github.com/aakritsubedi/Sheets2API" target="_blank">
        <span class="fab fa-github"></span>
      </a>
    </div>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

import Testing from '@/components/Testing'

import SheetsAPI from '@/services/sheets.js'

export default {
  name: 'Dashboard',
  components: {
    VueJsonPretty,
    Testing,
  },
  data() {
    return {
      url: '',
      apiURL: '',
      response: '',
      clipboard: '',
      isResultVisible: false,
      isLoading: true,
      message: '',
      sheets: {},
    }
  },
  methods: {
    copyToClipboard: function (value) {
      let clipboardElement = document.querySelector('#copy-paste')
      clipboardElement.setAttribute('type', 'text')
      this.clipboard = JSON.stringify(value)

      clipboardElement.select()
      try {
        document.execCommand('copy')
      } catch (err) {
        alert('Oops, unable to copy')
      }

      /* unselect the range */
      clipboardElement.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    },
    getAPIInfo: async function () {
      if (
        !this.url.length ||
        !this.url.includes('https://docs.google.com/spreadsheets/d/')
      ) {
        console.log('Invalid URL')
        this.message = 'Invalid URL provided. Update the link and try again.'
      } else {
        this.message = 'Preparing your API...'
        const key = this.url.match(/(?=\/d\/).*/)[0].split('/')[2] || 0
        const gid = this.url.match(/(?=gid).*/)[0].split('=')[1] || 0

        if (!key) {
          this.message =
            'Unable to find the sheets with given key. Please check and try again.'
        }

        try {
          const apiInfo = await SheetsAPI.fetchAPIInfo(key, gid)
          this.isResultVisible = true
          this.result = true
          this.sheets = apiInfo.sheets
          this.isLoading = false
        } catch (err) {
          this.message = `<div>
            <strong>PERMISSION DENIED:</strong> <span>403</span><br />
            The caller does not have permission. <br /> 
            You need to add sheets2api@sheets2api.iam.gserviceaccount.com as editor in spreadsheet.
          </div>`
        }

        // Adding Query param in URL
        this.$router.push({
          path: this.$route.path,
          query: { key: key, gid: gid },
        })
      }
    },
    showResults: function () {
      this.result = true
      this.response = null
      this.apiURL = null
      this.isLoading = true
      this.methods = []
      this.getAPIInfo()
      this.isResultVisible = true
    },
    hideResult: function () {
      this.isResultVisible = false
      this.$router.replace('/')
    },
  },
  created() {
    const { query } = this.$route
    if (Object.keys(query).length) {
      const { key, gid } = query
      this.url = `https://docs.google.com/spreadsheets/d/${key}/edit#gid=${gid}`
      this.showResults()
    }
  },
  head() {
    return {
      title: 'Sheets2API',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Turn any Google Sheet into an API instantly. Power websites, apps, or whatever you like, all from a spreadsheet.',
        },
      ],
    }
  },
}
</script>

<style scoped>
@import url('@/assets/css/index.css');
</style>