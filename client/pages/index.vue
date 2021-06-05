<template>
  <div>
    <Banner />
    <div class="container">
      <div class="info">
        <h2>Turn a Google Spreadsheet into a JSON API</h2>
        <p>
          Sheets2API turns your spreadsheet into a Restful JSON API, meaning you
          can get data in and out of your spreadsheet using simple HTTP requests
          and URLs. It also means that Sheets2API can work with pretty much
          anything you like...
        </p>
      </div>
      <div class="playground">
        <div class="form__group field">
          <input
            type="input"
            class="form__field"
            name="name"
            id="name"
            autocomplete="off"
            v-model="url"
          />
          <label for="name" class="form__label">Google Sheet URL</label>
          <span for="name" class="form__helptext"
            >Enter th full url of the google sheets</span
          >
        </div>
        <br />
        <a class="btn btn-success" @click="getAPIInfo">Get API</a>
        <span class="message" v-if="message">{{ message }}</span>
      </div>
    </div>
    <div class="results" v-if="result">
      <h3># Results</h3>
      <div class="form__group field" style="width: 100%">
        <input
          type="input"
          class="form__field"
          readonly="true"
          v-model="apiURL"
          @click="() => copyToClipboard(apiURL)"
        />
        <label for="name" class="form__label">API Endpoint URL</label>
        <span for="name" class="form__helptext">Your API Endpoint URL</span>
      </div>
      <div style="position: relative; margin: 15px 0">
        <span class="form__label" style="display: block">Response Data</span
        ><br />
        <vue-json-pretty
          :path="'res'"
          :data="response"
          @click="() => copyToClipboard(response)"
        />
      </div>
      <input type="hidden" id="copy-paste" v-model="clipboard" />
    </div>
    <Information />
    <Footer />
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

import Banner from '@/components/Banner'
import Footer from '@/components/Footer'
import Information from '@/components/Info'

import SheetsAPI from '@/services/sheets.js'

export default {
  name: 'Sheet2API',
  components: {
    VueJsonPretty,
    SheetsAPI,
    Banner,
    Information,
    Footer,
  },
  data() {
    return {
      url: '',
      apiURL: '',
      response: '',
      clipboard: '',
      result: false,
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
        this.message = 'Invalid URL'
        console.log('Invalid URL')
      } else {
        this.message = 'Preparing your API... scroll to view'
        const key = this.url.match(/(?=\/d\/).*/)[0].split('/')[2]
        const gid = this.url.match(/(?=gid).*/)[0].split('=')[1]

        const apiInfo = await SheetsAPI.fetchAPIInfo(key, gid)
        this.result = true
        this.response = apiInfo.data
        this.apiURL = apiInfo.apiURL
      }
      setTimeout(() => {
        this.message = ''
      }, 3000)
    },
  },
  head() {
    return {
      title: 'Sheets2API',
    }
  },
}
</script>

<style>
.container {
  height: 50vh;
  display: flex;
  color: #2e2e2e;
  flex-direction: row;
  justify-content: center;
}
.container .info {
  width: 30%;
  display: flex;
  padding: 0 16px;
  height: inherit;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.info p {
  margin: 10px 0;
  font-size: 14px;
}
.container .playground {
  padding: 0 16px;
  height: inherit;
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.form__group {
  position: relative;
  padding: 15px 0 0;
  margin-top: 10px;
  width: 50%;
}

.form__field {
  border: 0;
  outline: 0;
  width: 100%;
  color: #2e2e2e;
  padding: 7px 0;
  font-size: 1.3rem;
  font-family: inherit;
  background: transparent;
  transition: border-color 0.2s;
  border-bottom: 2px solid #9b9b9b;
}
.form__field::placeholder {
  color: transparent;
}
.form__field:placeholder-shown ~ .form__label {
  font-size: 1.3rem;
  cursor: text;
  top: 20px;
}

.form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: #9b9b9b;
}
.form__helptext {
  font-size: 12px;
  color: #9b9b9b;
  text-align: left;
}
.form__field:focus {
  padding-bottom: 6px;
  font-weight: 700;
  border-width: 3px;
  border-image: linear-gradient(to right, #11998e, #5ebb81);
  border-image-slice: 1;
}
.form__field:focus ~ .form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: #11998e;
  font-weight: 700;
}

/* reset input */
.form__field:required,
.form__field:invalid {
  box-shadow: none;
}

.btn {
  margin: 10px;
  transition: 0.5s;
  color: #2e2e2e;
  text-align: center;
  padding: 10px 30px;
  border-radius: 10px;
  text-transform: uppercase;
  background-size: 200% auto;
  box-shadow: 0 0 20px #eee;
}

.btn:hover {
  color: #fff;
  background-position: right center;
}

.btn-success {
  background-image: linear-gradient(
    to right,
    #84fab0 0%,
    #8fd3f4 51%,
    #84fab0 100%
  );
}

.vjs-tree {
  width: 100%;
}
.results {
  width: 100%;
  color: #2e2e2e;
  padding: 15px 16px;
}
.logo-container {
  width: 700px;
  height: 400px;
}
.logo-container img {
  width: 100%;
  height: 100%;
}
.message {
  font-size: 14px;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: #fafafa;
  text-align: left !important;
}

@media (max-width: 460px) {
  .container {
    height: 400px;
    flex-direction: column;
    justify-content: unset;
  }
  .container .info {
    width: 100%;
  }
  .info p {
    margin: 10px 0;
    font-size: 14px;
  }
  .form__group {
    width: 100%;
  }
  .container .playground {
    padding: 0 16px;
    width: 100%;
  }
}
</style>
