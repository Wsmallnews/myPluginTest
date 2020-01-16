import HttpRequest from '@/libs/axios'
import config from '@/config'
const apiUrl = process.env.NODE_ENV === 'development' ? config.apiUrl.dev : config.apiUrl.pro

const axios = new HttpRequest(apiUrl)
export default axios
