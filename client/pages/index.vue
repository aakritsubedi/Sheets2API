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
        </div>
      </div>
      <div class="loading-wrapper" v-else>
        <div class="loader"></div>
        <span>{{ message }}</span>
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
        this.message = 'Invalid URL, close result window & try again'
      } else {
        this.message = 'Preparing your API...'
        const key = this.url.match(/(?=\/d\/).*/)[0].split('/')[2] || 0
        const gid = this.url.match(/(?=gid).*/)[0].split('=')[1] || 0

        if (!key) {
          this.message = 'Invalid Key, close result window & try again'
        }

        const apiInfo = await SheetsAPI.fetchAPIInfo(key, gid)
        this.result = true
        this.response = apiInfo.data
        this.apiURL = apiInfo.apiURL
        this.isLoading = false

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
}
</script>

<style scoped>
/* Layouts */
.wrapper {
  overflow: hidden;
  position: relative;
}
.main-container {
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.info-container {
  width: 100%;
  height: 20vh;
  display: flex;
  padding: 0 16px;
  color: #ffffff;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(#3c8558, #54b87b);
}
/* Information */
.info-title {
  font-size: 28px;
}
.info-desc {
  margin: 5px 0;
  font-size: 16px;
}
/* Results */
.results {
  top: 0;
  right: -40%;
  width: 40%;
  height: 100vh;
  position: absolute;
  padding: 5px 16px;
  background-color: #fafafa;
  z-index: 999;
  overflow-y: scroll;
  transition: right 0.4s ease-in-out;
}
.showResults {
  right: 0;
}
.hideResult {
  float: right;
  font-size: 30px;
  cursor: pointer;
}
/* Github Icon */
.github-icon {
  top: 5px;
  right: 5px;
  font-size: 25px;
  position: absolute;
}
.github-icon a {
  color: #2e2e2e;
}
.github-icon a:hover {
  color: #535353;
}

/* Searchbar */
.bar {
  margin: 0 auto;
  width: 575px;
  border-radius: 30px;
  border: 1px solid #dcdcdc;
}
.bar:hover {
  box-shadow: 1px 1px 8px 1px #dcdcdc;
}
.bar:focus-within {
  box-shadow: 1px 1px 8px 1px #dcdcdc;
  outline: none;
}
.searchbar {
  margin-left: 25px;
  height: 45px;
  border: none;
  width: 500px;
  outline: none;
  font-size: 16px;
}
.voice {
  height: 20px;
  position: relative;
  top: 5px;
  left: 10px;
}

/* Buttons */
.buttons {
  margin-top: 15px;
}
.button {
  background-color: #f5f5f5;
  border: none;
  color: #707070;
  font-size: 15px;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 4px;
  outline: none;
}
.button:hover {
  border: 1px solid #c8c8c8;
  padding: 9px 19px;
  color: #808080;
}
.button:focus {
  border: 1px solid #4885ed;
  padding: 9px 19px;
}
/* Logo */
.logo {
  margin-bottom: 20px;
}
/* Label, Input */
.label {
  display: block;
  font-size: 1rem;
  color: #9b9b9b;
}
.api-url {
  border: 0;
  outline: 0;
  width: 100%;
  padding: 7px 0;
  font-size: 1rem;
  color: #2e2e2e;
  margin-bottom: 15px;
  background: transparent;
  border-bottom: 2px solid #9b9b9b;
}
/* Loader */
.loading-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}
.loading-wrapper span {
  font-size: 14px;
  color: #2e2e2e;
  margin-top: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>