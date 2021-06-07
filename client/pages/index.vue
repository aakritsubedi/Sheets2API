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
    </div>
    <div class="results" :class="{ showResults: isResultVisible }">
      <i class="fa fa-times hideResult" @click="hideResult"></i>
      <div style="position: relative; margin: 15px 0" v-if="!isLoading">
        <div class="responses">
          <label class="label">API Endpoint URL</label>
          <input
            type="input"
            class="api-url"
            readonly="true"
            v-model="apiURL"
          />
          <span class="label" style="display: block">Response Data</span>
          <vue-json-pretty
            :path="'res'"
            :data="response"
            @click="() => copyToClipboard(response)"
          />
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

import SheetsAPI from '@/services/sheets.js'

export default {
  name: 'Dashboard',
  components: {
    VueJsonPretty,
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
          this.message = 'Unable to find the sheets with given key. Please check and try again.'
        }

        const apiInfo = await SheetsAPI.fetchAPIInfo(key, gid)
        // Todo: Update the response
        if(Object.values(apiInfo.data[0])[0] === '<!DOCTYPE html>') {
          this.message = `Unable to access private sheets. <br/> Update the link in google sheets and try again.`
        }
        else {
          this.result = true
          this.response = apiInfo.data
          this.apiURL = apiInfo.apiURL
          this.isLoading = false
        }

        // Adding Query param in URL
        this.$router.push({
          path: this.$route.path,
          query: { key: key, gid: gid },
        })
      }
    },
    showResults: function () {
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
          content: 'Turn any Google Sheet into an API instantly. Power websites, apps, or whatever you like, all from a spreadsheet.',
        },
      ],
    }
  },
}
</script>

<style scoped>
@import url('@/assets/css/index.css');
</style>