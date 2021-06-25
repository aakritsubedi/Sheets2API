import axios from 'axios'

class SheetsAPI {
  static async fetchAPIInfo(key, gid) {
    const baseUrl = 'https://sheets2api.aakritsubedi9.com.np';

    try {
      const apiInfo = await axios.get(
        `${baseUrl}/apiInfo?key=${key}`
      )

      return apiInfo.data
    } catch (err) {
      throw err
    }
  }
}

export default SheetsAPI
