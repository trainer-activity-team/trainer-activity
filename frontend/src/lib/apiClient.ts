import axios from 'axios'

const baseURL = import.meta.env.BACKEND_URL

if (!baseURL) {
  throw new Error('Missing BACKEND_URL environment variable.')
}

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
